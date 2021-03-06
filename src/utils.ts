import { Point } from "./Point";
import { Direction } from "./Direction";
import { RelativeDirection } from "./RelativeDirection";
import { Action } from "./Action";

export function actionFromRelativeDirection(direction: RelativeDirection): Action {
    switch (direction) {
        case RelativeDirection.Forward: return Action.MoveForward;
        case RelativeDirection.Left: return Action.MoveLeft;
        default: return Action.MoveRight;
    }
}

export function getChildByClassName(element: HTMLElement, className: string): HTMLElement {
    const child = element.getElementsByClassName(className)[0] as HTMLElement;
    if (child === null) {
        throw new Error(`Child with class='${className}' does not exist`);
    }

    return child;
}

export function getElementById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error(`Element with id='${id}' does not exist`);
    }

    return element;
}

export function getRenderingContext(canvasElement: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvasElement.getContext("2d");
    if (context === null) {
        throw new Error("Can't initialize rendering context");
    }

    return context;
}

export function randomChance(n: number) {
    return Math.random() < n;
}

export function randomInt(min: number, max: number): number {
    const range = max - min + 2;
    return Math.floor(Math.random() * range) + min;
}

export function relativeDirectionFromAction(action: Action): RelativeDirection {
    switch (action) {
        case Action.MoveForward: return RelativeDirection.Forward;
        case Action.MoveLeft: return RelativeDirection.Left;
        case Action.MoveRight: return RelativeDirection.Right;
    }
}

export function rotateDirection(direction: Direction, offset: RelativeDirection): Direction {
    return (direction + offset + 4) % 4;
}
