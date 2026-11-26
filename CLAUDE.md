# JanVayu

Shared engineering standard: @.claude/engineering-standards.md. It applies to all work in this repository. This file adds what is specific to the project, and wins where the two disagree.

A citizen-led national archive of India's air quality crisis, at
www.janvayu.in, deployed on Netlify. Read `docs/claude-code/` first: it holds
the project's own notes for this work (`overview.md`, `setup.md`,
`workflow.md`, `capabilities.md`, `sharing.md`), and `CONTRIBUTING.md`
and `FORKING.md` cover the rest.

## Commands

`.github/workflows/ci.yml` runs about 25 checks in `scripts/`
(`check-site-figures.py`, `check-theme-contrast.py`, the `build-*.py
--check` staleness gates, `check-inline-js.mjs` and others). Read that file
for the current list rather than copying it here, where it would drift.

## Watch out for

Sixteen workflows run here (counted 21 November 2026), several on a schedule
(one every 15 minutes). Three push a branch and open a pull request:
`cpcb-bulletins`, `current-year-air` and `translations`. `link-audit` opens an
issue and pushes nothing.
On a publish-locked site those builds are free until the next publish window;
check that the site is still locked before adding another scheduled commit.
