function dpr() {
  return window.devicePixelRatio || 1;
}

export function setupHiDPICanvas(
  /** @type {HTMLCanvasElement} */ canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");
  const r = canvas.getBoundingClientRect();
  const scale = dpr();
  canvas.width = Math.floor(r.width * scale);
  canvas.height = Math.floor(r.height * scale);
  ctx?.scale(scale, scale);
}
