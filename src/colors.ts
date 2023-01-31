import { Color, oklch } from "chroma-js";
import { randomGaussian, randomInt } from "./random";
import { Tile } from "./tile";

export const TILE_COLORS: Color[] = [];
TILE_COLORS[Tile.Empty] = oklch(0.184, 0.052, 249.7);
TILE_COLORS[Tile.Wall] = oklch(0.84, 0.089, 8.6);
TILE_COLORS[Tile.Food] = oklch(0.4, 0.152, 19.7);

export const BACKGROUND_COLOR = TILE_COLORS[Tile.Empty];
export const MISSING_WYRM_COLOR = oklch(1.0, 0.0, 0);

type Distribution = [number, number];

function randomColor(
    [lMean, lDev]: Distribution,
    [cMean, cDev]: Distribution,
    [hMean, hDev]: Distribution,
): Color {
    const l = randomGaussian(lMean, lDev);
    const c = randomGaussian(cMean, cDev);
    const h = randomGaussian(hMean, hDev) % 360;
    return oklch(l, c, h);
}

type ColorFunction = () => Color;

// common
const orangeyellow: ColorFunction = () => randomColor([0.8, 0.05], [0.25, 0.05], [90, 10]);
const yellowgreen: ColorFunction = () => randomColor([0.85, 0.05], [0.3, 0.05], [120, 5]);
const greengreen: ColorFunction = () => randomColor([0.8, 0.05], [0.25, 0.05], [145, 5]);
const bluegreen: ColorFunction = () => randomColor([0.8, 0.05], [0.25, 0.05], [160, 5]);
const cream: ColorFunction = () => randomColor([0.85, 0.05], [0.1, 0.05], [80, 10]);

// exotic
const lightblue: ColorFunction = () => randomColor([0.85, 0.05], [0.2, 0.05], [220, 5]);
const fuchsia: ColorFunction = () => randomColor([0.67, 0.05], [0.25, 0.05], [10, 10]);

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
    const index = (id - Tile.Wyrm + randomInt(-1, 3)) % colorFunctions.length;
    const func = colorFunctions[index];
    return func();
}
