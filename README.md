# OUI Lookup Tool

<img width="469" height="265" alt="image" src="https://github.com/user-attachments/assets/bc0d4cc4-d52d-49d5-b76c-81b4014dabec" />



A  browser extension for looking up MAC address vendors using the OUI (Organizationally Unique Identifier) database. Features automatic updates and dual API fallback.

## Features

- **Quick MAC address vendor lookup** - Enter any MAC address format
- **Dual API system** - Primary and backup APIs for redundancy
- **Offline support** - Works without internet using local database
- **Auto-updates** - Database automatically updates every 7 days
- **Privacy-focused** - Zero data collection or tracking
- **Cross-browser** - Works on Firefox, Chrome, and Edge

## Installation from Browser Extension Stores

[![Firefox Add-ons](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/oui-lookup-tool/)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/oui-lookup-tool/dlfjdembgipbooclgjgpnhjaemncejjj)
[![Edge Add-ons](https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/oui-lookup-tool/mejepkeeddaekgjbmfocoeicboilebkk)

## Manual Installation

### Firefox
1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder

### Chrome/Edge
1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension folder

## Usage

1. **Lookup a vendor:**
   - Click the extension icon in your browser toolbar
   - Enter a MAC address (e.g., `00:1A:2B:3C:4D:5E`, `48ea6281a2e3`, or `48:ea:62:81:a2:e3`)
   - Press Enter or click "Lookup Vendor"
   - View the vendor information in Wireshark format: `48:EA:62 HP Inc.`

2. **Update database:**
   - Click the refresh icon (⟳) in the top-right corner
   - Database downloads from IEEE and updates automatically
   - Shows confirmation message with vendor count

3. **Automatic updates:**
   - Database automatically updates every 7 days
   - No manual intervention needed
   - Always stays current with new vendors

## How It Works

The extension uses a **three-tier fallback system** for maximum reliability:

1. **Primary API** (`api.macvendors.com`) - Tries first with 3-second timeout
2. **Backup API** (`api.maclookup.app`) - Falls back if primary fails
3. **Offline Database** - Uses local IEEE OUI database if both APIs fail

### Auto-Update System

- Background script checks for updates every 7 days
- Downloads latest IEEE OUI database (~30,000+ vendors)
- Stores in browser storage for offline access
- Manual refresh available via refresh icon

## Files Structure

```
oui-lookup-extension/
├── manifest.json          # Extension configuration
├── popup.html            # User interface
├── popup.js              # Lookup logic and UI handlers
├── background.js         # Auto-update background script
├── oui-database.json     # Bundled fallback database (31 vendors)
└── icon.png              # Extension icon (48x48px)
```

## Technical Details

### APIs Used
- **MacVendors API**: Primary lookup service
- **MacLookup API**: Backup lookup service
- **IEEE OUI Database**: Official source for auto-updates

### Data Storage
- Uses browser's `storage.local` API for database caching
- No external servers or tracking
- All data stored locally

### Supported MAC Formats
- Colon-separated: `00:1A:2B:3C:4D:5E`
- Hyphen-separated: `00-1A-2B-3C-4D-5E`
- No separators: `001A2B3C4D5E`

## Development

### Building the Full Database

To create a complete OUI database (instead of the bundled sample):

```python
pip install requests
python convert_oui.py
```

This downloads the full IEEE OUI database and converts it to JSON format.

### Database Updates

The extension automatically maintains the database, but you can force updates:
- Click the refresh icon (⟳) in the extension popup
- Or wait for automatic weekly updates

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Pull requests are welcome! Feel free to submit issues or suggestions.

## Changelog

### Version 1.0
- Initial release
- Dual API fallback system
- Offline database support
- Auto-update functionality (every 7 days)
- Wireshark-inspired dark UI
- Cross-browser compatibility (Firefox, Chrome, Edge)
- Manual refresh option

## Author

Francis Héroux

## Acknowledgments

- IEEE for the OUI database
- MacVendors API for vendor lookup service
- MacLookup API for backup lookup service

---

Made with ❤️ for network administrators, security, and IT professionals
