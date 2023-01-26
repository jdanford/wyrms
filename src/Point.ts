import { Direction } from "./Direction";

export interface Point {
    x: number;
    y: number;
}

export function moveInDirection(point: Point, direction: Direction): Point {
    const newPoint = { ...point };
    switch (direction) {
        case Direction.Up:
            newPoint.y -= 1;
            break;
        case Direction.Right:
            newPoint.x += 1;
            break;
        case Direction.Down:
            newPoint.y += 1;
            break;
        case Direction.Left:
            newPoint.x -= 1;
            break;
    }

    return newPoint;
}

export function wrapBounds(point: Point, width: number, height: number): Point {
    const x = (point.x + width) % width;
    const y = (point.y + height) % height;
    return { x, y };
}
