/**
 * UI Module - Minimal Design with Detail Tabs
 * 
 * Separated UI logic from rendering.
 * Mobile-first tabbed interface.
 */

import { getPresetList, applyPresetToApp } from '../effects/presets.js';

let appInstance = null;
let statusElement = null;

// UI State
const uiState = {
    activeSection: 'lips', // 'lips', 'eyes', 'face'
    presetIndex: 0,
    showOriginal: false,
    zoomToFace: false,

    // Global controls
    opacity: 0.5,
    intensity: 1.0,
    saturation: 1.0,

    // Category Toggles (Master switches)
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
    console.log('UI with Tabs initialized');
}

/**
 * Render the full UI structure
 */
function renderUI() {
    const sidebar = document.getElementById('sidebar');

    sidebar.innerHTML = `
        <div class="ui-minimal">
            <!-- Status -->
            <div class="status-bar">
                <span id="statusText">Ready</span>
            </div>
            
            <!-- Show Original Toggle -->
            <div class="original-toggle">
                <button id="showOriginalBtn" class="show-original-btn ${uiState.showOriginal ? 'active' : ''}">
                    👁️ ${uiState.showOriginal ? 'Show Makeup' : 'Show Original'}
                </button>
            </div>
            
            <!-- Zoom Toggle -->
            <div class="zoom-toggle">
                <button id="zoomFaceBtn" class="zoom-face-btn ${uiState.zoomToFace ? 'active' : ''}">
                    🔍 ${uiState.zoomToFace ? 'Full View' : 'Zoom Face'}
                </button>
            </div>

            <!-- Category Tabs -->
            <div class="tabs-row">
                <button class="tab-btn ${uiState.activeSection === 'lips' ? 'active' : ''}" data-tab="lips">
                    <span class="tab-icon">💋</span>
                    <span class="tab-label">Lips</span>
                    <label class="tab-switch">
                        <input type="checkbox" class="category-toggle" data-category="lips" ${uiState.lipsEnabled ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </button>
                <button class="tab-btn ${uiState.activeSection === 'eyes' ? 'active' : ''}" data-tab="eyes">
                    <span class="tab-icon">👁️</span>
                    <span class="tab-label">Eyes</span>
                    <label class="tab-switch">
                        <input type="checkbox" class="category-toggle" data-category="eyes" ${uiState.eyesEnabled ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </button>
                <button class="tab-btn ${uiState.activeSection === 'face' ? 'active' : ''}" data-tab="face">
                    <span class="tab-icon">✨</span>
                    <span class="tab-label">Face</span>
                    <label class="tab-switch">
                        <input type="checkbox" class="category-toggle" data-category="face" ${uiState.faceEnabled ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </button>
            </div>

            <!-- Detail Panel -->
            <div class="detail-panel" id="detailPanel">
                ${renderDetailPanel(uiState.activeSection)}
            </div>
            
            <div class="divider"></div>

            <!-- Preset Selector -->
            <div class="control-row">
                <label>Look</label>
                <select id="presetSelector">
                    <option value="natural">🌿 Natural</option>
                    <option value="glam">✨ Glam</option>
                    <option value="bridal">💒 Bridal</option>
                    <option value="party">🎉 Party</option>
                    <option value="none">❌ None</option>
                </select>
            </div>
            
            <div class="divider"></div>
            
            <!-- Export Buttons -->
            <div class="export-section">
                <label>Export Image</label>
                <div class="export-buttons">
                    <button id="exportPngBtn" class="export-btn">📥 PNG</button>
                    <button id="exportJpegBtn" class="export-btn">📥 JPEG</button>
                </div>
            </div>
        </div>
    `;

    statusElement = document.getElementById('statusText');

    // Re-attach listeners for the dynamically rendered detail panel
    setupDetailListeners();
}

/**
 * Render content for the active detail panel
 */
