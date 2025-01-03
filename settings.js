// Function to load settings from chrome storage and apply them
function loadSettings() {
    chrome.storage.sync.get(
        {
            selectionBoxColor: '#0078d7',  // Default selection box color
            borderColor: '#005a8c',        // Default border color
            counterBgColor: '#0078d7',     // Default counter background color
            counterTextColor: '#ffffff'    // Default counter text color
        },
        (settings) => {
            // Apply the loaded settings to the inputs
            document.getElementById('selectionBoxColor').value = settings.selectionBoxColor;
            document.getElementById('borderColor').value = settings.borderColor;
            document.getElementById('counterBgColor').value = settings.counterBgColor;
            document.getElementById('counterTextColor').value = settings.counterTextColor;

            console.log('Loaded settings:', settings);
        }
    );
}

// Function to save the settings to chrome storage
document.getElementById('save-button').addEventListener('click', () => {
    const selectionBoxColor = document.getElementById('selectionBoxColor').value;
    const borderColor = document.getElementById('borderColor').value;
    const counterBgColor = document.getElementById('counterBgColor').value;
    let counterTextColor = document.getElementById('counterTextColor').value;

    // Check if automatic text color is enabled based on counter background color
    if (counterBgColor) {
        const bgColor = hexToRgb(counterBgColor);
        if (bgColor) {
            const brightness = (0.2126 * bgColor.r + 0.7152 * bgColor.g + 0.0722 * bgColor.b);
            counterTextColor = brightness > 128 ? '#000000' : '#ffffff';
        }
    }

    chrome.storage.sync.set(
        {
            selectionBoxColor,
            borderColor,
            counterBgColor,
            counterTextColor
        },
        () => {
            console.log('Settings saved:', {
                selectionBoxColor,
                borderColor,
                counterBgColor,
                counterTextColor
            });
        }
    );
});

// Function to reset the settings to defaults
document.getElementById('reset-button').addEventListener('click', () => {
    const defaultSettings = {
        selectionBoxColor: '#0078d7',
        borderColor: '#005a8c',
        counterBgColor: '#0078d7',
        counterTextColor: '#ffffff'
    };

    // Apply default values
    document.getElementById('selectionBoxColor').value = defaultSettings.selectionBoxColor;
    document.getElementById('borderColor').value = defaultSettings.borderColor;
    document.getElementById('counterBgColor').value = defaultSettings.counterBgColor;
    document.getElementById('counterTextColor').value = defaultSettings.counterTextColor;

    // Save defaults to storage
    chrome.storage.sync.set(defaultSettings, () => {
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

// Load settings when the settings page is loaded
loadSettings();
