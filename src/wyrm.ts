import { Color } from "chroma-js";

import { Action, actionFromRelativeDirection, relativeDirectionFromAction } from "./action";
import { Direction, RelativeDirection, rotate } from "./direction";
import { Grid, GridNeighbors } from "./grid";
import { move, Point } from "./point";
import { randomChance } from "./random";
import { Tile } from "./tile";

export interface WyrmParams {
    grid: Grid;
    id: number;
    position: Point;
    direction: Direction;
    color: Color;
}

export interface MoveParams {
    direction: Direction;
    grow: boolean;
    poop: boolean;
}

export class Wyrm {
    grid: Grid;
    id: number;
    segments: Point[];
    direction: Direction;
    color: Color;

    constructor(params: WyrmParams) {
        this.id = params.id;
        this.grid = params.grid;
        this.segments = [params.position];
        this.direction = params.direction;
        this.color = params.color;
    }

    get size(): number {
        return this.segments.length;
    }

    get head(): Point {
        return this.segments[0];
    }

    doBestAction(): void {
        const neighbors = this.grid.getNeighbors(this.head, this.direction);
        const direction = this.selectBestDirection(neighbors);
        const action = actionFromRelativeDirection(direction);
        this.doAction(action);
    }

    private selectBestDirection(neighbors: GridNeighbors): RelativeDirection {
        const sortedDirections = neighbors
            .map(([direction, tile]) => {
                const score = this.grid.getTileScore(tile);
                return [direction, score];
            })
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        const [direction] = sortedDirections[0];
        return direction;
    }

    doAction(action: Action): void {
        const relativeDirection = relativeDirectionFromAction(action);
        const direction = rotate(this.direction, relativeDirection);
        const destination = move(this.head, direction);

        const tileId = this.grid.getTile(destination) as number;
        switch (tileId) {
            case Tile.Wall:
            case this.id:
                return this.die();
            case Tile.Empty:
                return this.move({ direction, grow: false, poop: randomChance(1 / 32) });
            case Tile.Food:
                return this.move({ direction, grow: true, poop: false });
            default:
                if (!this.grid.wyrms[tileId]) {
                    console.error(`wyrm #${this.id} encountered unknown wyrm #${tileId}`);
                    return;
                }

                return this.grid.fightWyrms(this.id, tileId);
        }
    }

    private move({ direction, grow, poop }: MoveParams): void {
        const destination = move(this.head, direction);
        this.segments.unshift(destination);
        this.grid.setTile(destination, this.id);

        if (!grow) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const end = this.segments.pop()!;
            const tile = poop ? Tile.Food : Tile.Empty;
            this.grid.setTile(end, tile);
        }

        this.direction = direction;
    }

    die(): void {
        this.grid.destroyWyrm(this.id);
    }
}
