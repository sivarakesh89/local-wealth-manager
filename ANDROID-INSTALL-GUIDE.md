# Android installation — FinMate v2.2

## What you need

- Android phone
- Google Chrome
- The application's HTTPS URL

You **cannot reliably install the PWA by copying the ZIP or `index.html` to Android**. Android Chrome needs the application to be served from HTTPS for PWA/service-worker features.

## Step-by-step

1. Open Chrome on your laptop.
2. Complete `URL-CREATION-GUIDE.md` to obtain your HTTPS application URL.
3. Copy the complete URL.
4. On Android, open Chrome.
5. Paste the URL and open it.
6. Wait until FinMate loads.
7. Tap Chrome's **⋮** menu.
8. Look for **Install app**.
9. If you do not see Install app, look for **Add to Home screen**.
10. Confirm.
11. Open the new FinMate icon.
12. Create a vault or enter your existing password.
13. Go to **Settings → Quick unlock**.
14. Enable a PIN if desired.
15. If offered by your device/browser, enable fingerprint/device biometrics.

## If Install app does not appear

- Confirm the address starts with `https://`.
- Do not use a `file:///` address.
- Refresh the page.
- Make sure `manifest.webmanifest` is present.
- Make sure the site is not being opened inside another app's embedded browser.
- Open the URL directly in Chrome.

## If the Android app opens but has no data

That is expected if you have not synchronized the vault. Browser storage is device-specific.

Use **Sync → Connect Google Drive** on the Android device and retrieve the encrypted vault from the same Drive folder used by the laptop.

## v2.2 mobile navigation

FinMate v2.2 no longer relies on a bottom-only menu. On Android, tap the ☰ drawer button at the top-left to open the complete left navigation, including Essentials, Reports and Sync.
