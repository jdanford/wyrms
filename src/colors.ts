import { Color, oklch } from "chroma-js";
import { clamp, lerp, unlerp } from "./math";
import { randomGaussian, randomInt } from "./random";
import { Tile } from "./tile";

export const TILE_COLORS: Color[] = [];
TILE_COLORS[Tile.Empty] = oklch(0.184, 0.052, 249.7);
TILE_COLORS[Tile.Wall] = oklch(0.6, 0.09, 300);
TILE_COLORS[Tile.Food] = oklch(0.4, 0.152, 19.7);

export const BACKGROUND_COLOR = TILE_COLORS[Tile.Empty];
export const MISSING_WYRM_COLOR = oklch(1.0, 0.0, 0);

const HUE_MAX = 360;

type Distribution = [number, number];

function randomColor(
    [lMean, lDev]: Distribution,
    [cMean, cDev]: Distribution,
    [hMean, hDev]: Distribution,
): Color {
    const l = randomGaussian(lMean, lDev);
    const c = randomGaussian(cMean, cDev);
    const h = (randomGaussian(hMean, hDev) + HUE_MAX) % HUE_MAX;
    return oklch(l, c, h);
}

export function noteAndVelocityFromColor(color: Color): [string, number] {
    const [, chroma, hue] = color.oklch();

    let note: string;
    if (70 <= hue && hue < 110) {
        // orange
        note = "D4";
    } else if (110 <= hue && hue < 130) {
        // yellow
        note = "E4";
    } else if (130 <= hue && hue < 200) {
        // green
        note = "G4";
    } else if (200 <= hue && hue < 290) {
        // blue
        note = "A4";
    } else {
        // purple/red
        note = "B4";
    }

    const normalizedChroma = clamp(unlerp(chroma, 0.05, 0.35), 0.0, 1.0);
    const velocity = lerp(normalizedChroma, 0.5, 1.0);

    return [note, velocity];
}

type ColorFunction = () => Color;

// common
const orangeyellow = () => randomColor([0.8, 0.05], [0.25, 0.05], [90, 10]);
const yellowgreen = () => randomColor([0.85, 0.05], [0.3, 0.05], [120, 5]);
const greengreen = () => randomColor([0.8, 0.05], [0.25, 0.05], [145, 5]);
const bluegreen = () => randomColor([0.8, 0.05], [0.25, 0.05], [160, 5]);
const cream = () => randomColor([0.85, 0.05], [0.1, 0.05], [80, 10]);

// exotic
const lightblue = () => randomColor([0.85, 0.05], [0.2, 0.05], [220, 5]);
const fuchsia = () => randomColor([0.67, 0.05], [0.3, 0.02], [10, 10]);

const colorFunctions: ColorFunction[] = [
    orangeyellow,
    orangeyellow,
    yellowgreen,
    yellowgreen,
    yellowgreen,
    greengreen,
    greengreen,
    greengreen,
    bluegreen,
    bluegreen,
    bluegreen,
    cream,
    cream,
    lightblue,
    fuchsia,
];

export function randomWyrmColor(id: number): Color {
    const n = colorFunctions.length;
    const index = (id - Tile.Wyrm + randomInt(-1, 3) + n) % n;
    const func = colorFunctions[index];
    return func();
}
