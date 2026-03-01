<img src="src/assets/img/icon-128.png" width="64"/>

# Click Counter & Activity Tracker

A Chrome extension that tracks your clicks, typing, and file uploads across websites. Built as part of **Codecademy's AI Maker Bootcamp** (Week 5).

---

## Features

- **Click tracking** — Counts every click you make on any webpage
- **Typing tracking** — Counts keystrokes in input fields, textareas, and dropdowns (throttled to avoid flooding storage)
- **File upload tracking** — Counts when you select files via file input fields
- **Time-range filtering** — View stats for the last 6 hours, 24 hours, 7 days, or 30 days
- **Stats by site** — See which websites you interact with most (top 15)
- **Stats by activity type** — Breakdown of clicks vs typing vs uploads
- **Clear data** — One-click reset to remove all stored activity

All data is stored locally in your browser. Nothing is sent to any server.

---

## How to Use

### Install & Load the Extension

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the extension**
   ```bash
   npm run build
   ```

3. **Load in Chrome**
   - Open `chrome://extensions/`
   - Turn on **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `build` folder inside this project

### View Your Stats

1. Click the extension icon in the Chrome toolbar
2. Choose a time range from the dropdown (e.g. "Last 24 hours")
3. See your total activities, number of sites, and breakdown by type and by site
4. Use **Clear All Data** to reset everything

### Development Mode

Run `npm start` for development with auto-reload when you change code. Reload the extension in `chrome://extensions/` after changes.

---

## Context

This project is part of **Codecademy's AI Maker Bootcamp**, a program that teaches building practical AI-powered tools. Week 5 focuses on Chrome extensions — learning how content scripts, background workers, and popup UIs work together to extend the browser.

---

## Tech Stack

- **Manifest V3** — Modern Chrome extension format
- **React 18** — Popup UI
- **Webpack 5** — Bundling
- **Chrome Storage API** — Local persistence (events kept for 30 days max)
