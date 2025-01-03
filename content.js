let isDragging = false;
let startX, startY, selectionBox, linkCountDisplay;
const defaultSelectionBoxColor = 'rgba(0, 120, 215, 0.2)';
const defaultBorderColor = 'rgba(0, 120, 215, 0.7)';
const defaultCounterBgColor = '#0078d7';
const defaultCounterTextColor = '#fff';

// Function to fetch colors from chrome.storage
function getColorsFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(
            {
                selectionBoxColor: defaultSelectionBoxColor,
                borderColor: defaultBorderColor,
                counterBgColor: defaultCounterBgColor,
                counterTextColor: defaultCounterTextColor
            },
            (settings) => {
                resolve(settings);
            }
        );
    });
}

document.addEventListener('mousedown', (e) => {
    if (e.altKey && e.button === 0) { // ALT + Left Click
        isDragging = true;
        startX = e.pageX;
        startY = e.pageY;

        // Prevent default behavior (like text selection)
        e.preventDefault();

        // Fetch the colors before creating the box
        getColorsFromStorage().then((settings) => {
            const selectionBoxColor = settings.selectionBoxColor;
            const borderColor = settings.borderColor;
            const counterBgColor = settings.counterBgColor;
            const counterTextColor = settings.counterTextColor;

            // Create the selection box
            selectionBox = document.createElement('div');
            selectionBox.style.position = 'absolute';
            selectionBox.style.background = selectionBoxColor;
            selectionBox.style.border = `2px dashed ${borderColor}`;
            selectionBox.style.zIndex = '10000';
            document.body.appendChild(selectionBox);

            // Create the link count display
            linkCountDisplay = document.createElement('div');
            linkCountDisplay.style.position = 'absolute';
            linkCountDisplay.style.background = counterBgColor;
            linkCountDisplay.style.color = counterTextColor;
            linkCountDisplay.style.padding = '2px 5px';
            linkCountDisplay.style.borderRadius = '3px';
            linkCountDisplay.style.fontSize = '12px';
            linkCountDisplay.style.fontWeight = 'bold';
            linkCountDisplay.style.pointerEvents = 'none';
            linkCountDisplay.textContent = 'Links: 0';
            document.body.appendChild(linkCountDisplay);
        });
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = Math.min(e.pageX, startX);
        const y = Math.min(e.pageY, startY);
        const width = Math.abs(e.pageX - startX);
        const height = Math.abs(e.pageY - startY);

        selectionBox.style.left = `${x}px`;
        selectionBox.style.top = `${y}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;

        const rect = selectionBox.getBoundingClientRect();
        const links = Array.from(document.querySelectorAll('a')).filter(link => {
            const linkRect = link.getBoundingClientRect();
            return (
                linkRect.right >= rect.left &&
                linkRect.left <= rect.right &&
                linkRect.bottom >= rect.top &&
                linkRect.top <= rect.bottom
            );
        });

        linkCountDisplay.textContent = `Links: ${links.length}`;
        linkCountDisplay.style.left = `${rect.right}px`;
        linkCountDisplay.style.top = `${rect.bottom}px`;
    }
});

document.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;

        const rect = selectionBox.getBoundingClientRect();

        const links = Array.from(document.querySelectorAll('a')).filter(link => {
            const linkRect = link.getBoundingClientRect();
            return (
                linkRect.right >= rect.left &&
                linkRect.left <= rect.right &&
                linkRect.bottom >= rect.top &&
                linkRect.top <= rect.bottom
            );
        });

        // Open the selected links
        links.forEach(link => {
            window.open(link.href, '_blank');  // Open in new tab
        });

        document.body.removeChild(selectionBox);
        document.body.removeChild(linkCountDisplay);

        e.preventDefault();
    }
});

// Cancel dragging with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDragging) {
        isDragging = false;

        if (selectionBox) document.body.removeChild(selectionBox);
        if (linkCountDisplay) document.body.removeChild(linkCountDisplay);

        e.preventDefault();
    }
});

// Cancel dragging when ALT key is released
document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt' && isDragging) {
        isDragging = false;

        if (selectionBox) document.body.removeChild(selectionBox);
        if (linkCountDisplay) document.body.removeChild(linkCountDisplay);
    }
});
