import { Point } from "./point";
import { Wyrm } from "./wyrm";

export interface ScreenClickEvent {
    position: Point;
}

export type ScreenEvents = {
    click: (event: ScreenClickEvent) => void;
};

export interface WyrmSpawnedEvent {
    wyrm: Wyrm;
}

export interface WyrmDiedEvent {
    wyrm: Wyrm;
}

export type WorldEvents = {
    "wyrm-spawned": (event: WyrmSpawnedEvent) => void;
    "wyrm-died": (event: WyrmDiedEvent) => void;
};
