import { LinkedStack } from "@lib/algo/stack";
import { Graph } from "./algorithm/depth-first-paths";

interface AlgorithmStepper {
  initialize(): void;
  step(onComplete: Function): void | Promise<void>;
  reset(): void;
}

type DFPStepperState = {
  marked: boolean[];
  edgeTo: number[];
  stack: LinkedStack<number> | undefined;
  vertices: {
    s: number;
    v: number;
    w: number;
  };
  verticesCount: number;
  isDFSInProgress: boolean;
  isAdjVertexCmpInProgress: boolean;
  adjVertexI: number;
  adjVertexCount: number;
};

const defaultState = (verticesCount: number): DFPStepperState => ({
  marked: Array(verticesCount).fill(false),
  edgeTo: Array(verticesCount).fill(-1),
  stack: undefined,
  vertices: { s: -1, v: -1, w: -1, },
  verticesCount: verticesCount,
  isDFSInProgress: false,
  isAdjVertexCmpInProgress: false,
  adjVertexI: -1,
  adjVertexCount: -1
})

export class GraphDFPStepper implements AlgorithmStepper {
  #graph: Graph
  #initialState: DFPStepperState;
  #runningState: DFPStepperState;

  constructor(graph: Graph) {
    this.#graph = graph;
    this.#initialState = {
      ...defaultState(graph.verticesCount)
    }
    this.#runningState = {
      ...defaultState(graph.verticesCount)
    }
  }

  initialize(): void {
    const { vertices } = this.#runningState;
    vertices.s = 0;
    vertices.v = -1;
    vertices.w = -1;

    this.#runningState.isDFSInProgress = false;
  }

  step(onComplete: Function): void | Promise<void> {
    const {
      marked,
      vertices,
      verticesCount,
      isAdjVertexCmpInProgress,
    } = this.#runningState;

    if (vertices.s < verticesCount) {
      if (!marked[vertices.s] || this.#runningState.isDFSInProgress) {
        if (!this.#runningState.isDFSInProgress) {
          this.#runningState.isDFSInProgress = true;
          this.#runningState.stack = new LinkedStack<number>();
          this.#runningState.stack.push(vertices.s);
        }

        const stack = this.#runningState.stack!;

        if (!stack.isEmpty || isAdjVertexCmpInProgress) {
          vertices.v = stack.pop()!;

          if (!marked[vertices.v] || isAdjVertexCmpInProgress) {
            if (!isAdjVertexCmpInProgress) {
              marked[vertices.v] = true;
              this.#runningState.isAdjVertexCmpInProgress = true
              this.#runningState.adjVertexI = 0;
              this.#runningState.adjVertexCount = this.#graph.adjList(vertices.v).length;
            }
            const {adjVertexI, adjVertexCount} = this.#runningState;

            if (adjVertexI < adjVertexCount) {
              vertices.w = this.#graph.adjList(vertices.v)[adjVertexI];

              if (!marked[vertices.w]) {
                this.#runningState.edgeTo[vertices.w] = vertices.v;
                stack.push(vertices.w);
              }
              this.#runningState.adjVertexI++;
            } else {
              vertices.w = -1;
              this.#runningState.adjVertexI = -1;
              this.#runningState.adjVertexCount = -1;
              this.#runningState.isAdjVertexCmpInProgress = false;
            }
          } else {
            vertices.v = -1;
          }
        } else {
          this.#runningState.stack = undefined;
          this.#runningState.isDFSInProgress = false;
        }
      } else {
        vertices.s++;
      }
    } else {
      onComplete();
    }
  }

  reset(): void {
    this.#runningState = {
      ...this.#initialState
    };
  }

  isVertexInRange(v: number): boolean {
    return 0 <= v && v < this.#graph.verticesCount;
  }

  marked(v: number): boolean {
    return this.isVertexInRange(v) ? this.#runningState.marked[v] : false;
  }

  edgeTo(w: number): number {
    return this.isVertexInRange(w) ? this.#runningState.edgeTo[w] : -1;
  }
}
