/**
 * Effects Module
 * 
 * Makeup effect definitions and application logic.
 * 
 * Planned effects:
 * - Lipstick
 * - Eyeliner
 * - Eyeshadow
 * - Blush
 * - Contour
 * - Foundation
 */

// Effect types enum
export const EffectType = {
    LIPSTICK: 'lipstick',
    EYELINER: 'eyeliner',
    EYESHADOW: 'eyeshadow',
    BLUSH: 'blush',
    CONTOUR: 'contour',
    FOUNDATION: 'foundation'
};

// Base effect class
export class MakeupEffect {
    constructor(type, options = {}) {
        this.type = type;
        this.color = options.color || '#FF0000';
        this.opacity = options.opacity ?? 0.5;
        this.intensity = options.intensity ?? 1.0;
        this.enabled = options.enabled ?? true;
    }

    apply(ctx, landmarks) {
        // Override in subclasses
        throw new Error('apply() must be implemented by subclass');
    }
}

export default { EffectType, MakeupEffect };
