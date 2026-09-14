# FinMate v2.1 — How to open and use it

This guide is written for a Windows laptop and an Android phone using Google Chrome.

## Important first point

Do **not** double-click `index.html` and expect the full PWA to work. A `file:///...` address is only a basic file test. The proper version must be opened from an **HTTPS URL**.

The easiest setup is:

1. Upload this folder to a static HTTPS host.
2. Open the resulting HTTPS URL in Chrome on the laptop.
3. Open the same URL in Chrome on Android.
4. Install it as an app on Android.
5. Your financial data remains in the browser's encrypted local storage. Hosting only serves the application files.

---

# Part A — Create your application URL without installing developer tools

The simplest browser-only method is GitHub Pages.

## Step 1 — Create a GitHub account

1. Open Chrome.
2. Go to GitHub: https://github.com/
3. Sign in, or create an account.
4. Complete any email verification GitHub asks for.

You do **not** need to install Git or VS Code for this method.

## Step 2 — Create a repository

1. In GitHub, click the **+** button near the top-right.
2. Choose **New repository**.
3. Repository name: use something simple such as:
   `local-wealth-manager`
4. Choose **Public** if you want to use standard GitHub Pages on a personal repository without additional GitHub plan considerations.
5. You may leave the README option unchecked because this ZIP already contains the application files.
6. Click **Create repository**.

## Step 3 — Upload the application files

1. Open the new repository.
2. Click **Add file**.
3. Click **Upload files**.
4. Extract the downloaded FinMate ZIP on your laptop first.
5. Select the files and folders from the extracted application folder.
6. Make sure `index.html` is at the **top level of the repository**.
7. Make sure the `icons` folder is also at the top level and contains `icon.svg`.
8. Scroll down.
9. Click **Commit changes**.

Your repository should look approximately like this:

```text
local-wealth-manager/
  index.html
  app.js
  app.css
  manifest.webmanifest
  sw.js
  icon.svg
  icons/
    icon.svg
  ...other guide files...
```

The most important requirement is that `index.html` is in the repository root.

## Step 4 — Turn on GitHub Pages

1. In the repository, click **Settings**.
2. In the left menu, find **Pages**. It may be under **Code and automation**.
3. Under **Build and deployment**, find **Source**.
4. Select **Deploy from a branch**.
5. For the branch, select **main**.
6. For the folder, select **/(root)**.
7. Click **Save**.
8. Wait a few minutes.
9. Refresh the Pages screen.

GitHub will show a URL similar to:

`https://YOUR-GITHUB-USERNAME.github.io/local-wealth-manager/`

Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username.

## Step 5 — Test the URL on the laptop

1. Copy the GitHub Pages URL.
2. Open Google Chrome.
3. Paste the URL into the address bar.
4. Press Enter.
5. You should see **FinMate — Unlock your vault** if you already created a vault in that browser, or the **Welcome** screen if this browser has not used the app before.

If you see a 404 page, wait a few minutes and refresh. Also verify that `index.html` is in the repository root.

---

# Part B — First use on the laptop

## If this is your first ever use

1. Open the HTTPS URL in Chrome.
2. The app shows **Welcome to FinMate**.
3. Create a strong master password.
4. Confirm it.
5. Click **Create local vault**.
6. The dashboard opens.
7. Immediately go to **Settings → Quick unlock** if you want a PIN.
8. Choose **Enable PIN**.
9. Create a 6–12 digit PIN.
10. Confirm the PIN.

The master password remains the recovery method. Never forget it.

## If you have already used the app on this laptop

1. Open the same HTTPS URL.
2. Enter your master password, or use the PIN if you enabled it.
3. The vault opens.

The browser stores the encrypted vault locally. Clearing the browser's site data can remove the local vault, so always keep an encrypted backup.

---

# Part C — How the main sections work

The information architecture in v1.6 is:

- **Dashboard** — overall summary and quick actions.
- **Essentials** — financial-health inputs such as income, expenses, savings, emergency fund and insurance.
- **Wealth** — assets, bank/cash accounts and liabilities.
- **Transactions** — income, expenses, recurring entries and budgets.
- **Goals** — financial goals and progress.
- **Insights** — analysis and recommendations based on your data.
- **Reports** — backup/report-oriented functions.
- **Sync** — encrypted Google Drive connection and synchronization.
- **Settings** — currency, security, backup, lock and clear-data controls.

Import is intentionally contextual:

- Use **Wealth → Import holdings CSV/XLSX** for investments/holdings.
- Use **Transactions → Import bank/credit-card statement** for transaction data.

## Profiles

At the top of the app you will see the profile selector.

- Select an existing profile to switch.
- Select **＋ New profile** to create another profile.
- Select **⚙ Manage profiles** to rename or delete profiles.

Each profile has its own financial dataset.

---

# Part D — Delete All vs Clear all data

## Delete All

Each major data list has its own **Delete All** button. For example:

- Wealth → Banks & money
- Wealth → All assets
- Wealth → Liabilities
- Transactions → Transactions
- Transactions → Recurring
- Transactions → Budgets
- Goals → Goals

Delete All asks for confirmation and then a second final confirmation.

## Clear all data

Go to:

**Settings → Clear all data**

This clears the financial data for the **current profile**. It does not delete the master vault itself.

Use an encrypted backup before performing destructive operations.

---

# Part E — Android: open and install

1. Make sure the application has an HTTPS URL from Part A.
2. On your Android phone, open **Google Chrome**.
3. Enter the same HTTPS URL.
4. Wait for the application to load.
5. Open the Chrome menu (`⋮`).
6. Choose **Install app** if Chrome shows it.
7. If Chrome instead shows **Add to Home screen**, choose that.
8. Confirm the installation.
9. An app icon named **FinMate** appears on your Home screen/app drawer.
10. Open it from the new icon.
11. Enter your master password the first time on that Android browser/device.
12. In **Settings → Quick unlock**, enable PIN.
13. If your Android/Chrome/device supports the required WebAuthn biometric capability, you can also choose **Enable fingerprint / device biometrics**.

Biometric support depends on the browser, Android version, device authenticator and WebAuthn PRF support. The app does not pretend that fingerprint is available when the browser cannot securely provide the required capability.

---

# Part F — Using the same vault on laptop and phone

The laptop and phone have separate browser storage. They do not automatically share the local vault.

For cross-device synchronization:

1. Set up Google Drive once in **Sync**.
2. Connect the laptop and upload the encrypted vault.
3. On the phone, connect Google Drive using the same Google account and choose the same folder.
4. Retrieve the encrypted vault.
5. Enter the same master password when required.

Google Drive receives encrypted vault ciphertext, not readable financial records.

Before switching between devices, it is safest to sync the latest version and avoid editing both devices at the same time.
