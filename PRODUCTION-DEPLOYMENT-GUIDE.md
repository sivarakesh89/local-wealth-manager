# FinMate — Detailed Production & User Distribution Guide (v3.30)

This guide describes how to move FinMate from development to a normal user-facing PWA while keeping the source maintainable so you can continue making improvements from user feedback.

## 0. Understand the distribution model first

Use this model:

**Private source repository → development/testing → versioned release → HTTPS hosting → users**

Users should normally receive **one HTTPS FinMate URL**, not the source ZIP and not `app.js` files.

Each user gets:

1. Their own browser-local encrypted FinMate vault.
2. Their own Master password.
3. Their own optional PIN/biometric unlock on their device.
4. Their own optional Google Drive authorization.
5. Their own encrypted `FinMate-vault.json` in their Google Drive `FinMate` folder.

You do **not** need to collect a user's Google password, Drive password, PIN, Master password or OAuth secret.

---

# PART A — What you should keep privately

## 1. Create a private source repository

Recommended repository contents:

- `index.html`
- `app.js`
- `app.css`
- `sw.js`
- `manifest.webmanifest`
- `oauth-config.js`
- `icons/`
- `google-drive-worker/` (Worker source, if you maintain it here)
- README and release/change logs
- setup guides

Do **not** commit:

- Google client secrets
- Cloudflare Worker secrets
- API keys that are intended to remain private
- personal financial data
- real user vault exports
- screenshots containing credentials
- browser IndexedDB databases

A frontend OAuth client ID may be public depending on the OAuth design; the OAuth client secret must remain server-side.

---

# PART B — Recommended GitHub structure

## 2. Use three stages

A simple structure is:

- `develop` — where you make and test changes.
- `release/v3.30.0` — exact release candidate.
- `main` — stable production version.

For a new change:

1. Start from the current stable release.
2. Make the change in `develop`.
3. Test it using a test vault.
4. Create a release branch/tag.
5. Package the exact tested files.
6. Publish that release.
7. Keep the previous release ZIP for rollback.

Do not edit production `app.js` manually after deployment.

---

# PART C — Prepare the v3.30 release

## 3. Check the version numbers

Open `app.js` and confirm the application version/key are the v3.30 values.

Open `sw.js` and confirm the service-worker cache is also v3.30.

For every future release, change both. Otherwise a browser can continue serving an older cached application.

## 4. Run local syntax checks

From the FinMate folder:

```bash
node --check app.js
node --check sw.js
```

Both should finish without a syntax error.

This does not replace real browser/device testing.

## 5. Create a clean release ZIP

The ZIP should contain the files needed to run the PWA, including:

- `index.html`
- `app.js`
- `app.css`
- `sw.js`
- `manifest.webmanifest`
- `oauth-config.js`
- `favicon.png`
- `icons/`
- Google Drive Worker/config files that are intentionally part of your deployment package
- user documentation

Do not put personal vault data into this ZIP.

---

# PART D — Publish the PWA on GitHub Pages

GitHub Pages can publish from a branch or GitHub Actions. GitHub currently documents both approaches. A project site published from a private repository can still be publicly accessible depending on the GitHub plan/configuration, so **private source repository does not automatically mean private website**.

## 6. Create the GitHub repository

1. Sign in to GitHub.
2. Click **New repository**.
3. Give it a name, for example:
   `finmate`
4. Keep the repository **Private** if your GitHub plan supports Pages for private repositories.
5. Create the repository.
6. Do not upload personal financial data.

GitHub documents that Pages is available for public repositories on GitHub Free and for private repositories on supported paid plans. citeturn0search0

## 7. Upload the FinMate source

You can use GitHub Desktop, Git or the GitHub web interface.

For GitHub Desktop:

1. Install GitHub Desktop.
2. Sign in.
3. Clone your `finmate` repository.
4. Copy the tested FinMate release files into the repository.
5. Commit with a message such as:
   `Release FinMate v3.30.0`
6. Push to GitHub.

