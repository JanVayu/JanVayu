# Fixtures for the CI contrast gate

These are **not** real readings and must never be used as data. They exist so
`tests/contrast-ci.mjs` renders the same page on every run.

The sweep it gates measures the colour of text against the colour behind it.
Both can depend on the live AQI, because the site paints a band colour per
reading, so a live page makes the count drift on its own: one hand-run reported
331 light failures and the next 499 with no code change in between. A gate on a
number that moves by itself is a gate that gets switched off.

`waqi-feed.json` deliberately spans several AQI bands across its stations, so a
band colour that only fails in one band still gets painted.
