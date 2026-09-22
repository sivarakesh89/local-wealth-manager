# Sharing FinMate with other people: release and maintenance guide

This guide describes a practical path from a personal/development deployment to a publicly usable FinMate release. Publishing the PWA and making Google sign-in available to everyone are separate steps.

## 1. Choose how you want to distribute it

**Recommended for a centrally maintained community app:** keep one official hosted deployment (for example, GitHub Pages) and publish versioned releases from your repository. Users visit the same URL and receive updates after deployment/cache refresh. You retain control of the code and can incorporate feedback into later releases.

Other options:
- **Private/internal use:** share the URL only with a small, known group. You can keep OAuth in Testing and add their accounts as test users, subject to Google's current restrictions.
- **User-managed copies:** publish the source and let users fork or host their own copy. Each operator must configure their own OAuth client, backend credentials, hosting, and policies. Do not share your personal OAuth client secret or backend secrets.

## 2. Prepare a release candidate

1. Keep a separate development branch and a stable release branch/tag (for example, `v3.11.0`).
2. Test a clean installation and an upgrade from the prior release in Chrome and Edge, desktop and Android. Test locking/unlocking, import/export, Drive upload/retrieval, offline behavior, and recovery from a backup.
3. Use test accounts and non-sensitive sample data. Verify that one person's vault cannot be read by another account or browser profile.
4. Check that no credentials, API keys, private financial data, or OAuth client secrets are committed to the repository. Keep the Google client secret only in the backend's secret store.
5. Make a dated backup and retain the previous known-good release so you can roll back.
6. Publish release notes, known limitations, a support/contact route, and simple installation/update instructions.

## 3. Host the PWA reliably

1. Deploy the static app over HTTPS. GitHub Pages can host the front-end; the Google OAuth Worker remains a separate backend service.
2. Confirm the deployed `app.js`, `index.html`, `app.css`, manifest, icons, and service worker are from the same release. Check the app's About version and test in a fresh browser profile.
3. Keep the repository as the source of truth. Make improvements in development, test them, then merge/tag and deploy a release. Users should not edit the production copy directly.
4. Document that browser storage is local to a browser/device until the user explicitly syncs. Encourage users to maintain an encrypted backup and protect their master password. Do not promise that browser storage alone is a permanent backup.

## 4. Make Google OAuth available beyond your test group

1. Use a dedicated production OAuth project/client rather than reusing a development configuration where practical.
2. Configure the app's audience as External if people outside your organization will use it. An Internal audience is limited to accounts in the relevant organization.
3. While in Testing, only listed test users can authorize the app; Google currently documents a cap of 100 test users and a seven-day authorization expiry for applicable testing configurations. This is not a suitable frictionless public-launch state.
4. Before a broad launch, publish the OAuth app and complete the verification steps Google requires for the actual scopes and data accessed. FinMate's Drive integration requests `drive.file`, which is scoped to files the app uses, but confirm its current classification and requirements in Google's console and documentation rather than assuming verification is unnecessary.
5. Provide accurate app name, purpose, developer/support contact, home page, and privacy policy. Explain what Drive access is requested, that the vault file is encrypted, what the backend handles, and how users can disconnect/revoke access and delete their data.
6. Keep the OAuth Worker available and monitored. Configure its allowed app origin, redirect/callback URLs, client ID, and secrets securely. Never put the client secret in front-end JavaScript or public repository files.

Google's requirements can change. Check the official references before launch:
- Manage app audience and publishing status: https://support.google.com/cloud/answer/15549945
- OAuth production readiness and verification: https://developers.google.com/identity/protocols/oauth2/production-readiness/overview
- Sensitive-scope verification: https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification
- Drive scope selection: https://developers.google.com/workspace/drive/api/guides/api-specific-auth

## 5. Privacy, security, and user trust

- Publish a plain-language privacy notice describing local storage, encryption, optional Drive sync, OAuth, diagnostics, retention/deletion, and how to contact the maintainer.
- Minimize permissions and data collection. Do not collect users' financial data or passwords for support. Ask users to share redacted screenshots/logs only.
- State that users control their Google account authorization and should never send you their master password, PIN, recovery secrets, OAuth tokens, or unredacted financial exports.
- Provide a clear way to report bugs and security issues privately. Triage security reports before public discussion.
- Establish a process for dependency updates, browser compatibility checks, vulnerability reports, backups, and emergency rollback.

## 6. Accept suggestions without destabilizing the release

1. Add a public issue/feedback template with FinMate version, browser/device, expected behavior, actual behavior, and safe reproduction steps. Warn users not to include financial records or credentials.
2. Label requests as bug, usability, accessibility, feature, or security. Ask follow-up questions and reproduce using synthetic data.
3. Prioritize changes based on user impact, privacy/security, feasibility, and maintenance cost. Keep a roadmap and changelog so users can see what was accepted or deferred.
4. Implement changes on a feature branch, add regression tests/checklists, and invite a small opt-in tester group to validate them.
5. Merge only after review; tag a new version, publish release notes, deploy, and preserve the previous release for rollback.

## 7. Important product boundary

FinMate is a personal finance tracking tool, not a bank, broker, tax adviser, or investment adviser. Avoid claiming that values, classifications, or market prices are guaranteed correct. Explain manual valuation and data-provider limitations, and let users review imported classifications and amounts.
