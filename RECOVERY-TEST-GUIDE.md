# FinMate Recovery Build — Safe Test Order

## Before you begin

1. Keep `FinMate-emergency-encrypted-backup.json`, `FinMate-Laptop-Old-Backup.json`, `FinMate-Recovered-Lightweight-vault.json`, and `FinMate-Recovered-Gold-Media-vault.json` unchanged.
2. Extract this ZIP into its own folder.
3. Use a laptop/desktop and create a separate Chrome profile (Chrome profile icon → Add). Do not use the profile that contains your only working FinMate vault.
4. Open the recovery build through the same local web-server method used for FinMate, or deploy it to a private test URL. Do not use `file://` if the PWA requires secure-context APIs.
5. Do not connect Google Drive in this test profile.

## Test A — lightweight recovery file (2.41 MB)

1. Open FinMate in the isolated profile.
2. Choose the encrypted vault import/retrieve-from-file action.
3. Select `FinMate-Recovered-Lightweight-vault.json`.
4. Read the warnings. Continue only because this is a separate test profile.
5. Enter the emergency backup's master password locally. Never send it in chat or put it in a text file.
6. Verify transactions, assets, gold-jewellery entries, recurring items, profiles, and any other key records. The lightweight file intentionally omits the 88 embedded media data URLs, so some gold photos/invoices may be blank in this test.
7. If it fails, stop. Keep all original files unchanged and record the exact error text.

## Test B — gold-media recovery file (155.80 MB)

Only proceed after Test A succeeds and the lightweight records look correct.

1. Use a laptop with sufficient free RAM, close other applications, and remain in the isolated Chrome profile.
2. Select `FinMate-Recovered-Gold-Media-vault.json`.
3. Continue only after reading the large-file warning. A crash is still possible because the browser must parse the JSON and decrypt the full payload.
4. Enter the emergency backup's master password locally.
5. If it opens, verify multiple gold entries and open their images/invoices; verify ordinary records too.
6. If Chrome shows “Aw, Snap!”, do not repeatedly retry and do not clear site data. The isolated profile may need to be recreated, but keep the source files unchanged.

## After either test

- Do not press Sync Now, enable auto-sync, or upload to Google Drive.
- Do not overwrite any source or recovery file.
- Only after successful verification, export another encrypted backup to a separate filename and preserve it.
