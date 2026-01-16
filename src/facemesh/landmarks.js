/**
 * Facial Region Landmark Indices for MediaPipe Face Mesh (468/478 landmarks)
 * 
 * This file defines landmark index groups for each facial region,
 * organized for use with canvas path creation and makeup effects.
 * 
 * Reference: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
 */

// =============================================================================
// LIPS
// =============================================================================

/** Upper lip - outer edge */
export const UPPER_LIP_OUTER = [
    61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291
];

/** Upper lip - inner edge (cupid's bow to corners) */
export const UPPER_LIP_INNER = [
    78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308
];

/** Lower lip - outer edge */
export const LOWER_LIP_OUTER = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291
];

/** Lower lip - inner edge */
export const LOWER_LIP_INNER = [
    78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308
];

/** Complete upper lip region (for filling) */
export const UPPER_LIP = [
    61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
    308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78
];

/** Complete lower lip region (for filling) */
export const LOWER_LIP = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
    308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78
];

/** Full lips outline (outer contour) */
export const LIPS_OUTER = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
    409, 270, 269, 267, 0, 37, 39, 40, 185, 61
];

// =============================================================================
// EYES
// =============================================================================

/** Left eye contour (closed path) */
export const LEFT_EYE = [
    33, 7, 163, 144, 145, 153, 154, 155, 133,
    173, 157, 158, 159, 160, 161, 246, 33
];

/** Right eye contour (closed path) */
export const RIGHT_EYE = [
    362, 382, 381, 380, 374, 373, 390, 249, 263,
    466, 388, 387, 386, 385, 384, 398, 362
];

/** Left eye - upper lid */
export const LEFT_EYE_UPPER = [
    33, 246, 161, 160, 159, 158, 157, 173, 133
];

/** Left eye - lower lid */
export const LEFT_EYE_LOWER = [
    33, 7, 163, 144, 145, 153, 154, 155, 133
];

/** Right eye - upper lid */
export const RIGHT_EYE_UPPER = [
    362, 398, 384, 385, 386, 387, 388, 466, 263
];

/** Right eye - lower lid */
export const RIGHT_EYE_LOWER = [
    362, 382, 381, 380, 374, 373, 390, 249, 263
];

/** Left iris (refined landmarks 468-472) */
export const LEFT_IRIS = [468, 469, 470, 471, 472];

/** Right iris (refined landmarks 473-477) */
export const RIGHT_IRIS = [473, 474, 475, 476, 477];

// =============================================================================
// EYEBROWS
// =============================================================================

/** Left eyebrow */
export const LEFT_EYEBROW = [
    70, 63, 105, 66, 107, 55, 65, 52, 53, 46
];

/** Right eyebrow */
export const RIGHT_EYEBROW = [
    300, 293, 334, 296, 336, 285, 295, 282, 283, 276
];

/** Both eyebrows combined */
export const EYEBROWS = {
    left: LEFT_EYEBROW,
    right: RIGHT_EYEBROW
};

// =============================================================================
// CHEEKS
// =============================================================================

/** Left cheek region */
export const LEFT_CHEEK = [
    117, 118, 119, 120, 121, 128, 217,
    126, 142, 36, 205, 187, 123, 116, 117
];

/** Right cheek region */
export const RIGHT_CHEEK = [
    346, 347, 348, 349, 350, 357, 437,
    355, 371, 266, 425, 411, 352, 345, 346
];

// =============================================================================
// NOSE
// =============================================================================

/** Nose bridge */
export const NOSE_BRIDGE = [168, 6, 197, 195, 5, 4];

/** Nose tip and nostrils */
export const NOSE_TIP = [1, 2, 98, 327, 326, 97];

/** Complete nose region */
export const NOSE = [
    168, 6, 197, 195, 5, 4, 1, 19,
    94, 2, 164, 0, 11, 12,
    248, 281, 275, 274,
    45, 51, 3, 196, 122, 168
];

// =============================================================================
// FOREHEAD
// =============================================================================

/** Forehead region (upper face) */
export const FOREHEAD = [
    10, 338, 297, 332, 284, 251, 389, 264, 447, 366, 401, 435, 367, 364, 394,
    395, 369, 396, 175, 171, 140, 170, 169, 135, 138, 215, 177, 137, 227, 34,
    139, 21, 54, 103, 67, 109, 10
];

// =============================================================================
// JAWLINE
// =============================================================================

