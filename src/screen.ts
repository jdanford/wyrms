import { Color } from "chroma-js";
import EventEmitter = require("events");
import TypedEventEmitter from "typed-emitter";

import { getRenderingContext } from "./canvas";
import { ScreenEvents } from "./events";

export interface ScreenParams {
    width: number;
    height: number;
    pixelSize: number;
    canvas: HTMLCanvasElement;
}

export class Screen {
    width: number;
    height: number;
    pixelSize: number;

    private context: CanvasRenderingContext2D;
    private imageData: ImageData;
    private emitter: TypedEventEmitter<ScreenEvents>;

    constructor(params: ScreenParams) {
        this.width = params.width;
        this.height = params.height;
        this.pixelSize = params.pixelSize;

        this.context = getRenderingContext(params.canvas);
        this.context.imageSmoothingEnabled = false;

        this.prepareCanvas();
        this.imageData = this.context.createImageData(this.width, this.height);
        this.canvas.addEventListener("click", this.onClick.bind(this));

        this.emitter = new EventEmitter() as TypedEventEmitter<ScreenEvents>;
    }

    private get canvas(): HTMLCanvasElement {
        return this.context.canvas;
    }

    private prepareCanvas(): void {
        const screenWidth = this.width * this.pixelSize;
        const screenHeight = this.height * this.pixelSize;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${screenWidth}px`;
        this.canvas.style.height = `${screenHeight}px`;
        this.canvas.style.imageRendering = "pixelated";
    }

    setPixel(index: number, color: Color): void {
        const [r, g, b] = color._rgb._unclipped;
        const pixelIndex = index * 4;
        const pixelData = this.imageData.data;
        pixelData[pixelIndex + 0] = r;
        pixelData[pixelIndex + 1] = g;
        pixelData[pixelIndex + 2] = b;
        pixelData[pixelIndex + 3] = 255;
    }

    render(): void {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.putImageData(this.imageData, 0, 0);
    }

    private onClick(event: MouseEvent): void {
        const x = Math.floor(event.offsetX / this.pixelSize);
        const y = Math.floor(event.offsetY / this.pixelSize);
        const position = { x, y };
        this.emit("click", { position });
    }

    emit<E extends keyof ScreenEvents>(event: E, ...args: Parameters<ScreenEvents[E]>): this {
        this.emitter.emit(event, ...args);
        return this;
    }

    on<E extends keyof ScreenEvents>(event: E, listener: ScreenEvents[E]): this {
        this.emitter.on(event, listener);
        return this;
    }

    once<E extends keyof ScreenEvents>(event: E, listener: ScreenEvents[E]): this {
        this.emitter.once(event, listener);
        return this;
    }

    off<E extends keyof ScreenEvents>(event: E, listener: ScreenEvents[E]): this {
        this.emitter.off(event, listener);
        return this;
    }
}
