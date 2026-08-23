import { app } from '../dom.js';
import { topbar } from './shared.js';
import { waveformSVG } from '../waveform.js';

/* Hero image slot — a real <img>, not an invented graphic. Until the final
   asset is dropped in at assets/hero-image.jpg, the image fails to load and
   the dashed placeholder below is shown instead (see onerror handler). */
function heroVisual() {
  return `
    <img class="hero-image" src="assets/hero-image.jpg" alt="Noesis — Cognitive Cyber Risk Assessment"
      onerror="this.remove(); document.getElementById('heroPlaceholder').style.display='flex';">
    <div class="hero-placeholder" id="heroPlaceholder">
      <div class="hp-label">Image placeholder — replace assets/hero-image.jpg</div>
      <div class="hp-dim">380 × 480</div>
    </div>
  `;
}

export function renderLanding() {
  app.innerHTML = `
    ${topbar()}
    <div class="landing-hero">
      <div class="hero-layout">
        <div class="hero-copy">
          <div class="eyebrow">Periodic Cognitive Assessment</div>
          <div class="headline">It's not just what you decide.<br>It's how you decide it.</div>
          <div class="headline-sub">A structured way to understand the <span class="accent">cognitive factors</span> that drive cyber-risk decisions.</div>
          <div class="hero-underline"></div>
          <div class="sub">Noesis uses realistic business scenarios to assess the cognitive factors that influence cyber-risk decisions. It focuses on how decisions are formed, tested, and revised under uncertainty — revealing where cognitive vulnerabilities may emerge and where targeted mitigation is needed.</div>
        </div>
        <div class="hero-visual">
          <div class="hero-visual-frame">${heroVisual()}</div>
        </div>
      </div>

      <div class="hero-waveform">${waveformSVG(920, 60, 0.8, '#4FE0D6', true)}</div>

      <div class="landing-grid">
        <div class="landing-cell">
          <div class="lc-glow"><div class="dot"></div></div>
          <div class="lc-label">Adaptive</div>
          <p>The assessment evolves with the scenario. Each decision is followed by new evidence, prompting you to reassess as the situation changes.</p>
        </div>
        <div class="landing-cell">
          <div class="lc-glow"><div class="dot"></div></div>
          <div class="lc-label">Scenario-based</div>
          <p>Controlled, hypothetical cyber-risk scenarios create realistic decision conditions without requiring sensitive organisational incident data.</p>
        </div>
        <div class="landing-cell">
          <div class="lc-glow"><div class="dot"></div></div>
          <div class="lc-label">Focused on the decision process</div>
          <p>Noesis assesses how decisions are formed and revised under changing conditions, revealing cognitive vulnerabilities in the decision process.</p>
        </div>
      </div>

      <div class="not-block">
        <div class="nb-title">What you'll do</div>
        <p>You'll work through four short scenarios. Each presents a realistic cyber-risk situation, asks for an initial decision, then introduces new information before asking you to reconsider. The assessment focuses on how your judgement responds to new evidence and changing conditions.</p>
      </div>

      <button class="btn-primary" data-action="goToBeforeYouBegin">Start Cognitive Assessment</button>
    </div>
  `;
}
