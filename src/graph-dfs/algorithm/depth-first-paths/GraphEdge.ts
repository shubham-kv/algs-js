import { GraphVertex } from "./GraphVertex";

type EdgeStyles = {
  lineWidth: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  visitedStrokeStyle: string | CanvasGradient | CanvasPattern;
};

type EdgeConfig = {
  vertexV: GraphVertex;
  vertexW: GraphVertex;
  styles: EdgeStyles;
};

export class GraphEdge {
  vertexV: GraphVertex;
  vertexW: GraphVertex;
  styles: EdgeStyles;

  constructor(config: EdgeConfig) {
    this.vertexV = config.vertexV;
    this.vertexW = config.vertexW;
    this.styles = config.styles;
  }

  #applyStyles(ctx: CanvasRenderingContext2D) {
    const visited = this.vertexV.marked && this.vertexW.marked;
    ctx.strokeStyle = visited
      ? this.styles.visitedStrokeStyle
      : this.styles.strokeStyle;

    ctx.lineWidth = this.styles.lineWidth;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.vertexV.x, this.vertexV.y);
    ctx.lineTo(this.vertexW.x, this.vertexW.y);
    this.#applyStyles(ctx);
    ctx.stroke();
    ctx.restore();
  }
}
