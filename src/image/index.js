/**
 * Image Module
 * 
 * Handles image loading, processing, and safe handling of large images.
 */

// Maximum dimensions to prevent memory issues
const MAX_DIMENSION = 4096;
const MAX_PIXELS = 16777216; // 4096 x 4096

/**
 * Load an image from a File object
 * @param {File} file - The image file to load
 * @returns {Promise<HTMLImageElement>} - The loaded image element
 */
export async function loadImage(file) {
    if (!file) {
        throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('File is not an image');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Validate image dimensions
                if (img.width === 0 || img.height === 0) {
                    reject(new Error('Invalid image dimensions'));
                    return;
                }
                resolve(img);
            };

            img.onerror = () => reject(new Error('Failed to decode image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Load an image from a URL
 * @param {string} url - The image URL
 * @returns {Promise<HTMLImageElement>} - The loaded image element
 */
export async function loadImageFromURL(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image from URL'));
        img.src = url;
    });
}

/**
 * Calculate safe dimensions for large images
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @returns {{width: number, height: number, scale: number}} - Safe dimensions and scale factor
 */
export function getSafeDimensions(width, height) {
    let scale = 1;

    // Check if image exceeds max pixels
    const totalPixels = width * height;
    if (totalPixels > MAX_PIXELS) {
        scale = Math.sqrt(MAX_PIXELS / totalPixels);
    }

    // Check if any dimension exceeds max
    if (width * scale > MAX_DIMENSION) {
        scale = MAX_DIMENSION / width;
    }
    if (height * scale > MAX_DIMENSION) {
        scale = MAX_DIMENSION / height;
    }

    return {
        width: Math.floor(width * scale),
        height: Math.floor(height * scale),
        scale
    };
}

/**
 * Calculate dimensions that fit within a container while maintaining aspect ratio
 * @param {number} imgWidth - Image width
 * @param {number} imgHeight - Image height
 * @param {number} containerWidth - Container width
 * @param {number} containerHeight - Container height
 * @returns {{width: number, height: number, scale: number}} - Fitted dimensions
 */
export function getFitDimensions(imgWidth, imgHeight, containerWidth, containerHeight) {
    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't upscale

    return {
        width: Math.floor(imgWidth * scale),
        height: Math.floor(imgHeight * scale),
        scale
    };
}

/**
 * Create an offscreen canvas with the image at safe resolution
 * @param {HTMLImageElement} image - The source image
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number}}
 */
export function createImageCanvas(image) {
    const { width, height, scale } = getSafeDimensions(image.width, image.height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    return { canvas, ctx, scale };
}

// Legacy class export for backward compatibility
export class ImageLoader {
    static loadFromFile = loadImage;
    static loadFromURL = loadImageFromURL;
}

export default {
    loadImage,
    loadImageFromURL,
    getSafeDimensions,
    getFitDimensions,
    createImageCanvas,
    ImageLoader
};
