import {
  restartGraphDFPCanvasAnimation,
  startGraphDFPCanvasAnimation,
} from "./graph-dfp-canvas";

let startBtn: HTMLButtonElement;
let restartBtn: HTMLButtonElement;

let initialized = false;

function initMenuButtons() {
  [startBtn, restartBtn] = [
    document.querySelector(".btn_start")!,
    document.querySelector(".btn_restart")!,
  ];
  if (!startBtn || !restartBtn) {
    throw new Error("Failed initializing menu button elements");
  }
  initialized = true;
}

export function setGraphDFPMenu() {
  if (!initialized) {
    initMenuButtons();
  }

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    restartBtn.disabled = false;
    startGraphDFPCanvasAnimation();
  });

  restartBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    restartBtn.disabled = false;
    restartGraphDFPCanvasAnimation();
  });
}
