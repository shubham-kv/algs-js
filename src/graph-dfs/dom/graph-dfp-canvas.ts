import { GraphVertex, Graph, GraphDFP } from "../algorithm/depth-first-paths";

import { setupHiDPICanvas } from "../utils/canvas";
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
  graph.startDrawing(canvas);
}

function clearGraph() {
  if (!graph) {return;}
  graph.stopDrawing();

  const r = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');
  ctx?.clearRect(0, 0, r.width, r.height);
}

export function startGraphDFPCanvasAnimation() {
  graphDFP = new GraphDFP({ graph });
  graphDFP?.startProcessing();
}

export function restartGraphDFPCanvasAnimation() {
  if (!canvas) {
    initCanvas();
  }

  clearGraph();
  setupGraph(canvas);
  startGraphDFPCanvasAnimation();
}
