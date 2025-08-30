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
  label: string;
  styles: VertexCtxStyles;
};

export class GraphVertex {
  x: number;
  y: number;
  radius: number;
  label: string;
  styles: VertexCtxStyles;
  marked: boolean = false;

  constructor(/** @type {VertexConfig} */ config: VertexConfig) {
    this.x = config.x;
    this.y = config.y;
    this.radius = config.radius;
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
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "0.8rem sans-serif";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    this.#applyVertexStyles(ctx);
    ctx.fill();
    ctx.stroke();

    this.#applyLabelStyles(ctx);
    ctx.strokeText(this.label ?? "", this.x, this.y);

    ctx.restore();
  }
}