function renderDetailPanel(section) {
    if (section === 'lips') {
        return `
            <div class="detail-group">
                <label>Lipstick Color</label>
                <div class="color-picker-wrapper">
                    <input type="color" id="lipsColor" value="#CC3366">
                </div>
                <div class="color-swatches" data-target="lipsColor" data-effect="lipstick">
                    <button class="swatch" style="background:#CC3366" data-color="#CC3366" title="Classic Red"></button>
                    <button class="swatch" style="background:#E85D75" data-color="#E85D75" title="Rose Pink"></button>
                    <button class="swatch" style="background:#C4837A" data-color="#C4837A" title="Nude"></button>
                    <button class="swatch" style="background:#8B2252" data-color="#8B2252" title="Berry"></button>
                    <button class="swatch" style="background:#D4456A" data-color="#D4456A" title="Coral"></button>
                    <button class="swatch" style="background:#A0522D" data-color="#A0522D" title="Brown"></button>
                </div>
            </div>
            <div class="detail-group">
                <label>Opacity <span id="lipsOpacityValue">50%</span></label>
                <input type="range" id="lipsOpacity" min="0" max="100" value="50">
            </div>
            <div class="detail-group">
                <label>Blend Mode</label>
                <select id="lipsBlend">
                    <option value="soft-light">Natural</option>
                    <option value="multiply">Darken</option>
                    <option value="overlay">Vibrant</option>
                </select>
            </div>
        `;
    }
    else if (section === 'eyes') {
        return `
            <h4>Eyeliner</h4>
            <div class="detail-group">
                <label>Style</label>
                <select id="eyelinerStyle">
                    <option value="simple">Simple</option>
                    <option value="winged">Winged</option>
                    <option value="thick">Thick</option>
                </select>
            </div>
            <div class="detail-group">
                <label>Color</label>
                <div class="color-picker-wrapper">
                    <input type="color" id="eyelinerColor" value="#1a1a1a">
                </div>
                <div class="color-swatches" data-target="eyelinerColor" data-effect="eyeliner">
                    <button class="swatch" style="background:#1a1a1a" data-color="#1a1a1a" title="Black"></button>
                    <button class="swatch" style="background:#3D2314" data-color="#3D2314" title="Brown"></button>
                    <button class="swatch" style="background:#1E3A5F" data-color="#1E3A5F" title="Navy"></button>
                    <button class="swatch" style="background:#2F4F4F" data-color="#2F4F4F" title="Gray"></button>
                    <button class="swatch" style="background:#4B0082" data-color="#4B0082" title="Purple"></button>
                </div>
            </div>
            
            <div class="divider-small"></div>
            
            <h4>Eyeshadow</h4>
            <div class="detail-group">
                <label>Color</label>
                <div class="color-picker-wrapper">
                    <input type="color" id="eyeshadowColor" value="#8B4B8B">
                </div>
                <div class="color-swatches" data-target="eyeshadowColor" data-effect="eyeshadow">
                    <button class="swatch" style="background:#8B4B8B" data-color="#8B4B8B" title="Plum"></button>
                    <button class="swatch" style="background:#C9A86C" data-color="#C9A86C" title="Gold"></button>
                    <button class="swatch" style="background:#8B6B5B" data-color="#8B6B5B" title="Bronze"></button>
                    <button class="swatch" style="background:#2F4F4F" data-color="#2F4F4F" title="Smoky"></button>
                    <button class="swatch" style="background:#E8B4B8" data-color="#E8B4B8" title="Rose"></button>
                    <button class="swatch" style="background:#4169E1" data-color="#4169E1" title="Blue"></button>
                </div>
            </div>
            <div class="detail-group">
                <label>Opacity <span id="eyeshadowOpacityValue">35%</span></label>
                <input type="range" id="eyeshadowOpacity" min="0" max="100" value="35">
            </div>
        `;
    }
    else if (section === 'face') {
        return `
            <h4>Skin Smoothing</h4>
            <div class="detail-group">
                <label>Strength <span id="skinStrengthValue">30%</span></label>
                <input type="range" id="skinStrength" min="0" max="100" value="30">
            </div>
            
            <div class="divider-small"></div>
            
            <h4>Blush</h4>
            <div class="detail-group">
                <label>Color</label>
                <div class="color-picker-wrapper">
                    <input type="color" id="blushColor" value="#E8A0A0">
                </div>
                <div class="color-swatches" data-target="blushColor" data-effect="blush">
                    <button class="swatch" style="background:#E8A0A0" data-color="#E8A0A0" title="Soft Pink"></button>
                    <button class="swatch" style="background:#FFAA88" data-color="#FFAA88" title="Peach"></button>
                    <button class="swatch" style="background:#C87A8A" data-color="#C87A8A" title="Rose"></button>
                    <button class="swatch" style="background:#E8887A" data-color="#E8887A" title="Coral"></button>
                    <button class="swatch" style="background:#D4A5A5" data-color="#D4A5A5" title="Mauve"></button>
                </div>
            </div>
            <div class="detail-group">
                <label>Opacity <span id="blushOpacityValue">25%</span></label>
                <input type="range" id="blushOpacity" min="0" max="100" value="25">
            </div>
            
            <div class="divider-small"></div>
            
            <h4>Contour & Highlight</h4>
             <div class="detail-group">
                <label>Contour Color</label>
                <div class="color-picker-wrapper">
                    <input type="color" id="contourColor" value="#8B6B5B">
                </div>
                <div class="color-swatches" data-target="contourColor" data-effect="contour">
                    <button class="swatch" style="background:#8B6B5B" data-color="#8B6B5B" title="Medium"></button>
                    <button class="swatch" style="background:#6B4B3B" data-color="#6B4B3B" title="Deep"></button>
                    <button class="swatch" style="background:#A08070" data-color="#A08070" title="Light"></button>
                    <button class="swatch" style="background:#5C4033" data-color="#5C4033" title="Dark"></button>
                </div>
            </div>
        `;
    }
}

