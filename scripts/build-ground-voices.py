#!/usr/bin/env python3
"""Fold a field-collected quote sheet into data/testimonies.json.

The testimony wall started as a hand-assembled set. Field collection produces
spreadsheets instead: one row per person, with the quote in the language it was
spoken in, an English translation, and the collection metadata that makes the
quote citable — when it was taken, how, and what the speaker agreed to be
called.

Rows are only carried across if consent was recorded. The speaker's attribution
preference is honoured as given: "Anonymous" stays anonymous, "Initials only"
keeps the initial, "First name" keeps the first name. Nothing in the sheet is
widened here.

Usage:
    python3 scripts/build-ground-voices.py <sheet.xlsx> [--dry-run]

Reads .xlsx directly (it is a zip of XML) so the pipeline needs no new
dependency.
"""
import argparse
import datetime
import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'testimonies.json'
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

# The sheet names languages in full, and names mixed speech the way people
# actually speak it ("Hinglish", "Tamil-English"). The wall filters by base
# language, so a mixed quote files under its base and keeps the spoken label
# for the badge.
LANG_CODES = {
    'english': 'en', 'hindi': 'hi', 'hinglish': 'hi', 'bengali': 'bn',
    'tamil': 'ta', 'marathi': 'mr', 'telugu': 'te', 'kannada': 'kn',
    'gujarati': 'gu', 'punjabi': 'pa', 'malayalam': 'ml', 'odia': 'or',
    'urdu': 'ur', 'assamese': 'as', 'nepali': 'ne',
}
# The plain name of each language, for deciding whether a row's label is a
# mixed-speech one worth keeping ("Hinglish", "Tamil-English").
CANON = {
    'en': 'english', 'hi': 'hindi', 'bn': 'bengali', 'ta': 'tamil',
    'mr': 'marathi', 'te': 'telugu', 'kn': 'kannada', 'gu': 'gujarati',
    'pa': 'punjabi', 'ml': 'malayalam', 'or': 'odia', 'ur': 'urdu',
    'as': 'assamese', 'ne': 'nepali',
}


def cells(z, path):
    """Yield each row of a worksheet as {column letter: value}."""
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall(NS + 'si'):
            shared.append(''.join(t.text or '' for t in si.iter(NS + 't')))
    sheet = ET.fromstring(z.read(path))
    for row in sheet.iter(NS + 'row'):
        out = {}
        for c in row.findall(NS + 'c'):
            col = re.match(r'[A-Z]+', c.get('r')).group()
            v = c.find(NS + 'v')
            if v is None:
                inline = c.find(NS + 'is')
                out[col] = ''.join(t.text or '' for t in inline.iter(NS + 't')) if inline is not None else ''
            elif c.get('t') == 's':
                out[col] = shared[int(v.text)]
            else:
                out[col] = v.text
        yield out


def read_sheet(path):
    z = zipfile.ZipFile(path)
    rows = list(cells(z, 'xl/worksheets/sheet1.xml'))
    if not rows:
        return []
    header = rows[0]
    return [{header[c]: r.get(c, '') for c in header} for r in rows[1:]]


def excel_date(serial):
    """Excel serial day -> ISO date. 1899-12-30 is the epoch Excel behaves as if
    it has, once its non-existent 1900 leap day is accounted for."""
    try:
        return (datetime.date(1899, 12, 30) + datetime.timedelta(days=int(float(serial)))).isoformat()
    except (TypeError, ValueError):
        return ''


def lang_of(name):
    base = re.split(r'[-/]', str(name).strip())[0].strip().lower()
    return LANG_CODES.get(base, '')


def convert(rows):
    out, skipped = [], []
    for r in rows:
        quote = (r.get('Quote') or '').strip()
        if not quote:
            continue
        if (r.get('Consent Recorded') or '').strip().lower() not in ('yes', 'y', 'true'):
            skipped.append((r.get('Quote ID'), 'no consent recorded'))
            continue
        spoken = (r.get('Language') or '').strip()
        code = lang_of(spoken)
        if not code:
            skipped.append((r.get('Quote ID'), 'unmapped language ' + spoken))
            continue
        rec = {
            'lang': code,
            'city': (r.get('City') or '').strip(),
            'state': (r.get('State / UT') or '').strip(),
            'name': (r.get('Speaker / Alias') or 'Anonymous').strip(),
            'role': (r.get('Occupation') or '').strip(),
            'q': quote,
            'en': (r.get('English Translation') or '').strip(),
            'src': 'field',
        }
        # Only carry the spoken label when it differs from the plain language
        # name, so the badge can say "Hinglish" rather than flattening it to
        # Hindi.
        if spoken.lower() != CANON[code]:
            rec['spoken'] = spoken
        date = excel_date(r.get('Collection Date'))
        if date:
            rec['date'] = date
        mode = (r.get('Collection Mode') or '').strip()
        if mode:
            rec['mode'] = mode
        band = (r.get('AQI Category') or '').strip()
        if band:
            rec['band'] = band
        out.append(rec)
    return out, skipped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('sheet')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    rows = read_sheet(args.sheet)
    new, skipped = convert(rows)
    print(f'{len(rows)} rows read, {len(new)} usable, {len(skipped)} skipped')
    for qid, why in skipped:
        print(f'  skip {qid}: {why}')

    existing = json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else []
    seen = {t['q'].strip() for t in existing}
    added = [t for t in new if t['q'].strip() not in seen]
    print(f'{len(new) - len(added)} already on the wall, {len(added)} new')

    merged = existing + added
    langs = sorted({t['lang'] for t in merged})
    cities = {t['city'] for t in merged}
    print(f'wall is now {len(merged)} testimonies, {len(cities)} cities, {len(langs)} languages: {" ".join(langs)}')

    if args.dry_run:
        print(json.dumps(added[:3], ensure_ascii=False, indent=2))
        return
    OUT.write_text(json.dumps(merged, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    sys.exit(main())
