![banner_small](https://github.com/user-attachments/assets/f5bf43b7-babd-45f1-ad79-b43e934c71e9)

# Description
This Google Chrome browser extension was created to replace LinkClump which hasn't been updated to Chrome V3 manifest and is no longer supported.
It allows you to open multiple hyperlinks on a page at once.

![chrome_VspsHrKOf6](https://github.com/user-attachments/assets/1075fd07-a732-4004-a3ea-7061c85cbabf)

# Files
This extension consists of the following files:

| File            | Description                                           |
|-----------------|-------------------------------------------------------|
| `background.js` | Background service worker                             |
| `content.js`    | The main interface/logic on pages                     |
| `manifest.json` | Tells Chrome what the extension is called, the files to include, and so on |
| `popup.html`    | A popup that leads to the settings page               |
| `settings.html` | The settings page                                     |
| `settings.js`   | The logic for the settings page                       |
| `styles.css`    | Element styling                                       |

# Installation
To add this to Chrome, download the repo and follow this guide to install it:
https://knowledge.workspace.google.com/kb/load-unpacked-extensions-000005962

# Operation
To use this extension to open multiple hyperlinks on a page, hold ALT and then click and drag with the left mouse button. Release the mouse button to open the selected links, or release alt to cancel.

NOTE: It is possible to scroll on a page while dragging the box, to select even more links.

# Settings
To change settings for this extension, click the LinkSelector extension in Chrome, then click Settings.
Currently, the only settings are to change the colors of the interface.

# Contributions
All contributions (as PRs) are welcome to fix issues, add new functionality etc.

# Disclaimer
This extension was created with the help of ChatGPT.
