export class StdRandom {
  static uniformInteger(min: number, max: number): number {
    return Math.round(min + this.uniform() * (max - min));
  }

  static uniform(): number {
    return Math.random();
  }

  static uniformDouble(min: number, max: number): number {
    return min + this.uniform() * (max - min);
  }
}
