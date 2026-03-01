/**
 * Background service worker - Stores click counts per site in chrome.storage.local.
 */

const STORAGE_KEY = 'clickCounts';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'CLICK_RECORDED' && message.hostname) {
    incrementClickCount(message.hostname).then(sendResponse);
    return true; // Keep channel open for async response
  }
});

async function incrementClickCount(hostname) {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  const counts = data[STORAGE_KEY] || {};
  counts[hostname] = (counts[hostname] || 0) + 1;
  await chrome.storage.local.set({ [STORAGE_KEY]: counts });
  return { success: true };
}

