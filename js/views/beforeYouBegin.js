import { app } from '../dom.js';
import { topbar, hudWrap } from './shared.js';

export function renderBeforeYouBegin() {
  app.innerHTML = `
    ${topbar()}
    ${hudWrap(`<div class="byb-stage">
      <div class="byb-eyebrow">Before You Begin</div>
      <div class="byb-title">How to approach this assessment</div>
      <div class="byb-divider"></div>
      <div class="byb-body">
        <p><strong>No single answer determines your result.</strong> Noesis looks at how your decisions evolve across each scenario — including your initial judgement, confidence, the information you choose to consider, and how you respond to new evidence.</p>
        <p>The assessment considers the overall decision process, not any individual choice in isolation. Respond as you would in a real situation, based on the information available at each step.</p>
      </div>
      <div class="byb-cta">
        <button class="btn-primary" data-action="startAssessment">Start Assessment</button>
      </div>
    </div>`)}
  `;
}
