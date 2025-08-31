import { GraphVertex, Graph, GraphDFP } from "../algorithm/depth-first-paths";

import { clearCanvas, setupHiDPICanvas } from "../utils/canvas";
import {
  VERTICES_COUNT,
  RELATIVE_VERTEX_COORDS,
  lightGrey,
  darkGrey,
  EDGES,
} from "../constants";

let canvas: HTMLCanvasElement;
let graph: Graph;
let graphDFP: GraphDFP;

function initCanvas() {
  canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
  if (!canvas) {
    throw new Error("No canvas element");
  }
}

export function setupGraphDFPCanvas() {
  if (!canvas) {
    initCanvas();
  }
  setupHiDPICanvas(canvas);

  addEventListener("resize", () => {
    setupHiDPICanvas(canvas);
  });

  setupGraph(canvas);
}

function createVertices(width: number, height: number): GraphVertex[] {
  const vertices: GraphVertex[] = [];

  for (let i = 0; i < VERTICES_COUNT; i++) {
    const vertex = new GraphVertex({
      label: `${i}`,
      x: RELATIVE_VERTEX_COORDS[i].x * width,
      y: RELATIVE_VERTEX_COORDS[i].y * height,
      radius: 16,
      index: i,
      styles: {
        fillStyle: "white",
        lineWidth: 3,
        strokeStyle: lightGrey,
        markedStrokeStyle: darkGrey,
      },
    });
    vertices.push(vertex);
  }

  return vertices;
}

function setupGraph(canvas: HTMLCanvasElement) {
  const r = canvas.getBoundingClientRect();
  const vertices = createVertices(r.width, r.height);

  graph = new Graph({ vertices, edges: [] });
  for (const edge of EDGES) {
    graph.addEdge(edge[0], edge[1]);
  }
  graph.addEventListeners(canvas);

  graphDFP = new GraphDFP({ graph });
  graphDFP.startDrawing(canvas);
}

export function startGraphDFPCanvasAnimation() {
  if (!graphDFP) {
    throw new Error("Expected graphDFP object to be non-null");
  }
  graphDFP.startProcessing();
}

export function restartGraphDFPCanvasAnimation() {
  if (!canvas) {
    throw new Error("Expected canvas object to be non-null");
  }
  if (!graphDFP) {
    throw new Error("Expected graphDFP object to be non-null");
  }

  graphDFP.stopProcessing();
  graphDFP.stopDrawing();
  clearCanvas(canvas);
  setupGraph(canvas);
  startGraphDFPCanvasAnimation();
}
