/* ============ SCORING ============
   Deterministic, rule-based scoring — ported verbatim from the reference.
   Do not "improve" or simplify these rules; they encode deliberately
   designed evidence rules tied to specific academic constructs. */

import { state } from './state.js';

export function scoreReassessScenario(id, initial, reassess, confidence) {
  let level = 'weak', controlActive = true, inconsistent = false;
  if (id === 'anchoring') {
    if (initial === 'A' && reassess === 'A') { level = confidence >= 60 ? 'strong' : 'moderate'; controlActive = false; }
    else if (reassess === 'B') { level = 'moderate'; controlActive = true; }
    else if ((initial === 'B' || initial === 'C') && reassess === 'A') {
      // Caution decreased after aggravating evidence — not a meaningful test of anchoring,
      // and not equivalent to "no evidence of vulnerability". Flagged as a separate category.
      level = 'inconsistent'; controlActive = true; inconsistent = true;
    }
    else { level = 'weak'; controlActive = true; }
  } else if (id === 'authority') {
    if (reassess === 'A') { level = confidence <= 55 ? 'strong' : 'moderate'; controlActive = false; }
    else if (reassess === 'B') { level = 'moderate'; controlActive = true; }
    else { level = 'weak'; controlActive = true; }
  } else if (id === 'automation') {
    if (reassess === 'A') { level = confidence >= 55 ? 'strong' : 'moderate'; controlActive = false; }
    else if (reassess === 'B') { level = 'moderate'; controlActive = true; }
    else { level = 'weak'; controlActive = true; }
  }
  return { level, controlActive, inconsistent, initial, reassess, confidence };
}

export function scoreConfirmationScenario(hypothesis, sources, finalChoice, confidence) {
  const has4 = sources.includes(4);
  const has2 = sources.includes(2);
  let level = 'weak', controlActive = true;
  if (!has4 && !has2) { level = 'strong'; controlActive = false; }
  else if (!has4) { level = 'moderate'; controlActive = false; }
  else { level = 'weak'; controlActive = true; }
  return { level, controlActive, hypothesis, sources, finalChoice, confidence };
}

export function computeOverall() {
  const levels = Object.values(state.results).map(r => r.level);
  const strongWithoutControl = Object.values(state.results).some(r => r.level === 'strong' && !r.controlActive);
  const strongWithControl = Object.values(state.results).some(r => r.level === 'strong' && r.controlActive);
  const moderateCount = levels.filter(l => l === 'moderate').length;
  if (strongWithoutControl) return 'HIGH';
  if (strongWithControl || moderateCount >= 2) return 'ELEVATED';
  if (moderateCount >= 1) return 'MODERATE';
  return 'LOW';
}
