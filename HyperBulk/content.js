let isDragging = false;
let isClick = false; // Flag for click vs drag
let startX, startY, selectionBox, linkCountDisplay;
let highlightedLinks = []; // Array to track highlighted links

// Load settings from chrome storage
chrome.storage.sync.get({
    selectionBoxColor: 'rgba(0, 120, 215, 0.2)', // Default value
    borderColor: '#005a8c', // Default value
    counterBgColor: '#0078d7', // Default value
    counterTextColor: '#ffffff' // Default value
}, (settings) => {
    // Apply the loaded settings to the selection box and counter
    applySettings(settings);
});

function applySettings(settings) {
    // Apply the selection box color with the proper transparency
    selectionBox.style.background = settings.selectionBoxColor;
    selectionBox.style.border = `2px dashed ${settings.borderColor}`;

    // Update counter background color and text color
    linkCountDisplay.style.background = settings.counterBgColor;
    linkCountDisplay.style.color = settings.counterTextColor;
}

document.addEventListener('mousedown', (e) => {
    if (e.altKey && e.button === 0) { // Alt + Left Click
        isClick = true;
        isDragging = false; // Reset dragging
        startX = e.pageX;
        startY = e.pageY;

        // Prevent default behavior (like text selection)
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isClick && !isDragging && (Math.abs(e.pageX - startX) > 5 || Math.abs(e.pageY - startY) > 5)) {
        isDragging = true; // Begin dragging

        // Create the selection box
        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.zIndex = '10000';
        document.body.appendChild(selectionBox);

        // Create the link count display
        linkCountDisplay = document.createElement('div');
        linkCountDisplay.style.position = 'absolute';
        linkCountDisplay.style.padding = '2px 5px';
        linkCountDisplay.style.borderRadius = '3px';
        linkCountDisplay.style.fontSize = '12px';
        linkCountDisplay.style.fontWeight = 'bold';
        linkCountDisplay.style.pointerEvents = 'none';
        linkCountDisplay.textContent = 'Links: 0';
        document.body.appendChild(linkCountDisplay);

        // Apply styles to the new elements
        chrome.storage.sync.get({
            selectionBoxColor: 'rgba(0, 120, 215, 0.2)',
            borderColor: '#005a8c',
            counterBgColor: '#0078d7',
            counterTextColor: '#ffffff'
        }, (settings) => {
            applySettings(settings);
        });
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

        // Get all links in the page
        const links = Array.from(document.querySelectorAll('a'));
        let selectedLinks = [];

        // Highlight links within the selection box
        links.forEach(link => {
            const linkRect = link.getBoundingClientRect();
            if (
                linkRect.right >= rect.left &&
                linkRect.left <= rect.right &&
                linkRect.bottom >= rect.top &&
                linkRect.top <= rect.bottom
            ) {
                link.style.backgroundColor = 'rgba(0, 120, 215, 0.3)';
                selectedLinks.push(link);
            } else {
                link.style.backgroundColor = '';
            }
        });

        linkCountDisplay.textContent = `Links: ${selectedLinks.length}`;

        // Position the link count display near the cursor
        const offset = 10;
        let xPos = e.clientX + offset;
        let yPos = e.clientY + offset + window.scrollY;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const elementWidth = linkCountDisplay.offsetWidth;
        const elementHeight = linkCountDisplay.offsetHeight;

        if (xPos + elementWidth > viewportWidth) {
            xPos = viewportWidth - elementWidth - offset;
        }
        if (yPos + elementHeight > viewportHeight + window.scrollY) {
            yPos = viewportHeight + window.scrollY - elementHeight - offset;
        }

        linkCountDisplay.style.left = `${xPos}px`;
        linkCountDisplay.style.top = `${yPos}px`;
    }
});

document.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;

        const rect = selectionBox.getBoundingClientRect();
        const links = Array.from(document.querySelectorAll('a'));
        let selectedLinks = [];

        links.forEach(link => {
            const linkRect = link.getBoundingClientRect();
            if (
                linkRect.right >= rect.left &&
                linkRect.left <= rect.right &&
                linkRect.bottom >= rect.top &&
                linkRect.top <= rect.bottom
            ) {
                selectedLinks.push(link);
            }
        });

        chrome.storage.sync.get({ maxLinks: 10 }, (settings) => {
            const maxLinks = settings.maxLinks;

            if (maxLinks > 0 && selectedLinks.length > maxLinks) {
                const confirmation = confirm(`You are trying to open ${selectedLinks.length} links. Are you sure?`);
                if (confirmation) {
                    selectedLinks.forEach(link => {
                        window.open(link.href, '_blank');
                    });
                }
            } else {
                selectedLinks.forEach(link => {
                    window.open(link.href, '_blank');
                });
            }
        });

        document.body.removeChild(selectionBox);
        document.body.removeChild(linkCountDisplay);
    }

    isClick = false;
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (isClick || isDragging)) {
        isClick = false;
        isDragging = false;

        if (selectionBox && selectionBox.parentNode) {
            document.body.removeChild(selectionBox);
        }
        if (linkCountDisplay && linkCountDisplay.parentNode) {
            document.body.removeChild(linkCountDisplay);
        }

        document.querySelectorAll('a').forEach(link => {
            link.style.backgroundColor = '';
        });
    }
});


document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt') {
        // When ALT is released, reset the click flag
        isClick = false; // Make sure click flag is reset
        isDragging = false; // Reset dragging flag
    }

    // If ALT is released, reset background of all links
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
});
