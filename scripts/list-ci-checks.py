#!/usr/bin/env python3
"""Regenerate scripts/run-ci-checks.sh from the gating workflows.

A second, hand-kept list of "what CI runs" drifts from the workflow, and did:
v26.6.223 was pushed with a sweep of `scripts/check-*.py` behind it, while the
guard-site-figures job also runs six `build-*.py --check` steps. One of them
failed the moment the how-it-works diagram left index.html, and CI found it
after the push rather than before.

    python3 scripts/list-ci-checks.py     # rewrite scripts/run-ci-checks.sh
    bash scripts/run-ci-checks.sh         # run exactly what CI will run

accessibility.yml is scanned as well as ci.yml, because its contrast-gate job
is gating even though the axe job beside it is advisory. That job drives a real
browser against a local server, so the generated script now starts one; it also
takes about two minutes, where everything else here takes seconds.
"""

import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit('pyyaml is needed: pip install pyyaml')

ROOT = Path(__file__).resolve().parents[1]
PREFIXES = ('python3 scripts/', 'node scripts/', 'node test/', 'node tests/')
WORKFLOWS = ('ci.yml', 'accessibility.yml')
# Steps in these jobs are advisory and are not worth a contributor's time.
SKIP_JOBS = {'axe-audit', 'check-links'}

HEADER = """#!/usr/bin/env bash
# Every gating command CI actually runs, extracted from the workflows rather
# than kept as a second list that can drift from them. Regenerate with
# scripts/list-ci-checks.py whenever a workflow changes.
set -u

# The contrast gate drives a browser against a local copy of the site. Start
# one if nothing is already listening, and take it down again on the way out.
__served=""
if ! curl -s -o /dev/null --max-time 2 http://127.0.0.1:8231/ 2>/dev/null; then
  python3 -m http.server 8231 >/dev/null 2>&1 &
  __served=$!
  sleep 2
fi
trap '[ -n "$__served" ] && kill "$__served" 2>/dev/null' EXIT
"""


def main():
    seen, lines = set(), []
    jobs = []
    for name in WORKFLOWS:
        wf = yaml.safe_load((ROOT / '.github/workflows' / name).read_text(encoding='utf-8'))
        jobs += [(j, spec) for j, spec in wf['jobs'].items() if j not in SKIP_JOBS]
    for job, spec in jobs:
        for step in spec.get('steps', []):
            run = step.get('run')
            if not run:
                continue
            for line in run.strip().split('\n'):
                line = line.strip()
                if line.startswith(PREFIXES) and line not in seen:
                    seen.add(line)
                    lines.append(
                        f'echo "--- [{job}] {line}"; {line} >/dev/null 2>&1 '
                        f'|| {{ echo "   FAIL: {line}"; {line} 2>&1 | tail -6; }}')
    lines.append('echo "=== done ==="')
    out = ROOT / 'scripts/run-ci-checks.sh'
    out.write_text(HEADER + '\n'.join(lines) + '\n', encoding='utf-8')
    out.chmod(0o755)
    print(f'wrote {out.relative_to(ROOT)} with {len(lines) - 1} commands')
    return 0


if __name__ == '__main__':
    sys.exit(main())
