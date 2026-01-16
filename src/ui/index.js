/**
 * UI Module
 * 
 * User interface controls for makeup application.
 */

import { DEBUG, setDebug } from '../render/index.js';
import { LIPSTICK_PRESETS, BLEND_MODES } from '../effects/lipstick.js';
import { EYELINER_STYLES, EYELINER_COLORS } from '../effects/eyeliner.js';
import { EYESHADOW_PRESETS } from '../effects/eyeshadow.js';
import { BLUSH_PRESETS } from '../effects/blush.js';
import { CONTOUR_PRESETS } from '../effects/contour.js';
import { HIGHLIGHT_PRESETS } from '../effects/highlight.js';

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
        </div>
        
        <!-- Skin Smoothing -->
        <div class="ui-section collapsible">
            <h3 class="section-header" data-target="skinSmoothingControls">
                Skin Smoothing <span class="collapse-icon">▼</span>
            </h3>
            <div class="section-content" id="skinSmoothingControls">
                <label class="toggle-label">
                    <input type="checkbox" id="skinSmoothingEnabled">
                    <span>Enable Skin Smoothing</span>
                </label>
                <div class="control-group">
                    <label>Strength <span id="skinSmoothingStrengthValue">30%</span></label>
                    <input type="range" id="skinSmoothingStrength" min="0" max="100" value="30">
                </div>
                <div class="control-group">
                    <label>Preserve Texture <span id="skinSmoothingTextureValue">50%</span></label>
                    <input type="range" id="skinSmoothingTexture" min="0" max="100" value="50">
                </div>
            </div>
        </div>
        
        <!-- Face Effects -->
        <div class="ui-section collapsible">
            <h3 class="section-header" data-target="blushControls">
                Blush <span class="collapse-icon">▼</span>
            </h3>
            <div class="section-content" id="blushControls">
                <label class="toggle-label">
                    <input type="checkbox" id="blushEnabled">
                    <span>Enable Blush</span>
                </label>
                <div class="control-group">
                    <label>Color</label>
                    <div class="color-picker-row">
                        <input type="color" id="blushColor" value="#E8A0A0">
                        <div class="color-presets" id="blushPresets"></div>
                    </div>
                </div>
                <div class="control-group">
                    <label>Opacity <span id="blushOpacityValue">25%</span></label>
                    <input type="range" id="blushOpacity" min="0" max="100" value="25">
                </div>
            </div>
        </div>
        
        <div class="ui-section collapsible">
            <h3 class="section-header" data-target="contourControls">
                Contour <span class="collapse-icon">▼</span>
            </h3>
            <div class="section-content" id="contourControls">
                <label class="toggle-label">
                    <input type="checkbox" id="contourEnabled">
                    <span>Enable Contour</span>
                </label>
                <div class="control-group">
                    <label>Color</label>
                    <div class="color-picker-row">
                        <input type="color" id="contourColor" value="#8B6B5B">
                        <div class="color-presets" id="contourPresets"></div>
                    </div>
                </div>
                <div class="control-group">
                    <label>Opacity <span id="contourOpacityValue">20%</span></label>
                    <input type="range" id="contourOpacity" min="0" max="100" value="20">
                </div>
            </div>
        </div>
        
        <div class="ui-section collapsible">
            <h3 class="section-header" data-target="highlightControls">
                Highlight <span class="collapse-icon">▼</span>
            </h3>
            <div class="section-content" id="highlightControls">
                <label class="toggle-label">
                    <input type="checkbox" id="highlightEnabled">
                    <span>Enable Highlight</span>
                </label>
                <div class="control-group">
                    <label>Color</label>
                    <div class="color-picker-row">
                        <input type="color" id="highlightColor" value="#FFFFFF">
                        <div class="color-presets" id="highlightPresets"></div>
                    </div>
                </div>
                <div class="control-group">
                    <label>Opacity <span id="highlightOpacityValue">15%</span></label>
                    <input type="range" id="highlightOpacity" min="0" max="100" value="15">
                </div>
            </div>
        </div>
        
        <!-- Eye Effects -->
        <div class="ui-section collapsible">
            <h3 class="section-header" data-target="eyeshadowControls">
                Eyeshadow <span class="collapse-icon">▼</span>
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
            </div>
        </div>
        
        <div class="ui-section collapsible">
            <h3 class="section-header" data-target="eyelinerControls">
                Eyeliner <span class="collapse-icon">▼</span>
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
                    <label>Style</label>
                    <select id="eyelinerStyle">
                        ${EYELINER_STYLES.map(s =>
        `<option value="${s.value}">${s.label}</option>`
    ).join('')}
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Lip Effects -->
        <div class="ui-section collapsible">
            <h3 class="section-header" data-target="lipstickControls">
                Lipstick <span class="collapse-icon">▼</span>
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
    setupEventListeners();
    setupColorPresets();
    setupCollapsibles();
    console.log('UI module initialized');
}

