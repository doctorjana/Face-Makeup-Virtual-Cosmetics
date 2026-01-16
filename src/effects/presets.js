/**
 * Makeup Presets Module
 * 
 * Predefined makeup looks that configure multiple effects at once.
 * Easy to extend - just add a new preset object to PRESETS.
 */

/**
 * Preset definitions
 * Each preset configures all makeup effects with specific settings
 */
export const PRESETS = {
    natural: {
        name: 'Natural',
        description: 'Subtle everyday look',
        settings: {
            lipstick: { enabled: true, color: '#C4837A', opacity: 0.35, intensity: 0.8 },
            eyeliner: { enabled: true, style: 'thin', thickness: 1, opacity: 0.6 },
            eyeshadow: { enabled: false },
            blush: { enabled: true, color: '#E8A0A0', opacity: 0.15 },
            contour: { enabled: false },
            highlight: { enabled: true, opacity: 0.1 },
            skinSmoothing: { enabled: true, strength: 0.2 }
        }
    },

    glam: {
        name: 'Glam',
        description: 'Bold glamorous look',
        settings: {
            lipstick: { enabled: true, color: '#CC2233', opacity: 0.7, intensity: 1.0 },
            eyeliner: { enabled: true, style: 'winged', thickness: 3, opacity: 0.9 },
            eyeshadow: { enabled: true, color: '#6B4B6B', opacity: 0.5 },
            blush: { enabled: true, color: '#E8887A', opacity: 0.3 },
            contour: { enabled: true, opacity: 0.25 },
            highlight: { enabled: true, opacity: 0.25 },
            skinSmoothing: { enabled: true, strength: 0.4 }
        }
    },

    bridal: {
        name: 'Bridal',
        description: 'Elegant wedding look',
        settings: {
            lipstick: { enabled: true, color: '#C87A8A', opacity: 0.5, intensity: 0.9 },
            eyeliner: { enabled: true, style: 'classic', thickness: 2, opacity: 0.75 },
            eyeshadow: { enabled: true, color: '#A08090', opacity: 0.35 },
            blush: { enabled: true, color: '#FFAA88', opacity: 0.2 },
            contour: { enabled: true, opacity: 0.15 },
            highlight: { enabled: true, opacity: 0.3 },
            skinSmoothing: { enabled: true, strength: 0.35 }
        }
    },

    party: {
        name: 'Party',
        description: 'Fun night out look',
        settings: {
            lipstick: { enabled: true, color: '#E84420', opacity: 0.75, intensity: 1.0 },
            eyeliner: { enabled: true, style: 'winged', thickness: 4, opacity: 1.0 },
            eyeshadow: { enabled: true, color: '#4B3B6B', opacity: 0.6 },
            blush: { enabled: true, color: '#C87A8A', opacity: 0.35 },
            contour: { enabled: true, opacity: 0.3 },
            highlight: { enabled: true, opacity: 0.35 },
            skinSmoothing: { enabled: true, strength: 0.5 }
        }
    },

    none: {
        name: 'None',
        description: 'No makeup',
        settings: {
            lipstick: { enabled: false },
            eyeliner: { enabled: false },
            eyeshadow: { enabled: false },
            blush: { enabled: false },
            contour: { enabled: false },
            highlight: { enabled: false },
            skinSmoothing: { enabled: false }
        }
    }
};

/**
 * Get list of preset names for UI
 */
export function getPresetList() {
    return Object.entries(PRESETS).map(([key, preset]) => ({
        value: key,
        label: preset.name,
        description: preset.description
    }));
}

/**
 * Get preset settings by name
 */
export function getPreset(name) {
    return PRESETS[name] || null;
}

/**
 * Apply preset to app instance
 */
export function applyPresetToApp(app, presetName) {
    const preset = PRESETS[presetName];
    if (!preset || !app) return false;

    // Apply each effect's settings
    Object.entries(preset.settings).forEach(([effectName, settings]) => {
        app.setMakeup(effectName, settings);
    });

    return true;
}

export default {
    PRESETS,
    getPresetList,
    getPreset,
    applyPresetToApp
};
