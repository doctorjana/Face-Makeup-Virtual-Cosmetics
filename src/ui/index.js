/**
 * UI Module
 * 
 * User interface controls for makeup application.
 * Handles sidebar controls, color pickers, sliders, etc.
 */

let statusElement = null;

export function initUI() {
    const sidebar = document.getElementById('sidebar');

    sidebar.innerHTML = `
        <div class="ui-section">
            <h3>Status</h3>
            <p class="status-text" id="statusText">Initializing...</p>
        </div>
        <div class="ui-section">
            <h3>Makeup Controls</h3>
            <p class="ui-placeholder">Detect a face to enable controls</p>
        </div>
    `;

    statusElement = document.getElementById('statusText');
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
