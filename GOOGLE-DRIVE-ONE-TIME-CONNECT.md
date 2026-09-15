# Google Drive — one-time connection

The normal user experience in v1.6 is:

1. Open **Sync**.
2. Press **Connect Google Drive**.
3. Sign in to Google when the Google authorization window appears.
4. Allow the requested Drive permission.
5. Choose the dedicated FinMate folder in Google Picker.
6. The app remembers the selected folder on that browser/device.
7. Press **Sync now**.

You should not need to copy a Drive folder ID during normal use.

## Why is there still an Advanced setup section?

A browser application must be registered with Google. Google requires a web OAuth client ID, and Google Picker requires an API key. Those are application credentials, not your Google password.

For a hosted public version, the ideal deployment preconfigures those values so the normal user only sees **Connect Google Drive**. This ZIP cannot know your future hosting URL or your Google Cloud credentials, so v1.6 keeps them in **Sync → Advanced Google connection setup** for the one-time configuration.

After that, day-to-day Drive use is intended to be simple.


## If Chrome reports popup_closed after Continue

Run **Google diagnostics** first. If all checks pass but the GIS popup still closes before returning a token, FinMate v2.6 includes an optional **Full-page Google fallback**. This legacy browser compatibility flow requires adding the exact FinMate page URL (for the GitHub Pages root, `https://sivarakash89.github.io/`) to the OAuth client's **Authorized redirect URIs**. The access token is used only in memory and is not stored by FinMate.
