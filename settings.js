// Default color constants and new maxLinks setting
const DEFAULTS = {
    selectionBoxColor: 'rgba(0, 120, 215, 0.2)',  // Semi-transparent blue
    borderColor: '#005a8c',                      // Darker blue border
    counterBgColor: '#0078d7',                   // Blue background for counter
    counterTextColor: '#ffffff',                 // White text for the counter
    selectionBoxTransparency: 20,                 // Default transparency 20%
    maxLinks: 10                                 // Default max links to 10
};

// Function to load settings from chrome storage and apply them
function loadSettings() {
    chrome.storage.sync.get(DEFAULTS, (settings) => {
        // Apply the loaded settings to the inputs
        document.getElementById('selectionBoxColor').value = rgbToHex(settings.selectionBoxColor);
        document.getElementById('borderColor').value = settings.borderColor;
        document.getElementById('counterBgColor').value = settings.counterBgColor;
        document.getElementById('selectionBoxTransparency').value = settings.selectionBoxTransparency;
        document.getElementById('transparencyValue').textContent = `${settings.selectionBoxTransparency}%`;
        document.getElementById('maxLinks').value = settings.maxLinks; // Load maxLinks value

        console.log('Loaded settings:', settings);
    });
}

// Function to save the settings to chrome storage
document.getElementById('save-button').addEventListener('click', () => {
    let selectionBoxColor = document.getElementById('selectionBoxColor').value;
    const borderColor = document.getElementById('borderColor').value;
    const counterBgColor = document.getElementById('counterBgColor').value;
    const selectionBoxTransparency = document.getElementById('selectionBoxTransparency').value;
    const maxLinks = document.getElementById('maxLinks').value; // Get maxLinks value

    // Apply transparency to the selection box color
    selectionBoxColor = hexToRgba(selectionBoxColor, selectionBoxTransparency / 100);

    let counterTextColor = '#ffffff'; // Default white text

    // Check if automatic text color is enabled based on counter background color
    if (counterBgColor) {
        const bgColor = hexToRgb(counterBgColor);
        if (bgColor) {
            const brightness = (0.2126 * bgColor.r + 0.7152 * bgColor.g + 0.0722 * bgColor.b);
            counterTextColor = brightness > 128 ? '#000000' : '#ffffff'; // Black for light, white for dark
        }
    }

    chrome.storage.sync.set(
        {
            selectionBoxColor,
            borderColor,
            counterBgColor,
            counterTextColor,
            selectionBoxTransparency,
            maxLinks // Save maxLinks value
        },
        () => {
            console.log('Settings saved:', {
                selectionBoxColor,
                borderColor,
                counterBgColor,
                counterTextColor,
                selectionBoxTransparency,
                maxLinks
            });
        }
    );
});

// Function to reset the settings to defaults
document.getElementById('reset-button').addEventListener('click', () => {
    // Apply default values
    document.getElementById('selectionBoxColor').value = rgbToHex(DEFAULTS.selectionBoxColor);
    document.getElementById('borderColor').value = DEFAULTS.borderColor;
    document.getElementById('counterBgColor').value = DEFAULTS.counterBgColor;
    document.getElementById('selectionBoxTransparency').value = DEFAULTS.selectionBoxTransparency;
    document.getElementById('transparencyValue').textContent = `${DEFAULTS.selectionBoxTransparency}%`;
    document.getElementById('maxLinks').value = DEFAULTS.maxLinks; // Restore maxLinks default

    // Save defaults to storage
    chrome.storage.sync.set(DEFAULTS, () => {
        console.log('Defaults restored');
    });
});

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    let r, g, b;

    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return { r, g, b };
}

// Helper function to convert rgba color to hex for the input
function rgbToHex(rgba) {
    if (!rgba || !rgba.startsWith('rgba')) return rgba;
    const rgbaValues = rgba.match(/\d+/g); // Extract numbers from rgba
    const r = parseInt(rgbaValues[0]);
    const g = parseInt(rgbaValues[1]);
    const b = parseInt(rgbaValues[2]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Helper function to convert HEX to RGBA, applying transparency
function hexToRgba(hex, transparency) {
    const rgb = hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency})`;
}

// Update transparency value display
document.getElementById('selectionBoxTransparency').addEventListener('input', (e) => {
    const transparencyValue = e.target.value;
    document.getElementById('transparencyValue').textContent = `${transparencyValue}%`;
});

// Load settings when the settings page is loaded
loadSettings();
