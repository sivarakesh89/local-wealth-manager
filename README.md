# FinMate v3.47.0 — Drive + Split Media

This build starts from the working v3.46.3 gold-thumbnail recovery build and adds a first-stage manual Google Drive backup/restore path for the encrypted core vault and separately encrypted media.

## Important: treat as a test build

- Keep v3.46.3 deployed and keep your recovery files unchanged until v3.47 passes the restore test.
- Use **Upload to drive** / **Backup Now** to upload media first and then the encrypted core vault.
- Use **Retrieve from drive** on a fresh/test profile to restore the core and referenced media.
- Do not use this as conflict-safe two-way sync yet. Backup is upload/replace, restore replaces local data after confirmation; simultaneous edits on two devices are not merged.

Read `V3.47-DRIVE-SYNC-TEST-GUIDE.md` before connecting Google Drive. The current build has passed static JavaScript syntax and ZIP integrity checks, but has not been end-to-end tested with the user's Google account or live Drive. OAuth Worker configuration and Google Cloud permissions are not changed by this ZIP.

The app preserves the working jewellery thumbnail and enlarged-photo viewer. Media records are encrypted with the vault key and stored in a `FinMate/media/` subfolder as separate files.


## v3.51.0 — Detailed Conflict Review
See `V3.51.0-DETAILED-CONFLICT-REVIEW.md` for the read-only record-level comparison and staging tests.


## v3.52.0 — Conflict Resolution Worksheet
See `V3.52.0-CONFLICT-RESOLUTION-WORKSHEET.md`. This is a review worksheet only; it does not apply decisions.


## v3.53.0 — Secure Compare Authorization + Local Baseline Foundation
Compare with Drive now starts the existing secure OAuth Worker flow when authorization is missing and resumes the comparison after unlock. After comparison, the user may opt to save an encrypted, device-local baseline in IndexedDB `syncmeta`. The baseline is not uploaded or shared and never triggers automatic merging. See `V3.53.0-OAUTH-AND-BASELINE.md`.


## v3.54.0 — Shared Baseline Foundation
See `V3.54.0-SHARED-BASELINE.md` for the encrypted shared-baseline staging flow and safety limits.


## v3.55.0 — Shared Baseline Review
See `V3.55.0-SHARED-BASELINE-REVIEW.md` for the read-only shared-baseline drift review and staging test instructions.


## v3.56.0 — Three-way Conflict Review

Adds a read-only comparison of the shared baseline, local profile, and current encrypted Google Drive vault. It classifies one-sided changes, two-sided conflicts, additions, and deletion candidates without applying any changes. See `V3.56.0-THREE-WAY-CONFLICT-REVIEW.md` for details and staging tests.


## v3.57.0 — Safe Conflict Resolution Worksheet

Adds an optional decision worksheet after three-way review. Decisions begin as `UNRESOLVED`; creating or editing the worksheet never changes FinMate data. Applying decisions is intentionally not enabled in this release. See `V3.57.0-SAFE-CONFLICT-RESOLUTION-WORKSHEET.md`.


## v3.58.0 — XLSX Conflict Resolution Worksheet

The three-way conflict review now exports an Excel workbook with Summary, Decisions, and Instructions sheets. Decisions start as `UNRESOLVED`; editing the workbook does not apply changes to FinMate. See `V3.58.0-XLSX-CONFLICT-WORKSHEET.md` for staging tests and safety limits.

## v3.59.1 — Safe Local Conflict Resolution

Adds an explicit XLSX decision import path for local-only conflict resolution. The worksheet carries review-time local/Drive fingerprints; apply rejects stale data, unresolved decisions, invalid choices, mismatched Drive/baseline identifiers, or pending local journal changes. A local encrypted recovery point is saved before applying. No Drive upload, baseline update, or media-store mutation occurs. See `V3.59.1-SAFE-LOCAL-CONFLICT-RESOLUTION.md` for limitations and staging tests.


## v3.60.0 — Conflict Apply Audit Report

After a successful local conflict-resolution apply, FinMate can optionally export a JSON audit report containing the chosen decision per record, local before/after SHA-256 fingerprints, recovery-point reference, and summary counts. The report does not include full financial record contents. It is optional and is generated only after the local save succeeds. The apply path remains local-only: no Drive upload, shared-baseline update, or media-store mutation. See `V3.60.0-CONFLICT-APPLY-AUDIT.md` for staging tests.

## v3.61.0 — Conflict Apply Audit Viewer

Adds a read-only Sync-page viewer for a previously exported v3.60.0 local conflict-apply audit JSON, structural checks for report/decision/hash/count consistency, and optional human-readable HTML export. Reports are selected from files saved by the user; the app does not persist audit history or change vault/Drive/baseline/media while viewing. See `V3.61.0-CONFLICT-AUDIT-VIEWER.md` for staging tests and limitations.


