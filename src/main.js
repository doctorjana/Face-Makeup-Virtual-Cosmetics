/**
 * Face Makeup Application - Main Entry Point
 * 
 * Bootstraps the application and coordinates modules:
 * - image/     : Image loading and processing
 * - facemesh/  : MediaPipe Face Mesh integration
 * - render/    : Canvas/WebGL rendering
 * - effects/   : Makeup effect definitions
 * - ui/        : User interface controls
 */

import { loadImage, getSafeDimensions, getFitDimensions } from './image/index.js';
import { getDetector, FaceMeshDetector } from './facemesh/index.js';
import { drawDebugLandmarks, setDebug } from './render/index.js';
import { LipstickEffect } from './effects/lipstick.js';
import { EyelinerEffect } from './effects/eyeliner.js';
import { EyeshadowEffect } from './effects/eyeshadow.js';
import { BlushEffect } from './effects/blush.js';
import { ContourEffect } from './effects/contour.js';
import { HighlightEffect } from './effects/highlight.js';
import { initUI, updateStatus } from './ui/index.js';

class FaceMakeupApp {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.imageInput = document.getElementById('imageInput');
        this.viewport = document.querySelector('.viewport');

        // Current state
        this.currentImage = null;
        this.imageScale = 1;
        this.originalDimensions = { width: 0, height: 0 };
        this.faceLandmarks = null;

        // FaceMesh detector
        this.detector = getDetector();

