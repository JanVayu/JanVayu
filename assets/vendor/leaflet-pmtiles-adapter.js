/* leaflet-pmtiles-adapter.js — read a PMTiles archive through Leaflet.VectorGrid.
 *
 * L.VectorGrid.Protobuf fetches tiles from a {z}/{x}/{y} URL template. PMTiles
 * puts every tile in one file and addresses them with HTTP range requests, so
 * there is no per-tile URL to give it.
 *
 * The bundled VectorGrid keeps its protobuf parser (Pbf, VectorTile) private —
 * they are not on L or window — so we cannot decode a tile ourselves and hand
 * back the structure it expects. Rather than vendor a second copy of the
 * parser, this hands the bytes back through the door VectorGrid already has:
 * point its _url at a blob: URL holding the tile, let its own fetch-and-parse
 * path run unchanged, then revoke.
 *
 * L.Util.template() leaves a blob: URL alone because it contains no {tokens},
 * and it reads _url synchronously, so swapping the value around the call is
 * safe even with several tiles in flight.
 *
 * Usage:  L.vectorGrid.pmtiles('/data/tiles/ward.pmtiles', { … })
 *         — same options as L.vectorGrid.protobuf.
 */
(function (L) {
    'use strict';
    if (!L || !L.VectorGrid || !L.VectorGrid.Protobuf) return;
    if (typeof pmtiles === 'undefined') return;

    // Leaflet.VectorGrid calls L.DomEvent.fakeStop on every feature click.
    // Leaflet removed it in 1.6; we ship 1.9.4, so every click on a boundary
    // threw "L.DomEvent.fakeStop is not a function" before the layer could
    // fire its own click event — the map invited you to tap a ward and then
    // silently did nothing. It failed inside a DOM handler, so nothing broke
    // visibly and no popup ever appeared to be missing.
    //
    // fakeStop used to flag an event as already handled so Leaflet's own map
    // click would skip it. A no-op is the right shim here: our handlers call
    // L.DomEvent.stop themselves, so propagation is already stopped where it
    // matters. Defined on the adapter because this is the one file we control
    // that is guaranteed to load after VectorGrid and before any map is built.
    if (L.DomEvent && typeof L.DomEvent.fakeStop !== 'function') {
        L.DomEvent.fakeStop = function () {};
    }

    var Proto = L.VectorGrid.Protobuf;
    var origGetTile = Proto.prototype._getVectorTilePromise;

    L.VectorGrid.PMTiles = Proto.extend({
        initialize: function (archiveUrl, options) {
            this._archive = new pmtiles.PMTiles(archiveUrl);
            // The template is never used — _getVectorTilePromise swaps in a
            // blob URL per tile — but VectorGrid expects a string here.
            Proto.prototype.initialize.call(this, archiveUrl, options);
        },

        /** Resolve the archive's own min/max zoom, so callers need not hardcode. */
        header: function () {
            return this._archive.getHeader();
        },

        _getVectorTilePromise: function (coords) {
            var self = this;
            return this._archive.getZxy(coords.z, coords.x, coords.y)
                .then(function (tile) {
                    // A missing tile is normal — most of the country is empty
                    // at any given z/x/y. VectorGrid wants an empty structure,
                    // not a rejection.
                    if (!tile || !tile.data || !tile.data.byteLength) return { layers: {} };
                    var url = URL.createObjectURL(new Blob([tile.data]));
                    var saved = self._url;
                    self._url = url;
                    var p;
                    try {
                        p = origGetTile.call(self, coords);
                    } finally {
                        self._url = saved;   // restore before any await resumes
                    }
                    return p.then(function (parsed) {
                        URL.revokeObjectURL(url);
                        return parsed;
                    }, function (err) {
                        URL.revokeObjectURL(url);
                        throw err;
                    });
                })
                .catch(function () {
                    // A range request can fail on a flaky connection. One dead
                    // tile must not take down the layer.
                    return { layers: {} };
                });
        },
    });

    L.vectorGrid.pmtiles = function (archiveUrl, options) {
        return new L.VectorGrid.PMTiles(archiveUrl, options);
    };
})(window.L);
