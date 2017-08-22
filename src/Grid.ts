import { getRenderingContext, randomChance, randomInt, rotateDirection } from "./utils";
import { Point, moveInDirection } from "./Point";
import { Direction } from "./Direction";
import { RelativeDirection } from "./RelativeDirection";
import { Tile } from "./Tile";
import { Action } from "./Action";
import { Wyrm } from "./Wyrm";

export interface GridNeighbors extends Array<[RelativeDirection, Tile]> { }

interface ScoreTable extends Array<number> { }

const tileScores: ScoreTable = [];
tileScores[Tile.Empty] = 0;
tileScores[Tile.Wall] = -1;
tileScores[Tile.Food] = 1;

interface ColorTable extends Array<string> { }

const tileColors: ColorTable = [];
tileColors[Tile.Empty] = "#001328";
tileColors[Tile.Wall] = "#feb3bf";
tileColors[Tile.Food] = "#880e24";

const wyrmColors: ColorTable = [
    "#92e790",
    "#eafffb",
    "#54ffdb",
    "#fc2f25",
    "#f92dc7",
    "#d0f392",
    "#b5f458",
    "#e2f73a",
    "#5ec0ff",
    "#ffecaf",
    "#efe5d2",
    "#eff5a7",
    "#4fe946",
    "#9ddcff",
    "#66a37c",
    "#afebc6",
    "#fed07d",
    "#5aeb88",
    "#ffd143",
    "#38bc5e",
];

interface WyrmTable {
    [id: number]: Wyrm
}

export interface GridOptions {
    width: number;
    height: number;
    tileSize: number;
    canvasElement: HTMLCanvasElement;
}

const spawnInterval = 64;

export class Grid {
    public width: number;
    public height: number;
    public tileSize: number;
    public wyrms: WyrmTable;
    private nextWyrmId: number;
    private tiles: Uint8Array;
    private stepCount: number;
    private canvasElement: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(options: GridOptions) {
        this.width = options.width;
        this.height = options.height;
        this.tileSize = options.tileSize;

        this.wyrms = {};
        this.nextWyrmId = Tile.Wyrm;
        this.stepCount = 0;

        this.tiles = new Uint8Array(this.width * this.height);
        this.fill();

        this.canvasElement = options.canvasElement;
        this.context = getRenderingContext(this.canvasElement);
        this.setCanvasSize();
    }

    private setCanvasSize() {
        const pixelWidth = this.width * this.tileSize;
        const pixelHeight = this.height * this.tileSize;
        this.canvasElement.width = pixelWidth * this.renderScale;
        this.canvasElement.height = pixelHeight * this.renderScale;
        this.canvasElement.style.width = `${pixelWidth}px`;
        this.canvasElement.style.height = `${pixelHeight}px`;
    }

    private fill(): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const position = { x, y };
                const tile = this.atEdge(position)
                    ? Tile.Wall
                    : (randomChance(1 / 16) ? Tile.Food : Tile.Empty);
                this.setTile(position, tile);
            }
        }
    }

    step(): void {
        if (this.stepCount > spawnInterval / 2 && this.stepCount % spawnInterval === 0) {
            this.createRandomWyrm();
        }

        const wyrms = Object.keys(this.wyrms).map(id => this.wyrms[+id]);
        wyrms.sort(wyrm => -wyrm.size);
        wyrms.forEach(wyrm => {
            if (this.wyrms[wyrm.id]) {
                wyrm.doBestAction();
            }
        });

        this.stepCount++;
    }

    draw(): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const position = { x, y };
                const tile = this.getTile(position);
                const tileColor = this.getTileColor(tile);
                const size = this.tileSize * this.renderScale;

                this.context.fillStyle = tileColor;
                this.context.fillRect(x * size, y * size, size, size);
            }
        }
    }

    private getTileColor(tile: Tile): string {
        let i = tile as number;
        if (i < Tile.Wyrm) {
            return tileColors[i];
        }

        i = (i - Tile.Wyrm) % wyrmColors.length;
        return wyrmColors[i];
    }

    getTileScore(tile: Tile): number {
        const score = tileScores[tile];
        if (score !== undefined) {
            return score;
        }

        return -1;
    }

    createRandomWyrm(): void {
        const x = Math.floor(this.width / 2);
        const y = Math.floor(this.height / 2);
        const position = { x, y };
        const direction = randomInt(0, 3) as Direction;
        this.createWyrm(position, direction);
    }

    createWyrm(position: Point, direction: Direction): void {
        const currentTile = this.getTile(position);
        if (currentTile === Tile.Wall || currentTile >= Tile.Wyrm) {
            return;
        }

        const id = this.nextWyrmId++;
        const wyrm = new Wyrm({ id, position, direction, grid: this });
        this.wyrms[id] = wyrm;
        this.setTile(position, id);
    }

    destroyWyrm(id: number): void {
        const wyrm = this.wyrms[id];
        delete this.wyrms[id];

        wyrm.segments.forEach(position => {
            const tile = randomChance(1 / 4) ? Tile.Empty : Tile.Food;
            this.setTile(position, tile);
        });
    }

    fightWyrms(idA: number, idB: number): void {
        const wyrmA = this.wyrms[idA];
        const wyrmB = this.wyrms[idB];
        const ratio = wyrmA.size / wyrmB.size;
        const advantage = randomInt(8, 12) / 10;
        const finalRatio = ratio * advantage;

        let winner = wyrmA, loser = wyrmB;
        if (finalRatio < 0.5) {
            winner = wyrmB, loser = wyrmA;
        }

        loser.die();
        winner.doAction(Action.MoveForward);
    }

    getTile(position: Point): Tile {
        const i = this.index(position);
        return this.tiles[i];
    }

    getNeighbors(position: Point, direction: Direction): GridNeighbors {
        const left = rotateDirection(direction, RelativeDirection.Left);
        const right = rotateDirection(direction, RelativeDirection.Right);
        const forwardPosition = moveInDirection(position, direction);
        const leftPosition = moveInDirection(position, left);
        const rightPosition = moveInDirection(position, right);
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
        return y === 0 || y === this.height - 1 || x === 0 || x === this.width - 1;
    }

    private index(position: Point) {
        return position.y * this.width + position.x;
    }

    private get renderScale(): number {
        return window.devicePixelRatio;
    }
}
