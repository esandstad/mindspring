#!/bin/bash
# Update steps: 1) edit src/app.js and raise CONFIG.version (e.g. 'v41')  2) ./publish.sh
set -e
cd "$(dirname "$0")"
python3 src/build.py
if node -e "require('playwright')" 2>/dev/null; then
  mkdir -p tests/out
  node tests/regression.js "$PWD/index.html" tests/out | tail -1
  node tests/personas.js "$PWD/index.html" | tail -1
  node tests/sweep.js "$PWD/index.html" 150 1 | tail -1
fi
V=$(python3 -c "import json;print(json.load(open('version.json'))['version'])")
git add -A
git commit -q -m "$V" ${GIT_TRAILER:+-m "$GIT_TRAILER"}
git push -q origin main && git log --oneline -1
