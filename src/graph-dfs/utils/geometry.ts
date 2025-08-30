export type Point = { x: number; y: number };

export function distance(pointA: Point, pointB: Point) {
  return Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
  );
}
