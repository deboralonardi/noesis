import { app } from '../dom.js';
import { topbar, hudWrap } from './shared.js';
import { waveformSVG } from '../waveform.js';
import { SCENARIOS } from '../data.js';
import { state, getScenarioData } from '../state.js';

function progressRail() {
  const total = SCENARIOS.length;
  const segs = SCENARIOS.map((s, i) => {
    let amp, color;
    if (i < state.scenarioIdx) { amp = 1; color = '#4FE0D6'; }
    else if (i === state.scenarioIdx) { amp = 0.6; color = '#4FE0D6'; }
    else { amp = 0.08; color = '#4E5769'; }
    return `<div class="progress-seg">${waveformSVG(200, 28, amp, color, i <= state.scenarioIdx)}</div>`;
  }).join('');
  return `<div class="progress-rail">${segs}<div class="progress-label">${state.scenarioIdx + 1} / ${total}</div></div>`;
}

export function canGoForward() {
  const sc = SCENARIOS[state.scenarioIdx];
  const d = getScenarioData(sc.id);
  if (state.currentPhase === 'decide') return !!d.selectedChoice;
  if (state.currentPhase === 'sources') return d.selectedSources.length === 2;
  if (state.currentPhase === 'injected') return !!d.reassessChoice;
  if (state.currentPhase === 'final') return !!d.finalChoice;
  return false;
}

function navRow() {
  return `
    <div class="nav-row">
      <button class="btn-ghost" data-action="goBack">← Back</button>
      <button class="btn-primary" ${canGoForward() ? '' : 'disabled'} data-action="goForward">Forward →</button>
    </div>
  `;
}

export function renderScenario() {
  const sc = SCENARIOS[state.scenarioIdx];
  const d = getScenarioData(sc.id);
  let body = '';

  if (state.currentPhase === 'decide') {
    body = `
      <div class="scenario-text">${sc.narrative}</div>
      <div class="prompt-label">${sc.prompt}</div>
      <div class="choice-list">
        ${sc.choices.map(c => `<button class="choice ${d.selectedChoice === c.id ? 'selected' : ''}" data-action="selectChoice" data-id="${c.id}"><span class="tag">${c.id}</span>${c.text}</button>`).join('')}
      </div>
      <div class="confidence-block">
        <div class="prompt-label">How confident are you in this ${sc.kind === 'sources' ? 'hypothesis' : 'assessment'}?</div>
        <div class="confidence-row">
          <input type="range" min="0" max="100" value="${d.confidence}" data-action="updateConfidence">
          <span class="confidence-value" id="confval">${d.confidence}%</span>
        </div>
      </div>
      ${navRow()}
    `;
  } else if (state.currentPhase === 'injected') {
    body = `
      <div class="injected-info">
        <span class="label">${sc.injected.label}</span>
        ${sc.injected.text}
      </div>
      <div class="prompt-label">${sc.reassessPrompt}</div>
      <div class="choice-list">
        ${sc.reassessChoices.map(c => `<button class="choice ${d.reassessChoice === c.id ? 'selected' : ''}" data-action="selectReassess" data-id="${c.id}"><span class="tag">${c.id}</span>${c.text}</button>`).join('')}
      </div>
      ${navRow()}
    `;
  } else if (state.currentPhase === 'sources') {
    body = `
      <div class="prompt-label">${sc.sourcesPrompt}</div>
      <div class="source-hint">${sc.sourceHint} — selected: ${d.selectedSources.length}/2</div>
      <div class="source-grid">
        ${sc.sources.map(s => `
          <button class="source-card ${d.selectedSources.includes(s.id) ? 'selected' : ''}" data-action="toggleSource" data-id="${s.id}">
            <span class="sc-num">SOURCE ${s.id}</span>${s.text}
          </button>
        `).join('')}
      </div>
      ${navRow()}
    `;
  } else if (state.currentPhase === 'final') {
    body = `
      <div class="prompt-label">${sc.finalPrompt}</div>
      <div class="choice-list">
        ${sc.finalChoices.map(c => `<button class="choice ${d.finalChoice === c.id ? 'selected' : ''}" data-action="selectFinal" data-id="${c.id}"><span class="tag">${c.id}</span>${c.text}</button>`).join('')}
      </div>
      ${navRow()}
    `;
  }

  app.innerHTML = `
    ${topbar()}
    ${progressRail()}
    ${hudWrap(`<div class="stage">
      <div class="stage-kicker">
        <div class="stage-eyebrow">${sc.title}</div>
        <div class="stage-index">${sc.label}</div>
      </div>
      ${body}
    </div>`)}
  `;
}
