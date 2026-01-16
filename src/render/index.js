/**
 * Render Module
 * 
 * Canvas rendering pipeline for face mesh visualization and makeup effects.
 */

import { REGIONS } from '../facemesh/landmarks.js';

// Debug flag - set to true to visualize landmarks
export let DEBUG = true;

/**
 * Set debug mode
 * @param {boolean} enabled
 */
export function setDebug(enabled) {
    DEBUG = enabled;
}

/**
 * Color scheme for different facial regions
 */
const REGION_COLORS = {
    lips: '#FF4466',        // Red-pink for lips
    leftEye: '#44AAFF',     // Blue for left eye
    rightEye: '#44AAFF',    // Blue for right eye
    leftEyebrow: '#FFAA44', // Orange for left eyebrow
    rightEyebrow: '#FFAA44',// Orange for right eyebrow
    leftIris: '#00FFAA',    // Cyan for left iris
    rightIris: '#00FFAA',   // Cyan for right iris
    faceOval: '#AAFFAA',    // Light green for face outline
    nose: '#FFFF66',        // Yellow for nose
    other: '#888888'        // Gray for other points
};

/**
 * Get the region and color for a landmark index
 * @param {number} index - Landmark index
 * @returns {{region: string, color: string}}
 */
function getLandmarkRegion(index) {
    if (REGIONS.lipsOuter?.includes(index) || REGIONS.upperLip?.includes(index) || REGIONS.lowerLip?.includes(index)) {
        return { region: 'lips', color: REGION_COLORS.lips };
    }
    if (REGIONS.leftEye?.includes(index)) {
        return { region: 'leftEye', color: REGION_COLORS.leftEye };
    }
    if (REGIONS.rightEye?.includes(index)) {
        return { region: 'rightEye', color: REGION_COLORS.rightEye };
    }
    if (REGIONS.leftEyebrow?.includes(index)) {
        return { region: 'leftEyebrow', color: REGION_COLORS.leftEyebrow };
    }
    if (REGIONS.rightEyebrow?.includes(index)) {
        return { region: 'rightEyebrow', color: REGION_COLORS.rightEyebrow };
    }
    if (REGIONS.leftIris?.includes(index)) {
        return { region: 'leftIris', color: REGION_COLORS.leftIris };
    }
    if (REGIONS.rightIris?.includes(index)) {
        return { region: 'rightIris', color: REGION_COLORS.rightIris };
    }
    if (REGIONS.jawline?.includes(index)) {
        return { region: 'faceOval', color: REGION_COLORS.faceOval };
    }
    if (REGIONS.nose?.includes(index)) {
        return { region: 'nose', color: REGION_COLORS.nose };
    }
    return { region: 'other', color: REGION_COLORS.other };
}

/**
 * Draw debug landmarks on canvas with color coding
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array<{x: number, y: number, z: number}>} landmarks - Pixel coordinates
 * @param {number} scale - Scale factor from original image to canvas
 */
export function drawDebugLandmarks(ctx, landmarks, scale = 1) {
    if (!DEBUG || !landmarks || landmarks.length === 0) return;

    // Draw all landmarks with color coding
    landmarks.forEach((point, index) => {
        const x = point.x * scale;
        const y = point.y * scale;
        const { color } = getLandmarkRegion(index);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw contour connections for key regions
    drawContour(ctx, landmarks, REGIONS.jawline, REGION_COLORS.faceOval, scale, 1);
    drawContour(ctx, landmarks, REGIONS.leftEye, REGION_COLORS.leftEye, scale, 1.5);
    drawContour(ctx, landmarks, REGIONS.rightEye, REGION_COLORS.rightEye, scale, 1.5);
    drawContour(ctx, landmarks, REGIONS.lipsOuter, REGION_COLORS.lips, scale, 1.5);
    drawContour(ctx, landmarks, REGIONS.upperLip, REGION_COLORS.lips, scale, 1);
}

/**
 * Draw a contour connecting landmarks
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} landmarks
 * @param {Array<number>} indices
 * @param {string} color
 * @param {number} scale
 * @param {number} lineWidth
 */
function drawContour(ctx, landmarks, indices, color, scale, lineWidth = 1) {
    if (indices.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();

    const first = landmarks[indices[0]];
    if (!first) return;

    ctx.moveTo(first.x * scale, first.y * scale);

    for (let i = 1; i < indices.length; i++) {
        const point = landmarks[indices[i]];
        if (point) {
            ctx.lineTo(point.x * scale, point.y * scale);
        }
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
}

/**
 * Renderer class for managing canvas operations
 */
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawImage(image, x = 0, y = 0, width = null, height = null) {
        width = width ?? image.width;
        height = height ?? image.height;
        this.ctx.drawImage(image, x, y, width, height);
    }

    drawLandmarks(landmarks, scale = 1) {
        drawDebugLandmarks(this.ctx, landmarks, scale);
    }
}

export default {
    Renderer,
    drawDebugLandmarks,
    setDebug,
    DEBUG,
    REGION_COLORS
};