        // Makeup effects (order matters for layering)
        this.effects = {
            contour: new ContourEffect(),
            highlight: new HighlightEffect(),
            blush: new BlushEffect(),
            eyeshadow: new EyeshadowEffect(),
            eyeliner: new EyelinerEffect(),
            lipstick: new LipstickEffect()
        };
    }

    async init() {
        this.setupEventListeners();
        this.initializeCanvas();

        // Initialize UI module
        initUI(this);

        // Pre-initialize detector (loads model in background)
        updateStatus('Loading face detection model...');
        try {
            await this.detector.init();
            updateStatus('Ready - upload an image');
        } catch (error) {
            updateStatus('Model loading failed - will retry on image upload');
        }

        console.log('Face Makeup App initialized');
    }

    setupEventListeners() {
        this.imageInput.addEventListener('change', (e) => this.handleImageSelect(e));
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeCanvas() {
        // Set initial canvas size based on viewport
        const rect = this.viewport.getBoundingClientRect();
        this.canvas.width = rect.width * 0.8;
        this.canvas.height = rect.height * 0.8;

        // Draw placeholder
        this.drawPlaceholder();
    }

    drawPlaceholder() {
        this.ctx.fillStyle = '#1a1a24';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#404050';
        this.ctx.font = '16px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            'Upload an image to begin',
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    async handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            updateStatus('Loading image...');
            console.log(`Loading image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

            // Load the image
            this.currentImage = await loadImage(file);

            // Store original dimensions
            this.originalDimensions = {
                width: this.currentImage.width,
                height: this.currentImage.height
            };

            console.log(`Image loaded: ${this.originalDimensions.width}x${this.originalDimensions.height}`);

            // Render the image
            this.renderImage();

            // Detect face landmarks
            await this.detectFace();

        } catch (error) {
            console.error('Failed to load image:', error);
            updateStatus(`Error: ${error.message}`);
            this.showError(error.message);
        }
    }

    async detectFace() {
        if (!this.currentImage) return;

        try {
            updateStatus('Detecting face...');

            const result = await this.detector.detect(this.currentImage);

            if (result) {
                this.faceLandmarks = FaceMeshDetector.toPixelCoords(result);
                console.log(`Detected ${this.faceLandmarks.length} landmarks`);
                updateStatus(`Face detected - ${this.faceLandmarks.length} landmarks`);

                // Draw overlays
                this.drawOverlays();
            } else {
                this.faceLandmarks = null;
                updateStatus('No face detected - try another image');
            }

        } catch (error) {
            console.error('Face detection failed:', error);
            updateStatus('Face detection failed');
        }
    }

    renderImage() {
        if (!this.currentImage) return;

        // Get viewport dimensions
        const viewportRect = this.viewport.getBoundingClientRect();
        const padding = 40;
        const maxWidth = viewportRect.width - padding * 2;
        const maxHeight = viewportRect.height - padding * 2;

        // Get safe dimensions (handle very large images)
        const safeDims = getSafeDimensions(
            this.currentImage.width,
            this.currentImage.height
        );

        // Fit to viewport while maintaining aspect ratio
        const fitDims = getFitDimensions(
            safeDims.width,
            safeDims.height,
            maxWidth,
            maxHeight
        );

        // Calculate total scale factor from original
        this.imageScale = safeDims.scale * fitDims.scale;

        // Set canvas to fitted dimensions
        this.canvas.width = fitDims.width;
        this.canvas.height = fitDims.height;

        // Draw the image
        this.ctx.drawImage(
            this.currentImage,
            0, 0,
            this.currentImage.width, this.currentImage.height,
            0, 0,
            fitDims.width, fitDims.height
        );

        console.log(`Rendered at ${fitDims.width}x${fitDims.height} (scale: ${this.imageScale.toFixed(3)})`);
    }

    /**
     * Draw all overlays (makeup effects, debug landmarks, etc.)
     */
    drawOverlays() {
        if (!this.faceLandmarks) return;

        // Apply makeup effects in correct order (back to front)
        this.applyMakeup();

        // Draw debug landmarks (on top of makeup)
        drawDebugLandmarks(this.ctx, this.faceLandmarks, this.imageScale);
    }

    /**
     * Apply all makeup effects in correct order
     */
    applyMakeup() {
        const { width, height } = this.canvas;

        // Face effects first (contour, highlight, blush)
        this.effects.contour.apply(this.ctx, this.faceLandmarks, width, height, this.imageScale);
        this.effects.highlight.apply(this.ctx, this.faceLandmarks, width, height, this.imageScale);
        this.effects.blush.apply(this.ctx, this.faceLandmarks, width, height, this.imageScale);

        // Eye effects
        this.effects.eyeshadow.apply(this.ctx, this.faceLandmarks, width, height, this.imageScale);
        this.effects.eyeliner.apply(this.ctx, this.faceLandmarks, width, height, this.imageScale);

        // Lip effects last
        this.effects.lipstick.apply(this.ctx, this.faceLandmarks, width, height, this.imageScale);
    }

    /**
     * Update makeup settings
     */
    setMakeup(effectName, settings) {
        const effect = this.effects[effectName];
        if (effect) {
            effect.update(settings);
            if (this.currentImage && this.faceLandmarks) {
                this.redraw();
            }
        }
    }

    /**
     * Redraw the entire scene
     */
    redraw() {
        this.renderImage();
        this.drawOverlays();
    }

    /**
     * Toggle debug mode
     */
    setDebugMode(enabled) {
        setDebug(enabled);
        if (this.currentImage) {
            this.redraw();
        }
    }

    handleResize() {
        if (this.currentImage) {
            this.redraw();
        } else {
            this.initializeCanvas();
        }
    }

    showError(message) {
        this.ctx.fillStyle = '#1a1a24';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#e85d75';
        this.ctx.font = '14px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            `Error: ${message}`,
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }

    /**
     * Get current image info
     */
    getImageInfo() {
        if (!this.currentImage) return null;

        return {
            originalWidth: this.originalDimensions.width,
            originalHeight: this.originalDimensions.height,
            displayWidth: this.canvas.width,
            displayHeight: this.canvas.height,
            scale: this.imageScale,
            landmarks: this.faceLandmarks
        };
    }

    /**
     * Get current makeup settings
     */
    getMakeupSettings() {
        const settings = {};
        for (const [name, effect] of Object.entries(this.effects)) {
            settings[name] = effect.getSettings();
        }
        return settings;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new FaceMakeupApp();
    app.init();

    // Expose app instance for debugging
    window.faceMakeupApp = app;
    window.loadImage = loadImage;
});

export { FaceMakeupApp };
