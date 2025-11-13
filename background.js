// ========== background.js ==========
// Browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Check for updates every 7 days
const UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// On install or update, check if database needs updating
browserAPI.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed/updated');
  checkAndUpdateDatabase();
});

// Periodically check for updates (when browser starts)
browserAPI.runtime.onStartup.addListener(() => {
  console.log('Browser started, checking for database updates');
  checkAndUpdateDatabase();
});

// Listen for manual update requests from popup
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateDatabase') {
    updateDatabase().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
  }
});

async function checkAndUpdateDatabase() {
  try {
    const stored = await browserAPI.storage.local.get(['lastUpdated']);
    const lastUpdated = stored.lastUpdated || 0;
    const now = Date.now();
    
    // Update if never updated or last update was more than 7 days ago
    if (now - lastUpdated > UPDATE_INTERVAL) {
      console.log('Database update needed, downloading...');
      await updateDatabase();
    } else {
      console.log('Database is up to date');
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

async function updateDatabase() {
  try {
    console.log('Downloading IEEE OUI database...');
    
    const response = await fetch('https://standards-oui.ieee.org/oui/oui.txt');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const text = await response.text();
    console.log('Parsing OUI data...');
    
    const ouiDatabase = {};
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('(hex)')) {
        const parts = line.split('(hex)');
        if (parts.length >= 2) {
          const oui = parts[0].trim().replace(/-/g, '').replace(/ /g, '');
          const vendor = parts[1].trim();
          ouiDatabase[oui.toUpperCase()] = vendor;
        }
      }
    }
    
    const count = Object.keys(ouiDatabase).length;
    console.log(`Parsed ${count} OUI entries`);
    
    // Save to storage
    await browserAPI.storage.local.set({
      ouiDatabase: ouiDatabase,
      lastUpdated: Date.now()
    });
    
    console.log('Database updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update database:', error);
    throw error;
  }
}