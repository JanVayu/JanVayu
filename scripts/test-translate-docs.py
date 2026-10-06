#!/usr/bin/env python3
"""Offline test of scripts/translate-docs.py: no network, no API key.

The translation job once failed every file for weeks because Sarvam deprecated
the model it named, and still reported success. This test holds the parts that
make a failure visible and a bad translation impossible to commit: parts are cut
without splitting a table or a code block, a translation that loses a heading, a
table row, a code fence or a link target is rejected, output that is not in the
target script is rejected, a language filter limits the run, and any failure
makes the script exit non-zero.
"""
import importlib.util, os, sys, tempfile, shutil, pathlib, subprocess
HERE = pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('td', HERE / 'translate-docs.py'); td=importlib.util.module_from_spec(spec); spec.loader.exec_module(td)

# --- chunking keeps tables and fences whole and loses nothing
sample = "# T\n\nIntro para.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n\n```bash\nx=1\n\ny=2\n```\n\n" + ("Word "*600 + "\n\n")*4 + "## End\n\nlast\n"
ch = td.split_chunks(sample, 2500)
assert "".join(ch) == sample, "chunks lose text"
assert all(c.count("```") % 2 == 0 for c in ch), "a fence was split"
table = "| a | b |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n"
assert any(table in c for c in ch), "table was split"
print("chunks:", len(ch), "OK")

# --- structure + validation
src = "# Title\n\nSee [guide](user-guide/overview.md).\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n```\ncode\n```\n"
good = src.replace("Title","शीर्षक").replace("See","देखें") + "यह एक अनुवाद है "*10
assert td.validate(src, good, "hi") is None
assert "link targets differ" in td.validate(src, good.replace("overview.md","other.md"), "hi")
assert "table_rows" in td.validate(src, good.replace("| 1 | 2 |\n",""), "hi")
assert "headings" in td.validate(src, good.replace("# शीर्षक","शीर्षक"), "hi")
assert "target script" in td.validate(src, src, "hi")
assert td.validate(src, good, "ta") is not None   # Devanagari is not Tamil
print("validation OK")

# --- end to end in a scratch copy of the repo layout with a stub translator
tmp = pathlib.Path(tempfile.mkdtemp())
(tmp/"docs").mkdir(); (tmp/"docs"/"a.md").write_text(src)
td.REPO_ROOT = tmp; td.EN_DIR = tmp/"docs"
subprocess.run(["git","init","-q"],cwd=tmp); subprocess.run(["git","-c","user.email=a@b","-c","user.name=t","add","."],cwd=tmp)
subprocess.run(["git","-c","user.email=a@b","-c","user.name=t","commit","-qm","x"],cwd=tmp)
os.environ["SARVAM_API_KEY"]="x"; os.environ["MODE"]="backfill"; os.environ["LANGS"]="hi"
calls=[]
def stub(key, content, lang, rel): calls.append(lang); return good
td.translate = stub
rc = td.main(); assert rc == 0 and (tmp/"docs-hi"/"a.md").exists() and calls==["hi"], (rc, calls)
print("write OK; language filter OK (only hi called)")

# a bad translation is rejected, not written, and the exit code is 1
(tmp/"docs-hi"/"a.md").unlink()
td.translate = lambda k,c,l,r: good.replace("overview.md","x.md")
rc = td.main(); assert rc == 1 and not (tmp/"docs-hi"/"a.md").exists(), rc
print("rejected + exit 1 OK")


# a rejected translation is retried; a second good attempt is written
(tmp/"docs-hi"/"a.md").unlink(missing_ok=True)
attempts=[]
def flaky(k,c,l,r):
    attempts.append(1)
    return good.replace("overview.md","x.md") if len(attempts) == 1 else good
td.translate = flaky
rc = td.main(); assert rc == 0 and len(attempts) == 2 and (tmp/"docs-hi"/"a.md").exists(), (rc, attempts)
print("retry after rejection OK")

# still rejected after every attempt: not written, exit 1, three attempts made
(tmp/"docs-hi"/"a.md").unlink()
attempts.clear()
def always_bad(k,c,l,r):
    attempts.append(1); return good.replace("overview.md","x.md")
td.translate = always_bad
rc = td.main(); assert rc == 1 and len(attempts) == td.MAX_ATTEMPTS and not (tmp/"docs-hi"/"a.md").exists(), (rc, attempts)
print("gives up after MAX_ATTEMPTS OK")

# an API error exits 1
def boom(k,c,l,r): raise RuntimeError("HTTP 400")
td.translate = boom
rc = td.main(); assert rc == 1
print("api failure exit 1 OK")

# thinking is switched off in the request (it was the cause of every cut-off)
import io, json, urllib.request
sent = {}
class _Resp(io.BytesIO):
    def __enter__(self): return self
    def __exit__(self, *a): return False
def fake_urlopen(req, timeout=0):
    sent["body"] = json.loads(req.data)
    return _Resp(json.dumps({"choices":[{"finish_reason":"stop","message":{"content":"ok"}}]}).encode())
real_urlopen = urllib.request.urlopen
urllib.request.urlopen = fake_urlopen
real_part = td.translate_part
real_part("k", "hello", "hi", "a.md", 1, 1)
urllib.request.urlopen = real_urlopen
assert "reasoning_effort" in sent["body"] and sent["body"]["reasoning_effort"] is None, sent["body"]
assert sent["body"]["model"] == "sarvam-105b"
print("reasoning_effort null in the request OK")

# a cut-off part is halved and retried until it fits; the pieces rejoin in order
long = "".join(f"Paragraph {i} " + "word " * 40 + "\n\n" for i in range(12))
def cutting(k, c, l, r, n, t):
    if len(c) > 700: raise td.CutOff("cut")
    return c
td.translate_part = cutting
out = td.translate_with_retry("k", long, "hi", "a.md", 1, 1)
assert out.replace("\n","").replace(" ","") == long.replace("\n","").replace(" ",""), "text lost or reordered"
assert [x for x in out.split("Paragraph ")[1:]] and out.index("Paragraph 0") < out.index("Paragraph 11")
print("halve and retry OK")

# a part that cannot be split further still raises, so the file is not written
def always_cut(k, c, l, r, n, t): raise td.CutOff("cut")
td.translate_part = always_cut
try:
    td.translate_with_retry("k", "one single line with no break", "hi", "a.md", 1, 1)
    raise SystemExit("expected CutOff")
except td.CutOff:
    print("unsplittable cut-off raises OK")
td.translate_part = real_part
shutil.rmtree(tmp)