## v3.62.0 — Audit Fingerprint & Verification Manifest

Adds a canonical JSON SHA-256 fingerprint to the read-only audit viewer and HTML export, plus an optional verification-manifest JSON export. The fingerprint is for comparing report copies and spotting content differences; it is not a signature or proof of authenticity. Viewing/exporting reports does not change the vault, Drive, baseline, or media. See `V3.62.0-AUDIT-FINGERPRINT.md` for staging tests.


## v3.63.0 — Audit viewer button fix

Fixes the Sync-page audit report controls: the JSON picker uses the browser file-picker API when available, and Export viewer as HTML now guides the user to choose a report first, then exports it automatically after a valid report is loaded. The export button is no longer silently disabled when no report is loaded. This is a viewer-only usability fix; opening/exporting reports does not modify the vault, pending journal, Drive, shared baseline, or media. See `V3.63.0-AUDIT-VIEWER-BUTTON-FIX.md` for the test checklist.

## v3.64.0 — Audit manifest verification

Adds a read-only **Verify saved manifest** action to the conflict-apply audit viewer. It checks a selected verification manifest against the currently loaded report, including canonical SHA-256 fingerprint, report metadata, validation status, decision count, and summary counts. Mismatches are reported without modifying the vault, pending journal, Drive, shared baseline, or media. This is a consistency check, not a digital signature. See `V3.64.0-AUDIT-MANIFEST-VERIFICATION.md` for the test checklist.


## v3.65.0 — Audit verification receipt

Adds an explicit **Export verification receipt** action after manifest verification. The JSON receipt records the loaded report fingerprint and summary, selected manifest filename, verification timestamp, MATCH/MISMATCH result, and individual checks. It is generated locally and does not include vault financial data. It is not signed and is not proof of report authenticity or Google Drive state. See `V3.65.0-AUDIT-VERIFICATION-RECEIPT.md` for the test checklist.


## v3.66.0 — End-to-end validation release candidate

This is the planned end-to-end validation and release-candidate milestone. It consolidates the already-tested conflict review, safe local resolution, record-journal guards, media/recovery safeguards, audit viewer, manifest verification, and verification receipt into one versioned deployment package. No new sync or merge semantics are introduced in this release. Complete `V3.66.0-END-TO-END-VALIDATION.md` before treating the release as accepted.


## v3.66.1 — Recurring-generation journal race fix

Fixes a confirmed class of reload-related pending-journal regressions: automatic recurring transaction generation is now awaited during unlock instead of running an untracked asynchronous vault persist in the background. This prevents recurring-generation writes from racing with Drive upload/journal acknowledgement. It does not clear existing journal entries, alter media storage, or change conflict-resolution semantics. Validate using the targeted steps in `V3.66.1-RECURRING-JOURNAL-RACE-FIX.md`.


## v3.66.7

See `V3.66.7-GOOGLE-AUTH-MEDIA-FIX.md` for the separate Google authorization button, collapsible sync tools, and encrypted media externalization fix.


## v3.66.8

Removes the redundant Backup Now action, moves local encrypted vault export/import and Import media beneath the three primary Google Drive actions, and reconciles orphaned attachment JSON files in the Drive `media` folder after the core vault upload has been read-back verified. Pending journal entries continue to be deduplicated by collection and record ID so each effective entry/change contributes one pending item. See `V3.66.8-MEDIA-LIFECYCLE-PENDING-COUNT.md`.


## v3.67.0

- Renamed Google Drive actions to **Upload to drive** and **Retrieve from drive**.
- Renamed local file actions to **Save FinMate vault locally** and **Retrieve from local saved vault**.
- Local saved vault is a single JSON bundle containing the encrypted core vault plus each referenced encrypted media attachment. Restore verifies the core password and each bundled attachment before replacing the current vault; it creates a local recovery point and does not upload to Drive. Legacy encrypted core-only vault files remain importable, but naturally do not contain media.
- Kept **Export viewer as HTML** inside the Conflict apply audit viewer and removed the duplicate button above it.
- Updated privacy, terms and help pages for the local core+media bundle and restore behavior.
- Static validation only; perform user-side restore testing with a backup before relying on this release.


## v3.67.1 local saved vault format
Save FinMate vault locally creates a separate `FinMate-core-vault.json` plus a `media/` folder of encrypted attachment JSON files when directory access is supported. Restore selects the core file first and then all attachment files from `media/` in one multi-file selection. See `V3.67.1-SEPARATE-CORE-MEDIA-FILES.md`.
