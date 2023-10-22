import { Direction } from "./direction";
import { lerp } from "./math";

export function randomChance(p: number): boolean {
    return Math.random() < p;
}

export function random(min: number, max: number): number {
    const t = Math.random();
    return lerp(t, min, max);
}

export function randomInt(min: number, max: number): number {
    const range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
}

// https://stackoverflow.com/a/36481059
export function randomGaussian(mean = 0, stdev = 1): number {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdev + mean;
}

export function randomDirection(): Direction {
    return randomInt(0, 3);
}
