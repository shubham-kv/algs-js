type VertexCtxStyles = {
  lineWidth: number;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  markedStrokeStyle: string | CanvasGradient | CanvasPattern;
};

type VertexConfig = {
  x: number;
  y: number;
  radius: number;
  index: number;
  label: string;
  styles: VertexCtxStyles;
};

export class GraphVertex {
  x: number;
  y: number;
  radius: number;

  /** Index of the vertex in vertices array of `Graph` */
  index: number;
  label: string;
  styles: VertexCtxStyles;

  /** A boolean set to `true` when this vertex is visited during path traversal */
  marked: boolean = false;

  constructor(config: VertexConfig) {
    this.x = config.x;
    this.y = config.y;
    this.radius = config.radius;
    this.index = config.index;
    this.label = config.label;
    this.styles = config.styles;
  }

  #applyVertexStyles(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.styles.fillStyle;
    ctx.lineWidth = this.styles.lineWidth;

    ctx.strokeStyle = !this.marked
      ? this.styles.strokeStyle
      : this.styles.markedStrokeStyle;
  }

  #applyLabelStyles(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = !this.marked
      ? this.styles.strokeStyle
      : this.styles.markedStrokeStyle;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 1rem sans-serif";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    this.#applyVertexStyles(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    this.#applyLabelStyles(ctx);
    ctx.fillText(this.label ?? "", this.x, this.y);
    ctx.restore();
  }
}
