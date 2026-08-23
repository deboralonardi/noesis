/* ============ WAVEFORM (progress rail + landing decorative wave) ============ */

export function waveformPath(w, h, amp) {
  const points = [0, 0.35, -0.55, 0.75, -0.25, 0.6, -0.7, 0.45, -0.35, 0.85, -0.4, 0.25, 0];
  const n = points.length - 1;
  const stepX = w / n;
  const midY = h / 2;
  let d = `M 0 ${midY.toFixed(1)}`;
  points.forEach((p, i) => {
    const x = i * stepX;
    const y = midY - p * amp * (h / 2 - 3);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return d;
}

export function waveformSVG(w, h, amp, color, glow) {
  const path = waveformPath(w, h, amp);
  const glowFilter = glow ? `filter="drop-shadow(0 0 3px ${color})"` : '';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;">
    <path d="${path}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" ${glowFilter} opacity="${0.35 + amp * 0.65}" />
  </svg>`;
}
