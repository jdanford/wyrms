import { Point, moveInDirection } from "./Point";
import { Direction } from "./Direction";
import { RelativeDirection } from "./RelativeDirection";
import { Action } from "./Action";
import { Tile } from "./Tile";
import { Grid, GridNeighbors } from "./Grid";
import { actionFromRelativeDirection, randomChance, relativeDirectionFromAction, rotateDirection } from "./utils"

export class WyrmOptions {
    id: number;
    grid: Grid;
    position: Point;
    direction: Direction;
}

export class MoveParams {
    direction: Direction;
    grow: boolean;
    poop: boolean;
}

export class Wyrm {
    id: number;
    grid: Grid;
    segments: [Point];
    direction: Direction;

    constructor(options: WyrmOptions) {
        this.id = options.id;
        this.grid = options.grid;
        this.segments = [options.position];
        this.direction = options.direction;
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
        const sortedDirections = neighbors.map(([direction, tile]) => {
            const score = this.grid.getTileScore(tile);
            return [direction, score];
        }).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        const [direction,] = sortedDirections[0];
        return direction;
    }

    doAction(action: Action): void {
        const relativeDirection = relativeDirectionFromAction(action);
        const direction = rotateDirection(this.direction, relativeDirection);
        const destination = moveInDirection(this.head, direction);

        const tileId = this.grid.getTile(destination) as number;
        switch (tileId) {
            case Tile.Wall:
            case this.id:
                return this.die();
            case Tile.Empty:
                return this.move({direction, grow: false, poop: randomChance(1 / 32)});
            case Tile.Food:
                return this.move({direction, grow: true, poop: false});
            default:
                if (!this.grid.wyrms[tileId]) {
                    console.warn(`enemy wyrm #${tileId} is dead`);
                    this.grid.setTile(destination, Tile.Empty);
                    return;
                }

                return this.grid.fightWyrms(this.id, tileId);
        }
    }

    private move({ direction, grow, poop }: MoveParams): void {
        const destination = moveInDirection(this.head, direction);
        this.grid.setTile(destination, this.id);
        this.segments.unshift(destination);

        if (!grow) {
            const last = this.segments.pop() || destination;
            const tile = poop ? Tile.Food : Tile.Empty;
            this.grid.setTile(last, tile);
        }

        this.direction = direction;
    }

    die(): void {
        this.grid.destroyWyrm(this.id);
    }
}
