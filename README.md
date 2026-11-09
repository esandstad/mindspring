# MINDSPRING: Perimenopause, Menopause & Mood Check-In

Live app: https://esandstad.github.io/mindspring/
By Erick Sandstad, Psychotherapist.

Answers are processed only on the client's device. The app never sends answers anywhere. It only fetches `version.json` to tell users of old copies that a newer version exists.

## Layout
- `index.html` — the built app (GitHub Pages serves this). Do not edit by hand.
- `version.json` — the current version, read by older copies to offer an update.
- `src/app.js` — all questions, scoring, flags, report and PDF logic. **`CONFIG.version` is the only place the version is set.**
- `src/style.css`, `src/icon.b64` — styles and home-screen icon.
- `src/build.py` — builds `index.html`, `version.json`, and `src/build/artifact.html` (the Claude-hosted copy, not committed).
- `tests/regression.js`, `tests/personas.js` — automated checks (Playwright). Personas are synthetic.
- `tests/sweep.js` — random profiles of women 40–60, checking internal rules (tiers, staging, hidden answers, score ranges, PDF).
- `tests/scenarios.js` — 12 realistic cases printed for clinical review.
- `publish.sh` — build, test, commit, push.

## Making an update
1. Edit `src/app.js`; raise `CONFIG.version` (e.g. `v40` → `v41`).
2. Run `./publish.sh`. The site updates within a minute or two.
3. Republish `src/build/artifact.html` to the Claude-hosted copy if you use it.

Licensing of included instruments (MRS, C-SSRS, E-HITS, ASRS, PC-PTSD-5, PCL-5, SCOFF) should be confirmed by the clinician before wide use.
