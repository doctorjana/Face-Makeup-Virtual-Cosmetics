/**
 * Highlight Effect Module
 * 
 * Applies highlighter to cheekbones and nose bridge for luminous glow.
 */

import { getRegionPath, createPath2D } from '../facemesh/landmarks.js';

/**
 * Default highlight settings
 */
export const DEFAULT_HIGHLIGHT = {
    enabled: false,
    color: '#FFFFFF',      // White highlight
    opacity: 0.15,
    intensity: 0.6,
    featherRadius: 8,
    shimmer: true
};

/**
 * Highlight color presets
 */
export const HIGHLIGHT_PRESETS = [
    { name: 'Pearl', color: '#FFFFFF' },
    { name: 'Champagne', color: '#F8E8D8' },
    { name: 'Rose Gold', color: '#F0D8D0' },
    { name: 'Gold', color: '#F8E8C8' },
    { name: 'Silver', color: '#E8E8F0' },
    { name: 'Bronze', color: '#E8D8C0' }
];

/**
 * Cheekbone highlight landmark indices (high points of cheeks)
 */
const LEFT_CHEEKBONE = [117, 118, 119, 47, 126];
const RIGHT_CHEEKBONE = [346, 347, 348, 277, 355];

/**
 * Nose bridge highlight points
 */
const NOSE_HIGHLIGHT = [168, 6, 197, 195, 5];

/**
 * Apply highlight to a region
 */
function drawHighlight(ctx, points, color, opacity, featherRadius, shimmer) {
    if (points.length < 2) return;

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const radius = Math.max(maxX - minX, maxY - minY) / 2 + featherRadius;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'overlay';

    // Soft radial gradient
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, `${color}80`);
    gradient.addColorStop(1, `${color}00`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add shimmer effect
    if (shimmer) {
        ctx.globalAlpha = opacity * 0.5;
        ctx.globalCompositeOperation = 'screen';

        const shimmerGradient = ctx.createRadialGradient(
            centerX, centerY - radius * 0.2, 0,
            centerX, centerY, radius * 0.6
        );
        shimmerGradient.addColorStop(0, 'rgba(255,255,255,0.4)');
        shimmerGradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = shimmerGradient;
        ctx.fill();
    }

    ctx.restore();
}

/**
 * Get highlight region points from landmarks
 */
function getHighlightPoints(landmarks, indices, scale) {
    return indices
        .filter(idx => idx < landmarks.length && landmarks[idx])
        .map(idx => ({
            x: landmarks[idx].x * scale,
            y: landmarks[idx].y * scale
        }));
}

/**
 * Apply highlight effect
 */
export function applyHighlight(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_HIGHLIGHT, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    const opacity = config.opacity * config.intensity;

    // Highlight cheekbones
    const leftCheekbone = getHighlightPoints(landmarks, LEFT_CHEEKBONE, scale);
    const rightCheekbone = getHighlightPoints(landmarks, RIGHT_CHEEKBONE, scale);

    drawHighlight(ctx, leftCheekbone, config.color, opacity, config.featherRadius, config.shimmer);
    drawHighlight(ctx, rightCheekbone, config.color, opacity, config.featherRadius, config.shimmer);

    // Highlight nose bridge
    const noseBridge = getHighlightPoints(landmarks, NOSE_HIGHLIGHT, scale);
    drawHighlight(ctx, noseBridge, config.color, opacity * 0.7, config.featherRadius, config.shimmer);
}

/**
 * HighlightEffect class
 */
export class HighlightEffect {
    constructor() {
        this.settings = { ...DEFAULT_HIGHLIGHT };
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
        applyHighlight(ctx, landmarks, width, height, scale, this.settings);
    }

    getSettings() {
        return { ...this.settings };
    }
}

export default {
    applyHighlight,
    HighlightEffect,
    DEFAULT_HIGHLIGHT,
    HIGHLIGHT_PRESETS
};
