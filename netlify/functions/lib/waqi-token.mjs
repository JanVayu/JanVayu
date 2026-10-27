// The WAQI token, read from the environment and nowhere else.
//
// Until 27 October 2026 the same 40-character token was written into app.js,
// js/try-home.js and eight functions (usually as the fallback after this very
// variable), so every browser held it and anyone could spend JanVayu's WAQI
// quota. It is now set as WAQI_TOKEN in the Netlify site settings, the browser
// reaches WAQI only through waqi-proxy, and scripts/check-no-waqi-token.py fails
// if a literal token is ever committed again.
//
// An empty string, not a throw: a function with no token gets WAQI's own "invalid
// key" answer and takes its existing failure path, instead of crashing a scheduled
// run that has other work to do. waqi-proxy checks for it and says so.
export const WAQI_TOKEN = process.env.WAQI_TOKEN || process.env.WAQI_API_TOKEN || "";
