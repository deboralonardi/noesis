/* ============ ACTIONS ============
   State-mutating handlers wired up by main.js via event delegation.
   Each action re-renders the current screen (except updateConfidence,
   which patches the DOM directly for a smooth slider drag — same
   optimisation as the reference implementation). */

import { state, getScenarioData, phasesFor } from './state.js';
import { SCENARIOS } from './data.js';
import { scoreReassessScenario, scoreConfirmationScenario } from './scoring.js';
import { canGoForward } from './views/scenario.js';
import { render } from './render.js';

export function goToBeforeYouBegin() {
  state.screen = 'beforeYouBegin';
  render();
}

export function startAssessment() {
  state.screen = 'scenario';
  state.scenarioIdx = 0;
  state.currentPhase = 'decide';
  render();
}

export function selectChoice(id) {
  getScenarioData(SCENARIOS[state.scenarioIdx].id).selectedChoice = id;
  render();
}

export function selectReassess(id) {
  getScenarioData(SCENARIOS[state.scenarioIdx].id).reassessChoice = id;
  render();
}

export function selectFinal(id) {
  getScenarioData(SCENARIOS[state.scenarioIdx].id).finalChoice = id;
  render();
}

export function updateConfidence(v) {
  getScenarioData(SCENARIOS[state.scenarioIdx].id).confidence = parseInt(v, 10);
  const label = document.getElementById('confval');
  if (label) label.textContent = v + '%';
}

export function toggleSource(id) {
  const d = getScenarioData(SCENARIOS[state.scenarioIdx].id);
  const idx = d.selectedSources.indexOf(id);
  if (idx >= 0) d.selectedSources.splice(idx, 1);
  else {
    if (d.selectedSources.length >= 2) return;
    d.selectedSources.push(id);
  }
  render();
}

export function goForward() {
  if (!canGoForward()) return;
  const sc = SCENARIOS[state.scenarioIdx];
  const phases = phasesFor(sc);
  const idx = phases.indexOf(state.currentPhase);

  if (idx < phases.length - 1) {
    state.currentPhase = phases[idx + 1];
    render();
    return;
  }

  // last phase of this scenario — score it
  const d = getScenarioData(sc.id);
  let result;
  if (sc.kind === 'sources') result = scoreConfirmationScenario(d.selectedChoice, d.selectedSources, d.finalChoice, d.confidence);
  else result = scoreReassessScenario(sc.id, d.selectedChoice, d.reassessChoice, d.confidence);
  state.results[sc.id] = result;

  if (state.scenarioIdx < SCENARIOS.length - 1) {
    state.scenarioIdx += 1;
    state.currentPhase = phasesFor(SCENARIOS[state.scenarioIdx])[0];
    render();
  } else {
    state.screen = 'dashboard';
    render();
  }
}

export function goBack() {
  const sc = SCENARIOS[state.scenarioIdx];
  const phases = phasesFor(sc);
  const idx = phases.indexOf(state.currentPhase);

  if (idx > 0) {
    state.currentPhase = phases[idx - 1];
    render();
    return;
  }

  if (state.scenarioIdx > 0) {
    state.scenarioIdx -= 1;
    const prevPhases = phasesFor(SCENARIOS[state.scenarioIdx]);
    state.currentPhase = prevPhases[prevPhases.length - 1];
    render();
  } else {
    state.screen = 'beforeYouBegin';
    render();
  }
}

export function goToLongitudinal() {
  state.screen = 'longitudinal';
  render();
}

export function goToDashboard() {
  state.screen = 'dashboard';
  render();
}

export function restart() {
  location.reload();
}

export function downloadReport() {
  window.print();
}
