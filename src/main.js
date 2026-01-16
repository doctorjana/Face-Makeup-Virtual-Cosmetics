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

import { ImageLoader } from './image/index.js';
import { initUI } from './ui/index.js';

class FaceMakeupApp {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.imageInput = document.getElementById('imageInput');
        this.currentImage = null;
    }

    init() {
        this.setupEventListeners();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize UI module
        initUI();
        
        console.log('Face Makeup App initialized');
    }

    setupEventListeners() {
        this.imageInput.addEventListener('change', (e) => this.handleImageSelect(e));
    }

    async handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            this.currentImage = await ImageLoader.loadFromFile(file);
            this.renderImage(this.currentImage);
            console.log('Image loaded:', file.name);
        } catch (error) {
            console.error('Failed to load image:', error);
        }
    }

    renderImage(image) {
        // Fit image to canvas while maintaining aspect ratio
        const containerWidth = this.canvas.parentElement.clientWidth;
        const containerHeight = this.canvas.parentElement.clientHeight;
        
        const scale = Math.min(
            containerWidth / image.width,
            containerHeight / image.height,
            1 // Don't upscale
        );

        this.canvas.width = image.width * scale;
        this.canvas.height = image.height * scale;
        
        this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas() {
        if (this.currentImage) {
            this.renderImage(this.currentImage);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new FaceMakeupApp();
    app.init();
    
    // Expose app instance for debugging
    window.faceMakeupApp = app;
});
