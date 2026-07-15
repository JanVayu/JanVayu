// Shared HTTP/CORS helpers for Netlify Functions — the single source of truth
// for the CORS headers and OPTIONS preflight handling that was previously
// copy-pasted into every function.
//
// All endpoints are read-open (Access-Control-Allow-Origin: "*") so the static
// front-end, the status page and third-party data consumers can call them from
// any host. `methods` varies per endpoint (most are GET-only; a few POST), so
// each caller passes its own verb list and it is preserved verbatim.

// Build the standard CORS header set, merging any endpoint-specific extras
// (e.g. "Cache-Control", "Content-Type"). Extras win on key collision.
export function corsHeaders(methods = "GET, OPTIONS", extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    ...extra,
  };
}

// If the request is a CORS preflight, return a 204 Response with the CORS
// headers; otherwise return null so the caller continues. A 204 carries no
// body by definition, so we pass `null` (also required by the strict WHATWG
// Response constructor — an empty-string body throws in some runtimes).
export function preflight(request, methods = "GET, OPTIONS", extra = {}) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(methods, extra) });
  }
  return null;
}

// JSON Response helper: serialises `body`, sets Content-Type + CORS headers,
// and merges any endpoint-specific extras.
export function jsonResponse(body, { status = 200, methods = "GET, OPTIONS", headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(methods, headers) },
  });
}

// Header set for the JSON POST/GET endpoints that respond with
// Content-Type: application/json and a custom Access-Control-Allow-Headers list
// (e.g. an API key), and deliberately do NOT advertise Allow-Methods. Kept as a
// distinct helper so migrating those functions is behaviour-preserving.
export function jsonCorsHeaders({ allowHeaders = "Content-Type", extra = {} } = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": allowHeaders,
    "Content-Type": "application/json",
    ...extra,
  };
}
