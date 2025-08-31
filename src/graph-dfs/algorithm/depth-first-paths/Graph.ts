import { GraphEdge } from "./GraphEdge";
import { GraphVertex } from "./GraphVertex";
import { lightGrey } from "../../constants";
import { distance, type Point } from "../../utils/geometry";

type GraphConfig = {
  vertices: GraphVertex[];
  edges: GraphEdge[];
};

export class Graph {
  vertices: GraphVertex[];
  edges: GraphEdge[];
  #adjList: number[][];

  #activeVertex: GraphVertex | undefined = undefined;

  constructor(config: GraphConfig) {
    this.vertices = config.vertices;
    this.edges = config.edges;
    this.#adjList = Array(this.vertices.length)
      .fill(0)
      .map(() => []);
  }

  isVertexInRange(v: number): boolean {
    return 0 <= v && v < this.verticesCount;
  }

  addEdge(v: number, w: number) {
    if (!this.isVertexInRange(v)) {
      throw new Error(`Vertex ${v} is out of range`);
    }
    if (!this.isVertexInRange(w)) {
      throw new Error(`Vertex ${w} is out of range`);
    }

    this.#adjList[v].push(w);
    this.#adjList[w].push(v);

    this.edges.push(
      new GraphEdge({
        vertexV: this.vertices[v],
        vertexW: this.vertices[w],
        styles: {
          lineWidth: 3,
          strokeStyle: lightGrey,
        },
      })
    );
  }

  adjList(v: number): number[] {
    if (!this.isVertexInRange(v)) {
      throw new Error(`Vertex ${v} is out of range`);
    }
    return [...this.#adjList[v]];
  }

  get verticesCount() {
    return this.vertices.length;
  }
  get edgesCount() {
    return this.edges.length;
  }

  /**
   * Make the vertices interactive by updating their positions when they are
   * clicked and dragged.
   *
   * @param {HTMLCanvasElement} canvas
   */
  addEventListeners(canvas: HTMLCanvasElement) {
    const setActiveVertex = (interactionPoint: Point) => {
      for (const vertex of this.vertices) {
        if (distance(vertex, interactionPoint) < vertex.radius) {
          this.#activeVertex = vertex;
        }
      }
    };

    const updateActiveVertexPosition = (interactionPoint: Point) => {
      if (!this.#activeVertex) {
        return;
      }

      const r = canvas.getBoundingClientRect();

      if (
        0 <= interactionPoint.x &&
        interactionPoint.x <= r.width &&
        0 <= interactionPoint.y &&
        interactionPoint.y <= r.height
      ) {
        const point = this.#activeVertex;
        point.x = interactionPoint.x;
        point.y = interactionPoint.y;
      }
    };

    const unsetActiveVertex = () => {
      this.#activeVertex = undefined;
    };

    canvas.addEventListener("mousedown", (e) => {
      const mouse: Point = { x: e.offsetX, y: e.offsetY, };
      setActiveVertex(mouse);
    });
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch: Point = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
      const r = canvas.getBoundingClientRect();
      touch.x -= r.left;
      touch.y -= r.top;

      setActiveVertex(touch);
    });

    canvas.addEventListener("mousemove", (e) => {
      const mouse: Point = { x: e.offsetX, y: e.offsetY, };
      updateActiveVertexPosition(mouse);
    });
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch: Point = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
      const r = canvas.getBoundingClientRect();
      touch.x -= r.left;
      touch.y -= r.top;

      updateActiveVertexPosition(touch);
    });

    window.addEventListener("mouseup", unsetActiveVertex);
    window.addEventListener("touchend", unsetActiveVertex);
    window.addEventListener("touchcancel", unsetActiveVertex);
  }
}
