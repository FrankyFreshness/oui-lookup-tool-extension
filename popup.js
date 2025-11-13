let ouiDatabase = null;

// Browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', async function() {
  const macInput = document.getElementById('macInput');
  const lookupBtn = document.getElementById('lookupBtn');
  const refreshIcon = document.getElementById('refreshIcon');
  const result = document.getElementById('result');

  // Load database (try storage first, then bundled file)
  await loadDatabase();

  // Refresh icon click handler
  refreshIcon.addEventListener('click', async function() {
    refreshIcon.classList.add('spinning');
    
    try {
      await browserAPI.runtime.sendMessage({ action: 'updateDatabase' });
      await loadDatabase();
      
      // Get update info
      const stored = await browserAPI.storage.local.get(['lastUpdated', 'ouiDatabase']);
      const count = ouiDatabase ? Object.keys(ouiDatabase).length.toLocaleString() : '0';
      const updateTime = stored.lastUpdated ? 'Updated just now' : 'Updated today';
      
      // Show temporary success message
      showTemporaryResult(`Database updated: ${count} vendors • ${updateTime}`, 'success', 5000);
    } catch (error) {
      showTemporaryResult('Update failed: ' + error.message, 'error', 5000);
    } finally {
      refreshIcon.classList.remove('spinning');
    }
  });

  async function loadDatabase() {
    try {
      // Try to load from storage (updated database)
      const stored = await browserAPI.storage.local.get(['ouiDatabase', 'lastUpdated']);
      
      if (stored.ouiDatabase && Object.keys(stored.ouiDatabase).length > 0) {
        ouiDatabase = stored.ouiDatabase;
        console.log('Loaded updated database from storage:', Object.keys(ouiDatabase).length, 'entries');
        return;
      }
    } catch (error) {
      console.log('No updated database in storage, loading bundled version');
    }

    // Fallback to bundled database
    try {
      const dbUrl = browserAPI.runtime.getURL('oui-database.json');
      const response = await fetch(dbUrl);
      ouiDatabase = await response.json();
      console.log('Loaded bundled database:', Object.keys(ouiDatabase).length, 'entries');
    } catch (error) {
      console.error('Failed to load database:', error);
    }
  }

  // Allow Enter key to submit
  macInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      lookupBtn.click();
    }
  });

  lookupBtn.addEventListener('click', async function() {
    const mac = macInput.value.trim();
    
    if (!mac) {
      showResult('Please enter a MAC address', 'error');
      return;
    }

    // Basic MAC address validation
    const macPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{12})$/;
    if (!macPattern.test(mac)) {
      showResult('Invalid MAC address format', 'error');
      return;
    }

    // Extract OUI (first 3 octets)
    const oui = extractOUI(mac);

    // Show loading state
    lookupBtn.disabled = true;
    showResult('Looking up vendor...', 'loading');

    // Try primary API first
    let apiSuccess = await tryMacVendorsAPI(mac, oui);
    
    // If primary fails, try backup API
    if (!apiSuccess) {
      console.log('Primary API failed, trying backup API');
      apiSuccess = await tryMacLookupAPI(mac, oui);
    }
    
    // If both APIs fail, use offline database
    if (!apiSuccess) {
      console.log('All APIs failed, using offline database');
      fallbackToOffline(oui);
    }
    
    lookupBtn.disabled = false;
  });

  async function tryMacVendorsAPI(mac, oui) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(
        `https://api.macvendors.com/${encodeURIComponent(mac)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      console.log('MacVendors API response status:', response.status);
      
      if (response.ok) {
        const vendor = await response.text();
        showResult(`${oui} ${vendor}`, 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.log('MacVendors API error:', error.message);
      return false;
    }
  }

  async function tryMacLookupAPI(mac, oui) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(
        `https://api.maclookup.app/v2/macs/${encodeURIComponent(mac)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      console.log('MacLookup API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data.company) {
          showResult(`${oui} ${data.company}`, 'success');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log('MacLookup API error:', error.message);
      return false;
    }
  }

  function fallbackToOffline(oui) {
    const offlineVendor = lookupVendorOffline(oui);
    console.log('Offline lookup for', oui, ':', offlineVendor);
    
    if (offlineVendor) {
      showResult(`${oui} ${offlineVendor} (offline)`, 'success');
    } else {
      if (!ouiDatabase) {
        showResult(`${oui} Offline database not loaded`, 'error');
      } else {
        showResult(`${oui} Unknown Vendor (offline)`, 'error');
      }
    }
  }

  function extractOUI(mac) {
    const cleanMac = mac.replace(/[:-]/g, '').toUpperCase();
    const oui = cleanMac.substring(0, 6);
    return oui.match(/.{1,2}/g).join(':');
  }

  function lookupVendorOffline(oui) {
    if (!ouiDatabase) {
      console.error('Offline database not available');
      return null;
    }
    
    const ouiKey = oui.replace(/:/g, '');
    return ouiDatabase[ouiKey.toUpperCase()] || 
           ouiDatabase[ouiKey.toLowerCase()] || 
           ouiDatabase[ouiKey] ||
           null;
  }

  function showResult(message, type) {
    result.textContent = message;
    result.className = type;
    result.classList.remove('hidden');
  }

  function showTemporaryResult(message, type, duration) {
    showResult(message, type);
    setTimeout(() => {
      result.classList.add('hidden');
    }, duration);
  }
});