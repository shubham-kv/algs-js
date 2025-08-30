import { setupGraphDFPCanvas } from "./dom/graph-dfp-canvas";
import { setGraphDFPMenu } from "./dom/graph-dfp-menu";

import "../globals.css";
import "./styles.css";

async function setup() {
  setupGraphDFPCanvas();
  setGraphDFPMenu();
}

document.addEventListener("DOMContentLoaded", setup);
