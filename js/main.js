import { app } from './dom.js';
import { render } from './render.js';
import * as actions from './actions.js';

const ID_AS_NUMBER = new Set(['toggleSource']);

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const handler = actions[action];
  if (typeof handler !== 'function') return;

  if ('id' in target.dataset) {
    const id = ID_AS_NUMBER.has(action) ? Number(target.dataset.id) : target.dataset.id;
    handler(id);
  } else {
    handler();
  }
});

app.addEventListener('input', (event) => {
  const target = event.target;
  if (target.dataset && target.dataset.action === 'updateConfidence') {
    actions.updateConfidence(target.value);
  }
});

render();
