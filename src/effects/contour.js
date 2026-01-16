/**
 * Contour Effect Module
 * 
 * Applies contouring shadows to jawline and nose for face shaping.
 * Uses soft gradients for realistic appearance.
 */

import { getRegionPath, createPath2D } from '../facemesh/landmarks.js';

/**
 * Default contour settings
 */
export const DEFAULT_CONTOUR = {
    enabled: false,
    color: '#8B6B5B',      // Warm brown shadow
    opacity: 0.2,
    intensity: 0.7,
    featherRadius: 10,
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
 * Draw contour on one side of face
 */
function drawContourRegion(ctx, points, color, opacity, featherRadius) {
    if (points.length < 3) return;

    // Create gradient from edge inward
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Create path
    const path = createPath2D(points, true);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'multiply';

    // Create radial gradient for soft falloff
    const radius = Math.max(maxX - minX, maxY - minY) / 2;
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
    );
    gradient.addColorStop(0, `${color}00`);  // Transparent center
    gradient.addColorStop(0.5, `${color}40`); // Subtle middle
    gradient.addColorStop(1, color);          // Full color at edge

    ctx.fillStyle = gradient;
    ctx.fill(path);
    ctx.restore();
}

/**
 * Apply contour effect to jawline and nose
 */
export function applyContour(ctx, landmarks, width, height, scale, settings = {}) {
    const config = { ...DEFAULT_CONTOUR, ...settings };

    if (!config.enabled || !landmarks || landmarks.length === 0) {
        return;
    }

    const opacity = config.opacity * config.intensity;

    // Contour the lower jaw / jawline sides
    const lowerJaw = getRegionPath(landmarks, 'lowerJaw', scale);
    if (lowerJaw.length > 0) {
        drawContourRegion(ctx, lowerJaw, config.color, opacity * 0.6, config.featherRadius);
    }

    // Contour nose sides
    const noseBridge = getRegionPath(landmarks, 'noseBridge', scale);
    if (noseBridge.length > 0) {
        // Draw subtle shadow on both sides of nose
        ctx.save();
        ctx.globalAlpha = opacity * 0.4;
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Apply blur for soft edge
        ctx.filter = `blur(${config.featherRadius / 2}px)`;

        ctx.beginPath();
        ctx.moveTo(noseBridge[0].x, noseBridge[0].y);
        for (let i = 1; i < noseBridge.length; i++) {
            ctx.lineTo(noseBridge[i].x, noseBridge[i].y);
        }
        ctx.stroke();
        ctx.restore();
    }
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
