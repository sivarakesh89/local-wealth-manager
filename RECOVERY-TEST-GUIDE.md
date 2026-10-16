# FinMate v3.46 Split-Media Recovery — Test Guide

## Files and prerequisites

- `SPLIT-GOLD-MEDIA-RECOVERY.js`
- Node.js 20 or newer
- `FinMate-Recovered-Gold-Media-vault.json`
- A laptop/desktop with plenty of free RAM

The helper runs locally and does not make network requests. It needs to decrypt and parse the large source once, so it still needs substantial RAM. Do not run it on a phone.

## Part A — Split the large encrypted vault

1. Extract the FinMate v3.46 ZIP into a new folder.
2. Open Windows Terminal or PowerShell in that folder.
3. Run: `node SPLIT-GOLD-MEDIA-RECOVERY.js`
4. Paste the full path to `FinMate-Recovered-Gold-Media-vault.json` when asked.
5. Enter the recovery file's master password when prompted. Password characters are hidden. Do not send the password to anyone or save it in a text file.
6. Wait for the helper to create a new `FinMate-Split-Recovery-*` folder.
7. Keep the original file unchanged. The new folder should contain `FinMate-Recovered-Core-vault.json`, `FinMate-Media-Shard-*.json`, and `MANIFEST.txt`.
8. If the helper reports an authentication/decryption error or Node.js runs out of memory, stop. Do not delete or overwrite any source file.

## Part B — Import the compact core vault

1. Use a separate Chrome profile that does not contain your only working FinMate vault.
2. Run/deploy this v3.46 build locally or at a private test URL using the normal FinMate hosting method.
3. Open Settings → Google Drive section → Retrieve from local JSON file.
4. Select `FinMate-Recovered-Core-vault.json`.
5. Confirm the recovery warning and enter the same master password.
6. Verify transactions, assets, recurring entries and gold-jewellery records. The compact core intentionally stores attachment references rather than embedding the media bytes.

## Part C — Import the media shards

1. In Settings → Google Drive section, select **Import recovery media shards**.
2. Select every `FinMate-Media-Shard-*.json` file from the new folder in one selection. Do not select `MANIFEST.txt` or the core vault.
3. FinMate processes each shard and decrypts/authenticates each attachment one at a time, then stores its encrypted record in a separate IndexedDB store.
4. Open several gold-jewellery entries and test both the photo and invoice buttons. Check different entries, not only the first one.
5. If import stops, read the exact error. You may select the same shard files again; successfully imported references remain in local IndexedDB.

## After testing

- Do not press Sync Now or upload to Google Drive yet.
- Keep the original emergency backup, laptop backup, gold-media vault, core vault, all shards and manifest.
- This build changes local storage structure for referenced media. Do not use it as your only production copy until all attachments are verified and a backup/export strategy for split media is implemented.
