# FinMate v3.47.0 — Drive + Split Media

This build starts from the working v3.46.3 gold-thumbnail recovery build and adds a first-stage manual Google Drive backup/restore path for the encrypted core vault and separately encrypted media.

## Important: treat as a test build

- Keep v3.46.3 deployed and keep your recovery files unchanged until v3.47 passes the restore test.
- Use **Upload core + media** / **Backup Now** to upload media first and then the encrypted core vault.
- Use **Retrieve core + media** on a fresh/test profile to restore the core and referenced media.
- Do not use this as conflict-safe two-way sync yet. Backup is upload/replace, restore replaces local data after confirmation; simultaneous edits on two devices are not merged.

Read `V3.47-DRIVE-SYNC-TEST-GUIDE.md` before connecting Google Drive. The current build has passed static JavaScript syntax and ZIP integrity checks, but has not been end-to-end tested with the user's Google account or live Drive. OAuth Worker configuration and Google Cloud permissions are not changed by this ZIP.

The app preserves the working jewellery thumbnail and enlarged-photo viewer. Media records are encrypted with the vault key and stored in a `FinMate/media/` subfolder as separate files.
