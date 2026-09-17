#!/usr/bin/env python3
"""Keep the workshop decks, the JSON that advertises them, and the README honest.

The decks in `workshops/` are plain Markdown on purpose: they are meant to be
imported into Workshopy, projected, printed or translated by people we will
never meet. That portability is also what makes them easy to break quietly.

Four failures this catches, all of which render perfectly and are wrong:

  1. **A deck path with no file behind it.** `data/workshops.json` carries a
     `deck` per session and the Workshops panel turns it into a download link.
     Rename a file and the link 404s with nothing on screen to say so.

  2. **A quiz question with no correct answer.** Workshopy grades `- [x]` as
     correct and `- [ ]` as wrong. A question where every option is `- [ ]`
     imports without complaint, renders normally, and cannot be answered
     correctly by anyone. Nothing about the file looks wrong.

  3. **A README table that has drifted.** The table states each deck's step and
     quiz count. Those are recomputed here from the files themselves, so the
     table cannot quietly describe a deck that no longer exists in that shape.

  4. **A duration the JSON and the README disagree about.** The panel shows the
     JSON's duration and the README shows its own; a session advertised as 30
     minutes in one place and 45 in the other is a booking someone mis-plans.

Deliberately network-free, like every other guard in this repository: it reads
files and asserts relationships between them, and never asks workshopy.io
whether the syntax is still what it was.

    python3 scripts/check-workshop-decks.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DECK_DIR = ROOT / 'workshops'
JSON_PATH = ROOT / 'data' / 'workshops.json'
README = DECK_DIR / 'README.md'

# Workshopy: a line-initial `#` starts a step; `#[quiz]` makes that step a graded
# quiz; inside one, `##` is a question and `- [x]` / `- [ ]` are its options.
STEP = re.compile(r'^#(?!\[)\s+\S', re.M)
QUIZ = re.compile(r'^#\[quiz\]', re.M)
QUESTION = re.compile(r'^##\s+(.+)$', re.M)
OPTION = re.compile(r'^- \[( |x)\]\s+(.+)$', re.M)


def deck_shape(text):
    """Steps, quizzes, and every quiz question with its options."""
    steps = len(STEP.findall(text)) + len(QUIZ.findall(text))
    quizzes = len(QUIZ.findall(text))
    # Split on step boundaries so options are attributed to the right question.
    blocks = re.split(r'^(?=#(?!#))', text, flags=re.M)
    questions = []
    for b in blocks:
        if not b.startswith('#[quiz]'):
            continue
        parts = re.split(r'^(?=##\s)', b, flags=re.M)[1:]
        for part in parts:
            q = QUESTION.search(part)
            opts = OPTION.findall(part)
            questions.append((q.group(1).strip() if q else '(unnamed)', opts))
    return steps, quizzes, questions


def main():
    problems = []
    sessions = json.loads(JSON_PATH.read_text(encoding='utf-8'))['sessions']

    declared = {}
    for s in sessions:
        deck = s.get('deck')
        if not deck:
            problems.append(f"session '{s['id']}' has no deck path")
            continue
        path = ROOT / deck.lstrip('/')
        if not path.is_file():
            problems.append(f"session '{s['id']}' points at {deck}, which does not exist")
            continue
        declared[path.name] = (s['id'], s['duration'])

    on_disk = {p.name for p in DECK_DIR.glob('*.md')} - {'README.md'}
    for orphan in sorted(on_disk - set(declared)):
        problems.append(f"workshops/{orphan} exists but no session in workshops.json links to it")

    readme = README.read_text(encoding='utf-8')
    shapes = {}
    for name, (sid, duration) in sorted(declared.items()):
        text = (DECK_DIR / name).read_text(encoding='utf-8')
        steps, quizzes, questions = deck_shape(text)
        shapes[name] = (steps, quizzes)

        if quizzes == 0:
            problems.append(f"{name} has no #[quiz] step")
        for qtext, opts in questions:
            if not opts:
                problems.append(f"{name}: quiz question '{qtext}' has no options")
            elif not any(mark == 'x' for mark, _ in opts):
                problems.append(
                    f"{name}: quiz question '{qtext}' has {len(opts)} options and no "
                    f"correct one (- [x]); it can never be answered correctly")

        row = re.search(r'^\|\s*`' + re.escape(name) + r'`\s*\|(.+)$', readme, re.M)
        if not row:
            problems.append(f"{name} is not listed in the README table")
            continue
        cells = [c.strip() for c in row.group(1).split('|')]
        r_duration, r_steps, r_quizzes = cells[1], cells[2], cells[3]
        if r_duration.replace('min', '').strip() != duration.replace('minutes', '').replace('utes', '').strip().replace('hour', 'hour'):
            # Compare loosely: "45 min" vs "45 minutes", "1 hour" vs "1 hour".
            a = re.sub(r'\s|utes|s\b', '', r_duration.lower())
            b = re.sub(r'\s|utes|s\b', '', duration.lower())
            if a != b:
                problems.append(
                    f"{name}: README says '{r_duration}', workshops.json says '{duration}'")
        if r_steps != str(steps):
            problems.append(f"{name}: README claims {r_steps} steps, the file has {steps}")
        if r_quizzes != str(quizzes):
            problems.append(f"{name}: README claims {r_quizzes} quizzes, the file has {quizzes}")

    if problems:
        print('FAIL — workshop decks and what the site says about them disagree:\n')
        for p in problems:
            print(f'  • {p}')
        print(f'\n{len(problems)} problem(s).')
        return 1

    total_steps = sum(v[0] for v in shapes.values())
    print(f'PASS — {len(declared)} decks, {total_steps} steps, '
          f'{sum(v[1] for v in shapes.values())} quizzes; every deck path resolves, '
          f'every quiz question has a correct answer, and the README table matches the files.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
