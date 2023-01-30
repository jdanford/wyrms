import { Direction, pointFromDirection } from "./direction";

export interface Point {
    x: number;
    y: number;
}

export function addPoints(a: Point, b: Point): Point {
    const x = a.x + b.x;
    const y = a.y + b.y;
    return { x, y };
}

export function move(point: Point, direction: Direction): Point {
    const offset = pointFromDirection(direction);
    return addPoints(point, offset);
}

export function wrapBounds(point: Point, width: number, height: number): Point {
    const x = (point.x + width) % width;
    const y = (point.y + height) % height;
    return { x, y };
}
