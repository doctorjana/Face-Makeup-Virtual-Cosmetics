/**
 * FaceMesh Module
 * 
 * MediaPipe Face Mesh integration for facial landmark detection.
 * Provides 468 3D landmarks with refined eye and lip tracking.
 */

// CDN URLs for MediaPipe
const VISION_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

/**
 * Dynamically load MediaPipe Vision module
 */
async function loadVisionModule() {
    const { FaceLandmarker, FilesetResolver } = await import(
        `${VISION_CDN}/vision_bundle.mjs`
    );
    return { FaceLandmarker, FilesetResolver };
}

/**
 * FaceMesh detector using MediaPipe Face Landmarker
 */
export class FaceMeshDetector {
    constructor() {
        this.faceLandmarker = null;
        this.isInitialized = false;
        this.isInitializing = false;
    }

    /**
     * Initialize the Face Landmarker
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) return;
        if (this.isInitializing) {
            // Wait for ongoing initialization
            while (this.isInitializing) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            return;
        }

        this.isInitializing = true;

        try {
            console.log('Loading MediaPipe Vision module...');
            const { FaceLandmarker, FilesetResolver } = await loadVisionModule();

            // Load WASM files
            console.log('Loading WASM fileset...');
            const wasmFileset = await FilesetResolver.forVisionTasks(
                `${VISION_CDN}/wasm`
            );

            // Create Face Landmarker
            console.log('Creating Face Landmarker...');
            this.faceLandmarker = await FaceLandmarker.createFromOptions(wasmFileset, {
                baseOptions: {
                    modelAssetPath: MODEL_URL,
                    delegate: 'GPU'
                },
                runningMode: 'IMAGE',
                numFaces: 1,
                outputFaceBlendshapes: false,
                outputFacialTransformationMatrixes: false
            });

            this.isInitialized = true;
            console.log('FaceMesh detector initialized successfully');

        } catch (error) {
            console.error('Failed to initialize FaceMesh:', error);
            throw error;
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Detect face landmarks in an image
     * @param {HTMLImageElement|HTMLCanvasElement} imageElement - The image to process
     * @returns {Promise<FaceMeshResult|null>} - Detection result or null if no face found
     */
    async detect(imageElement) {
        if (!this.isInitialized) {
            await this.init();
        }

        try {
            const result = this.faceLandmarker.detect(imageElement);

            if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
                console.log('No face detected');
                return null;
            }

            // Return first face landmarks (468 points)
            const landmarks = result.faceLandmarks[0];

            return {
                landmarks: landmarks,
                count: landmarks.length,
                imageWidth: imageElement.width || imageElement.naturalWidth,
                imageHeight: imageElement.height || imageElement.naturalHeight
            };

        } catch (error) {
            console.error('Face detection failed:', error);
            throw error;
        }
    }

    /**
     * Get landmarks as pixel coordinates
     * @param {FaceMeshResult} result - Detection result
     * @returns {Array<{x: number, y: number, z: number}>} - Landmarks in pixel coordinates
     */
    static toPixelCoords(result) {
        if (!result || !result.landmarks) return [];

        return result.landmarks.map(point => ({
            x: point.x * result.imageWidth,
            y: point.y * result.imageHeight,
            z: point.z * result.imageWidth // Z is relative to width
        }));
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.faceLandmarker) {
            this.faceLandmarker.close();
            this.faceLandmarker = null;
        }
        this.isInitialized = false;
    }
}

// Singleton instance
let detectorInstance = null;

/**
 * Get or create the FaceMesh detector instance
 * @returns {FaceMeshDetector}
 */
export function getDetector() {
    if (!detectorInstance) {
        detectorInstance = new FaceMeshDetector();
    }
    return detectorInstance;
}

/**
 * Detect face landmarks in an image (convenience function)
 * @param {HTMLImageElement|HTMLCanvasElement} imageElement - The image to process
 * @returns {Promise<FaceMeshResult|null>}
 */
export async function detectFace(imageElement) {
    const detector = getDetector();
    return detector.detect(imageElement);
}

export default {
    FaceMeshDetector,
    getDetector,
    detectFace
};
