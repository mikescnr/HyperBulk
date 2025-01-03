let isDragging = false;
let startX, startY, selectionBox, linkCountDisplay;

let isAltPressed = false;

// Listen for Alt key press and release
document.addEventListener('keydown', (e) => {
    if (e.key === 'Alt') {
        isAltPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt') {
        isAltPressed = false;
        // Cancel the drag when Alt is released
        if (isDragging) {
            isDragging = false;
            if (selectionBox) document.body.removeChild(selectionBox);
            if (linkCountDisplay) document.body.removeChild(linkCountDisplay);
        }
    }
});

// Start dragging on right-click or Alt + Left click
document.addEventListener('mousedown', (e) => {
    if ((e.button === 2 || (e.altKey || isAltPressed) && e.button === 0)) { // Right-click or Alt + Left-click
        isDragging = true;
        startX = e.pageX;
        startY = e.pageY;

        // Prevent default behavior (like text selection or context menu)
        e.preventDefault();

        // Create the selection box
        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.background = 'rgba(0, 120, 215, 0.2)';
        selectionBox.style.border = '2px dashed rgba(0, 120, 215, 0.7)';
        selectionBox.style.zIndex = '10000';
        document.body.appendChild(selectionBox);

        // Create the link count display
        linkCountDisplay = document.createElement('div');
        linkCountDisplay.style.position = 'absolute';
        linkCountDisplay.style.background = '#0078d7';
        linkCountDisplay.style.color = '#fff';
        linkCountDisplay.style.padding = '2px 5px';
        linkCountDisplay.style.borderRadius = '3px';
        linkCountDisplay.style.fontSize = '12px';
        linkCountDisplay.style.fontWeight = 'bold';
        linkCountDisplay.style.pointerEvents = 'none';
        linkCountDisplay.textContent = 'Links: 0';
        document.body.appendChild(linkCountDisplay);
    }
});

// Update the selection box and count of links while dragging
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

// Finish dragging and open selected links
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

        links.forEach(link => {
            chrome.runtime.sendMessage({ url: link.href });
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
