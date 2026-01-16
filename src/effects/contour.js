/**
 * Contour Effect Module
 * 
 * Applies contouring shadows to sculpt the face:
 * - Under cheekbones (hollows)
 * - Sides of nose
 * - Temples
 * - Under jawline
 */

import { getRegionPath } from '../facemesh/landmarks.js';

/**
 * Default contour settings
 */
export const DEFAULT_CONTOUR = {
    enabled: false,
    color: '#8B6B5B',      // Warm brown shadow
    opacity: 0.25,
    intensity: 0.8,
    featherRadius: 12,
    blendMode: 'multiply'
};

/**
 * Contour color presets
 */
export const CONTOUR_PRESETS = [
    { name: 'Warm Brown', color: '#8B6B5B' },
    { name: 'Cool Taupe', color: '#7A6B6B' },
    { name: 'Bronze', color: '#9B7B5B' },
    { name: 'Deep Brown', color: '#5B4B3B' },
    { name: 'Gray Brown', color: '#6B6060' }
];

/**
 * Cheekbone hollow landmarks - under the cheekbones
 * These create the sculpted look
 */
const LEFT_CHEEK_HOLLOW = [234, 227, 137, 177, 215, 138, 135, 169, 170, 140];
const RIGHT_CHEEK_HOLLOW = [454, 447, 366, 401, 435, 367, 364, 394, 395, 369];

/**
 * Temple area landmarks
 */
const LEFT_TEMPLE = [54, 103, 67, 109, 10];
const RIGHT_TEMPLE = [284, 332, 297, 338, 10];

/**
 * Nose side landmarks for definition
 */
const LEFT_NOSE_SIDE = [236, 198, 131, 49, 129];
const RIGHT_NOSE_SIDE = [456, 420, 360, 279, 358];

/**
 * Get landmark points scaled
 */
function getPoints(landmarks, indices, scale) {
    return indices
        .filter(idx => idx < landmarks.length && landmarks[idx])
        .map(idx => ({
            x: landmarks[idx].x * scale,
            y: landmarks[idx].y * scale
        }));
}

/**
 * Draw contour shadow with soft gradient
 */
function drawContourShadow(ctx, points, color, opacity, featherRadius) {
    if (points.length < 3) return;

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const radiusX = (maxX - minX) / 2 + featherRadius;
    const radiusY = (maxY - minY) / 2 + featherRadius;
    const radius = Math.max(radiusX, radiusY);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'multiply';

    // Create path from points
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // Apply blur for soft edges
    ctx.filter = `blur(${featherRadius}px)`;
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
}

/**
 * Draw nose contour lines
 */
function drawNoseContour(ctx, leftPoints, rightPoints, color, opacity, featherRadius) {
    if (leftPoints.length < 2 || rightPoints.length < 2) return;

    ctx.save();
    ctx.globalAlpha = opacity * 0.6;
    ctx.globalCompositeOperation = 'multiply';
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.filter = `blur(${featherRadius / 2}px)`;

    // Left side of nose
    ctx.beginPath();
    ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
    for (let i = 1; i < leftPoints.length; i++) {
        ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
    }
    ctx.stroke();

    // Right side of nose
    ctx.beginPath();
    ctx.moveTo(rightPoints[0].x, rightPoints[0].y);
    for (let i = 1; i < rightPoints.length; i++) {
        ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
    }
    ctx.stroke();

    ctx.restore();
}

/**
 * Apply contour effect
 */
export function applyContour(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_CONTOUR, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    const opacity = config.opacity * config.intensity;

    // Contour cheek hollows (main contour area)
    const leftCheekHollow = getPoints(landmarks, LEFT_CHEEK_HOLLOW, scale);
    const rightCheekHollow = getPoints(landmarks, RIGHT_CHEEK_HOLLOW, scale);

    drawContourShadow(ctx, leftCheekHollow, config.color, opacity, config.featherRadius);
    drawContourShadow(ctx, rightCheekHollow, config.color, opacity, config.featherRadius);

    // Contour temples (subtle)
    const leftTemple = getPoints(landmarks, LEFT_TEMPLE, scale);
    const rightTemple = getPoints(landmarks, RIGHT_TEMPLE, scale);

    drawContourShadow(ctx, leftTemple, config.color, opacity * 0.5, config.featherRadius);
    drawContourShadow(ctx, rightTemple, config.color, opacity * 0.5, config.featherRadius);

    // Nose contour
    const leftNose = getPoints(landmarks, LEFT_NOSE_SIDE, scale);
    const rightNose = getPoints(landmarks, RIGHT_NOSE_SIDE, scale);

    drawNoseContour(ctx, leftNose, rightNose, config.color, opacity, config.featherRadius);
}

/**
 * ContourEffect class
 */
export class ContourEffect {
    constructor() {
        this.settings = { ...DEFAULT_CONTOUR };
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
        applyContour(ctx, landmarks, width, height, scale, this.settings);
    }

    getSettings() {
        return { ...this.settings };
    }
}

export default {
    applyContour,
    ContourEffect,
    DEFAULT_CONTOUR,
    CONTOUR_PRESETS
};
