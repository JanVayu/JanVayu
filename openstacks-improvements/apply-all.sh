#!/bin/bash
# OpenStacks Ecosystem Update Script
# Run this from a directory where you want to clone all repos.
# It will: clone each repo, apply improved READMEs + shared docs, commit, and push.
#
# Usage:
#   cd /path/to/workspace
#   bash /path/to/apply-all.sh
#
# Prerequisites: git configured with GitHub push access

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SHARED_DIR="$SCRIPT_DIR/shared"
WORK_DIR="$(pwd)/openstacks-update-$(date +%Y%m%d)"

echo "=== OpenStacks Ecosystem Update ==="
echo "Working directory: $WORK_DIR"
echo ""

mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# --- Helper function ---
update_repo() {
  local repo_name="$1"
  local dir_name="$2"  # lowercase directory name in openstacks-improvements
  local github_desc="$3"
  local github_topics="$4"

  echo ""
  echo "--- Updating $repo_name ---"

  # Clone
  if [ ! -d "$repo_name" ]; then
    git clone "https://github.com/Varnasr/$repo_name.git"
  fi
  cd "$repo_name"

  # Create branch
  git checkout -b openstacks-ecosystem-update 2>/dev/null || git checkout openstacks-ecosystem-update

  # Copy README
  if [ -f "$SCRIPT_DIR/$dir_name/README.md" ]; then
    cp "$SCRIPT_DIR/$dir_name/README.md" README.md
    echo "  Copied README.md"
  fi

  # Copy shared governance docs
  cp "$SHARED_DIR/CONTRIBUTING.md" CONTRIBUTING.md 2>/dev/null && echo "  Copied CONTRIBUTING.md" || true
  cp "$SHARED_DIR/CODE_OF_CONDUCT.md" CODE_OF_CONDUCT.md 2>/dev/null && echo "  Copied CODE_OF_CONDUCT.md" || true
  cp "$SHARED_DIR/LICENSE" LICENSE 2>/dev/null && echo "  Copied LICENSE" || true

  # For OpenStacks hub, also copy the new index.html
  if [ "$repo_name" = "OpenStacks-for-Change" ] && [ -f "$SCRIPT_DIR/$dir_name/index.html" ]; then
    cp "$SCRIPT_DIR/$dir_name/index.html" index.html
    echo "  Copied index.html (new landing page)"
  fi

  # Stage and commit
  git add -A
  if git diff --cached --quiet; then
    echo "  No changes to commit"
  else
    git commit -m "Update README, governance docs, and OpenStacks branding

Part of the OpenStacks ecosystem improvement pass:
- Improved README with accurate content inventory and status
- Added OpenStacks cross-links and branding
- Updated CONTRIBUTING.md with ecosystem-wide guidelines
- Updated CODE_OF_CONDUCT.md (Contributor Covenant)
- Updated LICENSE with full MIT text"
    echo "  Committed changes"
  fi

  cd "$WORK_DIR"

  # Update GitHub description and topics via gh CLI (if available)
  if command -v gh &> /dev/null; then
    if [ -n "$github_desc" ]; then
      gh repo edit "Varnasr/$repo_name" --description "$github_desc" 2>/dev/null && echo "  Updated GitHub description" || echo "  Could not update description (check gh auth)"
    fi
    if [ -n "$github_topics" ]; then
      # gh repo edit --add-topic expects comma-separated
      for topic in $(echo "$github_topics" | tr ',' ' '); do
        gh repo edit "Varnasr/$repo_name" --add-topic "$topic" 2>/dev/null || true
      done
      echo "  Updated GitHub topics"
    fi
  else
    echo "  Skipping GitHub description/topics (gh CLI not installed)"
  fi
}

# --- Apply to all repos ---

update_repo "InsightStack" "insightstack" \
  "MEL tools, calculators & research documentation for development work — Part of OpenStacks" \
  "openstacks,development-economics,social-impact,south-asia,open-source,mel,monitoring-evaluation,stata,research-tools,calculators"

update_repo "FieldStack" "fieldstack" \
  "Reusable R notebooks & scripts for fieldwork, surveys & evaluation — Part of OpenStacks" \
  "openstacks,development-economics,social-impact,south-asia,open-source,r-lang,fieldwork,survey-design,evaluation,quarto"

update_repo "EquityStack" "equitystack" \
  "Python/Jupyter workflows for health, gender, education & climate data — Part of OpenStacks" \
  "openstacks,development-economics,social-impact,south-asia,open-source,python,jupyter,data-workflows,health-equity,gender"

update_repo "SignalStack" "signalstack" \
  "Research Rundown newsletter archive & curated development resources — Part of OpenStacks" \
  "openstacks,development-economics,social-impact,south-asia,open-source,newsletter,research-curation,development-policy"

update_repo "RootStack" "rootstack" \
  "[Early-stage] Foundational data schemas for the OpenStacks ecosystem" \
  "openstacks,development-economics,social-impact,south-asia,open-source,database,schemas,postgresql"

update_repo "BridgeStack" "bridgestack" \
  "[Early-stage] API backend bridging OpenStacks data layers" \
  "openstacks,development-economics,social-impact,south-asia,open-source,fastapi,api,backend"

update_repo "ViewStack" "viewstack" \
  "[Early-stage] Frontend UI for OpenStacks data visualization" \
  "openstacks,development-economics,social-impact,south-asia,open-source,frontend,data-visualization,dashboard"

update_repo "PolicyStack" "policystack" \
  "[Early-stage] South Asia policy tracker — Part of OpenStacks" \
  "openstacks,development-economics,social-impact,south-asia,open-source,policy-tracker,governance,india"

update_repo "OpenStacks-for-Change" "openstacks-hub" \
  "Open, modular toolkit ecosystem for development research & evaluation — openstacks.dev" \
  "openstacks,development-economics,social-impact,south-asia,open-source"

echo ""
echo "=== All repos updated ==="
echo ""
echo "Next steps:"
echo "  1. Review changes in each repo directory under $WORK_DIR"
echo "  2. Push each repo:"
echo ""
for repo in InsightStack FieldStack EquityStack SignalStack RootStack BridgeStack ViewStack PolicyStack OpenStacks-for-Change; do
  echo "     cd $WORK_DIR/$repo && git push -u origin openstacks-ecosystem-update"
done
echo ""
echo "  3. Create PRs on GitHub for each repo, or push directly to main if you prefer"
echo ""
