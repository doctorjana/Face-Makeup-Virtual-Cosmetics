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
    }

    async init() {
        this.setupEventListeners();
        this.initializeCanvas();

        // Initialize UI module
        initUI();

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

                // Debug: Draw landmarks
                this.drawLandmarks();
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

    drawLandmarks() {
        if (!this.faceLandmarks) return;

        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';

        for (const point of this.faceLandmarks) {
            const x = point.x * this.imageScale;
            const y = point.y * this.imageScale;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    handleResize() {
        if (this.currentImage) {
            this.renderImage();
            if (this.faceLandmarks) {
                this.drawLandmarks();
            }
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
     * @returns {Object|null}
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
