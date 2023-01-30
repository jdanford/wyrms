export function getRenderingContext(canvasElement: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvasElement.getContext("2d");
    if (context === null) {
        throw new Error("Can't initialize rendering context");
    }

    return context;
}
