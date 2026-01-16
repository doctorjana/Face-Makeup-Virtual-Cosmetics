/**
 * Skin Smoothing Effect Module
 * 
 * Applies subtle skin smoothing to face regions while preserving:
 * - Eye areas
 * - Lip areas  
 * - Natural skin texture
 * 
 * Uses a blend of original and smoothed image to maintain realism.
 */

import { generateCombinedMask, generateRegionMask } from '../render/masks.js';

/**
 * Default skin smoothing settings
 */
export const DEFAULT_SKIN_SMOOTHING = {
    enabled: false,        // Disabled by default
    strength: 0.3,         // 0-1, subtle default
    preserveTexture: 0.5,  // How much texture to preserve
    blurRadius: 8          // Blur radius in pixels
};

/**
 * Skin regions to smooth (face without eyes/lips)
 */
const SKIN_REGIONS = ['leftCheek', 'rightCheek', 'forehead', 'nose'];

/**
 * Regions to exclude from smoothing
 */
const EXCLUDE_REGIONS = ['leftEye', 'rightEye', 'upperLip', 'lowerLip'];

/**
 * Apply skin smoothing effect
 * 
 * @param {CanvasRenderingContext2D} ctx - Main canvas context
 * @param {HTMLImageElement} originalImage - Original unmodified image
 * @param {Array} landmarks - Face landmarks
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} scale - Scale factor
 * @param {Object} settings - Effect settings
 */
export function applySkinSmoothing(ctx, originalImage, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_SKIN_SMOOTHING, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0 || !originalImage) {
        return;
    }

    // Create offscreen canvas for processing
    const processCanvas = document.createElement('canvas');
    processCanvas.width = width;
    processCanvas.height = height;
    const processCtx = processCanvas.getContext('2d');

    // Draw current canvas content to process canvas (preserves zoom cropping)
    processCtx.drawImage(ctx.canvas, 0, 0);

    // Create smoothed version with blur
    const smoothCanvas = document.createElement('canvas');
    smoothCanvas.width = width;
    smoothCanvas.height = height;
    const smoothCtx = smoothCanvas.getContext('2d');

    // Apply blur for smoothing effect
    smoothCtx.filter = `blur(${config.blurRadius}px)`;
    smoothCtx.drawImage(ctx.canvas, 0, 0);
    smoothCtx.filter = 'none';

    // Create skin mask (face regions minus eyes and lips)
    const skinMask = createSkinMask(landmarks, width, height, scale, config);

    // Blend smoothed image with original based on mask and strength
    // Get image data for pixel manipulation
    const originalData = processCtx.getImageData(0, 0, width, height);
    const smoothData = smoothCtx.getImageData(0, 0, width, height);
    const maskData = skinMask.ctx.getImageData(0, 0, width, height);

    const texturePreserve = config.preserveTexture;
    const strength = config.strength;

    // Blend pixels
    for (let i = 0; i < originalData.data.length; i += 4) {
        const maskAlpha = maskData.data[i] / 255; // Use red channel as alpha

        if (maskAlpha > 0) {
            const blendAmount = maskAlpha * strength;

            // Blend with texture preservation
            // High frequency details (texture) from original, low frequency (smooth) from blurred
            for (let c = 0; c < 3; c++) {
                const orig = originalData.data[i + c];
                const smooth = smoothData.data[i + c];

                // Calculate high-pass (texture)
                const texture = orig - smooth;

                // Blend: smooth base + preserved texture
                const textureAmount = texture * texturePreserve;
                const blended = smooth + textureAmount;

                // Mix with original based on blend amount
                originalData.data[i + c] = Math.round(
                    orig * (1 - blendAmount) + blended * blendAmount
                );
            }
        }
    }

    // Put blended result back
    processCtx.putImageData(originalData, 0, 0);

    // Draw result to main canvas
    ctx.drawImage(processCanvas, 0, 0);
}

/**
 * Create a mask for skin regions, excluding eyes and lips
 */
function createSkinMask(landmarks, width, height, scale, config) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Draw skin regions in white
    ctx.fillStyle = '#FFFFFF';

    for (const region of SKIN_REGIONS) {
        try {
            const { canvas: regionMask } = generateRegionMask(
                landmarks, region, width, height, scale,
                { featherRadius: 10 }
            );
            ctx.drawImage(regionMask, 0, 0);
        } catch (e) {
            // Region may not exist, continue
        }
    }

    // Subtract excluded regions (eyes, lips) - draw in black
    ctx.globalCompositeOperation = 'destination-out';

    for (const region of EXCLUDE_REGIONS) {
        try {
            const { canvas: regionMask } = generateRegionMask(
                landmarks, region, width, height, scale,
                { featherRadius: 5 }
            );
            ctx.drawImage(regionMask, 0, 0);
        } catch (e) {
            // Region may not exist, continue
        }
    }

    ctx.globalCompositeOperation = 'source-over';

    // Apply additional feathering
    const featherCanvas = document.createElement('canvas');
    featherCanvas.width = width;
    featherCanvas.height = height;
    const featherCtx = featherCanvas.getContext('2d');
    featherCtx.filter = `blur(${config.blurRadius / 2}px)`;
    featherCtx.drawImage(canvas, 0, 0);
    featherCtx.filter = 'none';

    return { canvas: featherCanvas, ctx: featherCtx };
}

/**
 * SkinSmoothingEffect class
 */
export class SkinSmoothingEffect {
    constructor() {
        this.settings = { ...DEFAULT_SKIN_SMOOTHING };
    }

    update(newSettings) {
        Object.assign(this.settings, newSettings);
    }

    setEnabled(enabled) {
        this.settings.enabled = enabled;
    }

    setStrength(strength) {
        this.settings.strength = Math.max(0, Math.min(1, strength));
    }

    setPreserveTexture(value) {
        this.settings.preserveTexture = Math.max(0, Math.min(1, value));
    }

    apply(ctx, originalImage, landmarks, width, height, scale) {
        applySkinSmoothing(ctx, originalImage, landmarks, width, height, scale, this.settings);
    }

    getSettings() {
        return { ...this.settings };
    }
}

export default {
    applySkinSmoothing,
    SkinSmoothingEffect,
    DEFAULT_SKIN_SMOOTHING
};
