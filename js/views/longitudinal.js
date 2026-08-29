import { app } from '../dom.js';
import { topbar } from './shared.js';

/* VISION — mockup only. Fixed illustrative data, not wired to real session
   results. Do not connect this to live scoring without a backend/DB — see
   PROJECT_BRIEF.md "Scope constraints". */

function classifyLongi(v) {
  if (v >= 65) return { label: 'HIGH', cls: 'high-cell' };
  if (v >= 50) return { label: 'ELEVATED', cls: 'elevated-cell' };
  if (v >= 30) return { label: 'MODERATE', cls: 'moderate-cell' };
  return { label: 'LOW', cls: 'low-cell' };
}

export function renderLongitudinal() {
  const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027'];
  const overallSeries = [78, 74, 69, 58, 52, 47];
  const constructSeries = {
    'Anchoring': [70, 68, 60, 55, 44, 38],
    'Confirmation bias': [55, 58, 50, 47, 40, 35],
    'Authority cues': [80, 76, 74, 60, 58, 50],
    'Automation bias': [62, 60, 58, 52, 48, 42]
  };
  const colors = { 'Anchoring': '#FF6152', 'Confirmation bias': '#F5A623', 'Authority cues': '#7C8CFF', 'Automation bias': '#46D18A' };

  const w = 900, h = 260, padL = 40, padR = 20, padT = 20, padB = 30;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const xStep = plotW / (quarters.length - 1);
  const yScale = v => padT + plotH - (v / 100) * plotH;
  function pathFor(series) { return series.map((v, i) => `${i === 0 ? 'M' : 'L'} ${padL + i * xStep} ${yScale(v)}`).join(' '); }

  const overallPath = pathFor(overallSeries);
  const constructPaths = Object.entries(constructSeries).map(([name, series]) =>
    `<path d="${pathFor(series)}" fill="none" stroke="${colors[name]}" stroke-width="1.4" stroke-dasharray="3,3" opacity="0.55" />`
  ).join('');

  const gridLines = [0, 25, 50, 75, 100].map(v =>
    `<line x1="${padL}" y1="${yScale(v)}" x2="${w - padR}" y2="${yScale(v)}" stroke="#232C3A" stroke-width="1" />
     <text x="${padL - 8}" y="${yScale(v) + 4}" font-family="JetBrains Mono" font-size="10" fill="#526075" text-anchor="end">${v}</text>`
  ).join('');
  const xLabels = quarters.map((q, i) =>
    `<text x="${padL + i * xStep}" y="${h - 8}" font-family="JetBrains Mono" font-size="9.5" fill="#526075" text-anchor="middle">${q}</text>`
  ).join('');
  const overallDots = overallSeries.map((v, i) =>
    `<circle cx="${padL + i * xStep}" cy="${yScale(v)}" r="3.5" fill="#4FE0D6" style="filter: drop-shadow(0 0 4px rgba(79,224,214,0.7));" />`
  ).join('');

  const rows = quarters.map((q, i) => {
    const cells = Object.keys(constructSeries).map(name => {
      const c = classifyLongi(constructSeries[name][i]);
      return `<td class="${c.cls}">${c.label}</td>`;
    }).join('');
    return `<tr><td>${q}</td><td style="font-family:var(--mono);">${overallSeries[i]}</td>${cells}</tr>`;
  }).join('');

  app.innerHTML = `
    ${topbar()}
    <span class="demo-flag">Roadmap mockup — illustrative seeded data, not a live tracking engine</span>
    <div class="dash-header">
      <div class="dash-title">Cognitive Risk — Longitudinal View</div>
      <div class="dash-sub">QUARTERLY REASSESSMENT CYCLE · INDIVIDUAL TREND, NOT ORGANISATIONAL AGGREGATE</div>
    </div>

    <div class="longi-chart">
      <div class="longi-svg-wrap">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
          ${gridLines}
          ${constructPaths}
          <path d="${overallPath}" fill="none" stroke="#4FE0D6" stroke-width="2.2" style="filter: drop-shadow(0 0 3px rgba(79,224,214,0.5));" />
          ${overallDots}
          ${xLabels}
        </svg>
      </div>
      <div class="longi-legend">
        <div class="legend-item"><span class="legend-dot" style="background:#4FE0D6; box-shadow:0 0 6px rgba(79,224,214,0.6);"></span>Overall Cognitive Risk Index (illustrative)</div>
        ${Object.entries(colors).map(([name, c]) => `<div class="legend-item"><span class="legend-dot" style="background:${c};"></span>${name}</div>`).join('')}
      </div>
    </div>

    <div class="longi-chart" style="padding:0; overflow-x:auto;">
      <table class="session-table">
        <thead><tr><th>Cycle</th><th>Overall index</th><th>Anchoring</th><th>Confirmation</th><th>Authority</th><th>Automation</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="footer-note">
      This view illustrates the intended longitudinal monitoring concept described in the project roadmap. Data shown here is seeded for illustration only. Overall index values are framework-derived illustrative scores for prototype purposes, not psychometrically validated measurements. In the live architecture, cadence between sessions would not be tied directly to score improvement, to avoid incentivising response gaming.
    </div>

    <div class="action-row">
      <button class="btn-ghost" data-action="goToDashboard">← BACK TO ASSESSMENT RESULT</button>
      <button class="btn-ghost" data-action="restart">↺ Restart assessment</button>
    </div>
  `;
}