## 8. Configure GitHub Pages

On GitHub:

1. Open the `finmate` repository.
2. Click **Settings**.
3. In the left sidebar, open **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch** if you want the simple static deployment model.
5. Select your production branch, for example `main`.
6. Select `/ (root)` if your `index.html` is in the repository root.
7. Click **Save**.
8. Wait for the deployment.
9. Open the URL GitHub shows under the Pages section.

GitHub's current documented branch deployment flow is Settings → Pages → Build and deployment → Deploy from a branch → branch/folder → Save. citeturn0search0

## 9. Verify HTTPS

Open the production URL.

It should begin with:

`https://`

GitHub Pages supports HTTPS and allows HTTPS enforcement.

Do not distribute an `http://` URL.

---

# PART E — Important GitHub security point

## 10. Your repository can be private while the website is public

This distinction is important.

**Private repository** means your source code is restricted.

**Public GitHub Pages site** means anyone with the website URL can load the application.

That is normally acceptable for FinMate because the user's financial data is intended to remain in the user's local encrypted browser vault. However, do not put secrets or personal data into the website bundle.

GitHub explicitly warns that Pages sites can be publicly available even when their source repository is private, depending on the account/organization configuration.

If you require a genuinely private Pages site, GitHub's current private Pages access-control option is an Enterprise Cloud capability.

For normal public distribution, therefore, the recommended arrangement is:

**Private source code + public FinMate website + encrypted local user data.**

---

# PART F — Configure the Cloudflare OAuth Worker

## 11. Why the Worker is needed

FinMate's secure Google Drive architecture keeps the Google OAuth client secret out of the browser.

The Worker handles the sensitive OAuth server-side operations.

Your current architecture uses endpoints such as:

- `/start`
- `/callback`
- `/redeem`
- `/refresh`
- `/health`

## 12. Worker environment

The Worker should contain the server-side values:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `APP_ORIGIN`
- KV binding such as `FINMATE_KV`

Never put `GOOGLE_CLIENT_SECRET` into `app.js`.

## 13. Set APP_ORIGIN

Set `APP_ORIGIN` to the **exact production FinMate origin**.

For example, if your production site is:

`https://sivarakesh89.github.io`

then the Worker must use that production origin.

Do not leave the development origin in production.

## 14. Deploy the Worker

From the Worker project:

1. Install/configure Wrangler if you use the command-line deployment flow.
2. Log in to Cloudflare.
3. Select the FinMate Worker.
4. Confirm the KV binding exists.
5. Confirm the OAuth secrets exist as Cloudflare secrets.
6. Deploy the Worker.
7. Open the Worker `/health` endpoint in a browser.
8. Confirm it returns the expected healthy response.

Do not paste the client secret into chat, screenshots or this guide.

---

# PART G — Configure Google Cloud OAuth once for the application

This is the **developer/admin setup**. It is not repeated by every FinMate user.

## 15. Open Google Cloud

1. Sign in using the Google account that owns the FinMate OAuth project.
2. Open the Google Cloud project used for FinMate.
3. Confirm the correct project is selected.

## 16. Enable Google Drive API

1. Open **APIs & Services**.
2. Open **Library**.
3. Search for **Google Drive API**.
4. Open it.
5. Click **Enable** if it is not already enabled.

## 17. Configure OAuth consent / publishing status

For an external application, Google currently distinguishes testing from production. In testing, only explicitly added test users can authorize the app; Google documents that test users are added manually and that testing has limitations.

For real distribution:

1. Open **Google Auth Platform / OAuth consent screen** in the Google Cloud project.
2. Select the appropriate user type.
3. Enter the FinMate application name.
4. Enter the support/developer information requested by Google.
5. Add the required scopes used by FinMate.
6. Add the production application information requested by Google.
7. If Google requires verification for the scopes/configuration you selected, complete the verification process.
8. Move the application to the production/published state when ready.

Do not distribute FinMate to many users while it is still configured as a restricted testing application unless every intended user has been deliberately added as an allowed test user.

