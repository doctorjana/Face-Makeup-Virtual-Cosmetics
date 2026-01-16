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
 */
function drawEyelinerLine(ctx, landmarks, eyeRegion, scale, config, faceCenter) {
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

    // Find outer corner by checking which endpoint is FURTHER from face center
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    const distFirst = Math.abs(firstPoint.x - faceCenter.x);
    const distLast = Math.abs(lastPoint.x - faceCenter.x);

    // Outer corner is the one FURTHER from center
    const outerIdx = distFirst > distLast ? 0 : points.length - 1;
    const innerIdx = outerIdx === 0 ? points.length - 1 : 0;

    const outerCorner = points[outerIdx];
    const innerCorner = points[innerIdx];

    // Draw from inner to outer corner
    ctx.beginPath();
    ctx.moveTo(innerCorner.x, innerCorner.y);

    // Order points from inner to outer
    const drawOrder = innerIdx === 0 ? points : [...points].reverse();

    // Use quadratic curves for smooth line
    for (let i = 1; i < drawOrder.length - 1; i++) {
        const xc = (drawOrder[i].x + drawOrder[i + 1].x) / 2;
        const yc = (drawOrder[i].y + drawOrder[i + 1].y) / 2;
        ctx.quadraticCurveTo(drawOrder[i].x, drawOrder[i].y, xc, yc);
    }

    // Draw to outer corner
    ctx.lineTo(outerCorner.x, outerCorner.y);

    // Add wing at outer corner if style is winged
    if (config.style === 'winged') {
        const wingLength = thickness * 4;

        // Wing direction: AWAY from face center (lateral) and upward
        const outwardX = outerCorner.x > faceCenter.x ? 1 : -1;

        const wingX = outerCorner.x + outwardX * wingLength * 0.8;
        const wingY = outerCorner.y - wingLength * 0.6;

        ctx.lineTo(wingX, wingY);
    }

    ctx.stroke();
    ctx.restore();
}

/**
 * Apply eyeliner effect to both eyes
 */
export function applyEyeliner(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_EYELINER, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    // Calculate face center using nose tip (landmark 4) 
    const noseTip = landmarks[4];
    const faceCenter = {
        x: noseTip.x * scale,
        y: noseTip.y * scale
    };

    // Draw eyeliner on both eyes
    drawEyelinerLine(ctx, landmarks, 'leftEyeUpper', scale, config, faceCenter);
    drawEyelinerLine(ctx, landmarks, 'rightEyeUpper', scale, config, faceCenter);
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
