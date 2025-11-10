document.addEventListener('DOMContentLoaded', function() {
  const macInput = document.getElementById('macInput');
  const lookupBtn = document.getElementById('lookupBtn');
  const result = document.getElementById('result');

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

    // Show loading state
    lookupBtn.disabled = true;
    showResult('Looking up vendor...', 'loading');

    try {
      const response = await fetch(`https://api.macvendors.com/${encodeURIComponent(mac)}`);
      
      if (response.ok) {
        const vendor = await response.text();
        showResult(`Vendor: ${vendor}`, 'success');
      } else if (response.status === 404) {
        showResult('Vendor not found for this MAC address', 'error');
      } else {
        showResult('Unable to lookup vendor', 'error');
      }
    } catch (error) {
      showResult('Error: ' + error.message, 'error');
    } finally {
      lookupBtn.disabled = false;
    }
  });

  function showResult(message, type) {
    result.textContent = message;
    result.className = type;
    result.classList.remove('hidden');
  }
});