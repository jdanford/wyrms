import { Point } from "./point";

export enum Direction {
    Up = 0,
    Right,
    Down,
    Left,
}

export enum RelativeDirection {
    Forward = 0,
    Right,
    Backward,
    Left,
}

export function rotate(direction: Direction, offset: RelativeDirection): Direction {
    return (direction + offset + 4) % 4;
}

export function pointFromDirection(direction: Direction): Point {
    switch (direction) {
        case Direction.Up:
            return { x: 0, y: -1 };
        case Direction.Right:
            return { x: 1, y: 0 };
        case Direction.Down:
            return { x: 0, y: 1 };
        case Direction.Left:
            return { x: -1, y: 0 };
    }
}
