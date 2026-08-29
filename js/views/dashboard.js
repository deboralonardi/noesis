import { app } from '../dom.js';
import { topbar } from './shared.js';
import { SCENARIOS, CONSTRUCT_LABELS, SAFEGUARD_TEXT, INTERVENTIONS } from '../data.js';
import { state } from '../state.js';
import { computeOverall } from '../scoring.js';

function scalePosition(level) {
  if (level === 'weak') return 16.5;
  if (level === 'moderate') return 50;
  return 83.5;
}

export function renderDashboard() {
  const overall = computeOverall();

  const triggers = [
    { text: 'Trusted long-term relationship (vendor)', active: state.results.anchoring.level !== 'weak' },
    { text: 'Time-bound, high-visibility decision', active: true },
    { text: 'Senior stakeholder pressure', active: state.results.authority.level !== 'weak' },
    { text: 'High confidence in automated tooling', active: state.results.automation.level !== 'weak' },
    { text: 'Limited time for evidence gathering', active: state.results.confirmation.level !== 'weak' }
  ];

  // build roadmap from the intervention library — many-to-many mapping to constructs
  const roadmapItems = INTERVENTIONS
    .map(iv => {
      const relevantTargets = iv.targets.filter(t => state.results[t] && state.results[t].level !== 'weak');
      if (relevantTargets.length === 0) return null;
      const hasStrong = relevantTargets.some(t => state.results[t].level === 'strong');
      return { ...iv, relevantTargets, priority: hasStrong ? 'High' : 'Medium' };
    })
    .filter(Boolean)
    .sort((a, b) => (a.priority === 'High' ? 0 : 1) - (b.priority === 'High' ? 0 : 1));

  const roadmapHtml = roadmapItems.map((iv, i) => `
    <div class="roadmap-item">
      <div class="ri-top">
        <span class="ri-priority">Priority ${i + 1}</span>
        <span class="ri-construct">${iv.title}</span>
      </div>
      <div class="ri-action">${iv.action}</div>
      <div class="ri-detail">${iv.detail}</div>
      <div class="ri-meta">
        <span>Targets: ${iv.relevantTargets.map(t => CONSTRUCT_LABELS[t]).join(' · ')}</span>
        <span>Level: ${iv.level}</span>
        <span class="priority-${iv.priority.toLowerCase()}">Priority: ${iv.priority}</span>
        <span>Review: Next assessment cycle</span>
      </div>
    </div>
  `).join('') || `<div class="roadmap-item"><div class="ri-detail">No material interventions recommended — responses show consistent evidence-based reassessment across scenarios.</div></div>`;

  app.innerHTML = `
    ${topbar()}
    <span class="demo-flag">Illustrative output — generated from fixed scoring rules, not a validated scoring model</span>
    <div class="dash-header">
      <div class="dash-title">Cognitive Cyber Risk Profile</div>
      <div class="dash-sub">SESSION · ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} · 4 SCENARIOS COMPLETED</div>
    </div>

    <div class="risk-banner ${overall}">
      <div>
        <div class="rb-label">Overall Cognitive Cyber Risk</div>
        <div class="rb-level">${overall}</div>
      </div>
      <div style="text-align:right;">
        <div class="rb-label">Decision Criticality</div>
        <div class="rb-level" style="font-size:17px;">HIGH (by design)</div>
      </div>
    </div>
    <div class="rb-note">Composite rating based on cognitive vulnerability, decision context and observed safeguards.</div>

    <div class="section-block">
      <div class="section-heading"><h2>1 · Vulnerability Profile</h2><span class="sh-q">Where are the vulnerabilities?</span></div>
      <div class="section-panel">
        ${SCENARIOS.map(sc => {
          const r = state.results[sc.id];
          return `
            <div class="vuln-row">
              <div class="vuln-top"><span class="vuln-name">${CONSTRUCT_LABELS[sc.id]}</span><span class="vuln-level ${r.level}">${r.level.toUpperCase()}</span></div>
              <div class="scale-track"><div class="scale-marker ${r.level}" style="left:${scalePosition(r.level)}%;"></div></div>
              <div class="scale-labels"><span>Weak</span><span>Moderate</span><span>Strong</span></div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="section-block">
      <div class="section-heading"><h2>2 · Contextual Triggers</h2><span class="sh-q">Under which conditions can they intensify?</span></div>
      <div class="section-panel">
        <div class="tag-list">
          ${triggers.map(t => `<span class="tag-chip ${t.active ? 'warn' : ''}">${t.text}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="section-block">
      <div class="section-heading"><h2>3 · Observed Decision Safeguards</h2><span class="sh-q">What protective behaviours are already present?</span></div>
      <div class="section-panel">
        <div class="safeguard-list">
          ${SCENARIOS.map(sc => {
            const r = state.results[sc.id];
            const txt = r.controlActive ? SAFEGUARD_TEXT[sc.id].good : SAFEGUARD_TEXT[sc.id].bad;
            return `<div class="safeguard-row ${r.controlActive ? 'good' : 'bad'}"><span class="sg-name">${CONSTRUCT_LABELS[sc.id]}</span><span class="sg-obs">${txt}</span></div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="section-block">
      <div class="section-heading"><h2 style="font-size:16px;">4 · Mitigation Roadmap</h2><span class="sh-q">What should change, at what level, and what should be reassessed?</span></div>
      <div class="roadmap-panel">
        <div class="roadmap-heading"><h2>Recommended interventions</h2></div>
        <div class="roadmap-sub">Ordered by priority — derived from vulnerability level and observed safeguards</div>
        ${roadmapHtml}
        <div class="roadmap-closing">
          <div class="rc-text">
            <div class="rc-label">Reassessment</div>
            <div class="rc-desc">Measure whether the safeguards changed decision behaviour over subsequent assessment cycles.</div>
          </div>
          <button class="btn-primary no-print" data-action="goToLongitudinal">View Longitudinal Dashboard (mockup) →</button>
        </div>
      </div>
    </div>

    <div class="footer-note">
      This profile reflects illustrative scoring rules used for prototype purposes. In the full framework, each rating derives from the evidence rubric defined in the Cognitive Assessment Model, based on a single scenario per construct — sufficient for a proof of concept, not yet a psychometrically validated measure.
    </div>

    <div class="action-row">
      <button class="btn-ghost no-print" data-action="restart">↺ Restart assessment</button>
      <button class="btn-primary no-print" data-action="downloadReport">⬇ Download PDF report</button>
    </div>
  `;
}
