# Start here — FinMate v3.46 Split-Media Recovery

This build addresses the large gold-media recovery file by separating financial records from the 88 embedded photos/invoices. The core vault remains encrypted, and each attachment is encrypted separately so the app can import and open media one item at a time.

## 1. Create split files on your laptop

1. Extract this ZIP to a new folder.
2. Ensure Node.js 20 or newer is installed.
3. Double-click `RUN-SPLIT-RECOVERY-WINDOWS.bat` (or open PowerShell in this folder and run `node SPLIT-GOLD-MEDIA-RECOVERY.js`).
4. Provide the full path to `FinMate-Recovered-Gold-Media-vault.json` when asked.
5. Enter its master password in the hidden password prompt.
6. Wait for a new `FinMate-Split-Recovery-*` folder. It should contain the compact core vault, multiple media shard JSON files, and `MANIFEST.txt`.

The helper runs locally without network requests. It does need enough memory to decrypt and parse the large source once. It never edits the source file.

## 2. Restore in FinMate v3.46

1. Use a separate Chrome profile on your laptop. Do not use your only working FinMate profile.
2. Open the v3.46 build using your normal FinMate local-server/deployment method.
3. In Settings → Google Drive section, choose **Retrieve from local JSON file** and select `FinMate-Recovered-Core-vault.json`.
4. Enter the same master password and verify that the ordinary financial records appear.
5. Choose **Import recovery media shards** and select every `FinMate-Media-Shard-*.json` file from the split folder in one selection.
6. Wait for completion, then open several gold-jewellery entries and test both photos and invoices.

## Important

- Do not connect or sync Google Drive during this test.
- Keep the emergency backup, laptop backup, original gold-media vault, core vault, shards and manifest unchanged until verification is complete.
- If the helper fails, record the exact error and stop; do not delete or overwrite source files.
- This is a recovery build. Its split-media storage is not yet integrated into normal full-vault export/sync. Do not treat it as the only production copy or sync it to Drive until that lifecycle is implemented and tested.
