#!/usr/bin/env python3
"""
handdrawn.py — emit Excalidraw-style hand-drawn SVG shapes.

Why this exists
---------------
The homepage diagram (assets/how-it-works.svg) was exported from Excalidraw, so
its edges are wobbly two-stroke paths with fractional coordinates. Diagrams
authored by hand since then used plain <rect> and <line>: same Kalam lettering,
but crisp geometry, which reads as a different kind of object sitting next to
the real ones. There was no generator in the repo to close the gap, so this is
it.

The look, in one sentence: rough.js draws each straight edge twice, as two
slightly bowed lines that miss their endpoints by a pixel or two, and fills
shapes with a separate hachure or solid path underneath. That is all this does.

Determinism matters more than it looks. The jitter is seeded from the shape's
own coordinates, so the same diagram regenerates byte-identically and a diff
shows real changes rather than fresh noise every build.

Not a general drawing library. It knows rectangles, lines, arrows and ellipses,
because that is what the JanVayu diagrams are made of.
"""

import math


class Pen:
    """Deterministic jitter, seeded per shape so output is reproducible."""

    def __init__(self, seed=0):
        self.state = (seed * 2654435761) & 0xFFFFFFFF

    def next(self):
        # xorshift32 — small, dependency-free, and stable across Python versions
        x = self.state or 0x9E3779B9
        x ^= (x << 13) & 0xFFFFFFFF
        x ^= x >> 17
        x ^= (x << 5) & 0xFFFFFFFF
        self.state = x & 0xFFFFFFFF
        return self.state / 0xFFFFFFFF

    def jitter(self, amount):
        return (self.next() - 0.5) * 2 * amount


def _seed_of(*nums):
    s = 0
    for n in nums:
        s = (s * 31 + int(abs(n) * 7)) & 0xFFFFFFFF
    return s


def _fmt(v):
    return f'{v:.2f}'.rstrip('0').rstrip('.')


def hand_line(x1, y1, x2, y2, roughness=1.0, seed=None, passes=2):
    """One straight edge as `passes` slightly bowed strokes."""
    pen = Pen(seed if seed is not None else _seed_of(x1, y1, x2, y2))
    length = math.hypot(x2 - x1, y2 - y1)
    # long edges wander more than short ones, as a real pen does
    amp = roughness * min(3.0, 0.6 + length / 220.0)
    out = []
    for p in range(passes):
        # endpoints miss slightly; the middle bows away from true
        sx = x1 + pen.jitter(amp * 0.7)
        sy = y1 + pen.jitter(amp * 0.7)
        ex = x2 + pen.jitter(amp * 0.7)
        ey = y2 + pen.jitter(amp * 0.7)
        mx = (x1 + x2) / 2 + pen.jitter(amp * 1.6)
        my = (y1 + y2) / 2 + pen.jitter(amp * 1.6)
        c1x = (sx + mx) / 2 + pen.jitter(amp)
        c1y = (sy + my) / 2 + pen.jitter(amp)
        c2x = (mx + ex) / 2 + pen.jitter(amp)
        c2y = (my + ey) / 2 + pen.jitter(amp)
        out.append(
            f'M{_fmt(sx)} {_fmt(sy)} Q{_fmt(c1x)} {_fmt(c1y)} {_fmt(mx)} {_fmt(my)} '
            f'Q{_fmt(c2x)} {_fmt(c2y)} {_fmt(ex)} {_fmt(ey)}'
        )
    return ' '.join(out)


def hand_rect(x, y, w, h, roughness=1.0, seed=None):
    """Four hand-drawn edges. Corners deliberately do not meet exactly."""
    s = seed if seed is not None else _seed_of(x, y, w, h)
    return ' '.join([
        hand_line(x, y, x + w, y, roughness, s + 1),
        hand_line(x + w, y, x + w, y + h, roughness, s + 2),
        hand_line(x + w, y + h, x, y + h, roughness, s + 3),
        hand_line(x, y + h, x, y, roughness, s + 4),
    ])