/** Jawline / face contour (from ear to ear via chin) */
export const JAWLINE = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
    172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10
];

/** Lower jaw only (chin area) */
export const LOWER_JAW = [
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172
];

// =============================================================================
// FACE REGIONS MAP
// =============================================================================

/**
 * All facial regions indexed by name
 */
export const REGIONS = {
    // Lips
    upperLip: UPPER_LIP,
    lowerLip: LOWER_LIP,
    upperLipOuter: UPPER_LIP_OUTER,
    upperLipInner: UPPER_LIP_INNER,
    lowerLipOuter: LOWER_LIP_OUTER,
    lowerLipInner: LOWER_LIP_INNER,
    lipsOuter: LIPS_OUTER,

    // Eyes
    leftEye: LEFT_EYE,
    rightEye: RIGHT_EYE,
    leftEyeUpper: LEFT_EYE_UPPER,
    leftEyeLower: LEFT_EYE_LOWER,
    rightEyeUpper: RIGHT_EYE_UPPER,
    rightEyeLower: RIGHT_EYE_LOWER,
    leftIris: LEFT_IRIS,
    rightIris: RIGHT_IRIS,

    // Eyebrows
    leftEyebrow: LEFT_EYEBROW,
    rightEyebrow: RIGHT_EYEBROW,

    // Cheeks
    leftCheek: LEFT_CHEEK,
    rightCheek: RIGHT_CHEEK,

    // Nose
    nose: NOSE,
    noseBridge: NOSE_BRIDGE,
    noseTip: NOSE_TIP,

    // Forehead
    forehead: FOREHEAD,

    // Jawline
    jawline: JAWLINE,
    lowerJaw: LOWER_JAW
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a region's landmarks as pixel coordinates for canvas path creation
 * 
 * @param {Array<{x: number, y: number, z?: number}>} landmarks - All 468/478 landmarks in pixel coords
 * @param {string} regionName - Name of the region (key from REGIONS map)
 * @param {number} [scale=1] - Optional scale factor to apply
 * @returns {Array<{x: number, y: number}>} - Array of points for the region path
 */
export function getRegionPath(landmarks, regionName, scale = 1) {
    const indices = REGIONS[regionName];

    if (!indices) {
        console.warn(`Unknown region: ${regionName}`);
        return [];
    }

    if (!landmarks || landmarks.length === 0) {
        return [];
    }

    return indices
        .filter(idx => idx < landmarks.length && landmarks[idx])
        .map(idx => ({
            x: landmarks[idx].x * scale,
            y: landmarks[idx].y * scale
        }));
}

/**
 * Get multiple regions' paths at once
 * 
 * @param {Array} landmarks - All landmarks
 * @param {Array<string>} regionNames - Array of region names
 * @param {number} [scale=1] - Scale factor
 * @returns {Object} - Object with region names as keys and paths as values
 */
export function getRegionPaths(landmarks, regionNames, scale = 1) {
    const paths = {};
    for (const name of regionNames) {
        paths[name] = getRegionPath(landmarks, name, scale);
    }
    return paths;
}

/**
 * Create a canvas Path2D from region landmarks
 * 
 * @param {Array<{x: number, y: number}>} points - Region path points
 * @param {boolean} [close=true] - Whether to close the path
 * @returns {Path2D} - Canvas Path2D object
 */
export function createPath2D(points, close = true) {
    const path = new Path2D();

    if (points.length === 0) return path;

    path.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        path.lineTo(points[i].x, points[i].y);
    }

    if (close) {
        path.closePath();
    }

    return path;
}

/**
 * Get a region as a ready-to-use Path2D
 * 
 * @param {Array} landmarks - All landmarks in pixel coords
 * @param {string} regionName - Region name
 * @param {number} [scale=1] - Scale factor
 * @param {boolean} [close=true] - Close the path
 * @returns {Path2D}
 */
export function getRegionAsPath2D(landmarks, regionName, scale = 1, close = true) {
    const points = getRegionPath(landmarks, regionName, scale);
    return createPath2D(points, close);
}

/**
 * Get list of all available region names
 * @returns {string[]}
 */
export function getAvailableRegions() {
    return Object.keys(REGIONS);
}

export default {
    REGIONS,
    getRegionPath,
    getRegionPaths,
    createPath2D,
    getRegionAsPath2D,
    getAvailableRegions
};
