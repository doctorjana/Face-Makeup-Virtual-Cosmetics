/**
 * Eyeliner Effect Module
 * 
 * Applies eyeliner along upper eyelid landmarks.
 * Supports adjustable thickness and color.
 */

import { getRegionPath } from '../facemesh/landmarks.js';

/**
 * Default eyeliner settings
 */
export const DEFAULT_EYELINER = {
    enabled: true,
    color: '#1a1a1a',      // Near black
    thickness: 2,          // Line thickness in pixels
    opacity: 0.85,
    style: 'classic',      // classic, winged, thick
    smudge: 0.5            // 0-1 smudge/softness
};

/**
 * Eyeliner style presets
 */
export const EYELINER_STYLES = [
    { value: 'classic', label: 'Classic' },
    { value: 'thin', label: 'Thin Line' },
    { value: 'thick', label: 'Thick/Bold' },
    { value: 'winged', label: 'Winged' }
];

/**
 * Eyeliner color presets
 */
export const EYELINER_COLORS = [
    { name: 'Black', color: '#1a1a1a' },
    { name: 'Dark Brown', color: '#3d2314' },
    { name: 'Navy', color: '#1a1a3a' },
    { name: 'Charcoal', color: '#36454f' },
    { name: 'Purple', color: '#301934' },
    { name: 'Forest Green', color: '#1a3a1a' }
];

/**
 * Draw eyeliner on one eye
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} landmarks - Pixel coordinates
 * @param {string} eyeRegion - 'leftEyeUpper' or 'rightEyeUpper'
 * @param {number} scale
 * @param {Object} config
 */
function drawEyelinerLine(ctx, landmarks, eyeRegion, scale, config) {
    const points = getRegionPath(landmarks, eyeRegion, scale);

    if (points.length < 3) return;

    ctx.save();

    // Adjust thickness based on style
    let thickness = config.thickness;
    if (config.style === 'thin') thickness *= 0.6;
    if (config.style === 'thick') thickness *= 1.8;

    // Set line properties
    ctx.strokeStyle = config.color;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = config.opacity;

    // Apply smudge effect using shadow
    if (config.smudge > 0) {
        ctx.shadowColor = config.color;
        ctx.shadowBlur = config.smudge * 3;
    }

    // Draw the eyeliner path
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Use quadratic curves for smooth line
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    // Last point
    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);

    // Add wing if style is winged
    if (config.style === 'winged') {
        // Calculate wing direction (outward and upward)
        const secondLast = points[points.length - 2];
        const dx = lastPoint.x - secondLast.x;
        const dy = lastPoint.y - secondLast.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        // Wing extends outward and upward
        const wingLength = thickness * 4;
        const wingX = lastPoint.x + (dx / len) * wingLength - (dy / len) * wingLength * 0.5;
        const wingY = lastPoint.y + (dy / len) * wingLength * 0.3 - wingLength * 0.7;

        ctx.lineTo(wingX, wingY);
    }

    ctx.stroke();
    ctx.restore();
}

/**
 * Apply eyeliner effect to both eyes
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} landmarks
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @param {Object} settings
 */
export function applyEyeliner(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_EYELINER, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    // Draw eyeliner on both eyes
    drawEyelinerLine(ctx, landmarks, 'leftEyeUpper', scale, config);
    drawEyelinerLine(ctx, landmarks, 'rightEyeUpper', scale, config);
}

/**
 * EyelinerEffect class
 */
export class EyelinerEffect {
    constructor() {
        this.settings = { ...DEFAULT_EYELINER };
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

    setThickness(thickness) {
        this.settings.thickness = Math.max(1, Math.min(10, thickness));
    }

    setOpacity(opacity) {
        this.settings.opacity = Math.max(0, Math.min(1, opacity));
    }

    setStyle(style) {
        this.settings.style = style;
    }

    apply(ctx, landmarks, width, height, scale) {
        applyEyeliner(ctx, landmarks, width, height, scale, this.settings);
    }

    getSettings() {
        return { ...this.settings };
    }
}

export default {
    applyEyeliner,
    EyelinerEffect,
    DEFAULT_EYELINER,
    EYELINER_STYLES,
    EYELINER_COLORS
};
