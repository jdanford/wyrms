import { Color } from "chroma-js";
import EventEmitter = require("events");
import TypedEventEmitter from "typed-emitter";

import { Direction, RelativeDirection, rotate } from "./direction";
import { World, WorldNeighbors } from "./world";
import { move, Point } from "./point";
import { randomChance } from "./random";
import { Tile } from "./tile";
import { WyrmEvents } from "./events";

export interface WyrmParams {
    world: World;
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
    world: World;
    id: number;
    segments: Point[];
    direction: Direction;
    color: Color;

    private emitter: TypedEventEmitter<WyrmEvents>;

    constructor(params: WyrmParams) {
        this.id = params.id;
        this.world = params.world;
        this.segments = [params.position];
        this.direction = params.direction;
        this.color = params.color;
        this.emitter = new EventEmitter() as TypedEventEmitter<WyrmEvents>;
    }

    get size(): number {
        return this.segments.length;
    }

    get head(): Point {
        return this.segments[0];
    }

    doBestAction(): void {
        const neighbors = this.world.getNeighbors(this.head, this.direction);
        const direction = this.selectBestDirection(neighbors);
        this.doAction(direction);
    }

    private selectBestDirection(neighbors: WorldNeighbors): RelativeDirection {
        const sortedDirections = neighbors
            .map(([direction, tile]) => {
                const score = this.world.getTileScore(tile);
                return [direction, score];
            })
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        const [direction] = sortedDirections[0];
        return direction;
    }

    doAction(relativeDirection: RelativeDirection): void {
        const direction = rotate(this.direction, relativeDirection);
        const destination = move(this.head, direction);

        const tileId = this.world.getTile(destination) as number;
        switch (tileId) {
            case Tile.Wall:
            case this.id:
                return this.die();
            case Tile.Empty:
                return this.move({ direction, grow: false, poop: randomChance(1 / 32) });
            case Tile.Food:
                return this.move({ direction, grow: true, poop: false });
            default:
                const enemyWyrm = this.world.wyrms[tileId];
                if (enemyWyrm === undefined) {
                    console.error(`wyrm #${this.id} encountered unknown wyrm #${tileId}`);
                    return;
                }

                return this.world.fightWyrms(this, enemyWyrm);
        }
    }

    private move({ direction, grow, poop }: MoveParams): void {
        const destination = move(this.head, direction);
        this.segments.unshift(destination);
        this.world.setTile(destination, this.id);

        if (!grow) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const end = this.segments.pop()!;
            const tile = poop ? Tile.Food : Tile.Empty;
            this.world.setTile(end, tile);
        }

        this.direction = direction;
    }

    die(): void {
        this.world.destroyWyrm(this.id);
        this.emitter.emit("wyrm-died", { wyrm: this });
    }

    on<E extends keyof WyrmEvents>(event: E, listener: WyrmEvents[E]): this {
        this.emitter.on(event, listener);
        return this;
    }

    once<E extends keyof WyrmEvents>(event: E, listener: WyrmEvents[E]): this {
        this.emitter.once(event, listener);
        return this;
    }

    off<E extends keyof WyrmEvents>(event: E, listener: WyrmEvents[E]): this {
        this.emitter.off(event, listener);
        return this;
    }
}
