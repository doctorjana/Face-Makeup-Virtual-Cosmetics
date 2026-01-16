/**
 * Lipstick Effect Module
 * 
 * Applies realistic lipstick color to lips using alpha masks.
 * Supports multiple blend modes and adjustable parameters.
 */

import { generateCombinedMask } from '../render/masks.js';

/**
 * Default lipstick settings
 */
export const DEFAULT_LIPSTICK = {
    enabled: true,
    color: '#CC3366',      // Deep pink-red
    opacity: 0.5,          // 0-1
    intensity: 1.0,        // 0-1 (affects color saturation)
    blendMode: 'multiply', // multiply, overlay, soft-light, color
    featherRadius: 2       // Edge softness
};

/**
 * Available blend modes for lipstick
 */
export const BLEND_MODES = [
    { value: 'multiply', label: 'Multiply (Natural)' },
    { value: 'overlay', label: 'Overlay (Vibrant)' },
    { value: 'soft-light', label: 'Soft Light (Subtle)' },
    { value: 'color', label: 'Color (True Color)' },
    { value: 'hard-light', label: 'Hard Light (Bold)' }
];

/**
 * Preset lipstick colors
 */
export const LIPSTICK_PRESETS = [
    { name: 'Classic Red', color: '#CC2233' },
    { name: 'Deep Rose', color: '#CC3366' },
    { name: 'Coral', color: '#E86850' },
    { name: 'Berry', color: '#8B2252' },
    { name: 'Nude Pink', color: '#C4837A' },
    { name: 'Mauve', color: '#915F6D' },
    { name: 'Wine', color: '#722F37' },
    { name: 'Plum', color: '#6B3A5B' },
    { name: 'Orange Red', color: '#E84420' },
    { name: 'Hot Pink', color: '#E8447A' }
];

/**
 * Adjust color intensity/saturation
 * @param {string} hexColor - Hex color string
 * @param {number} intensity - 0-1 intensity multiplier
 * @returns {string} - Adjusted hex color
 */
function adjustColorIntensity(hexColor, intensity) {
    // Parse hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Convert to HSL
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;

    let h, s;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        switch (max) {
            case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
            case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
            case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
        }
    }

    // Adjust saturation based on intensity
    const newS = Math.min(1, s * intensity);

    // Convert back to RGB
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let newR, newG, newB;
    if (newS === 0) {
        newR = newG = newB = l;
    } else {
        const q = l < 0.5 ? l * (1 + newS) : l + newS - l * newS;
        const p = 2 * l - q;
        newR = hue2rgb(p, q, h + 1 / 3);
        newG = hue2rgb(p, q, h);
        newB = hue2rgb(p, q, h - 1 / 3);
    }

    // Convert back to hex
    const toHex = (c) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * Apply lipstick effect to canvas
 * 
 * @param {CanvasRenderingContext2D} ctx - Destination canvas context
 * @param {Array} landmarks - Face landmarks in pixel coordinates
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} scale - Scale factor
 * @param {Object} settings - Lipstick settings
 */
export function applyLipstick(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_LIPSTICK, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    // Generate combined lip mask (upper + lower)
    const { canvas: maskCanvas } = generateCombinedMask(
        landmarks,
        ['upperLip', 'lowerLip'],
        width,
        height,
        scale,
        { featherRadius: config.featherRadius }
    );

    // Adjust color based on intensity
    const adjustedColor = adjustColorIntensity(config.color, config.intensity);

    // Create colored overlay
    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = width;
    colorCanvas.height = height;
    const colorCtx = colorCanvas.getContext('2d');

    // Fill with lipstick color
    colorCtx.fillStyle = adjustedColor;
    colorCtx.fillRect(0, 0, width, height);

    // Apply mask (use mask as alpha channel)
    colorCtx.globalCompositeOperation = 'destination-in';
    colorCtx.drawImage(maskCanvas, 0, 0);

    // Apply to main canvas with blend mode
    ctx.save();
    ctx.globalAlpha = config.opacity;
    ctx.globalCompositeOperation = config.blendMode;
    ctx.drawImage(colorCanvas, 0, 0);
    ctx.restore();
}

/**
 * LipstickEffect class for managing lipstick state and rendering
 */
export class LipstickEffect {
    constructor() {
        this.settings = { ...DEFAULT_LIPSTICK };
        this.maskCanvas = null;
    }

    /**
     * Update settings
     * @param {Object} newSettings 
     */
    update(newSettings) {
        Object.assign(this.settings, newSettings);
    }

    /**
     * Set enabled state
     * @param {boolean} enabled 
     */
    setEnabled(enabled) {
        this.settings.enabled = enabled;
    }

    /**
     * Set color
     * @param {string} color - Hex color
     */
    setColor(color) {
        this.settings.color = color;
    }

    /**
     * Set opacity
     * @param {number} opacity - 0-1
     */
    setOpacity(opacity) {
        this.settings.opacity = Math.max(0, Math.min(1, opacity));
    }

    /**
     * Set intensity
     * @param {number} intensity - 0-1
     */
    setIntensity(intensity) {
        this.settings.intensity = Math.max(0, Math.min(1, intensity));
    }

    /**
     * Set blend mode
     * @param {string} mode 
     */
    setBlendMode(mode) {
        this.settings.blendMode = mode;
    }

    /**
     * Apply effect to canvas
     */
    apply(ctx, landmarks, width, height, scale) {
        applyLipstick(ctx, landmarks, width, height, scale, this.settings);
    }

    /**
     * Get current settings
     */
    getSettings() {
        return { ...this.settings };
    }
}

export default {
    applyLipstick,
    LipstickEffect,
    DEFAULT_LIPSTICK,
    BLEND_MODES,
    LIPSTICK_PRESETS
};
