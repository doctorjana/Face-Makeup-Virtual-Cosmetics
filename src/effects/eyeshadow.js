/**
 * Eyeshadow Effect Module
 * 
 * Applies eyeshadow with soft gradients above the eyelids.
 * Supports multiple colors and blending styles.
 */

import { getRegionPath } from '../facemesh/landmarks.js';

/**
 * Default eyeshadow settings
 */
export const DEFAULT_EYESHADOW = {
    enabled: false,
    color: '#8B4B8B',      // Purple-mauve
    opacity: 0.35,
    spread: 1.0,           // How far up the shadow extends
    intensity: 0.8,
    blendMode: 'multiply',
    shimmer: false
};

/**
 * Eyeshadow color presets
 */
export const EYESHADOW_PRESETS = [
    { name: 'Nude', color: '#C4A484' },
    { name: 'Rose Gold', color: '#B76E79' },
    { name: 'Mauve', color: '#8B4B8B' },
    { name: 'Bronze', color: '#CD7F32' },
    { name: 'Smoky Gray', color: '#5A5A5A' },
    { name: 'Navy', color: '#2A3A5A' },
    { name: 'Forest', color: '#3A5A3A' },
    { name: 'Burgundy', color: '#6A2A3A' },
    { name: 'Copper', color: '#B87333' },
    { name: 'Champagne', color: '#D4AF8A' }
];

/**
 * Create gradient eyeshadow on one eye
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} landmarks - Pixel coordinates  
 * @param {string} eyeUpperRegion - 'leftEyeUpper' or 'rightEyeUpper'
 * @param {string} eyebrowRegion - 'leftEyebrow' or 'rightEyebrow'
 * @param {number} scale
 * @param {Object} config
 */
function drawEyeshadow(ctx, landmarks, eyeUpperRegion, eyebrowRegion, scale, config) {
    const eyePoints = getRegionPath(landmarks, eyeUpperRegion, scale);
    const browPoints = getRegionPath(landmarks, eyebrowRegion, scale);

    if (eyePoints.length < 3 || browPoints.length < 3) return;

    // Calculate eye and brow center/bounds
    const eyeMinX = Math.min(...eyePoints.map(p => p.x));
    const eyeMaxX = Math.max(...eyePoints.map(p => p.x));
    const eyeMinY = Math.min(...eyePoints.map(p => p.y));
    const eyeCenterX = (eyeMinX + eyeMaxX) / 2;

    const browMinY = Math.min(...browPoints.map(p => p.y));
    const browCenterY = browPoints.reduce((sum, p) => sum + p.y, 0) / browPoints.length;

    // Shadow extends from eye to between eye and brow
    const shadowHeight = (eyeMinY - browCenterY) * config.spread;
    const shadowTopY = eyeMinY - shadowHeight;

    ctx.save();

    // Create gradient from eye to above
    const gradient = ctx.createLinearGradient(
        eyeCenterX, eyeMinY,
        eyeCenterX, shadowTopY
    );

    // Parse color to add transparency
    const baseColor = config.color;
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.5, `${baseColor}88`);
    gradient.addColorStop(1, `${baseColor}00`);

    // Create shadow shape - curved area above eye
    ctx.beginPath();

    // Start from left side of eye
    ctx.moveTo(eyePoints[0].x, eyePoints[0].y);

    // Draw upper curve following eye shape but higher
    for (let i = 0; i < eyePoints.length; i++) {
        const t = i / (eyePoints.length - 1); // 0 to 1
        const curveHeight = Math.sin(t * Math.PI) * shadowHeight;
        ctx.lineTo(eyePoints[i].x, eyePoints[i].y - curveHeight);
    }

    // Connect back along eye line
    for (let i = eyePoints.length - 1; i >= 0; i--) {
        ctx.lineTo(eyePoints[i].x, eyePoints[i].y);
    }

    ctx.closePath();

    // Apply gradient fill
    ctx.globalAlpha = config.opacity * config.intensity;
    ctx.globalCompositeOperation = config.blendMode;
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add shimmer effect if enabled
    if (config.shimmer) {
        ctx.globalAlpha = config.opacity * 0.3;
        ctx.globalCompositeOperation = 'overlay';

        // Lighter highlights
        const shimmerGradient = ctx.createRadialGradient(
            eyeCenterX, eyeMinY - shadowHeight * 0.3,
            0,
            eyeCenterX, eyeMinY - shadowHeight * 0.3,
            (eyeMaxX - eyeMinX) * 0.5
        );
        shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = shimmerGradient;
        ctx.fill();
    }

    ctx.restore();
}

/**
 * Apply eyeshadow effect to both eyes
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} landmarks
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @param {Object} settings
 */
export function applyEyeshadow(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_EYESHADOW, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    // Draw eyeshadow on both eyes
    drawEyeshadow(ctx, landmarks, 'leftEyeUpper', 'leftEyebrow', scale, config);
    drawEyeshadow(ctx, landmarks, 'rightEyeUpper', 'rightEyebrow', scale, config);
}

/**
 * EyeshadowEffect class
 */
export class EyeshadowEffect {
    constructor() {
        this.settings = { ...DEFAULT_EYESHADOW };
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

    setSpread(spread) {
        this.settings.spread = Math.max(0.3, Math.min(2, spread));
    }

    setIntensity(intensity) {
        this.settings.intensity = Math.max(0, Math.min(1, intensity));
    }

    setShimmer(shimmer) {
        this.settings.shimmer = shimmer;
    }

    apply(ctx, landmarks, width, height, scale) {
        applyEyeshadow(ctx, landmarks, width, height, scale, this.settings);
    }

    getSettings() {
        return { ...this.settings };
    }
}

export default {
    applyEyeshadow,
    EyeshadowEffect,
    DEFAULT_EYESHADOW,
    EYESHADOW_PRESETS
};
