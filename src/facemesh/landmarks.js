/**
 * Landmark Indices for MediaPipe Face Mesh (468 landmarks)
 * 
 * Reference: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
 */

// Lips - outer contour
export const LIPS_OUTER = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
    409, 270, 269, 267, 0, 37, 39, 40, 185, 61
];

// Lips - inner contour
export const LIPS_INNER = [
    78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
    415, 310, 311, 312, 13, 82, 81, 80, 191, 78
];

// Left eye contour
export const LEFT_EYE = [
    33, 7, 163, 144, 145, 153, 154, 155, 133,
    173, 157, 158, 159, 160, 161, 246, 33
];

// Right eye contour  
export const RIGHT_EYE = [
    362, 382, 381, 380, 374, 373, 390, 249, 263,
    466, 388, 387, 386, 385, 384, 398, 362
];

// Left eyebrow
export const LEFT_EYEBROW = [
    70, 63, 105, 66, 107, 55, 65, 52, 53, 46
];

// Right eyebrow
export const RIGHT_EYEBROW = [
    300, 293, 334, 296, 336, 285, 295, 282, 283, 276
];

// Left iris
export const LEFT_IRIS = [468, 469, 470, 471, 472];

// Right iris
export const RIGHT_IRIS = [473, 474, 475, 476, 477];

// Face oval/silhouette
export const FACE_OVAL = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
    172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10
];

// Nose bridge and tip
export const NOSE = [
    168, 6, 197, 195, 5,  // bridge
    4, 1, 19, 94, 2,      // tip area
    98, 327               // nostrils
];

// Left cheek region (approximate)
export const LEFT_CHEEK = [
    116, 123, 147, 187, 207, 216, 206, 203, 129, 142, 126
];

// Right cheek region (approximate)
export const RIGHT_CHEEK = [
    345, 352, 376, 411, 427, 436, 426, 423, 358, 371, 355
];

// Forehead region (approximate upper face points)
export const FOREHEAD = [
    10, 109, 67, 103, 54, 21, 162, 127, 234, 93, 132, 58,
    172, 136, 150, 149, 176, 148, 152
];

// Export all regions
export const FACIAL_REGIONS = {
    LIPS_OUTER,
    LIPS_INNER,
    LEFT_EYE,
    RIGHT_EYE,
    LEFT_EYEBROW,
    RIGHT_EYEBROW,
    LEFT_IRIS,
    RIGHT_IRIS,
    FACE_OVAL,
    NOSE,
    LEFT_CHEEK,
    RIGHT_CHEEK,
    FOREHEAD
};

export default FACIAL_REGIONS;
