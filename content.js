let isDragging = false;
let isClick = false; // New flag to check if it's a click (no drag)
let startX, startY, selectionBox, linkCountDisplay;

document.addEventListener('mousedown', (e) => {
    if (e.altKey && e.button === 0) { // Alt + Left Click
        isClick = true; // Set the flag to true for a click
        isDragging = false; // Make sure dragging flag is false initially
        startX = e.pageX;
        startY = e.pageY;

        // Prevent default behavior (like text selection)
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

document.addEventListener('mousemove', (e) => {
    if (isClick && !isDragging && Math.abs(e.pageX - startX) > 5 || Math.abs(e.pageY - startY) > 5) {
        isDragging = true; // If there is significant movement, start dragging
    }

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

        // Highlight links within the selection box
        document.querySelectorAll('a').forEach(link => {
            const linkRect = link.getBoundingClientRect();
            if (linkRect.right >= rect.left &&
                linkRect.left <= rect.right &&
                linkRect.bottom >= rect.top &&
                linkRect.top <= rect.bottom) {
                link.style.backgroundColor = 'rgba(0, 120, 215, 0.3)'; // Highlighted background
            } else {
                link.style.backgroundColor = ''; // Reset background for non-selected links
            }
        });

        linkCountDisplay.textContent = `Links: ${links.length}`;

        // Position the link count display relative to the cursor
        linkCountDisplay.style.left = `${e.pageX + 10}px`; // Slight offset from cursor
        linkCountDisplay.style.top = `${e.pageY + 10}px`; // Slight offset from cursor
    }
});

document.addEventListener('mouseup', (e) => {
    if (isClick && !isDragging) {
        // If it's just a click and not a drag, do nothing
        isClick = false; // Reset click flag
        return; // Prevent link opening
    }

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
            window.open(link.href, '_blank');
        });

        document.body.removeChild(selectionBox);
        document.body.removeChild(linkCountDisplay);

        e.preventDefault();
    }
});

// Cancel dragging with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (isClick || isDragging)) {
        isClick = false; // Reset click flag
        isDragging = false;

        if (selectionBox && selectionBox.parentNode) {
            document.body.removeChild(selectionBox);
        }
        if (linkCountDisplay && linkCountDisplay.parentNode) {
            document.body.removeChild(linkCountDisplay);
        }

        // Reset link backgrounds if ESC is pressed
        document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = ''; // Reset highlight
        });

        e.preventDefault();
    }
});

// Cancel dragging with ALT key release
document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt' && isClick) {
        isClick = false; // Reset click flag
        isDragging = false;

        if (selectionBox && selectionBox.parentNode) {
            document.body.removeChild(selectionBox);
        }
        if (linkCountDisplay && linkCountDisplay.parentNode) {
            document.body.removeChild(linkCountDisplay);
        }

        // Reset link backgrounds if ALT is released
        document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = ''; // Reset highlight
        });
    }
});
