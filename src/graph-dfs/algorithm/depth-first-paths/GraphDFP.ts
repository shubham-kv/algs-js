import { Graph } from "./Graph";
import { delay } from "../../utils/time";
import { darkGrey } from "../../constants";
import { clearCanvas } from "../../utils/canvas";

type GraphDFPConfig = {
  graph: Graph;
};

/**
 * Graph processing to find paths using *depth first search* algorithm with
 * visualization on canvas.
 */
export class GraphDFP {
  #graph: Graph;
  #marked: boolean[];
  #edgeTo: number[];

  #drawingLoopHandle: number = 0
  #shouldProcess: boolean = false;

  constructor(config: GraphDFPConfig) {
    this.#graph = config.graph;

    const n = this.#graph.verticesCount;
    this.#marked = Array(n).fill(false);
    this.#edgeTo = Array(n).fill(-1);
  }

  async #dfs(v: number) {
    if (!this.#shouldProcess) {
      return;
    }

    if (!this.#graph.isVertexInRange(v)) {
      throw new Error(`Vertex ${v} is out of range`);
    }

    this.#marked[v] = true; // local array for fast access
    this.#graph.vertices[v].marked = true;

    for (const w of this.#graph.adjList(v)) {
      await delay(0.25 * 1000);

      if (!this.#marked[w]) {
        this.#edgeTo[w] = v;

        const edge = this.#graph.edges.find(
          (edge) =>
            (edge.vertexV.index === v && edge.vertexW.index === w) ||
            (edge.vertexV.index === w && edge.vertexW.index === v)
        );
        edge && (edge.marked = true);

        await this.#dfs(w);
      }
    }
  }

  async startProcessing() {
    this.#shouldProcess = true;
    const n = this.#graph.verticesCount;
    
    for (let v = 0; v < n; v++) {
      if (!this.#marked[v]) {
        await this.#dfs(v);
      }
    }
  }

  stopProcessing() {
    this.#shouldProcess = false;
  }

  #drawLoop(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    clearCanvas(cvs);

    for (const edge of this.#graph.edges) {
      if (edge.marked) {
        // Draw visited edge
        edge.draw(ctx, {strokeStyle: darkGrey});
      } else {
        edge.draw(ctx);
      }
    }

    for (const vertex of this.#graph.vertices) {
      vertex.draw(ctx);
    }

    this.#drawingLoopHandle = requestAnimationFrame(() => {
      this.#drawLoop(cvs, ctx);
    });
  }

  startDrawing(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2d context from canvas');
    }
    this.#drawLoop(canvas, ctx);
  }

  stopDrawing() {
    cancelAnimationFrame(this.#drawingLoopHandle);
  }
}
