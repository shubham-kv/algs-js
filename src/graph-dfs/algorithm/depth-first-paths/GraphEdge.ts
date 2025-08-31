import { GraphVertex } from "./GraphVertex";

type EdgeStyles = {
  lineWidth: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
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
  marked: boolean = false;

  constructor(config: EdgeConfig) {
    this.vertexV = config.vertexV;
    this.vertexW = config.vertexW;
    this.styles = config.styles;
  }

  #applyStyles(ctx: CanvasRenderingContext2D, styles?: Partial<EdgeStyles>) {
    ctx.strokeStyle = styles?.strokeStyle ?? this.styles.strokeStyle;
    ctx.lineWidth = styles?.lineWidth ?? this.styles.lineWidth;
  }

  draw(ctx: CanvasRenderingContext2D, styleOverrides?: Partial<EdgeStyles>) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.vertexV.x, this.vertexV.y);
    ctx.lineTo(this.vertexW.x, this.vertexW.y);
    this.#applyStyles(ctx, styleOverrides);
    ctx.stroke();
    ctx.restore();
  }
}
