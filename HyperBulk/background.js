// Background script to manage context menus and key functionality

// Create the context menu on extension install
chrome.runtime.onInstalled.addListener(() => {
  // Create the context menu item
  chrome.contextMenus.create({
    id: 'openSettings',
    title: 'Open Link Selector Settings',
    contexts: ['all']
  });
});

// Handle context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSettings') {
    // Open settings page when the context menu item is clicked
    chrome.tabs.create({ url: 'settings.html' });
  }
});

// Listen for any incoming messages (optional for future communication with content script)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'keyEvent') {
    // Handle any key events or other custom events if needed
    // Example: message.data could be the pressed key info
    console.log('Received key event:', message.data);
  }
  sendResponse({ status: 'received' });
});