/**
 * Setup global and static event listeners
 */
function setupEventListeners() {
    // Show Original
    document.getElementById('showOriginalBtn')?.addEventListener('click', (e) => {
        uiState.showOriginal = !uiState.showOriginal;
        e.target.classList.toggle('active');
        e.target.innerHTML = `👁️ ${uiState.showOriginal ? 'Show Makeup' : 'Show Original'} `;
        if (appInstance) appInstance.setShowOriginal(uiState.showOriginal);
    });

    // Zoom to Face
    document.getElementById('zoomFaceBtn')?.addEventListener('click', (e) => {
        uiState.zoomToFace = !uiState.zoomToFace;
        e.target.classList.toggle('active');
        e.target.innerHTML = `🔍 ${uiState.zoomToFace ? 'Full View' : 'Zoom Face'}`;
        if (appInstance) appInstance.setZoomToFace(uiState.zoomToFace);
    });

    // Category Tabs (switching view)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Ignore if clicked on the switch itself
            if (e.target.closest('.tab-switch')) return;

            // Switch active tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            uiState.activeSection = btn.dataset.tab;

            // Re-render detail panel
            const panel = document.getElementById('detailPanel');
            panel.innerHTML = renderDetailPanel(uiState.activeSection);

            // Setup listeners for new elements
            setupDetailListeners();
        });
    });

    // Category Toggles (Enable/Disable)
    document.querySelectorAll('.category-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const category = e.target.dataset.category;
            const enabled = e.target.checked;

            if (category === 'lips') {
                uiState.lipsEnabled = enabled;
                appInstance?.setMakeup('lipstick', { enabled });
            } else if (category === 'eyes') {
                uiState.eyesEnabled = enabled;
                appInstance?.setMakeup('eyeliner', { enabled });
                appInstance?.setMakeup('eyeshadow', { enabled });
            } else if (category === 'face') {
                uiState.faceEnabled = enabled;
                appInstance?.setMakeup('blush', { enabled });
                appInstance?.setMakeup('contour', { enabled });
                appInstance?.setMakeup('highlight', { enabled });
                appInstance?.setMakeup('skinSmoothing', { enabled });
            }
        });
    });

    // Preset Selector
    document.getElementById('presetSelector')?.addEventListener('change', (e) => {
        applyPreset(e.target.value);
    });

    // Export Buttons
    document.getElementById('exportPngBtn')?.addEventListener('click', () => {
        if (appInstance) appInstance.exportImage('png');
    });
    document.getElementById('exportJpegBtn')?.addEventListener('click', () => {
        if (appInstance) appInstance.exportImage('jpeg', 0.92);
    });
}

/**
 * Setup listeners for dynamic detail panel elements
 */