## 18. Configure the OAuth client

Use the OAuth client associated with the FinMate Worker.

Add the production web origin as an authorized JavaScript origin when the selected OAuth architecture requires it.

Add the **Worker callback URL** as the authorized redirect URI.

Important: the redirect URI is the Worker callback, not a guessed FinMate URL. Use the exact URI shown by your FinMate configuration/Worker.

---

# PART H — How EACH user gets their own Google Drive

This is the part that is most important for distributing FinMate to other people.

## 19. You do NOT share your Google Drive with them

Do not create one common FinMate folder and ask everyone to use your Drive.

Instead:

**User A → User A's Google account → User A's FinMate folder**

**User B → User B's Google account → User B's FinMate folder**

**User C → User C's Google account → User C's FinMate folder**

FinMate creates/uses a `FinMate` folder in the Google Drive belonging to the Google account that the user authorizes.

## 20. What you send to each user

Send only:

1. The production FinMate URL.
2. A short user guide.
3. Optional Android/iPhone installation instructions.
4. A reminder to remember their Master password.
5. A reminder that Google Drive is optional.

Do **not** send:

- your Google password
- your Google client secret
- your Cloudflare secret
- your personal Drive folder
- your personal encrypted vault
- your developer credentials

## 21. User first-run procedure

Tell the user:

1. Open the FinMate HTTPS URL.
2. FinMate shows **Create local vault**.
3. Enter a strong Master password.
4. Confirm it.
5. FinMate automatically moves to the unlock screen.
6. Enter the Master password to unlock.
7. Optionally go to Settings and configure a PIN.
8. Optionally configure fingerprint/biometric unlock on a supported device.
9. Start entering their own financial data.

Their financial data is stored in their browser's local encrypted vault.

## 22. User Google Drive setup

When the user wants backup/sync:

1. Open **Sync** in FinMate.
2. Choose **Connect Google Drive**.
3. Google opens its authorization screen.
4. The user selects **their own Google account**.
5. The user reviews the requested permissions.
6. The user approves access.
7. Google returns to FinMate.
8. FinMate creates/fetches the user's `FinMate` folder in that user's Drive.
9. FinMate can then use **Sync Now**.
10. The encrypted vault is uploaded to that user's Drive.

The user should never type their Google password into FinMate. Google handles that authentication page.

## 23. If the user changes Google accounts

If the user wants a different Google account:

1. Disconnect the existing Drive connection in FinMate.
2. Connect Google Drive again.
3. Select the new Google account.
4. Confirm the new account's Drive authorization.
5. Verify the correct `FinMate` folder is being used.

Do not copy another user's vault into the account unless the user explicitly wants to restore that encrypted backup and knows the corresponding Master password.

---

# PART I — Android installation for users

## 24. Android Chrome

1. Open the production FinMate HTTPS URL in Chrome.
2. Wait for FinMate to load completely.
3. Open Chrome's menu.
4. Choose **Install app** or **Add to Home screen**, depending on the browser/device wording.
5. Confirm installation.
6. Open FinMate from the new icon.
7. Create/unlock the local vault.
8. If desired, configure PIN and fingerprint in Settings.

Camera capture for jewellery/property documents depends on browser/device permission support. Test it on the actual Android devices you intend to support.

---

# PART J — iPhone/iPad installation

## 25. Safari

1. Open the production FinMate HTTPS URL in Safari.
2. Tap Share.
3. Choose **Add to Home Screen**.
4. Confirm.
5. Open FinMate from the Home Screen.
6. Create/unlock the local vault.
7. Configure supported security options.

Again, test camera and WebAuthn behaviour on the actual iOS versions you intend to support.

---

# PART K — Developer workflow after users start giving suggestions

## 26. Never modify the production copy directly

When a user reports a problem:

1. Record the issue.
2. Reproduce it in a separate test vault.
3. Create a change in `develop`.
4. Test only the affected functionality first.
5. Run regression tests.
6. Update the version.
7. Update `sw.js` cache version.
8. Add a changelog.
9. Build/package the new release ZIP.
10. Deploy it.
11. Test the hosted URL.
12. Announce the new version.

