# Zion Songs Book - External Tuner Package

This package contains:

1. `standalone-tuner/index.html`
   - A mobile-friendly standalone tuner page.
   - Host this file on HTTPS using Netlify, GitHub Pages, Firebase Hosting, or your own domain.

2. `apps-script-patch/Code.gs`
3. `apps-script-patch/Index.html`
4. `apps-script-patch/Scripts.html`
   - These replace the matching files in your Apps Script project.
   - They change the Tuner view so it opens the external tuner page instead of using the Apps Script microphone iframe.

## Fastest setup

### A. Host the tuner page

#### Option 1: Netlify Drop
1. Open Netlify Drop in your browser.
2. Drag `standalone-tuner/index.html` into the drop area.
3. Netlify will give you a live HTTPS URL.
4. Test the URL on mobile. Confirm the tuner can request microphone permission.

### B. Patch your Apps Script project
1. Open your Apps Script project.
2. Replace the existing `Code.gs`, `Index.html`, and `Scripts.html` with the files in `apps-script-patch`.
3. In `Code.gs`, set:

   `const EXTERNAL_TUNER_URL = 'YOUR_LIVE_TUNER_URL_HERE';`

4. Save the project.
5. Deploy a new web app version.
6. Open the new `/exec` URL.

## What changes in the app
- The Tuner tab still stays inside your Zion Songs Book app.
- `Open Tuner` opens the standalone HTTPS tuner page in a new tab.
- `Copy Link` copies the external tuner URL.
- Your song library, playlists, and Google Sheet logic stay in Apps Script.

## Important
- The external tuner page must use HTTPS.
- Microphone access may fail in in-app browsers. Open the tuner in Chrome or Safari.
- After changing `EXTERNAL_TUNER_URL`, deploy a new Apps Script version.
