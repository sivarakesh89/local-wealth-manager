# Google Drive setup — Local Wealth Manager

The app cannot access an existing Google Drive folder anonymously. Google requires OAuth authorization. This is a one-time setup for your own PWA deployment.

1. Go to Google Cloud Console.
2. Create a project.
3. Enable **Google Drive API**.
4. Configure OAuth consent screen for personal/testing use.
5. Create **OAuth Client ID -> Web application**.
6. Add the exact HTTPS origin where your PWA is hosted under Authorized JavaScript origins.
7. Copy the client ID ending in `.apps.googleusercontent.com`.
8. In the app: **Sync -> Google OAuth client ID**.
9. Open your Google Drive folder and copy the folder ID from its URL.
10. Paste it into **Google Drive folder ID**.
11. Save settings.
12. Press **Manual upload to Google Drive** once and grant permission.
13. Later use **Sync now** on either device.

The encrypted file will appear in that folder as:

`Local-Wealth-Manager-vault.json`

The file is not a readable export of your financial records. It contains the encrypted vault envelope.

## Automatic sync

Enable **Automatic sync after save**. The PWA will debounce local changes and try to upload the latest encrypted vault. If the Google access token expires, Google may ask for authorization again.

## Conflict warning

v1.3 uses a simple latest-vault model. If you edit the same vault independently on both devices before synchronizing, the last uploaded vault can overwrite the other device's newer changes. Always press **Sync now** before switching devices. A future version should add record-level conflict resolution and version history.
