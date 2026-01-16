/**
 * UI Module
 * 
 * User interface controls for makeup application.
 * Handles sidebar controls, color pickers, sliders, etc.
 */

import { DEBUG, setDebug } from '../render/index.js';

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
            <div class="legend" id="debugLegend">
                <div class="legend-item"><span class="legend-color" style="background: #FF4466"></span> Lips</div>
                <div class="legend-item"><span class="legend-color" style="background: #44AAFF"></span> Eyes</div>
                <div class="legend-item"><span class="legend-color" style="background: #FFAA44"></span> Eyebrows</div>
                <div class="legend-item"><span class="legend-color" style="background: #AAFFAA"></span> Face Outline</div>
                <div class="legend-item"><span class="legend-color" style="background: #FFFF66"></span> Nose</div>
                <div class="legend-item"><span class="legend-color" style="background: #00FFAA"></span> Iris</div>
            </div>
        </div>
        
        <div class="ui-section">
            <h3>Makeup Controls</h3>
            <p class="ui-placeholder">Detect a face to enable controls</p>
        </div>
    `;

    statusElement = document.getElementById('statusText');

    // Setup debug toggle
    const debugToggle = document.getElementById('debugToggle');
    debugToggle.addEventListener('change', (e) => {
        if (appInstance) {
            appInstance.setDebugMode(e.target.checked);
        }
    });

    console.log('UI module initialized');
}

export function updateStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log(`Status: ${message}`);
}

export function updateUI(state) {
    // TODO: Update UI based on application state
}

export default { initUI, updateStatus, updateUI };
