export function getRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext("2d");
    if (context === null) {
        throw new Error("Can't initialize rendering context");
    }

    return context;
}
