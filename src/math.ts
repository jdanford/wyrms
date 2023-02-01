export function clamp(x: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, x));
}

export function lerp(t: number, min: number, max: number): number {
    const range = max - min;
    return t * range + min;
}

export function unlerp(x: number, min: number, max: number): number {
    const range = max - min;
    return (x - min) / range;
}
