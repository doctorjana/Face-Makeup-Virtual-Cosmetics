/**
 * Mask Generation Module
 * 
 * Generates per-region alpha masks using offscreen canvas.
 * Masks have feathered edges for natural blending.
 */

import { getRegionPath, createPath2D } from '../facemesh/landmarks.js';

/**
 * Create an offscreen canvas for mask generation
 * @param {number} width 
 * @param {number} height 
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}}
 */
function createOffscreenCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    return { canvas, ctx };
}

/**
 * Generate a feathered alpha mask for a facial region
 * 
 * @param {Array<{x: number, y: number}>} landmarks - All landmarks in pixel coords
 * @param {string} regionName - Name of the region to mask
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} [scale=1] - Scale factor
 * @param {Object} [options] - Mask options
 * @param {number} [options.featherRadius=3] - Blur radius for edge feathering
 * @param {number} [options.expandRadius=0] - Expand/contract the mask
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}}
 */
export function generateRegionMask(landmarks, regionName, width, height, scale = 1, options = {}) {
    const { featherRadius = 3, expandRadius = 0 } = options;

    // Create offscreen canvas
    const { canvas, ctx } = createOffscreenCanvas(width, height);

    // Get region path points
    const points = getRegionPath(landmarks, regionName, scale);

    if (points.length < 3) {
        console.warn(`Region ${regionName} has insufficient points`);
        return { canvas, ctx };
    }

    // Create closed path
    const path = createPath2D(points, true);

    // Draw filled region in white (full alpha)
    ctx.fillStyle = '#FFFFFF';
    ctx.fill(path);

    // Apply feathering using blur filter
    if (featherRadius > 0) {
        // Use CanvasRenderingContext2D filter for blur
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        // Apply blur filter
        tempCtx.filter = `blur(${featherRadius}px)`;
        tempCtx.drawImage(canvas, 0, 0);

        // Copy back to original canvas
        ctx.clearRect(0, 0, width, height);
        ctx.filter = 'none';
        ctx.drawImage(tempCanvas, 0, 0);
    }

    return { canvas, ctx };
}

/**
 * Generate masks for multiple regions at once
 * 
 * @param {Array} landmarks - All landmarks
 * @param {Array<string>} regionNames - List of region names
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} [scale=1] - Scale factor
 * @param {Object} [options] - Mask options per region
 * @returns {Map<string, HTMLCanvasElement>} - Map of region name to mask canvas
 */
export function generateRegionMasks(landmarks, regionNames, width, height, scale = 1, options = {}) {
    const masks = new Map();

    for (const regionName of regionNames) {
        const regionOptions = options[regionName] || options.default || {};
        const { canvas } = generateRegionMask(
            landmarks,
            regionName,
            width,
            height,
            scale,
            regionOptions
        );
        masks.set(regionName, canvas);
    }

    return masks;
}

/**
 * Generate a combined mask from multiple regions
 * 
 * @param {Array} landmarks - All landmarks
 * @param {Array<string>} regionNames - Regions to combine
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} [scale=1] - Scale factor
 * @param {Object} [options] - Mask options
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}}
 */
export function generateCombinedMask(landmarks, regionNames, width, height, scale = 1, options = {}) {
    const { featherRadius = 3 } = options;
    const { canvas, ctx } = createOffscreenCanvas(width, height);

    // Draw all regions onto the same canvas
    for (const regionName of regionNames) {
        const points = getRegionPath(landmarks, regionName, scale);
        if (points.length < 3) continue;

        const path = createPath2D(points, true);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill(path);
    }

    // Apply feathering
    if (featherRadius > 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.filter = `blur(${featherRadius}px)`;
        tempCtx.drawImage(canvas, 0, 0);

        ctx.clearRect(0, 0, width, height);
        ctx.filter = 'none';
        ctx.drawImage(tempCanvas, 0, 0);
    }

    return { canvas, ctx };
}

/**
 * Apply a color through a mask onto a destination canvas
 * 
 * @param {CanvasRenderingContext2D} destCtx - Destination canvas context
 * @param {HTMLCanvasElement} maskCanvas - The alpha mask
 * @param {string} color - CSS color to apply
 * @param {number} [opacity=0.5] - Overall opacity
 * @param {string} [blendMode='multiply'] - Canvas composite operation
 */
export function applyColorWithMask(destCtx, maskCanvas, color, opacity = 0.5, blendMode = 'multiply') {
    const width = maskCanvas.width;
    const height = maskCanvas.height;

    // Create a temporary canvas for the colored overlay
    const { canvas: colorCanvas, ctx: colorCtx } = createOffscreenCanvas(width, height);

    // Fill with the desired color
    colorCtx.fillStyle = color;
    colorCtx.fillRect(0, 0, width, height);

    // Use the mask as alpha
    colorCtx.globalCompositeOperation = 'destination-in';
    colorCtx.drawImage(maskCanvas, 0, 0);

    // Apply to destination with blend mode
    destCtx.save();
    destCtx.globalAlpha = opacity;
    destCtx.globalCompositeOperation = blendMode;
    destCtx.drawImage(colorCanvas, 0, 0);
    destCtx.restore();
}

/**
 * Get mask pixel data for custom processing
 * 
 * @param {HTMLCanvasElement} maskCanvas 
 * @returns {ImageData}
 */
export function getMaskImageData(maskCanvas) {
    const ctx = maskCanvas.getContext('2d');
    return ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
}

/**
 * MaskGenerator class for managing region masks
 */
export class MaskGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.masks = new Map();
    }

    /**
     * Generate and cache a mask for a region
     */
    generate(landmarks, regionName, scale = 1, options = {}) {
        const { canvas } = generateRegionMask(
            landmarks,
            regionName,
            this.width,
            this.height,
            scale,
            options
        );
        this.masks.set(regionName, canvas);
        return canvas;
    }

    /**
     * Get a cached mask
     */
    get(regionName) {
        return this.masks.get(regionName);
    }

    /**
     * Clear all cached masks
     */
    clear() {
        this.masks.clear();
    }

    /**
     * Resize the generator (clears cache)
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.clear();
    }
}

export default {
    generateRegionMask,
    generateRegionMasks,
    generateCombinedMask,
    applyColorWithMask,
    getMaskImageData,
    MaskGenerator
};
