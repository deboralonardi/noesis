/* ============ STATE ============ */

export const state = {
  screen: 'landing',        // landing | beforeYouBegin | scenario | dashboard | longitudinal
  scenarioIdx: 0,
  currentPhase: 'decide',
  scenarioData: {},          // keyed by scenario id
  results: {}
};

export function getScenarioData(id) {
  if (!state.scenarioData[id]) {
    state.scenarioData[id] = { selectedChoice: null, confidence: 50, selectedSources: [], reassessChoice: null, finalChoice: null };
  }
  return state.scenarioData[id];
}

export function phasesFor(sc) {
  return sc.kind === 'sources' ? ['decide', 'sources', 'final'] : ['decide', 'injected'];
}
