# FinMate — Moving from Development Mode to Normal Working Mode

This guide is for the FinMate v3.29 release. The recommended model is:

**Private source repository → versioned release ZIP → HTTPS PWA hosting → users install/use the hosted PWA.**

## 1. Keep the source private

Keep the editable FinMate source in a private GitHub repository (or another private Git service). Do not put passwords, Google client secrets, Worker secrets or private API keys in `app.js`, `oauth-config.js`, the PWA bundle, screenshots or public documentation.

The frontend may contain a public OAuth client ID if the chosen Google OAuth design requires it, but the OAuth client secret must stay only in the Cloudflare Worker/server-side environment.

## 2. Use a separate production branch

A simple branch model:

- `develop` — your normal modification/testing branch.
- `release/v3.29.0` — the exact version that you have validated.
- `main` — the stable version you are comfortable distributing.

Do not edit the hosted production files directly. Make changes in `develop`, test them, then promote a tested release.

## 3. Host the PWA on HTTPS

GitHub Pages is suitable for the PWA because it gives users a normal HTTPS URL and requires no local installation.

Example production flow:

1. Keep the repository private if your GitHub plan/org permits the required Pages setup.
2. Publish the production build from the selected branch/folder.
3. Confirm the final HTTPS URL.
4. Open that URL in Chrome/Edge on desktop and Chrome/Safari on mobile.
5. Use “Install app” / “Add to Home Screen” from the browser.

The PWA stores financial data locally in the browser. Users do not need Node.js, Python or a local development server.

## 4. Google Drive OAuth

FinMate's secure architecture keeps the Google OAuth client secret in the supplied Cloudflare Worker.

Before public distribution, verify:

- Worker is deployed on HTTPS.
- `APP_ORIGIN` exactly matches the production PWA origin.
- Google OAuth redirect URI points to the Worker callback endpoint.
- Google Drive API is enabled.
- The frontend does not contain `GOOGLE_CLIENT_SECRET`.
- The Worker contains the secret as a server-side secret, not in source committed to the public repository.

When you change the production domain, update Google OAuth configuration and `APP_ORIGIN` together.

## 5. Version every release

For each release:

1. Increase `version` and `key` in `app.js`.
2. Change the service-worker cache name in `sw.js`.
3. Add a `Vx.y-CHANGELOG.md`.
4. Update the README/version references where appropriate.
5. Create a ZIP of the exact production files.
6. Run syntax validation.
7. Test the hosted PWA.
8. Keep the previous ZIP so you can roll back.

The service-worker cache version is important because browsers may otherwise continue serving an older cached app.

## 6. Test before sharing

Minimum release test:

### Security
- Create a test vault.
- Verify master-password unlock.
- Verify PIN/biometric if supported.
- Verify that wrong password does not open the vault.
- Verify Backup/Restore.
- Verify Clear All warnings.
- Never use a real financial vault for first-run testing.

### Transactions
- Add Expense with Count as expense = Yes.
- Add Expense with Count as expense = No.
- Confirm both remain in the transaction list.
- Confirm only Yes contributes to expense totals/analytics.
- Add a custom category directly from the category selector.
- Edit an existing transaction.
- Confirm Amount has no min/max filter.

### Axio import
Use a copy of the Axio export.
- Category name must be preserved.
- Place must become Description.
- Tags must be imported.
- Axio Expense = No must not count toward expense totals.
- Verify dates and amounts before importing into a real vault.

### Wealth
- Add one stock, mutual fund, PPF and bond.
- Confirm only populated categories appear.
- Expand/collapse each category.
- Confirm desktop table and mobile cards remain usable.

### Gold
- Enter metal and stone weights.
- Confirm Gross Weight = Metal + Stone.
- Confirm gold-weight totals use Metal Weight.
- Test photo upload and camera capture on a real phone.
- Test bill upload.
- Test a purchase date for which historical market data is available.
- Confirm the stored gold rate is visible on edit.

### Real Estate
- Test Upload and Camera for Deed, Patta, Chitta and Other.
- Test property photo Upload and Camera.
- Confirm documents/photos remain local and encrypted.

## 7. User feedback without destabilizing production

Give users the stable production URL. For suggestions:

1. Record the requested change.
2. Reproduce it in a separate test vault.
3. Implement in `develop`.
4. Test the affected area plus regression checks.
5. Release as a new version.

Avoid asking users to replace their production `app.js` manually.

## 8. Backup and rollback

Before every upgrade:

- Export an encrypted FinMate backup from a test/real vault as appropriate.
- Keep the previous production ZIP.
- Keep the previous service-worker version.
- Do not delete IndexedDB/site data as a troubleshooting step unless the user explicitly understands that this can remove the local vault.

If a release has a serious problem, restore the previous hosted release and investigate the new version separately.

## 9. Recommended distribution model

For normal users, give them only:

**FinMate HTTPS URL → Open → Create/unlock vault → Install PWA → Optional Connect Google Drive**

For developers/maintainers, keep:

**Private repository → development branch → release branch/tag → release ZIP → production deployment**

This gives you the ability to continue modifying FinMate based on user feedback without turning every user into a developer.

## 10. Important limitation

A JavaScript syntax check and local inspection cannot prove every browser, Android camera, PWA-installation, OAuth or Google Drive flow works on every device. After each release, perform a real smoke test on at least one desktop browser and one Android/iOS device before distributing the release.
