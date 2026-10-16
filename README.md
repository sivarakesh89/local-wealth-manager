# FinMate v3.46.1 Split-Media Recovery Build

This recovery-only build adds a split-media path for restoring large encrypted gold-jewellery vaults that crash Chrome during import.

**Start with `SPLIT-MEDIA-START-HERE.md`.** The offline helper `SPLIT-GOLD-MEDIA-RECOVERY.js` creates a compact encrypted core vault plus individually encrypted media shards. Import the core vault first, then all media shards using Settings → Google Drive section → Import recovery media shards.

This build is for isolated recovery testing. It does not yet integrate split-media attachments into the normal full-vault export and Google Drive sync lifecycle. Do not sync it to Drive or use it as your only production copy until that is implemented and verified.

See `RECOVERY-TEST-GUIDE.md` and `V3.46-SPLIT-MEDIA-RECOVERY-CHANGELOG.md and V3.46.1-MEDIA-IMPORT-FIX.md` for details and limitations.
