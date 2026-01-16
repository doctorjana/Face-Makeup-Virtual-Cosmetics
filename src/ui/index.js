/**
 * UI Module
 * 
 * User interface controls for makeup application.
 * Handles sidebar controls, color pickers, sliders, etc.
 */

import { DEBUG, setDebug } from '../render/index.js';
import { LIPSTICK_PRESETS, BLEND_MODES } from '../effects/lipstick.js';

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
        
        <div class="ui-section" id="makeupControls">
            <h3>Lipstick</h3>
            
            <label class="toggle-label">
                <input type="checkbox" id="lipstickEnabled" checked>
                <span>Enable Lipstick</span>
            </label>
            
            <div class="control-group">
                <label>Color</label>
                <div class="color-picker-row">
                    <input type="color" id="lipstickColor" value="#CC3366">
                    <div class="color-presets" id="colorPresets"></div>
                </div>
            </div>
            
            <div class="control-group">
                <label>Opacity <span id="opacityValue">50%</span></label>
                <input type="range" id="lipstickOpacity" min="0" max="100" value="50">
            </div>
            
            <div class="control-group">
                <label>Intensity <span id="intensityValue">100%</span></label>
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
    `;

    statusElement = document.getElementById('statusText');

    // Setup event listeners
    setupEventListeners();

    // Setup color presets
    setupColorPresets();

    console.log('UI module initialized');
}

function setupEventListeners() {
    // Debug toggle
    document.getElementById('debugToggle').addEventListener('change', (e) => {
        if (appInstance) {
            appInstance.setDebugMode(e.target.checked);
        }
    });

    // Lipstick enabled toggle
    document.getElementById('lipstickEnabled').addEventListener('change', (e) => {
        if (appInstance) {
            appInstance.setMakeup('lipstick', { enabled: e.target.checked });
        }
    });

    // Lipstick color
    document.getElementById('lipstickColor').addEventListener('input', (e) => {
        if (appInstance) {
            appInstance.setMakeup('lipstick', { color: e.target.value });
        }
    });

    // Lipstick opacity
    document.getElementById('lipstickOpacity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('opacityValue').textContent = `${value}%`;
        if (appInstance) {
            appInstance.setMakeup('lipstick', { opacity: value / 100 });
        }
    });

    // Lipstick intensity
    document.getElementById('lipstickIntensity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('intensityValue').textContent = `${value}%`;
        if (appInstance) {
            appInstance.setMakeup('lipstick', { intensity: value / 100 });
        }
    });

    // Blend mode
    document.getElementById('lipstickBlendMode').addEventListener('change', (e) => {
        if (appInstance) {
            appInstance.setMakeup('lipstick', { blendMode: e.target.value });
        }
    });
}

function setupColorPresets() {
    const presetsContainer = document.getElementById('colorPresets');
    const colorInput = document.getElementById('lipstickColor');

    LIPSTICK_PRESETS.forEach(preset => {
        const swatch = document.createElement('button');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = preset.color;
        swatch.title = preset.name;
        swatch.addEventListener('click', () => {
            colorInput.value = preset.color;
            if (appInstance) {
                appInstance.setMakeup('lipstick', { color: preset.color });
            }
        });
        presetsContainer.appendChild(swatch);
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
    if (state.lipstick) {
        document.getElementById('lipstickEnabled').checked = state.lipstick.enabled;
        document.getElementById('lipstickColor').value = state.lipstick.color;
        document.getElementById('lipstickOpacity').value = state.lipstick.opacity * 100;
        document.getElementById('lipstickIntensity').value = state.lipstick.intensity * 100;
        document.getElementById('lipstickBlendMode').value = state.lipstick.blendMode;
    }
}

export default { initUI, updateStatus, updateUI };
