/**
 * Image Module
 * 
 * Handles image loading, processing, and manipulation.
 */

export class ImageLoader {
    /**
     * Load an image from a File object
     * @param {File} file - The image file to load
     * @returns {Promise<HTMLImageElement>} - The loaded image element
     */
    static loadFromFile(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('File is not an image'));
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Failed to load image'));
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
    static loadFromURL(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image from URL'));
            img.src = url;
        });
    }
}

export default ImageLoader;
