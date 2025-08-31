function dpr() {
  return window.devicePixelRatio || 1;
}

export function setupHiDPICanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  const r = canvas.getBoundingClientRect();
  const scale = dpr();
  canvas.width = Math.floor(r.width * scale);
  canvas.height = Math.floor(r.height * scale);
  ctx?.scale(scale, scale);
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  const r = canvas.getBoundingClientRect();
  const ctx = canvas.getContext("2d");
  ctx?.clearRect(0, 0, r.width, r.height);
}
