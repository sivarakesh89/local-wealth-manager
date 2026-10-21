# FinMate v3.47.0 — Drive + Split Media

This build starts from the working v3.46.3 gold-thumbnail recovery build and adds a first-stage manual Google Drive backup/restore path for the encrypted core vault and separately encrypted media.

## Important: treat as a test build

- Keep v3.46.3 deployed and keep your recovery files unchanged until v3.47 passes the restore test.
- Use **Upload core + media** / **Backup Now** to upload media first and then the encrypted core vault.
- Use **Retrieve core + media** on a fresh/test profile to restore the core and referenced media.
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
