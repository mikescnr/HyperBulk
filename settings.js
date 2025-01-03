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
    const counterTextColor = document.getElementById('counterTextColor').value;

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

// Load settings when the settings page is loaded
loadSettings();
