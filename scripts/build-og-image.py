#!/usr/bin/env python3
"""
Render og-image.png from og-image.svg using cairosvg.

The SVG is the source of truth for headline numbers; the PNG is what social
platforms (Facebook, Twitter, LinkedIn, WhatsApp, Slack) actually crawl.
Run this after editing og-image.svg, then commit both files together.

Usage:
    pip install cairosvg
    python3 scripts/build-og-image.py
"""

import sys
from pathlib import Path

try:
    import cairosvg
except ImportError:
    print("ERROR: cairosvg not installed. Run: pip install cairosvg", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
SVG = ROOT / "og-image.svg"
PNG = ROOT / "og-image.png"

if not SVG.exists():
    print(f"ERROR: {SVG} not found", file=sys.stderr)
    sys.exit(1)

cairosvg.svg2png(
    url=str(SVG),
    write_to=str(PNG),
    output_width=1200,
    output_height=630,
)

print(f"✓ Generated {PNG} ({PNG.stat().st_size:,} bytes)")
print()
print("After committing, bust the social-media cache by bumping the ?v=YYYYMMDD")
print("query string on og:image and twitter:image meta tags in index.html.")
