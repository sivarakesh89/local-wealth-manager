# FinMate v2.9.0

FinMate is a local-first Progressive Web App for personal finance, wealth, portfolio, goals, insights and encrypted Google Drive synchronization.

## What is included in v2.9

- Large official FinMate gold-tree branding in the left navigation.
- Mobile uses the same complete left navigation as laptop through a drawer.
- Essentials, Reports and Sync are visible on mobile.
- Google Drive OAuth diagnostics show the exact Authorized JavaScript origin to configure.
- Investment CSV imports use Invested Amount as the fallback value; Average Cost is not treated as current value.
- PDF import now extracts text locally and provides a preview using PDF.js; arbitrary bank/broker PDF layouts are not silently converted into transactions.
- Refresh market prices supports Yahoo symbols, AMFI mutual-fund NAVs, Gold, Silver and Crypto; INR physical-metal conversion uses USD/INR.
- Portfolio P/L is based on Current Value minus Invested Amount.
- Interactive SVG portfolio charts include legends and hover titles.
- Added stock, sector, market-cap, asset-class, mutual-fund, expense, income and bank-balance charts.
- Dark is the default theme for new vaults.
- Added Midnight, Aurora, Royal and Earth multi-tone themes.
- Biometric setup checks WebAuthn PRF support and uses platform authenticators when available; PIN remains the fallback.

## Privacy architecture

- Financial data is stored in browser IndexedDB.
- Vault contents are encrypted with AES-GCM.
- The master password wraps a random vault encryption key.
- PIN and supported biometric unlock methods wrap the same vault key; the PIN itself is not stored as plaintext.
- Google Drive is optional. Only the encrypted vault payload is synchronized.
- For a GitHub Pages deployment, the recommended long-term OAuth path is the supplied secure backend/Cloudflare Worker. The PWA never contains the OAuth client secret.

## First-time use

1. Host the files on an HTTPS URL (GitHub Pages is one no-install option).
2. Open the URL in Chrome.
3. Create the master password.
4. Add your financial data.
5. Optionally enable PIN under Settings → Quick unlock.
6. Optionally enable device biometrics on a browser/device that exposes WebAuthn PRF.
7. Optionally configure Google Drive under Sync.

## Google Drive troubleshooting

If the Google warning says the app is being tested, that is expected while the OAuth project is in Testing. The Google account being used must be listed under Test users. Also, the OAuth Web application must contain the exact FinMate page origin under Authorized JavaScript origins.

FinMate v2.7 shows the exact JavaScript origin and canonical fallback redirect URI. If the GIS popup closes before returning a token, FinMate can offer a full-page compatibility flow. For the proper long-term solution, deploy `google-drive-worker/` and use its URL in Sync → Advanced Google connection setup.

Google now recommends authorization-code flow for modern web applications; a static GitHub Pages site cannot safely hold the OAuth client secret or act as the authorization-code endpoint by itself.

Do not put the path portion of a GitHub Pages URL into the JavaScript-origin field. For example, if FinMate is hosted at `https://example.github.io/finmate/`, the JavaScript origin is `https://example.github.io`.

## Market price updates

For listed stocks/ETFs, enter a market symbol such as `RELIANCE.NS`, `AAPL` or another supported Yahoo symbol. For Indian mutual funds, enter the AMFI scheme code. Gold and Silver can use `GC=F` and `SI=F`; select the unit as grams or ounces. FinMate converts the market quote appropriately and converts USD/oz to INR/gram when the asset currency is INR.

Because browser CORS and provider policies can block direct market-data requests, the Stock Price Proxy setting is supported. For a dependable long-term deployment, use a provider/proxy you control rather than relying on a public CORS relay.

See `REAL-TIME-PRICES-GUIDE.md` and `PROXY-SETUP.md`.

## Imports

- Wealth → Import holdings CSV/XLSX: use holdings/investment files.
- Transactions → Import bank/credit-card statement: use CSV/XLS/XLSX statements.
- Import & Export: general file operations.
- PDF files are extracted locally with masked password entry. FinMate reconstructs common transaction rows, maps Debit to Expense and Credit to Income, and includes a **Recover PDF imports** action that can rebuild current/legacy PDF imports from saved rows or extracted PDF text.
- Wealth imports recognize an **Investment** column, infer Stock/Mutual Fund/Bond and other common asset types from the investment name, and preserve the uploaded spreadsheet display values in the source columns.
- Retrieve from Drive can rediscover the app-created FinMate folder/vault file on another browser/device instead of relying only on a folder ID stored locally.
- The mobile navigation drawer has an explicit scrollable menu with a visible scrollbar.

## Updating GitHub

Keep the same GitHub repository and URL. Replace the repository files with the contents of the new FinMate ZIP and commit the changes. Do not clear Chrome site data during an application update; that can delete the browser-side IndexedDB vault.

See `FINMATE-GITHUB-UPDATE-GUIDE.md`.

## Important

FinMate is a personal record-keeping and planning tool, not a regulated financial adviser. Market prices can be delayed, unavailable or blocked by provider/browser restrictions. Verify important figures before making financial decisions.