## 27. Example future release

Suppose the next change is a user-requested dashboard improvement.

Use:

`develop` → test → `release/v3.31.0` → `main` → GitHub Pages → users

Keep:

- `finmate-pwa-v3.30.0.zip`
- `finmate-pwa-v3.31.0.zip`

If v3.31 has a serious problem, you have the previous release available for rollback.

---

# PART L — Release testing checklist

## 28. First-run authentication

- New browser opens FinMate.
- Create Master password.
- User is automatically redirected to unlock.
- Master password unlock works.
- Wrong password fails.
- PIN works if enabled.
- Fingerprint/biometric directly opens the device authentication prompt when supported.

## 29. Transactions

- Add Expense.
- Count as expense = Yes.
- Count as expense = No.
- Verify totals.
- Add custom category inline.
- Verify Amount filter is removed.
- Import Axio export.
- Verify Category.
- Verify Place → Description.
- Verify Tags.

## 30. Real Estate

For every property test:

- Upload Deed.
- Camera Deed.
- Upload Patta.
- Camera Patta.
- Upload Chitta.
- Camera Chitta.
- Upload Other document.
- Camera Other document.
- Upload property photo.
- Camera property photo.
- Set an Expense link tag.
- Add a transaction using that property link.
- Confirm the transaction appears under the property.
- Add a liability linked to the property.
- Confirm the liability appears under the property.

## 31. Wealth

- Add stock.
- Add mutual fund.
- Add PPF.
- Add bond.
- Confirm only populated asset categories appear.
- Confirm ticker/symbol explanation panel is gone.
- Confirm market-linked ticker fields still work where needed.

## 32. Google Drive

Use a dedicated test Google account first.

- Connect Drive.
- Verify FinMate folder.
- Sync Now.
- Confirm encrypted vault file appears.
- Disconnect.
- Reconnect.
- Test restore/download.
- Confirm another Google account gets its own Drive folder.

---

# PART M — Backup and rollback

## 33. Before every release

Keep:

- previous production ZIP
- new production ZIP
- changelog
- source commit/tag
- encrypted test backup
- Worker version/config record

Do not delete users' browser data as a troubleshooting shortcut.

Clearing IndexedDB/site data can remove the local vault from that browser.

## 34. If a release is broken

1. Stop distributing the new version.
2. Keep the problematic ZIP for investigation.
3. Restore the last known-good production build.
4. Increment/fix the release properly.
5. Test again.
6. Publish the corrected version.

Do not tell users to manually replace `app.js` unless there is an exceptional emergency and you fully understand the consequences.

---

# PART N — What a normal user should see

The ideal user experience is:

**Open FinMate URL → Create Master password → automatic unlock screen → enter password → use FinMate → optionally enable PIN/biometric → optionally connect their own Google Drive → Sync Now.**

The user does not need:

- Node.js
- Python
- GitHub
- Git
- Cloudflare
- Google Cloud Console
- OAuth terminology
- source code

Those are maintainer/developer concerns.

---

# PART O — Important final security rules

1. Never ask users for their Google password.
2. Never ask users for their FinMate Master password.
3. Never ask users for their PIN.
4. Never put Google client secrets in frontend JavaScript.
5. Never upload unencrypted financial data to a shared public folder.
6. Never include real financial data in the release ZIP.
7. Keep encrypted backups securely.
8. Keep the production source controlled and versioned.
9. Test upgrades using a test vault before using a real vault.
10. Test at least one desktop browser and one real Android/iOS device before each release.

## Current recommended architecture

**Your private GitHub source**
↓
**Versioned FinMate release**
↓
**HTTPS GitHub Pages PWA**
↓
**User's browser + encrypted local vault**
↓ optional
**User's own Google Drive / FinMate folder / encrypted vault**

This keeps the development process maintainable while allowing you to continue improving FinMate from user feedback.
