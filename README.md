# FinMate PWA v2.1.0

FinMate is a privacy-first, local-first personal finance and wealth manager for Google Chrome on laptop and Android. The app stores financial data in an encrypted browser vault. Google Drive synchronization is optional and uploads the encrypted vault.

## What is new in v2.1.0

- Fixed the **Connect Google Drive** button action.
- Google Drive connection creates/uses a `FinMate` folder automatically.
- Added clearer Google connection error messages.
- The sidebar FinMate icon is larger; the header icon remains compact.
- The official icon assets are PNG files generated directly from the selected FinMate gold-tree artwork.
- Settings → About FinMate is collapsed until opened and shows the app version.
- Import buttons now open the browser's file chooser instead of saying `Choose a file first`.
- Wealth imports are treated as investment/holding data; Transactions imports can add transaction rows from CSV/XLS/XLSX statements.
- Updated service-worker cache version to v2.1.

## First-time laptop use

1. Put these files on an HTTPS static host (GitHub Pages is one option).
2. Open the resulting HTTPS URL in Google Chrome.
3. Create your master password.
4. Add your profile, accounts, assets, liabilities, transactions and goals.
5. Use Settings for categories, PIN/biometric options, backup and About.

Do not double-click `index.html` for normal PWA use. `file://` mode is suitable only for limited local inspection and does not provide the normal PWA/Google OAuth environment.

## Android use

1. Open the same HTTPS FinMate URL in Android Chrome.
2. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
3. Open the installed FinMate app.
4. Unlock with your password or configured PIN; supported devices may offer biometric/WebAuthn unlock.

## Google Drive

Go to **Sync → Advanced Google connection setup** and enter the Web application OAuth Client ID. Click **Save connection settings**, then **Connect Google Drive**. Google sign-in should open from that button. After authorization FinMate creates a `FinMate` folder and can sync `FinMate-vault.json`.

The OAuth client must have the correct **Authorized JavaScript origin** for the HTTPS site where FinMate runs. The Drive API must be enabled. If the OAuth consent screen is in Testing, the Google account must be listed as a test user.

The optional Picker API key and Cloud Project Number are only needed for the optional existing-folder picker.

## Import

- **Wealth → Import holdings CSV/XLSX**: opens a file chooser and previews investment columns.
- **Transactions → Import bank/credit-card statement**: opens a file chooser and imports common CSV/XLS/XLSX transaction rows.
- PDF files are recorded as local import notes; exact PDF parsing is statement-format dependent.

## Market prices

Use **Wealth → Refresh market prices**. Browser calls to public market endpoints may be blocked by CORS or rate limits. For testing, FinMate accepts an HTTPS CORS/market-data proxy ending in `url=`. For a durable personal deployment, use a small private HTTPS proxy with a proper market-data provider.

## Updating an existing GitHub Pages deployment

Keep the same repository and URL. Replace the application files with the files from the new FinMate ZIP, commit the changes, wait for GitHub Pages to publish, then refresh Chrome. Do **not** delete browser site data when updating because the encrypted vault is stored in IndexedDB.

## Included guides

- `OPEN-AND-USE-GUIDE.md` — laptop and Android opening/usage.
- `URL-CREATION-GUIDE.md` — creating an HTTPS URL with GitHub Pages.
- `ANDROID-INSTALL-GUIDE.md` — Android Chrome installation.
- `FINMATE-GITHUB-UPDATE-GUIDE.md` — updating an existing repository.
- `GOOGLE-OAUTH-STEP-BY-STEP.md` — detailed OAuth setup.
- `GOOGLE-DRIVE-ONE-TIME-CONNECT.md` — Drive connection overview.
- `SETUP-GOOGLE-DRIVE.md` — Drive technical notes.
- `REAL-TIME-PRICES-GUIDE.md` — practical price refresh architecture.
- `PROXY-SETUP.md` — proxy setup notes.

## Security reminder

Never put bank passwords, UPI PINs, OTPs, card PINs or other authentication secrets into FinMate. If a Google API key has ever been shared publicly, rotate it and restrict the replacement key to the required APIs and website origin.
