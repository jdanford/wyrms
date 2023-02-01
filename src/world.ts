import { Color } from "chroma-js";
import EventEmitter = require("events");
import TypedEventEmitter from "typed-emitter";

import { Action } from "./action";
import { MISSING_WYRM_COLOR, randomWyrmColor, TILE_COLORS } from "./colors";
import { Direction, RelativeDirection, rotate } from "./direction";
import { WorldEvents } from "./events";
import { clamp } from "./math";
import { move, Point } from "./point";
import { randomChance, randomGaussian, randomInt } from "./random";
import { Screen } from "./screen";
import { Tile } from "./tile";
import { Wyrm } from "./wyrm";

export type WorldNeighbors = [RelativeDirection, Tile][];

const tileScores: number[] = [];
tileScores[Tile.Empty] = 0;
tileScores[Tile.Wall] = -1;
tileScores[Tile.Food] = 1;

const MAX_WYRM_ID = (1 << 16) - 1;

type WyrmTable = Record<number, Wyrm>;

export interface WorldParams {
    width: number;
    height: number;
    spawnInterval: number;
}

export class World {
    width: number;
    height: number;
    spawnInterval: number;
    wyrms: WyrmTable;

    private nextWyrmId: number;
    private tiles: Uint16Array;
    private stepCount: number;
    private emitter: TypedEventEmitter<WorldEvents>;

    constructor(params: WorldParams) {
        this.width = params.width;
        this.height = params.height;
        this.spawnInterval = params.spawnInterval;

        this.wyrms = {};
        this.nextWyrmId = Tile.Wyrm;
        this.stepCount = 0;

        this.tiles = new Uint16Array(this.width * this.height);
        this.fill();

        this.emitter = new EventEmitter() as TypedEventEmitter<WorldEvents>;
    }

    private fill(): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const position = { x, y };
                const tile = this.atEdge(position)
                    ? Tile.Wall
                    : randomChance(1 / 16)
                    ? Tile.Food
                    : Tile.Empty;
                this.setTile(position, tile);
            }
        }
    }

    step(): void {
        if (this.stepCount > this.spawnInterval / 2 && this.stepCount % this.spawnInterval === 0) {
            this.createRandomWyrm();
        }

        const wyrms = Object.keys(this.wyrms).map((id) => this.wyrms[+id]);
        wyrms.sort((wyrm) => -wyrm.size);
        wyrms.forEach((wyrm) => {
            if (this.wyrms[wyrm.id]) {
                wyrm.doBestAction();
            }
        });

        this.stepCount++;
    }

    updateScreen(screen: Screen): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = y * this.width + x;
                const tile = this.tiles[index];
                const tileColor = this.getTileColor(tile);
                screen.setPixel(index, tileColor);
            }
        }
    }

    private getTileColor(tile: Tile): Color {
        const i = tile as number;
        if (i < Tile.Wyrm) {
            return TILE_COLORS[i];
        }

        const wyrm = this.wyrms[i];
        if (wyrm === undefined) {
            console.error(`wyrm #${i} is dead`);
            return MISSING_WYRM_COLOR;
        }
        return wyrm.color;
    }

    getTileScore(tile: Tile): number {
        const score = tileScores[tile];
        if (score !== undefined) {
            return score;
        }

        return -1;
    }

    createRandomWyrm(): void {
        const randX = Math.floor(randomGaussian(0.5, 0.1) * this.width);
        const randY = Math.floor(randomGaussian(0.5, 0.1) * this.height);
        const x = clamp(randX, 0, this.width - 1);
        const y = clamp(randY, 0, this.height - 1);
        const position = { x, y };
        const direction = randomInt(0, 3) as Direction;
        this.createWyrm(position, direction);
    }

    createWyrm(position: Point, direction: Direction): void {
        const currentTile = this.getTile(position);
        if (currentTile === Tile.Wall || currentTile >= Tile.Wyrm) {
            return;
        }

        const id = this.getNextWyrmId();
        const color = randomWyrmColor(id);
        const wyrm = new Wyrm({ world: this, id, position, direction, color });
        this.wyrms[id] = wyrm;
        this.setTile(position, id);

        this.emitter.emit("wyrm-spawned", { wyrm });
        wyrm.on("wyrm-died", (event) => this.emitter.emit("wyrm-died", event));
    }

    private getNextWyrmId(): number {
        const nextId = this.nextWyrmId;
        if (this.nextWyrmId == MAX_WYRM_ID) {
            this.nextWyrmId = Tile.Wyrm;
            while (this.wyrms[this.nextWyrmId] !== undefined) {
                this.nextWyrmId += 1;
            }
        } else {
            this.nextWyrmId += 1;
        }

        return nextId;
    }

    destroyWyrm(id: number): void {
        const wyrm = this.wyrms[id];
        delete this.wyrms[id];

        wyrm.segments.forEach((position, i) => {
            const foodChance = 1 / (i + 1) + 0.5;
            const tile = randomChance(foodChance) ? Tile.Food : Tile.Empty;
            this.setTile(position, tile);
        });
    }

    fightWyrms(wyrmA: Wyrm, wyrmB: Wyrm): void {
        const ratio = wyrmA.size / wyrmB.size;
        const advantage = randomInt(8, 12) / 10;
        const finalRatio = ratio * advantage;
        const [winner, loser] = finalRatio >= 0.5 ? [wyrmA, wyrmB] : [wyrmB, wyrmA];
        loser.die();
        winner.doAction(Action.MoveForward);
    }

    getTile(position: Point): Tile {
        const i = this.index(position);
        return this.tiles[i];
    }

    setTile(position: Point, tile: Tile): void {
        const i = this.index(position);
        this.tiles[i] = tile;
    }

    getNeighbors(position: Point, direction: Direction): WorldNeighbors {
        const left = rotate(direction, RelativeDirection.Left);
        const right = rotate(direction, RelativeDirection.Right);
        const forwardPosition = move(position, direction);
        const leftPosition = move(position, left);
        const rightPosition = move(position, right);
        return [
            [RelativeDirection.Forward, this.getTile(forwardPosition)],
            [RelativeDirection.Left, this.getTile(leftPosition)],
            [RelativeDirection.Right, this.getTile(rightPosition)],
        ];
    }

    private atEdge(position: Point): boolean {
        const { x, y } = position;
        return x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1;
    }

    private index(position: Point): number {
        return position.y * this.width + position.x;
    }

    on<E extends keyof WorldEvents>(event: E, listener: WorldEvents[E]): this {
        this.emitter.on(event, listener);
        return this;
    }

    once<E extends keyof WorldEvents>(event: E, listener: WorldEvents[E]): this {
        this.emitter.once(event, listener);
        return this;
    }

    off<E extends keyof WorldEvents>(event: E, listener: WorldEvents[E]): this {
        this.emitter.off(event, listener);
        return this;
    }
}
