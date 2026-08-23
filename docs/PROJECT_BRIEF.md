# Noesis — Project Brief for Claude Code

## What this project is

Noesis is a Cognitive Cyber Risk Assessment tool for executive-level cyber-risk decision-makers (CISOs, CIOs, risk managers, board members). It evaluates the cognitive vulnerability of managerial decision *processes* — not the person — through four short, controlled hypothetical business scenarios.

This is an MVP built for a master's thesis, later intended as a real, shareable web app.

## What's in this package

- `noesis-demo-v5.html` — **the definitive, approved reference.** This single HTML file already contains the full working logic (state machine, scoring rules, mitigation roadmap generation, all screens) and the final approved visual design (colors, typography, layout). Open it in a browser to see and interact with exactly what needs to be built as a real app.
- `architettura-progetto.md` — background document covering the theoretical framework (four cognitive constructs derived from academic literature — anchoring, confirmation bias, authority cues, automation bias), the evidence-rule design behind each scenario, the scoring logic, and the mitigation model. Useful for understanding *why* the logic works the way it does, not just *what* it does.

## Your task

Rebuild `noesis-demo-v5.html` as a clean, production-quality web app, preserving **all** existing content, logic, and visual design exactly as implemented in the reference file. This is a refactor/productionization task, not a redesign — do not change scoring rules, scenario text, copy, colors, fonts, or layout unless something is explicitly listed below as needing a change.

### Explicit changes to make relative to the reference HTML

1. **Remove the demo-only shortcut.** The reference file has a button on the landing page: *"⚡ Skip to results (demo shortcut — sample data)"*. This was added only for internal review during design and must NOT be in the production build.
2. **Replace the hero image placeholder.** The landing page has a dashed placeholder box (labeled "Image placeholder, 380 × 480") in the hero section. Leave this as an easily-replaceable image slot (e.g., a clearly marked `<img>` tag or component prop) — the actual image will be supplied separately by the project owner. Do not invent or generate a replacement image yourself.
3. **Code organization.** The reference is a single self-contained HTML file (inline CSS/JS) for ease of review. For production, feel free to restructure into a proper project (e.g., separate CSS/JS files, or a lightweight framework like plain Vite + vanilla JS, or React if you judge it meaningfully improves maintainability) — your call on tooling, as long as the final behavior and appearance are identical to the reference.

### What must NOT change

- The four scenarios (Vendor Anomaly / anchoring, Insider Data Access / confirmation bias, Go-Live Decision / authority cues, Unusual Login Alert / automation bias): keep narrative text, choices, and injected-evidence text exactly as written.
- The scoring logic (`scoreReassessScenario`, `scoreConfirmationScenario` functions in the reference file) — these encode specific, deliberately-designed evidence rules tied to academic constructs. Do not "improve" or simplify them.
- The Mitigation Roadmap logic: it's a many-to-many mapping (see `INTERVENTIONS` array in the reference) — each intervention can target multiple constructs, is included only if at least one targeted construct is Strong or Moderate for that session, and its priority (High/Medium) depends on the highest severity among its actually-relevant targets. Do not revert this to a simple one-bias-one-mitigation mapping.
- Visual design: dark theme, teal/turquoise accent (#4FE0D6), Sora/Inter/JetBrains Mono font pairing, HUD-style corner brackets on panels, the waveform motif in the progress rail. All defined in the `<style>` block of the reference file — port it faithfully.
- The Back/Forward navigation behavior: users can navigate both between phases within a scenario and between different scenarios, with previously-entered answers preserved and editable. This is implemented via the `goBack()` / `goForward()` / `scenarioData` state pattern in the reference — keep this UX intact.
- The four-block dashboard structure (Vulnerability Profile → Contextual Triggers → Observed Decision Safeguards → Mitigation Roadmap), with the Mitigation Roadmap visually dominant (larger panel, teal top border) — this hierarchy is intentional, not decorative.
- The Longitudinal Dashboard screen stays as an explicitly-labeled **mockup with seeded/fixed illustrative data** (see "Scope constraints" below) — do not wire it to real session data unless separately instructed.

## Scope constraints — CORE vs VISION

This MVP deliberately separates what's fully functional from what's shown only as an illustrative mockup. Keep this separation explicit and visible to the end user (the reference file already labels mockup sections clearly — preserve those labels).

**CORE (must work for real):**
- The four-scenario adaptive assessment flow, with real client-side scoring based on actual user input.
- The resulting Cognitive Cyber Risk Profile dashboard (Vulnerability Profile, Contextual Triggers, Observed Decision Safeguards, Mitigation Roadmap), computed live from the session's answers.
- Full Back/Forward navigation with state preservation.

**VISION (stays as a clearly-labeled mockup, not wired to real data):**
- The Longitudinal Dashboard (quarterly trend view). It currently shows fixed illustrative sample data regardless of the real assessment just completed. Do not build data persistence or a backend for this — it is explicitly out of scope for this MVP. If asked to make it "real" in the future, that would require a database and session/user tracking, which is a separate, larger piece of work.

## Technical constraints

- **No AI/LLM API calls of any kind.** All scoring logic is deterministic, rule-based JavaScript (already implemented in the reference file). This was a deliberate decision — the current scenarios are multiple-choice/slider-based, so an LLM would add cost, complexity (a securely-hidden API key isn't possible in a static site without a backend), and undesirable non-determinism, without adding real capability. Do not introduce any Anthropic API, OpenAI API, or similar dependency.
- **No backend, no database required.** This should deploy as a static site.
- **No user accounts/authentication needed** for this MVP.

## Deployment

- Target: **Netlify**, static site, free tier is sufficient (no serverless functions, no database, no paid features needed).
- Important: when running the deploy step, the person using Claude Code will authenticate to Netlify with a specific account (not necessarily the same account associated with any other tool in use). Simply follow the normal Netlify CLI/OAuth login flow when prompted — do not assume or hardcode any particular account or credentials.
- After deployment, confirm the live URL back to the user clearly.

## Language

The entire app is in English (this is intentional — the product targets an international executive audience). Do not translate any content.

## A note on originality (for context, not action)

The scoring thresholds, the evidence rules, and the mitigation-intervention library are original methodological choices developed for a master's thesis — not derived from a validated, published psychometric instrument. This doesn't require any code change, but if you're asked to add documentation, comments, or an About/Methodology page, reflect this honestly rather than implying the scoring is a validated clinical or psychometric tool.
