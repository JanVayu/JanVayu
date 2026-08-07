/**
 * geo.mjs — shared planar-geometry helpers for the boundary importers.
 *
 * Extracted from fetch-openmaps.mjs so the BharatLas importer can reuse the
 * same code rather than reimplement it. That matters more than it sounds:
 * a hand-rolled Douglas-Peucker written for the second importer silently
 * dropped every ward, because on a closed ring the first and last points are
 * identical and a naive point-to-LINE distance degenerates. The version below
 * measures to the SEGMENT with a clamped projection, which handles it.
 *
 * Pure functions, no I/O. Coordinates are [lon, lat] degrees throughout, and
 * areas are square degrees (fine for the relative comparisons made here).
 */

export const round5 = (n) => Math.round(n * 1e5) / 1e5;

// Douglas-Peucker on a ring/line of [lon, lat] pairs; tol in degrees.
export function simplifyRing(pts, tol) {
    if (pts.length <= 4) return pts;
    const keep = new Uint8Array(pts.length);
    keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
        const [a, b] = stack.pop();
        if (b - a < 2) continue;
        const [ax, ay] = pts[a], [bx, by] = pts[b];
        const dx = bx - ax, dy = by - ay;
        const len2 = dx * dx + dy * dy;
        let maxD = -1, maxI = -1;
        for (let i = a + 1; i < b; i++) {
            const [px, py] = pts[i];
            let d;
            if (len2 === 0) { const ex = px - ax, ey = py - ay; d = ex * ex + ey * ey; }
            else {
                const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
                const ex = px - (ax + t * dx), ey = py - (ay + t * dy);
                d = ex * ex + ey * ey;
            }
            if (d > maxD) { maxD = d; maxI = i; }
        }
        if (maxD > tol * tol) { keep[maxI] = 1; stack.push([a, maxI], [maxI, b]); }
    }
    const out = [];
    for (let i = 0; i < pts.length; i++) if (keep[i]) out.push(pts[i]);
    return out;
}

export function ringArea(ring) { // shoelace, signed, sq. degrees
    let s = 0;
    for (let i = 0, n = ring.length - 1; i < n; i++)
        s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    return s / 2;
}

export function ringCentroid(ring) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0, n = ring.length - 1; i < n; i++) {
        const f = ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
        a += f; cx += (ring[i][0] + ring[i + 1][0]) * f; cy += (ring[i][1] + ring[i + 1][1]) * f;
    }
    if (Math.abs(a) < 1e-12) return ring[0];
    return [cx / (3 * a), cy / (3 * a)];
}

export function closeRing(ring) {
    const [fx, fy] = ring[0], [lx, ly] = ring[ring.length - 1];
    if (fx !== lx || fy !== ly) ring.push([fx, fy]);
    return ring;
}

// Simplify a Polygon/MultiPolygon geometry in place; drops rings that
// collapse or fall under minRingArea (sq. degrees). Returns null if nothing left.
export function simplifyGeom(geom, tol, minRingArea = 0) {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] :
                  geom.type === 'MultiPolygon' ? geom.coordinates : null;
    if (!polys) return geom; // points pass through
    const outPolys = [];
    for (const poly of polys) {
        const outRings = [];
        for (const ring of poly) {
            let r = simplifyRing(ring.map(([x, y]) => [round5(x), round5(y)]), tol);
            if (r.length < 4) continue;
            r = closeRing(r.map(([x, y]) => [round5(x), round5(y)]));
            if (r.length < 4) continue;
            if (minRingArea && Math.abs(ringArea(r)) < minRingArea) {
                if (outRings.length === 0) continue;   // outer ring too small → skip poly
                else continue;                          // hole too small → drop hole
            }
            outRings.push(r);
        }
        if (outRings.length) outPolys.push(outRings);
    }
    if (!outPolys.length) return null;
    return outPolys.length === 1
        ? { type: 'Polygon', coordinates: outPolys[0] }
        : { type: 'MultiPolygon', coordinates: outPolys };
}

// Area-weighted centroid of the largest outer ring of a (Multi)Polygon.
export function geomCentroid(geom) {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
    let best = null, bestA = -1;
    for (const poly of polys) {
        const a = Math.abs(ringArea(poly[0]));
        if (a > bestA) { bestA = a; best = poly[0]; }
    }
    const [cx, cy] = ringCentroid(best);
    return [round5(cx), round5(cy)];
}
