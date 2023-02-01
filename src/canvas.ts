export function getRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext("2d");
    if (context === null) {
        throw new Error("can't initialize rendering context");
    }

    return context;
}
