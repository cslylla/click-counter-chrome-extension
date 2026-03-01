/**
 * Background service worker - Stores activity events (clicks, typing, uploads) with timestamps.
 */

const STORAGE_KEY = 'activityEvents';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 1 month - prune older events

const TIME_RANGES = {
  '6h': 6 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
  '1m': 30 * 24 * 60 * 60 * 1000,
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'ACTIVITY_RECORDED' && message.hostname && message.activityType) {
    addEvent(message.hostname, message.activityType).then(sendResponse);
    return true;
  }
  if (message.type === 'GET_STATS' && message.timeRange) {
    getStats(message.timeRange).then(sendResponse);
    return true;
  }
});

async function addEvent(hostname, activityType) {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  let events = data[STORAGE_KEY] || [];
  const now = Date.now();
  events.push({ h: hostname, t: activityType, ts: now });
  events = pruneOldEvents(events);
  await chrome.storage.local.set({ [STORAGE_KEY]: events });
  return { success: true };
}

function pruneOldEvents(events) {
  const cutoff = Date.now() - MAX_AGE_MS;
  return events.filter((e) => e.ts > cutoff);
}

async function getStats(timeRange) {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  let events = data[STORAGE_KEY] || [];
  events = pruneOldEvents(events);

  const rangeMs = TIME_RANGES[timeRange] || TIME_RANGES['1d'];
  const cutoff = Date.now() - rangeMs;
  const filtered = events.filter((e) => e.ts > cutoff);

  const bySite = {};
  const byType = { click: 0, keypress: 0, upload: 0 };

  for (const e of filtered) {
    bySite[e.h] = bySite[e.h] || { click: 0, keypress: 0, upload: 0 };
    bySite[e.h][e.t] = (bySite[e.h][e.t] || 0) + 1;
    byType[e.t] = (byType[e.t] || 0) + 1;
  }

  const total = filtered.length;
  return { bySite, byType, total };
}