def fill_path(x, y, w, h, r=12):
    """The solid under-fill. Rounded, and drawn once — fills are not sketchy."""
    return (f'M{_fmt(x + r)} {_fmt(y)} H{_fmt(x + w - r)} Q{_fmt(x + w)} {_fmt(y)} {_fmt(x + w)} {_fmt(y + r)} '
            f'V{_fmt(y + h - r)} Q{_fmt(x + w)} {_fmt(y + h)} {_fmt(x + w - r)} {_fmt(y + h)} '
            f'H{_fmt(x + r)} Q{_fmt(x)} {_fmt(y + h)} {_fmt(x)} {_fmt(y + h - r)} '
            f'V{_fmt(y + r)} Q{_fmt(x)} {_fmt(y)} {_fmt(x + r)} {_fmt(y)} Z')


def box(x, y, w, h, fill='#fbfaf7', stroke='#1e2a22', sw=2.2, roughness=1.0, seed=None):
    """A filled, hand-outlined box: solid fill under two sketchy outline passes."""
    return (f'<path d="{fill_path(x, y, w, h)}" fill="{fill}" stroke="none"/>'
            f'<path d="{hand_rect(x, y, w, h, roughness, seed)}" fill="none" '
            f'stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round"/>')


def arrow(x1, y1, x2, y2, stroke='#146c33', sw=2.0, head=9, roughness=1.0, seed=None):
    """A hand-drawn line with a two-stroke arrowhead."""
    s = seed if seed is not None else _seed_of(x1, y1, x2, y2)
    ang = math.atan2(y2 - y1, x2 - x1)
    a1 = ang + math.radians(155)
    a2 = ang - math.radians(155)
    d = hand_line(x1, y1, x2, y2, roughness, s)
    d += ' ' + hand_line(x2, y2, x2 + head * math.cos(a1), y2 + head * math.sin(a1), roughness * 0.6, s + 11, passes=1)
    d += ' ' + hand_line(x2, y2, x2 + head * math.cos(a2), y2 + head * math.sin(a2), roughness * 0.6, s + 12, passes=1)
    return (f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def circle(cx, cy, r, fill='#fbfaf7', stroke='#1e2a22', sw=2.2, roughness=1.0, seed=None):
    """An ellipse drawn as a wobbly closed loop, twice round."""
    pen = Pen(seed if seed is not None else _seed_of(cx, cy, r))
    parts = []
    for p in range(2):
        pts = []
        n = 14
        for i in range(n + 1):
            t = (i / n) * math.tau + pen.jitter(0.05)
            rr = r + pen.jitter(roughness * 1.3)
            pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
        d = f'M{_fmt(pts[0][0])} {_fmt(pts[0][1])}'
        for i in range(1, len(pts)):
            px, py = pts[i - 1]
            qx, qy = pts[i]
            d += f' Q{_fmt((px + qx) / 2 + pen.jitter(roughness))} {_fmt((py + qy) / 2 + pen.jitter(roughness))} {_fmt(qx)} {_fmt(qy)}'
        parts.append(d)
    body = f'<circle cx="{_fmt(cx)}" cy="{_fmt(cy)}" r="{_fmt(r)}" fill="{fill}" stroke="none"/>' if fill != 'none' else ''
    return body + f'<path d="{" ".join(parts)}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round"/>'


def text(x, y, s, size=13, fill='#1e2a22', weight=400, anchor='start'):
    esc = (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
    w = ' font-weight="700"' if weight >= 700 else ''
    a = f' text-anchor="{anchor}"' if anchor != 'start' else ''
    return (f'<text x="{_fmt(x)}" y="{_fmt(y)}" font-family="Kalam, Comic Sans MS, cursive" '
            f'font-size="{size}" fill="{fill}"{w}{a}>{esc}</text>')


def svg(width, height, body, label):
    esc = label.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
            f'role="img" aria-label="{esc}">\n{body}\n</svg>\n')
