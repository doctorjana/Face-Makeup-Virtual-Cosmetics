/**
 * UI Module
 * 
 * User interface controls for makeup application.
 * Handles sidebar controls, color pickers, sliders, etc.
 */

import { DEBUG, setDebug } from '../render/index.js';
import { LIPSTICK_PRESETS, BLEND_MODES } from '../effects/lipstick.js';
import { EYELINER_STYLES, EYELINER_COLORS } from '../effects/eyeliner.js';
import { EYESHADOW_PRESETS } from '../effects/eyeshadow.js';

let statusElement = null;
let appInstance = null;

export function initUI(app) {
    appInstance = app;
    const sidebar = document.getElementById('sidebar');

    sidebar.innerHTML = `
        <div class="ui-section">
            <h3>Status</h3>
            <p class="status-text" id="statusText">Initializing...</p>
        </div>
        
        <div class="ui-section">
            <h3>Debug</h3>
            <label class="toggle-label">
                <input type="checkbox" id="debugToggle" ${DEBUG ? 'checked' : ''}>
                <span>Show Landmarks</span>
            </label>
        </div>
        
        <!-- Eyeshadow Controls -->
        <div class="ui-section collapsible" id="eyeshadowSection">
            <h3 class="section-header" data-target="eyeshadowControls">
                Eyeshadow
                <span class="collapse-icon">▼</span>
            </h3>
            <div class="section-content" id="eyeshadowControls">
                <label class="toggle-label">
                    <input type="checkbox" id="eyeshadowEnabled">
                    <span>Enable Eyeshadow</span>
                </label>
                
                <div class="control-group">
                    <label>Color</label>
                    <div class="color-picker-row">
                        <input type="color" id="eyeshadowColor" value="#8B4B8B">
                        <div class="color-presets" id="eyeshadowPresets"></div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>Opacity <span id="eyeshadowOpacityValue">35%</span></label>
                    <input type="range" id="eyeshadowOpacity" min="0" max="100" value="35">
                </div>
                
                <div class="control-group">
                    <label>Spread <span id="eyeshadowSpreadValue">100%</span></label>
                    <input type="range" id="eyeshadowSpread" min="30" max="200" value="100">
                </div>
                
                <label class="toggle-label">
                    <input type="checkbox" id="eyeshadowShimmer">
                    <span>Shimmer Effect</span>
                </label>
            </div>
        </div>
        
        <!-- Eyeliner Controls -->
        <div class="ui-section collapsible" id="eyelinerSection">
            <h3 class="section-header" data-target="eyelinerControls">
                Eyeliner
                <span class="collapse-icon">▼</span>
            </h3>
            <div class="section-content" id="eyelinerControls">
                <label class="toggle-label">
                    <input type="checkbox" id="eyelinerEnabled" checked>
                    <span>Enable Eyeliner</span>
                </label>
                
                <div class="control-group">
                    <label>Color</label>
                    <div class="color-picker-row">
                        <input type="color" id="eyelinerColor" value="#1a1a1a">
                        <div class="color-presets" id="eyelinerPresets"></div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>Thickness <span id="eyelinerThicknessValue">2px</span></label>
                    <input type="range" id="eyelinerThickness" min="1" max="8" value="2">
                </div>
                
                <div class="control-group">
                    <label>Opacity <span id="eyelinerOpacityValue">85%</span></label>
                    <input type="range" id="eyelinerOpacity" min="0" max="100" value="85">
                </div>
                
                <div class="control-group">
                    <label>Style</label>
                    <select id="eyelinerStyle">
                        ${EYELINER_STYLES.map(s =>
        `<option value="${s.value}" ${s.value === 'classic' ? 'selected' : ''}>${s.label}</option>`
    ).join('')}
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Lipstick Controls -->
        <div class="ui-section collapsible" id="lipstickSection">
            <h3 class="section-header" data-target="lipstickControls">
                Lipstick
                <span class="collapse-icon">▼</span>
            </h3>
            <div class="section-content" id="lipstickControls">
                <label class="toggle-label">
                    <input type="checkbox" id="lipstickEnabled" checked>
                    <span>Enable Lipstick</span>
                </label>
                
                <div class="control-group">
                    <label>Color</label>
                    <div class="color-picker-row">
                        <input type="color" id="lipstickColor" value="#CC3366">
                        <div class="color-presets" id="lipstickPresets"></div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>Opacity <span id="lipstickOpacityValue">50%</span></label>
                    <input type="range" id="lipstickOpacity" min="0" max="100" value="50">
                </div>
                
                <div class="control-group">
                    <label>Intensity <span id="lipstickIntensityValue">100%</span></label>
                    <input type="range" id="lipstickIntensity" min="0" max="100" value="100">
                </div>
                
                <div class="control-group">
                    <label>Blend Mode</label>
                    <select id="lipstickBlendMode">
                        ${BLEND_MODES.map(m =>
        `<option value="${m.value}" ${m.value === 'multiply' ? 'selected' : ''}>${m.label}</option>`
    ).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;

    statusElement = document.getElementById('statusText');

    // Setup event listeners
    setupEventListeners();

    // Setup color presets
    setupColorPresets();

    // Setup collapsible sections
    setupCollapsibles();

    console.log('UI module initialized');
}

function setupEventListeners() {
    // Debug toggle
    document.getElementById('debugToggle').addEventListener('change', (e) => {
        if (appInstance) {
            appInstance.setDebugMode(e.target.checked);
        }
    });

    // === EYESHADOW ===
    document.getElementById('eyeshadowEnabled').addEventListener('change', (e) => {
        if (appInstance) appInstance.setMakeup('eyeshadow', { enabled: e.target.checked });
    });

    document.getElementById('eyeshadowColor').addEventListener('input', (e) => {
        if (appInstance) appInstance.setMakeup('eyeshadow', { color: e.target.value });
    });

    document.getElementById('eyeshadowOpacity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('eyeshadowOpacityValue').textContent = `${value}%`;
        if (appInstance) appInstance.setMakeup('eyeshadow', { opacity: value / 100 });
    });

    document.getElementById('eyeshadowSpread').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('eyeshadowSpreadValue').textContent = `${value}%`;
        if (appInstance) appInstance.setMakeup('eyeshadow', { spread: value / 100 });
    });

    document.getElementById('eyeshadowShimmer').addEventListener('change', (e) => {
        if (appInstance) appInstance.setMakeup('eyeshadow', { shimmer: e.target.checked });
    });

    // === EYELINER ===
    document.getElementById('eyelinerEnabled').addEventListener('change', (e) => {
        if (appInstance) appInstance.setMakeup('eyeliner', { enabled: e.target.checked });
    });

    document.getElementById('eyelinerColor').addEventListener('input', (e) => {
        if (appInstance) appInstance.setMakeup('eyeliner', { color: e.target.value });
    });

    document.getElementById('eyelinerThickness').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('eyelinerThicknessValue').textContent = `${value}px`;
        if (appInstance) appInstance.setMakeup('eyeliner', { thickness: value });
    });

    document.getElementById('eyelinerOpacity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('eyelinerOpacityValue').textContent = `${value}%`;
        if (appInstance) appInstance.setMakeup('eyeliner', { opacity: value / 100 });
    });

    document.getElementById('eyelinerStyle').addEventListener('change', (e) => {
        if (appInstance) appInstance.setMakeup('eyeliner', { style: e.target.value });
    });

    // === LIPSTICK ===
    document.getElementById('lipstickEnabled').addEventListener('change', (e) => {
        if (appInstance) appInstance.setMakeup('lipstick', { enabled: e.target.checked });
    });

    document.getElementById('lipstickColor').addEventListener('input', (e) => {
        if (appInstance) appInstance.setMakeup('lipstick', { color: e.target.value });
    });

    document.getElementById('lipstickOpacity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('lipstickOpacityValue').textContent = `${value}%`;
        if (appInstance) appInstance.setMakeup('lipstick', { opacity: value / 100 });
    });

    document.getElementById('lipstickIntensity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('lipstickIntensityValue').textContent = `${value}%`;
        if (appInstance) appInstance.setMakeup('lipstick', { intensity: value / 100 });
    });

    document.getElementById('lipstickBlendMode').addEventListener('change', (e) => {
        if (appInstance) appInstance.setMakeup('lipstick', { blendMode: e.target.value });
    });
}

function setupColorPresets() {
    // Eyeshadow presets
    const eyeshadowContainer = document.getElementById('eyeshadowPresets');
    const eyeshadowColorInput = document.getElementById('eyeshadowColor');
    EYESHADOW_PRESETS.forEach(preset => {
        const swatch = createColorSwatch(preset, eyeshadowColorInput, 'eyeshadow');
        eyeshadowContainer.appendChild(swatch);
    });

    // Eyeliner presets
    const eyelinerContainer = document.getElementById('eyelinerPresets');
    const eyelinerColorInput = document.getElementById('eyelinerColor');
    EYELINER_COLORS.forEach(preset => {
        const swatch = createColorSwatch(preset, eyelinerColorInput, 'eyeliner');
        eyelinerContainer.appendChild(swatch);
    });

    // Lipstick presets
    const lipstickContainer = document.getElementById('lipstickPresets');
    const lipstickColorInput = document.getElementById('lipstickColor');
    LIPSTICK_PRESETS.forEach(preset => {
        const swatch = createColorSwatch(preset, lipstickColorInput, 'lipstick');
        lipstickContainer.appendChild(swatch);
    });
}

function createColorSwatch(preset, colorInput, effectName) {
    const swatch = document.createElement('button');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = preset.color;
    swatch.title = preset.name;
    swatch.addEventListener('click', () => {
        colorInput.value = preset.color;
        if (appInstance) {
            appInstance.setMakeup(effectName, { color: preset.color });
        }
    });
    return swatch;
}

function setupCollapsibles() {
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.target;
            const content = document.getElementById(targetId);
            const icon = header.querySelector('.collapse-icon');

            content.classList.toggle('collapsed');
            icon.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
        });
    });
}

export function updateStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log(`Status: ${message}`);
}

export function updateUI(state) {
    // Update UI elements based on application state
}

export default { initUI, updateStatus, updateUI };
