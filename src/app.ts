import { start as startTone, ToneAudioNode, Volume, Transport, MonoSynth, Destination } from "tone";
import { noteAndVelocityFromColor } from "./colors";

import { Direction } from "./direction";
import { ScreenClickEvent, WyrmDiedEvent, WyrmSpawnedEvent } from "./events";
import { randomInt } from "./random";
import { Screen } from "./screen";
import { World } from "./world";

const TILE_SIZE = 8;
const SPAWN_INTERVAL = 32;

const FPS = 16;
const STEP_TIME = 1000 / FPS;

const AUDIO_BPM = (FPS * 60) / 10;
const MASTER_VOLUME_DB = -6;

export class App {
    private world: World;
    private screen: Screen;
    private lastStepTime: number;
    private pendingCallbacks: (() => void)[];
    private audioOutput: ToneAudioNode | undefined;
    private squareSynth: MonoSynth;
    private sawSynth: MonoSynth;

    constructor(canvas: HTMLCanvasElement) {
        const width = Math.floor(window.innerWidth / TILE_SIZE);
        const height = Math.floor(window.innerHeight / TILE_SIZE);

        this.world = new World({ width, height, spawnInterval: SPAWN_INTERVAL });
        this.screen = new Screen({ width, height, pixelSize: TILE_SIZE, canvas });
        this.lastStepTime = 0;
        this.pendingCallbacks = [];
        this.audioOutput = undefined;

        this.squareSynth = new MonoSynth({
            oscillator: { type: "square" },
            filterEnvelope: { baseFrequency: 2500 },
            envelope: { release: 0.8 },
        });

        this.sawSynth = new MonoSynth({
            oscillator: { type: "sawtooth" },
            filterEnvelope: { baseFrequency: 1500 },
            envelope: { release: 2.0 },
        });

        Transport.bpm.value = AUDIO_BPM;

        canvas.addEventListener("click", this.startAudio.bind(this), { once: true });
        this.screen.on("click", this.onClick.bind(this));

        this.screen.render();
        this.start();
    }

    private start(): void {
        const update = (currentTime: number) => {
            requestAnimationFrame(update);

            const nextStepTime = this.lastStepTime + STEP_TIME;
            if (currentTime >= nextStepTime) {
                this.lastStepTime = currentTime;
                this.step();
            }
        };

        requestAnimationFrame(update);
    }

    private async startAudio(): Promise<void> {
        if (this.audioOutput) {
            return;
        }

        this.audioOutput = new Volume(MASTER_VOLUME_DB);
        this.squareSynth.connect(this.audioOutput);
        this.sawSynth.connect(this.audioOutput);
        this.audioOutput.connect(Destination);

        this.world.on("wyrm-spawned", this.onWyrmSpawned.bind(this));
        this.world.on("wyrm-died", this.onWyrmDied.bind(this));

        startTone();
        Transport.start();
    }

    private step(): void {
        this.pendingCallbacks.forEach((callback) => callback());
        this.pendingCallbacks = [];

        this.world.step();
        this.world.updateScreen(this.screen);
        this.screen.render();
    }

    private onClick(event: ScreenClickEvent): void {
        const direction = randomInt(0, 3) as Direction;
        this.pendingCallbacks.push(() => this.world.createWyrm(event.position, direction));
    }

    private onWyrmSpawned({ wyrm }: WyrmSpawnedEvent): void {
        const [note, velocity] = noteAndVelocityFromColor(wyrm.color);
        this.squareSynth.triggerAttackRelease(note, "64n", undefined, velocity);
    }

    private onWyrmDied({ wyrm }: WyrmDiedEvent): void {
        const velocity = 1 - 1 / wyrm.size;
        this.sawSynth.triggerAttackRelease("A2", "64n", undefined, velocity);
    }
}
