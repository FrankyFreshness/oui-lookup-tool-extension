# OUI Lookup Tool

A quick simple browser extension for looking up a MAC address' vendor using the OUI (Organizationally Unique Identifier) database.

<img width="383" height="218" alt="image" src="https://github.com/user-attachments/assets/bb6582cb-0a73-4d90-96ba-3f5ab87a327f" />

## Features

- Quick MAC address vendor lookup
- Fast and lightweight
- Works offline (with refresh button to update the OUI Database when online for offline use)
- No data collection or tracking

## Installation

This is currently pending the submission process for the Extension stores in Firefox/Chrome/Edge. If you would like to manually add it, see below:

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

1. Click the extension icon in your browser toolbar
2. Enter a MAC address (e.g., `00:1A:2B:3C:4D:5E`)
3. Press Enter or click "Lookup Vendor"
4. View the vendor information

## Files

- `manifest.json` - Extension configuration
- `popup.html` - User interface
- `popup.js` - Lookup logic
- `icon.png` - Extension icon

## API

This extension uses the free [MAC Vendors API](https://macvendors.com/) for vendor lookups.

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Pull requests are welcome! Feel free to submit issues or suggestions.

## Author

Francis Héroux

---

Made with ❤️ for network administrators and security professionals
