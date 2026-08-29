export function topbar() {
  return `
    <div class="topbar">
      <div class="wordmark">
        <div class="wm-mark"></div>
        <div class="wm-text">NOESIS</div>
        <div class="wm-tagline">Cognitive Cyber Risk</div>
      </div>
      <div class="topbar-right">MVP</div>
    </div>
  `;
}

export function hudWrap(innerHtml) {
  return `<div class="hud-panel"><div class="hud-corner tl"></div><div class="hud-corner br"></div>${innerHtml}</div>`;
}
