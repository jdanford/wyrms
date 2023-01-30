import { RelativeDirection } from "./direction";

export enum Action {
    MoveForward = 0,
    MoveLeft,
    MoveRight,
}

export function relativeDirectionFromAction(action: Action): RelativeDirection {
    switch (action) {
        case Action.MoveForward:
            return RelativeDirection.Forward;
        case Action.MoveLeft:
            return RelativeDirection.Left;
        case Action.MoveRight:
            return RelativeDirection.Right;
    }
}

export function actionFromRelativeDirection(direction: RelativeDirection): Action {
    switch (direction) {
        case RelativeDirection.Left:
            return Action.MoveLeft;
        case RelativeDirection.Right:
            return Action.MoveRight;
        default:
            return Action.MoveForward;
    }
}
