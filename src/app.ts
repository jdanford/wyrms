import { Direction } from "./direction";
import { ScreenClickEvent } from "./events";
import { randomInt } from "./random";
import { Screen } from "./screen";
import { World } from "./world";

const TILE_SIZE = 8;
const SPAWN_INTERVAL = 32;
const STEP_INTERVAL = 1000 / 16;

export class App {
    private world: World;
    private screen: Screen;
    private lastStepTime: number;
    private pendingCallbacks: (() => void)[];

    constructor(canvas: HTMLCanvasElement) {
        const width = Math.floor(window.innerWidth / TILE_SIZE);
        const height = Math.floor(window.innerHeight / TILE_SIZE);

        this.world = new World({ width, height, spawnInterval: SPAWN_INTERVAL });
        this.screen = new Screen({ width, height, pixelSize: TILE_SIZE, canvas });
        this.lastStepTime = 0;
        this.pendingCallbacks = [];

        this.screen.on("click", this.onClick.bind(this));
        this.run();
    }

    private run(): void {
        const update = (currentTime: number) => {
            requestAnimationFrame(update);

            const nextStepTime = this.lastStepTime + STEP_INTERVAL;
            if (currentTime >= nextStepTime) {
                this.lastStepTime = currentTime;

                this.pendingCallbacks.forEach((callback) => callback());
                this.pendingCallbacks = [];

                this.world.step();
                this.world.updateScreen(this.screen);
                this.screen.render();
            }
        };

        requestAnimationFrame(update);
    }

    private onClick(event: ScreenClickEvent): void {
        const direction = randomInt(0, 3) as Direction;
        const callback = () => this.world.createWyrm(event.position, direction);
        this.pendingCallbacks.push(callback);
    }
}
