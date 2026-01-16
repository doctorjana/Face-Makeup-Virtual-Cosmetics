/**
 * UI Module - Minimal Design
 * 
 * Separated UI logic from rendering.
 * Mobile-first layout with simple controls.
 */

let appInstance = null;
let statusElement = null;

// UI State (separated from rendering)
const uiState = {
    activeSection: 'lips',
    presetIndex: 0,

    // Global controls
    opacity: 0.5,
    intensity: 1.0,
    saturation: 1.0,

    // Effect toggles
    lipsEnabled: true,
    eyesEnabled: true,
    faceEnabled: false
};

/**
 * Initialize UI
 */
export function initUI(app) {
    appInstance = app;
    renderUI();
    setupEventListeners();
    console.log('Minimal UI initialized');
}

/**
 * Render the UI structure
 */
function renderUI() {
    const sidebar = document.getElementById('sidebar');

    sidebar.innerHTML = `
        <div class="ui-minimal">
            <!-- Status -->
            <div class="status-bar">
                <span id="statusText">Ready</span>
            </div>
            
            <!-- Effect Toggles -->
            <div class="toggle-row">
                <button class="effect-toggle ${uiState.lipsEnabled ? 'active' : ''}" data-effect="lips">
                    💋 Lips
                </button>
                <button class="effect-toggle ${uiState.eyesEnabled ? 'active' : ''}" data-effect="eyes">
                    👁️ Eyes
                </button>
                <button class="effect-toggle ${uiState.faceEnabled ? 'active' : ''}" data-effect="face">
                    ✨ Face
                </button>
            </div>
            
            <!-- Preset Selector -->
            <div class="preset-row">
                <label>Preset</label>
                <select id="presetSelector">
                    <option value="natural">Natural</option>
                    <option value="glam">Glam</option>
                    <option value="bold">Bold</option>
                    <option value="subtle">Subtle</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            
            <!-- Global Sliders -->
            <div class="slider-group">
                <div class="slider-row">
                    <label>Opacity</label>
                    <input type="range" id="globalOpacity" min="0" max="100" value="50">
                    <span class="value-display" id="opacityValue">50%</span>
                </div>
                
                <div class="slider-row">
                    <label>Intensity</label>
                    <input type="range" id="globalIntensity" min="0" max="100" value="100">
                    <span class="value-display" id="intensityValue">100%</span>
                </div>
                
                <div class="slider-row">
                    <label>Saturation</label>
                    <input type="range" id="globalSaturation" min="0" max="100" value="100">
                    <span class="value-display" id="saturationValue">100%</span>
                </div>
            </div>
        </div>
    `;

    statusElement = document.getElementById('statusText');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Effect toggles
    document.querySelectorAll('.effect-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const effect = e.target.dataset.effect;
            toggleEffect(effect);
            e.target.classList.toggle('active');
        });
    });

    // Preset selector
    document.getElementById('presetSelector')?.addEventListener('change', (e) => {
        applyPreset(e.target.value);
    });

    // Global sliders
    setupSlider('globalOpacity', 'opacityValue', (value) => {
        uiState.opacity = value / 100;
        applyGlobalSettings();
    });

    setupSlider('globalIntensity', 'intensityValue', (value) => {
        uiState.intensity = value / 100;
        applyGlobalSettings();
    });

    setupSlider('globalSaturation', 'saturationValue', (value) => {
        uiState.saturation = value / 100;
        applyGlobalSettings();
    });
}

/**
 * Setup individual slider
 */
function setupSlider(sliderId, displayId, onChange) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);

    if (!slider) return;

    slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (display) display.textContent = `${value}%`;
        onChange(value);
    });
}

/**
 * Toggle effect on/off
 */
function toggleEffect(effect) {
    if (!appInstance) return;

    switch (effect) {
        case 'lips':
            uiState.lipsEnabled = !uiState.lipsEnabled;
            appInstance.setMakeup('lipstick', { enabled: uiState.lipsEnabled });
            break;
        case 'eyes':
            uiState.eyesEnabled = !uiState.eyesEnabled;
            appInstance.setMakeup('eyeliner', { enabled: uiState.eyesEnabled });
            appInstance.setMakeup('eyeshadow', { enabled: uiState.eyesEnabled });
            break;
        case 'face':
            uiState.faceEnabled = !uiState.faceEnabled;
            appInstance.setMakeup('blush', { enabled: uiState.faceEnabled });
            appInstance.setMakeup('contour', { enabled: uiState.faceEnabled });
            appInstance.setMakeup('highlight', { enabled: uiState.faceEnabled });
            appInstance.setMakeup('skinSmoothing', { enabled: uiState.faceEnabled });
            break;
    }
}

/**
 * Apply global settings to all effects
 */
function applyGlobalSettings() {
    if (!appInstance) return;

    const settings = {
        opacity: uiState.opacity,
        intensity: uiState.saturation
    };

    // Apply to all active effects
    if (uiState.lipsEnabled) {
        appInstance.setMakeup('lipstick', settings);
    }
    if (uiState.eyesEnabled) {
        appInstance.setMakeup('eyeliner', { opacity: uiState.opacity });
        appInstance.setMakeup('eyeshadow', settings);
    }
    if (uiState.faceEnabled) {
        appInstance.setMakeup('blush', settings);
        appInstance.setMakeup('contour', { opacity: uiState.opacity });
        appInstance.setMakeup('highlight', { opacity: uiState.opacity });
    }
}

/**
 * Apply preset configuration
 */
function applyPreset(presetName) {
    if (!appInstance) return;

    const presets = {
        natural: { opacity: 30, intensity: 80, saturation: 70 },
        glam: { opacity: 70, intensity: 100, saturation: 100 },
        bold: { opacity: 80, intensity: 100, saturation: 120 },
        subtle: { opacity: 20, intensity: 60, saturation: 80 },
        custom: null
    };

    const preset = presets[presetName];
    if (!preset) return;

    // Update sliders
    updateSlider('globalOpacity', 'opacityValue', preset.opacity);
    updateSlider('globalIntensity', 'intensityValue', preset.intensity);
    updateSlider('globalSaturation', 'saturationValue', preset.saturation);

    // Update state
    uiState.opacity = preset.opacity / 100;
    uiState.intensity = preset.intensity / 100;
    uiState.saturation = preset.saturation / 100;

    applyGlobalSettings();
}

/**
 * Update slider value
 */
function updateSlider(sliderId, displayId, value) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);

    if (slider) slider.value = value;
    if (display) display.textContent = `${value}%`;
}

/**
 * Update status message
 */
export function updateStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log(`Status: ${message}`);
}

/**
 * Get current UI state (for external access)
 */
export function getUIState() {
    return { ...uiState };
}

export default { initUI, updateStatus, getUIState };
