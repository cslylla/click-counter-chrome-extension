/**
 * Content script - Tracks clicks, typing, and file uploads on web pages.
 */

const hostname = () => window.location.hostname || 'unknown';

function sendActivity(activityType) {
  try {
    chrome.runtime.sendMessage({ type: 'ACTIVITY_RECORDED', hostname: hostname(), activityType });
  } catch (e) {
    console.debug('Activity Tracker: Could not send', e);
  }
}

// Clicks
document.addEventListener('click', () => sendActivity('click'), true);

// Typing - throttle to 1 per 2 seconds per hostname to avoid storage explosion
const keypressThrottle = {};
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const target = e.target;
  if (!target || !/^(INPUT|TEXTAREA|SELECT)$/i.test(target.tagName)) return;
  const key = hostname();
  const now = Date.now();
  if (keypressThrottle[key] && now - keypressThrottle[key] < 2000) return;
  keypressThrottle[key] = now;
  sendActivity('keypress');
}, true);

// File uploads
document.addEventListener('change', (e) => {
  const target = e.target;
  if (target?.tagName === 'INPUT' && target.type === 'file' && target.files?.length > 0) {
    sendActivity('upload');
  }
}, true);
