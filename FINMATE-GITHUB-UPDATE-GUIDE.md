# FinMate — How to update your GitHub Pages copy

You do **not** need Git, GitHub Desktop, Node.js or VS Code.

## Safest method: upload the new files through GitHub in Chrome

1. Keep using the **same GitHub repository and the same GitHub Pages URL**. Do not create a new repository for every FinMate version.
2. Download the latest FinMate ZIP from ChatGPT and extract it on your laptop.
3. Open your repository on GitHub in Chrome.
4. Open the repository's main file list.
5. Choose **Add file → Upload files**.
6. Open the extracted FinMate folder on your computer and select the contents of the folder (not the ZIP itself).
7. Upload the files into the repository root. Keep the `icons` folder and all its PNG files.
8. GitHub will show files that already exist as changed/replaced files. Commit the changes to the same branch used by GitHub Pages, normally `main`.
9. Wait 1–3 minutes for GitHub Pages to publish.
10. Open your existing FinMate URL in Chrome.
11. If the old screen still appears, do a hard refresh with `Ctrl + Shift + R` on laptop. On Android Chrome, close the installed FinMate app completely, open the URL in Chrome, and refresh before reopening the installed PWA.

## Very important: do NOT delete browser site data

FinMate stores the encrypted vault in IndexedDB in the browser. Updating the GitHub files does **not** require clearing site data.

Do **not** use Chrome's "Clear site data" for FinMate unless you have a verified encrypted backup.

## Google Drive after an update

Your Google Drive connection information is stored inside the encrypted local vault. Updating the application files does not intentionally delete it.

FinMate 1.9 changes the normal Drive flow so the app can create/use its own `FinMate` folder automatically. You should not need the Picker API key for the normal flow.

## If the browser still shows an older version

1. Confirm the repository contains the new `sw.js` and `app.js`.
2. Open the URL in an Incognito window. If the new version appears there, the old service worker/cache is the cause.
3. On laptop Chrome, open DevTools → Application → Service Workers and unregister the old FinMate worker, then reload. Do this only for the FinMate website.
4. Do not clear IndexedDB/storage unless you have a backup and specifically intend to reset the local vault.
