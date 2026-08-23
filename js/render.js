import { state } from './state.js';
import { renderLanding } from './views/landing.js';
import { renderBeforeYouBegin } from './views/beforeYouBegin.js';
import { renderScenario } from './views/scenario.js';
import { renderDashboard } from './views/dashboard.js';
import { renderLongitudinal } from './views/longitudinal.js';

export function render() {
  if (state.screen === 'landing') renderLanding();
  else if (state.screen === 'beforeYouBegin') renderBeforeYouBegin();
  else if (state.screen === 'scenario') renderScenario();
  else if (state.screen === 'dashboard') renderDashboard();
  else if (state.screen === 'longitudinal') renderLongitudinal();
}