function setupDetailListeners() {
    if (!appInstance) return;

    // LIPS
    if (uiState.activeSection === 'lips') {
        document.getElementById('lipsColor')?.addEventListener('input', (e) => {
            appInstance.setMakeup('lipstick', { color: e.target.value });
        });
        document.getElementById('lipsOpacity')?.addEventListener('input', (e) => {
            const val = e.target.value;
            document.getElementById('lipsOpacityValue').textContent = val + '%';
            appInstance.setMakeup('lipstick', { opacity: val / 100 });
        });
        document.getElementById('lipsBlend')?.addEventListener('change', (e) => {
            appInstance.setMakeup('lipstick', { blendMode: e.target.value });
        });
    }

    // EYES
    else if (uiState.activeSection === 'eyes') {
        document.getElementById('eyelinerStyle')?.addEventListener('change', (e) => {
            appInstance.setMakeup('eyeliner', { style: e.target.value });
        });
        document.getElementById('eyelinerColor')?.addEventListener('input', (e) => {
            appInstance.setMakeup('eyeliner', { color: e.target.value });
        });

        document.getElementById('eyeshadowColor')?.addEventListener('input', (e) => {
            appInstance.setMakeup('eyeshadow', { color: e.target.value });
        });
        document.getElementById('eyeshadowOpacity')?.addEventListener('input', (e) => {
            const val = e.target.value;
            document.getElementById('eyeshadowOpacityValue').textContent = val + '%';
            appInstance.setMakeup('eyeshadow', { opacity: val / 100 });
        });
    }

    // FACE
    else if (uiState.activeSection === 'face') {
        document.getElementById('skinStrength')?.addEventListener('input', (e) => {
            const val = e.target.value;
            document.getElementById('skinStrengthValue').textContent = val + '%';
            appInstance.setMakeup('skinSmoothing', { strength: val / 100 });
        });

        document.getElementById('blushColor')?.addEventListener('input', (e) => {
            appInstance.setMakeup('blush', { color: e.target.value });
        });
        document.getElementById('blushOpacity')?.addEventListener('input', (e) => {
            const val = e.target.value;
            document.getElementById('blushOpacityValue').textContent = val + '%';
            appInstance.setMakeup('blush', { opacity: val / 100 });
        });

        document.getElementById('contourColor')?.addEventListener('input', (e) => {
            appInstance.setMakeup('contour', { color: e.target.value });
        });
    }

    // Color Swatches (universal handler)
    document.querySelectorAll('.color-swatches').forEach(container => {
        const targetId = container.dataset.target;
        const effectName = container.dataset.effect;
        const colorInput = document.getElementById(targetId);

        container.querySelectorAll('.swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.dataset.color;
                if (colorInput) colorInput.value = color;
                if (appInstance) appInstance.setMakeup(effectName, { color });

                // Visual feedback - highlight selected swatch
                container.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
            });
        });
    });
}

/**
 * Apply preset configuration
 */
function applyPreset(presetName) {
    if (!appInstance) return;

    const success = applyPresetToApp(appInstance, presetName);

    if (success) {
        // Update toggles based on preset logic (simplified)
        // Ideally we would read back from app state
        if (presetName === 'none') {
            uiState.lipsEnabled = false;
            uiState.eyesEnabled = false;
            uiState.faceEnabled = false;
        } else {
            uiState.lipsEnabled = true;
            uiState.eyesEnabled = true;
            uiState.faceEnabled = true;
        }

        // Update checkbox states visually
        document.querySelectorAll('.category-toggle').forEach(cb => {
            const cat = cb.dataset.category;
            if (cat === 'lips') cb.checked = uiState.lipsEnabled;
            if (cat === 'eyes') cb.checked = uiState.eyesEnabled;
            if (cat === 'face') cb.checked = uiState.faceEnabled;
        });

        // Force refresh of detail panel to show new preset values (colors etc would need sync)
        // For now just re-render to ensure consistency
        const panel = document.getElementById('detailPanel');
        panel.innerHTML = renderDetailPanel(uiState.activeSection);
        setupDetailListeners();
    }
}

export function showLoader(message = 'Processing...') {
    const loader = document.getElementById('imageLoader');
    if (loader) {
        loader.querySelector('.loader-text').textContent = message;
        loader.style.display = 'flex';
    }
}

export function hideLoader() {
    const loader = document.getElementById('imageLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

export function updateStatus(message) {
    if (statusElement) statusElement.textContent = message;
    console.log(`Status: ${message} `);
}

export default { initUI, updateStatus, showLoader, hideLoader };
