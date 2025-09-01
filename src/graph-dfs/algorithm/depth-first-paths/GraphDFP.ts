import { LinkedStack } from "@lib/algo/stack";

import { Graph } from "./Graph";
import { delay } from "@/graph-dfs/utils/time";
import { darkGrey } from "@/graph-dfs/constants";
import { clearCanvas } from "@/graph-dfs/utils/canvas";
import type { GraphVertex } from "./GraphVertex";

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

  #drawingLoopHandle: number = 0;
  #shouldTraverse: boolean = false;
  #vertexTraversed: GraphVertex | undefined

  constructor(config: GraphDFPConfig) {
    this.#graph = config.graph;

    const n = this.#graph.verticesCount;
    this.#marked = Array(n).fill(false);
    this.#edgeTo = Array(n).fill(-1);
  }

  async #dfs(s: number) {
    if (!this.#shouldTraverse) {
      return;
    }

    if (!this.#graph.isVertexInRange(s)) {
      throw new Error(`Vertex ${s} is out of range`);
    }

    const delayMs = 0.3 * 1000;
    const stack = new LinkedStack<number>();
    stack.push(s);

    while (!stack.isEmpty) {
      await delay(delayMs);
      const v = stack.pop()!;

      if (!this.#marked[v]) {
        this.#marked[v] = true; // local array for fast access
        this.#vertexTraversed = this.#graph.vertices[v];
        this.#graph.vertices[v].marked = true;

        for (const w of this.#graph.adjList(v)) {
          if (!this.#marked[w]) {
            this.#edgeTo[w] = v;
            stack.push(w);
          }
        }
      }
    }
  }

  async startProcessing() {
    this.#shouldTraverse = true;
    const n = this.#graph.verticesCount;

    for (let v = 0; v < n; v++) {
      if (!this.#marked[v]) {
        await this.#dfs(v);
      }
    }
    this.#vertexTraversed = undefined;
  }

  stopProcessing() {
    this.#shouldTraverse = false;
  }

  #drawLoop(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    clearCanvas(cvs);

    for (const edge of this.#graph.edges) {
      edge.draw(ctx);
    }

    for (let w = 0; w < this.#graph.verticesCount; w++) {
      if (this.#edgeTo[w] < 0) {
        continue;
      }

      const v = this.#edgeTo[w];
      const edge = this.#graph.edges.find(
        (edge) =>
          (edge.vertexV.index === v && edge.vertexW.index === w) ||
          (edge.vertexV.index === w && edge.vertexW.index === v)
      );
      if (edge && (edge.vertexV.marked && edge.vertexW.marked)) {
        edge.draw(ctx, { strokeStyle: darkGrey });
      }
    }

    for (const vertex of this.#graph.vertices) {
      if (this.#vertexTraversed === vertex) {
        vertex.drawAsBeingVisited(ctx);
      } else {
        vertex.draw(ctx);
      }
    }

    this.#drawingLoopHandle = requestAnimationFrame(() => {
      this.#drawLoop(cvs, ctx);
    });
  }

  startDrawing(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2d context from canvas");
    }
    this.#drawLoop(canvas, ctx);
  }

  stopDrawing() {
    cancelAnimationFrame(this.#drawingLoopHandle);
  }
}
