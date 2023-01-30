import { Color, oklch } from "chroma-js";

import { Action } from "./action";
import { getRenderingContext } from "./canvas";
import { randomWyrmColor, TILE_COLORS } from "./colors";
import { Direction, RelativeDirection, rotate } from "./direction";
import { clamp } from "./math";
import { move, Point } from "./point";
import { randomChance, randomGaussian, randomInt } from "./random";
import { Tile } from "./tile";
import { Wyrm } from "./wyrm";

export type GridNeighbors = [RelativeDirection, Tile][];

const tileScores: number[] = [];
tileScores[Tile.Empty] = 0;
tileScores[Tile.Wall] = -1;
tileScores[Tile.Food] = 1;

const MAX_WYRM_ID = (1 << 16) - 1;

type WyrmTable = Record<number, Wyrm>;

export interface GridParams {
    width: number;
    height: number;
    tileSize: number;
    spawnInterval: number;
    canvasElement: HTMLCanvasElement;
}

export class Grid {
    width: number;
    height: number;
    tileSize: number;
    spawnInterval: number;
    wyrms: WyrmTable;

    private nextWyrmId: number;
    private tiles: Uint16Array;
    private stepCount: number;
    private context: CanvasRenderingContext2D;
    private imageData: ImageData;

    constructor(params: GridParams) {
        this.width = params.width;
        this.height = params.height;
        this.tileSize = params.tileSize;
        this.spawnInterval = params.spawnInterval;

        this.wyrms = {};
        this.nextWyrmId = Tile.Wyrm;
        this.stepCount = 0;

        this.tiles = new Uint16Array(this.width * this.height);
        this.fill();

        this.context = getRenderingContext(params.canvasElement);
        this.context.imageSmoothingEnabled = false;

        this.prepareCanvas();
        this.imageData = this.context.createImageData(this.width, this.height);
    }

    private get canvas(): HTMLCanvasElement {
        return this.context.canvas;
    }

    private prepareCanvas() {
        const screenWidth = this.width * this.tileSize;
        const screenHeight = this.height * this.tileSize;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${screenWidth}px`;
        this.canvas.style.height = `${screenHeight}px`;
        this.canvas.style.imageRendering = "pixelated";
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

    render(): void {
        const pixelData = this.imageData.data;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = y * this.width + x;
                const tile = this.tiles[index];
                const tileColor = this.getTileColor(tile);
                const [r, g, b] = tileColor._rgb._unclipped;

                const pixelIndex = index * 4;
                pixelData[pixelIndex + 0] = r;
                pixelData[pixelIndex + 1] = g;
                pixelData[pixelIndex + 2] = b;
                pixelData[pixelIndex + 3] = 255;
            }
        }

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.putImageData(this.imageData, 0, 0);
    }

    private getTileColor(tile: Tile): Color {
        const i = tile as number;
        if (i < Tile.Wyrm) {
            return TILE_COLORS[i];
        }

        const wyrm = this.wyrms[i];
        if (wyrm === undefined) {
            console.error(`wyrm #${tile} is dead`);
            return oklch(1, 0, 0);
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
        const wyrm = new Wyrm({ grid: this, id, position, direction, color });
        this.wyrms[id] = wyrm;
        this.setTile(position, id);
    }

    private getNextWyrmId() {
        const nextId = this.nextWyrmId;
        if (this.nextWyrmId == MAX_WYRM_ID) {
            this.nextWyrmId = Tile.Wyrm;
            while (this.wyrms[this.nextWyrmId]) {
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

    fightWyrms(idA: number, idB: number): void {
        const wyrmA = this.wyrms[idA];
        const wyrmB = this.wyrms[idB];
        const ratio = wyrmA.size / wyrmB.size;
        const advantage = randomInt(8, 12) / 10;
        const finalRatio = ratio * advantage;

        let winner = wyrmA,
            loser = wyrmB;
        if (finalRatio < 0.5) {
            (winner = wyrmB), (loser = wyrmA);
        }

        loser.die();
        winner.doAction(Action.MoveForward);
    }

    getTile(position: Point): Tile {
        const i = this.index(position);
        return this.tiles[i];
    }

    getNeighbors(position: Point, direction: Direction): GridNeighbors {
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

    setTile(position: Point, tile: Tile): void {
        const i = this.index(position);
        this.tiles[i] = tile;
    }

    private atEdge(position: Point): boolean {
        const { x, y } = position;
        return x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1;
    }

    private index(position: Point) {
        return position.y * this.width + position.x;
    }
}
