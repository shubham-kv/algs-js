import { delay } from "../../utils/time";
import { Graph } from "./Graph";

type GraphDFPConfig = {
  graph: Graph;
};

export class GraphDFP {
  /** @type {Graph} */ #graph: Graph;
  /** @type {boolean[]} */ #marked: boolean[];
  /** @type {number[]} */ #edgeTo: number[];

  constructor(/** @type {GraphDFPConfig} */ config: GraphDFPConfig) {
    this.#graph = config.graph;

    const n = this.#graph.verticesCount;
    this.#marked = Array(n).fill(false);
    this.#edgeTo = Array(n).fill(-1);
  }

  async #dfs(/** @type {number} */ v: number) {
    if (!this.#graph.isVertexInRange(v)) {
      throw new Error(`GraphDFS: Vertex ${v} is out of range`);
    }

    this.#marked[v] = true; // local array for fast access
    this.#graph.vertices[v].marked = true;

    for (const w of this.#graph.adjList(v)) {
      await delay(0.25 * 1000);

      if (!this.#marked[w]) {
        this.#edgeTo[w] = v;
        this.#dfs(w);
      }
    }
  }

  async startProcessing() {
    const n = this.#graph.verticesCount;

    for (let v = 0; v < n; v++) {
      if (!this.#marked[v]) {
        await this.#dfs(v);
      }
    }
  }
}
