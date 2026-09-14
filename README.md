# FinMate PWA v1.6

A privacy-first, local-first personal finance and wealth manager for laptop and Android Chrome.

## The easiest way to use it

**Do not double-click `index.html` for normal use.**

The correct flow is:

1. Put the application on an HTTPS static host.
2. Open the HTTPS URL in Google Chrome on your laptop.
3. Open the same URL in Chrome on Android.
4. Install it on Android with **Install app** / **Add to Home screen**.

No finance-data backend is required. The hosted files only serve the application. Your vault is encrypted locally before it is stored in browser IndexedDB.

## Guides included in this ZIP

- `OPEN-AND-USE-GUIDE.md` — complete laptop + Android usage guide.
- `URL-CREATION-GUIDE.md` — browser-only GitHub Pages URL setup, with no Git/Node/VS Code required.
- `ANDROID-INSTALL-GUIDE.md` — Android Chrome installation steps.
- `GOOGLE-OAUTH-STEP-BY-STEP.md` — detailed Google Cloud / OAuth / Picker setup.
- `GOOGLE-DRIVE-ONE-TIME-CONNECT.md` — short explanation of the one-time Drive connection.
- `SETUP-GOOGLE-DRIVE.md` — technical Drive notes.

## v1.6 changes

### Information architecture

Top-level navigation is now:

- Dashboard
- Essentials
- Wealth
- Transactions
- Goals
- Insights
- Reports
- Sync
- Settings

Recurring entries and budgets are presented inside **Transactions**. Imports are contextual:

- Wealth → Import holdings CSV/XLSX
- Transactions → Import bank/credit-card statement

### Data management

- Delete All is shown above the main lists for assets, banks, liabilities, transactions, recurring entries, budgets and goals.
- Delete All requires confirmation and a final confirmation.
- **Clear all data** is in **Settings** and clears financial data for the current profile.

### Profiles

The top profile selector supports:

- switching profiles
- creating a new profile
- Manage profiles
- renaming profiles
- deleting profiles, with confirmation

The profile manager was corrected so it no longer depends on a misleading Save button.

### Security / unlock

The vault now uses a random AES-256 data key wrapped by the master password. This allows additional unlock methods without storing the raw vault key.

- Master password remains the recovery method.
- Optional 6–12 digit PIN unlock is available on laptop and Android browser/device.
- Optional fingerprint/device biometric unlock uses WebAuthn with the PRF extension when the browser/device supports it.
- If biometric PRF is unavailable, the app does not fake fingerprint support; use password or PIN instead.

Existing v2 vaults are migrated to the v3 wrapped-key format after a successful password unlock.

### Google Drive

Normal use is now intended to be:

**Sync → Connect Google Drive → Google authorization → choose folder → connected**

The OAuth Client ID and Picker API key are kept under **Advanced Google connection setup** rather than being part of the normal sync workflow.

The app uses the narrower `drive.file` scope rather than full Drive access.

Google Cloud configuration is still technically required once for the web application because Google must identify the browser application and authorize access to private Drive data. See `GOOGLE-OAUTH-STEP-BY-STEP.md`.

### PWA reliability

The package now contains `icons/icon.svg` in the path referenced by the manifest and service worker.

## Security model

- AES-256-GCM vault encryption
- Random data-encryption key
- Password-derived AES key used only to wrap the data key
- PBKDF2-SHA-256 with 210,000 iterations for password/PIN wrapping
- Local IndexedDB storage
- Google Drive receives encrypted vault ciphertext only

Never store bank passwords, UPI PINs, OTPs, card PINs or other payment secrets in this app.

## Important backup rule

Keep an encrypted backup before major upgrades or destructive operations. Browser site-data can be lost if you clear Chrome's site data or reset the browser.

## Google Drive scope

The application requests:

`https://www.googleapis.com/auth/drive.file`

This is intentionally narrower than full `drive` access.

## Price updates

Stocks/ETFs may use market tickers such as `RELIANCE.NS` or `AAPL`. Indian mutual funds can use AMFI scheme codes. Browser CORS can affect public market-data endpoints; the app reports failures instead of silently inventing prices.

## Market price updates

See `REAL-TIME-PRICES-GUIDE.md`. Browser-based Yahoo Finance calls are best-effort only; a small HTTPS price proxy is the dependable approach for automatic stock/ETF prices.

## Updating GitHub Pages

See `FINMATE-GITHUB-UPDATE-GUIDE.md`. Keep the same repository and URL and replace the application files; do not clear browser site data because the encrypted vault lives in IndexedDB.
