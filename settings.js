document.addEventListener('DOMContentLoaded', () => {
    // Load current settings
    chrome.storage.sync.get(['boxColor', 'counterColor', 'triggerKey'], (data) => {
        document.getElementById('boxColor').value = data.boxColor || '#ff0000';
        document.getElementById('counterColor').value = data.counterColor || '#00ff00';
        document.getElementById('triggerKey').value = data.triggerKey || 'Alt';
    });

    // Save new settings
    document.getElementById('saveSettings').addEventListener('click', () => {
        const boxColor = document.getElementById('boxColor').value;
        const counterColor = document.getElementById('counterColor').value;
        const triggerKey = document.getElementById('triggerKey').value;

        chrome.storage.sync.set({ boxColor, counterColor, triggerKey }, () => {
            alert('Settings saved!');
        });
    });
});
