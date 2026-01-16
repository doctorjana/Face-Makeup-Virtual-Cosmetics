/**
 * Blush Effect Module
 * 
 * Applies natural blush color to cheeks with soft gradient blending.
 */

import { generateCombinedMask } from '../render/masks.js';

/**
 * Default blush settings
 */
export const DEFAULT_BLUSH = {
    enabled: false,
    color: '#E8A0A0',      // Soft rose pink
    opacity: 0.25,
    intensity: 0.8,
    featherRadius: 15,     // Heavy feathering for soft edges
    blendMode: 'multiply'
};

/**
 * Blush color presets
 */
export const BLUSH_PRESETS = [
    { name: 'Rose', color: '#E8A0A0' },
    { name: 'Peach', color: '#FFAA88' },
    { name: 'Coral', color: '#E8887A' },
    { name: 'Berry', color: '#C87A8A' },
    { name: 'Mauve', color: '#C89898' },
    { name: 'Bronze', color: '#C8A080' },
    { name: 'Plum', color: '#A87888' },
    { name: 'Apricot', color: '#F0B090' }
];

/**
 * Apply blush effect
 */
export function applyBlush(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_BLUSH, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    // Generate combined cheek mask with heavy feathering
    const { canvas: maskCanvas } = generateCombinedMask(
        landmarks,
        ['leftCheek', 'rightCheek'],
        width,
        height,
        scale,
        { featherRadius: config.featherRadius }
    );

    // Create colored overlay
    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = width;
    colorCanvas.height = height;
    const colorCtx = colorCanvas.getContext('2d');

    // Fill with blush color
    colorCtx.fillStyle = config.color;
    colorCtx.fillRect(0, 0, width, height);

    // Apply mask
    colorCtx.globalCompositeOperation = 'destination-in';
    colorCtx.drawImage(maskCanvas, 0, 0);

    // Apply to main canvas with blend mode
    ctx.save();
    ctx.globalAlpha = config.opacity * config.intensity;
    ctx.globalCompositeOperation = config.blendMode;
    ctx.drawImage(colorCanvas, 0, 0);
    ctx.restore();
}

/**
 * BlushEffect class
 */
export class BlushEffect {
    constructor() {
        this.settings = { ...DEFAULT_BLUSH };
    }

    update(newSettings) {
        Object.assign(this.settings, newSettings);
    }

    setEnabled(enabled) {
        this.settings.enabled = enabled;
    }

    setColor(color) {
        this.settings.color = color;
    }

    setOpacity(opacity) {
        this.settings.opacity = Math.max(0, Math.min(1, opacity));
    }

    apply(ctx, landmarks, width, height, scale) {
        applyBlush(ctx, landmarks, width, height, scale, this.settings);
    }

    getSettings() {
        return { ...this.settings };
    }
}

export default {
    applyBlush,
    BlushEffect,
    DEFAULT_BLUSH,
    BLUSH_PRESETS
};