function setupEventListeners() {
    // Debug toggle
    document.getElementById('debugToggle').addEventListener('change', (e) => {
        if (appInstance) appInstance.setDebugMode(e.target.checked);
    });

    // Skin Smoothing
    document.getElementById('skinSmoothingEnabled')?.addEventListener('change', (e) => {
        if (appInstance) appInstance.setMakeup('skinSmoothing', { enabled: e.target.checked });
    });

    document.getElementById('skinSmoothingStrength')?.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('skinSmoothingStrengthValue').textContent = `${value}%`;
        if (appInstance) appInstance.setMakeup('skinSmoothing', { strength: value / 100 });
    });

    document.getElementById('skinSmoothingTexture')?.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('skinSmoothingTextureValue').textContent = `${value}%`;
        if (appInstance) appInstance.setMakeup('skinSmoothing', { preserveTexture: value / 100 });
    });

    // Blush
    setupEffectListeners('blush', ['enabled', 'color', 'opacity']);

    // Contour
    setupEffectListeners('contour', ['enabled', 'color', 'opacity']);

    // Highlight
    setupEffectListeners('highlight', ['enabled', 'color', 'opacity']);

    // Eyeshadow
    setupEffectListeners('eyeshadow', ['enabled', 'color', 'opacity']);

    // Eyeliner
    setupEffectListeners('eyeliner', ['enabled', 'color', 'thickness', 'style']);

    // Lipstick
    setupEffectListeners('lipstick', ['enabled', 'color', 'opacity', 'blendMode']);
}

function setupEffectListeners(effectName, controls) {
    const prefix = effectName;

    if (controls.includes('enabled')) {
        document.getElementById(`${prefix}Enabled`)?.addEventListener('change', (e) => {
            if (appInstance) appInstance.setMakeup(effectName, { enabled: e.target.checked });
        });
    }

    if (controls.includes('color')) {
        document.getElementById(`${prefix}Color`)?.addEventListener('input', (e) => {
            if (appInstance) appInstance.setMakeup(effectName, { color: e.target.value });
        });
    }

    if (controls.includes('opacity')) {
        document.getElementById(`${prefix}Opacity`)?.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const valueEl = document.getElementById(`${prefix}OpacityValue`);
            if (valueEl) valueEl.textContent = `${value}%`;
            if (appInstance) appInstance.setMakeup(effectName, { opacity: value / 100 });
        });
    }

    if (controls.includes('thickness')) {
        document.getElementById(`${prefix}Thickness`)?.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const valueEl = document.getElementById(`${prefix}ThicknessValue`);
            if (valueEl) valueEl.textContent = `${value}px`;
            if (appInstance) appInstance.setMakeup(effectName, { thickness: value });
        });
    }

    if (controls.includes('style')) {
        document.getElementById(`${prefix}Style`)?.addEventListener('change', (e) => {
            if (appInstance) appInstance.setMakeup(effectName, { style: e.target.value });
        });
    }

    if (controls.includes('blendMode')) {
        document.getElementById(`${prefix}BlendMode`)?.addEventListener('change', (e) => {
            if (appInstance) appInstance.setMakeup(effectName, { blendMode: e.target.value });
        });
    }
}

function setupColorPresets() {
    const presetConfigs = [
        { id: 'blushPresets', colorId: 'blushColor', effect: 'blush', presets: BLUSH_PRESETS },
        { id: 'contourPresets', colorId: 'contourColor', effect: 'contour', presets: CONTOUR_PRESETS },
        { id: 'highlightPresets', colorId: 'highlightColor', effect: 'highlight', presets: HIGHLIGHT_PRESETS },
        { id: 'eyeshadowPresets', colorId: 'eyeshadowColor', effect: 'eyeshadow', presets: EYESHADOW_PRESETS },
        { id: 'eyelinerPresets', colorId: 'eyelinerColor', effect: 'eyeliner', presets: EYELINER_COLORS },
        { id: 'lipstickPresets', colorId: 'lipstickColor', effect: 'lipstick', presets: LIPSTICK_PRESETS }
    ];

    presetConfigs.forEach(({ id, colorId, effect, presets }) => {
        const container = document.getElementById(id);
        const colorInput = document.getElementById(colorId);
        if (!container || !colorInput) return;

        presets.forEach(preset => {
            const swatch = document.createElement('button');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = preset.color;
            swatch.title = preset.name;
            swatch.addEventListener('click', () => {
                colorInput.value = preset.color;
                if (appInstance) appInstance.setMakeup(effect, { color: preset.color });
            });
            container.appendChild(swatch);
        });
    });
}

function setupCollapsibles() {
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.target;
            const content = document.getElementById(targetId);
            const icon = header.querySelector('.collapse-icon');
            if (content) {
                content.classList.toggle('collapsed');
                if (icon) icon.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
            }
        });
    });
}

export function updateStatus(message) {
    if (statusElement) statusElement.textContent = message;
    console.log(`Status: ${message}`);
}

export default { initUI, updateStatus };
