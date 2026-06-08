#!/usr/bin/env bash
#
# health-check.sh — liveness probe for JanVayu's live site + serverless functions.
#
# Detects the "function crashed / down" class of outage (HTTP 5xx or no
# response) — e.g. the May 2026 chatbot 502 caused by a module load error.
# Benign 4xx responses (e.g. 405 "POST required", 400 "question required")
# count as UP because they prove the function loaded and is handling requests.
#
# For serverless functions we send a POST with an empty JSON body ({}). A
# healthy function returns a 4xx validation error (e.g. 400 "question and city
# are required") *before* any Groq/WAQI call, so the probe is zero-cost and
# spends no Groq tokens; a function that failed to load returns 5xx. (OPTIONS
# is NOT used: Netlify returns 502 for unsupported methods on healthy v2
# functions, which would be a false alarm.)
#
# Usage:
#   scripts/health-check.sh                 # probe production (www.janvayu.in)
#   BASE_URL=http://localhost:8888 scripts/health-check.sh
#   scripts/health-check.sh report.md       # also write a Markdown report
#
# Exit code: 0 if everything is UP, 1 if any endpoint is DOWN.

set -uo pipefail

BASE_URL="${BASE_URL:-https://www.janvayu.in}"
REPORT_FILE="${1:-}"
TIMEOUT="${TIMEOUT:-30}"

# Each entry: "Label|METHOD|path-or-url"
# A path (starting with /) is appended to BASE_URL; a full URL is used as-is.
CHECKS=(
  "Site homepage|GET|/"
  "Ask JanVayu PWA page|GET|/ask/"
  "Chatbot backend (air-query)|POST|/.netlify/functions/air-query"
  "reference-data|POST|/.netlify/functions/reference-data"
  "health-advisory|POST|/.netlify/functions/health-advisory"
  "accountability-brief|POST|/.netlify/functions/accountability-brief"
  "rankings|POST|/.netlify/functions/rankings"
  "historical-aqi|POST|/.netlify/functions/historical-aqi"
  "anomaly-check|POST|/.netlify/functions/anomaly-check"
)

failures=0
report=""
report+="# JanVayu health check\n\n"
report+="Base URL: \`${BASE_URL}\`\n"
report+="Checked at: $(date -u '+%Y-%m-%d %H:%M:%S UTC')\n\n"
report+="| Endpoint | Method | Status | Result |\n"
report+="|----------|--------|--------|--------|\n"

for entry in "${CHECKS[@]}"; do
  IFS='|' read -r label method target <<< "$entry"
  case "$target" in
    http*) url="$target" ;;
    *)     url="${BASE_URL}${target}" ;;
  esac

  # POST probes send an empty JSON body so the function reaches its own
  # validation (4xx) without invoking Groq/WAQI.
  if [ "$method" = "POST" ]; then
    code=$(curl -s -o /dev/null -m "$TIMEOUT" -w "%{http_code}" \
                -X POST -H "Content-Type: application/json" -d '{}' "$url" 2>/dev/null)
  else
    code=$(curl -s -o /dev/null -m "$TIMEOUT" -w "%{http_code}" \
                -X "$method" "$url" 2>/dev/null)
  fi
  rc=$?

  if [ "$rc" -ne 0 ]; then
    status="unreachable (curl $rc)"; result="DOWN"
  elif [ "$code" -ge 500 ] || [ "$code" -eq 000 ]; then
    status="$code"; result="DOWN"
  else
    status="$code"; result="UP"
  fi

  if [ "$result" = "DOWN" ]; then
    failures=$((failures + 1))
    icon="❌"
  else
    icon="✅"
  fi

  printf '%s  %-32s %-7s -> %s\n' "$icon" "$label" "$method" "$status"
  report+="| ${label} | ${method} | ${status} | ${icon} ${result} |\n"
done

report+="\n"
if [ "$failures" -gt 0 ]; then
  report+="**${failures} endpoint(s) DOWN** (HTTP 5xx or unreachable).\n"
else
  report+="All endpoints healthy.\n"
fi

if [ -n "$REPORT_FILE" ]; then
  printf '%b' "$report" > "$REPORT_FILE"
fi

if [ "$failures" -gt 0 ]; then
  echo ""
  echo "RESULT: $failures endpoint(s) DOWN"
  exit 1
fi

echo ""
echo "RESULT: all endpoints healthy"
exit 0
