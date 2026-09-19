#!/usr/bin/env python3
"""Regenerate scripts/run-ci-checks.sh from .github/workflows/ci.yml.

A second, hand-kept list of "what CI runs" drifts from the workflow, and did:
v26.6.223 was pushed with a sweep of `scripts/check-*.py` behind it, while the
guard-site-figures job also runs six `build-*.py --check` steps. One of them
failed the moment the how-it-works diagram left index.html, and CI found it
after the push rather than before.

    python3 scripts/list-ci-checks.py     # rewrite scripts/run-ci-checks.sh
    bash scripts/run-ci-checks.sh         # run exactly what CI will run
"""

import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit('pyyaml is needed: pip install pyyaml')

ROOT = Path(__file__).resolve().parents[1]
PREFIXES = ('python3 scripts/', 'node scripts/', 'node test/')

HEADER = """#!/usr/bin/env bash
# Every command ci.yml actually runs, extracted from the workflow rather than
# kept as a second list that can drift from it. Regenerate with
# scripts/list-ci-checks.py whenever ci.yml changes.
set -u
"""


def main():
    wf = yaml.safe_load((ROOT / '.github/workflows/ci.yml').read_text(encoding='utf-8'))
    seen, lines = set(), []
    for job, spec in wf['jobs'].items():
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
