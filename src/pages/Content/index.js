/**
 * Content script - Listens for clicks on web pages and reports them to the background script.
 * Runs on all http/https pages via manifest content_scripts.
 */

document.addEventListener('click', () => {
  try {
    const hostname = window.location.hostname || 'unknown';
    chrome.runtime.sendMessage({ type: 'CLICK_RECORDED', hostname });
  } catch (e) {
    // Extension context may be invalidated (e.g., after update)
    console.debug('Click Counter: Could not send click', e);
  }
});
