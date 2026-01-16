/**
 * Render Module
 * 
 * Canvas/WebGL rendering pipeline for makeup effects.
 * Handles compositing, blending, and final output.
 */

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawImage(image, x = 0, y = 0, width = null, height = null) {
        width = width ?? image.width;
        height = height ?? image.height;
        this.ctx.drawImage(image, x, y, width, height);
    }

    // TODO: Add makeup rendering methods
}

export default Renderer;
