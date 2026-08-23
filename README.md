# Noesis — Cognitive Cyber Risk Assessment

Noesis is a Cognitive Cyber Risk Assessment tool for executive-level
cyber-risk decision-makers (CISOs, CIOs, risk managers, board members). It
evaluates the cognitive vulnerability of managerial decision *processes* —
not the person — through four short, controlled hypothetical business
scenarios.

This is the production build of the MVP for a master's thesis. It is a
faithful, modularised rebuild of `reference/noesis-demo-v5.html` — the
approved single-file design/logic reference — with two explicit deltas:
the internal-review "skip to results" shortcut has been removed, and the
hero image on the landing page is a real, replaceable `<img>` slot instead
of an inline placeholder. See `docs/PROJECT_BRIEF.md` for the full brief.

## Project structure

```
index.html              entry point
css/styles.css           full visual design (dark theme, teal accent, HUD panels)
js/
  data.js                scenario text, choices, mitigation intervention library
  state.js                app state + per-scenario answer storage
  scoring.js              scoreReassessScenario / scoreConfirmationScenario / computeOverall
  waveform.js              SVG waveform generator (progress rail + hero decoration)
  dom.js                   shared #app root reference
  render.js                screen dispatcher
  actions.js               state-mutating handlers (click/input targets)
  main.js                  event delegation + bootstraps render()
  views/
    shared.js               topbar() / hudWrap()
    landing.js               landing page (incl. hero image slot)
    beforeYouBegin.js        instructions screen
    scenario.js              scenario flow (decide / sources / injected / final)
    dashboard.js             Cognitive Cyber Risk Profile (CORE, computed live)
    longitudinal.js          Longitudinal Dashboard (VISION — seeded mockup)
assets/                  drop the hero image here (see assets/README.md)
docs/                    original brief + theoretical background, for provenance
reference/               the approved reference file this build was ported from
```

No build step, no framework, no dependencies — plain ES modules served as
static files. No backend, no database, no AI/LLM API calls: all scoring is
deterministic client-side JavaScript, by design (see `docs/PROJECT_BRIEF.md`
→ "Technical constraints").

## Running locally

Any static file server works, since the JS is loaded as native ES modules
(which most browsers refuse to load from a `file://` URL). For example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## What's CORE vs VISION

- **CORE (fully functional):** the four-scenario adaptive assessment,
  real-time scoring, and the resulting Cognitive Cyber Risk Profile
  dashboard (Vulnerability Profile, Contextual Triggers, Observed Decision
  Safeguards, Mitigation Roadmap), plus full Back/Forward navigation with
  state preservation.
- **VISION (explicitly labelled mockup):** the Longitudinal Dashboard shows
  fixed, seeded illustrative data — it is not wired to real session results
  and requires no backend for this MVP.

## Before going live

Replace `assets/hero-image.jpg` with the real hero image (380 × 480) — see
`assets/README.md`. Until then the landing page falls back to a clearly
marked dashed placeholder automatically.

## Deployment

Target is Netlify, as a static site (free tier, no serverless functions, no
database). A `netlify.toml` is included (`publish = "."`, no build command).
Deploy via the Netlify CLI or by connecting this repository in the Netlify
UI. **Authenticate with the Netlify account that should own the deployed
site** — repository ownership and Netlify site ownership are independent;
whoever is logged into Netlify at deploy time owns the published site.

## A note on originality

The scoring thresholds, evidence rules and mitigation-intervention library
are original methodological choices developed for a master's thesis — not
derived from a validated, published psychometric instrument.
