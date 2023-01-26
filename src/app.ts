import { randomInt } from "./utils";
import { Direction } from "./Direction";
import { Grid } from "./Grid";

export class App {
    private grid: Grid;
    private lastStepTime: number;
    private stepInterval: number;

    constructor(canvasElement: HTMLCanvasElement) {
        const tileSize = 8;
        const width = Math.floor(window.innerWidth / tileSize);
        const height = Math.floor(window.innerHeight / tileSize);
        canvasElement.addEventListener("click", this.onClick.bind(this));

        this.grid = new Grid({ width, height, tileSize, canvasElement });
        this.lastStepTime = 0;
        this.stepInterval = 1000 / 16;
        this.run();
    }

    private run(): void {
        const update = (currentTime: number) => {
            requestAnimationFrame(update);

            const nextStepTime = this.lastStepTime + this.stepInterval;
            if (currentTime >= nextStepTime) {
                this.lastStepTime = currentTime;
                this.grid.step();
                this.grid.draw();
            }
        };

        requestAnimationFrame(update);
    }

    private onClick(event: MouseEvent): void {
        const x = Math.floor(event.offsetX / this.grid.tileSize);
        const y = Math.floor(event.offsetY / this.grid.tileSize);
        const position = { x, y };
        const direction = randomInt(0, 3) as Direction;
        this.grid.createWyrm(position, direction);
        this.grid.step();
    }
}
