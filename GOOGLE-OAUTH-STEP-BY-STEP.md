# Google Drive / OAuth setup — FinMate v2.4

This is the detailed one-time setup. You only need to do this because a browser application must identify itself to Google before Google will allow it to access private Drive data.

Google's current documentation uses **Google Auth platform → Clients** for web OAuth credentials, and Google's Picker documentation requires a Cloud project, the Google Picker API, an API key and an OAuth client ID. citeturn0search0turn0search1

> **Important:** You do not give FinMate your Google password. You sign in directly in Google's authorization window. The app receives an OAuth access token. Your master password is never sent to Google.

---

# What you will create

You will create three Google Cloud items in one project:

1. **Google Drive API** enabled.
2. **Google Picker API** enabled.
3. A **Web application OAuth 2.0 Client ID**.
4. An **API key** for Google Picker.

For this app, the Drive authorization scope is `drive.file`, which is narrower than full Drive access. The app uses the Picker so you can choose the folder instead of copying a folder ID manually.

Google's web Picker documentation specifically describes using an OAuth token plus a developer/API key and recommends restricting the API key to your website and the relevant APIs. citeturn0search0

---

# Part 1 — Create the Google Cloud project

## Step 1: Open Google Cloud Console

In Chrome, open:

https://console.cloud.google.com/

Sign in using the Google account that you want to use with FinMate.

## Step 2: Create a project

1. At the top of the Google Cloud Console, click the project selector.
2. Click **New Project**.
3. For project name, enter:
   `FinMate`
4. If Google asks for an organization, leave it as the default available to your account.
5. Click **Create**.
6. Wait for the project to be created.
7. Select the new **FinMate** project from the project selector.

You must make sure all later API credentials are created inside this project.

---

# Part 2 — Enable Google Drive API

1. In Google Cloud Console, make sure **FinMate** is selected.
2. Open **APIs & Services**.
3. Choose **Library**.
4. Search for:
   `Google Drive API`
5. Open **Google Drive API**.
6. Click **Enable**.
7. Wait until the API is enabled.

Google's Drive JavaScript quickstart also requires the Drive API to be enabled before making Drive API requests. citeturn0search1

---

# Part 3 — Enable Google Picker API

1. Stay in the same Google Cloud project.
2. Open **APIs & Services → Library**.
3. Search for:
   `Google Picker API`
4. Open it.
5. Click **Enable**.

The Google Picker web guide explicitly lists enabling Google Picker API as a prerequisite. citeturn0search0

---

# Part 4 — Configure Google Auth platform / consent screen

Google's interface may display this as **Google Auth platform**.

1. In Google Cloud Console, open **Google Auth platform**.
2. If Google shows **Get started**, click it.
3. Under **App information**, enter:
   - App name: `FinMate`
   - User support email: choose your Google account email.
4. Continue.
5. For **Audience**, if this is a personal Google account, choose **External** if Google gives you that choice.
6. Continue.
7. Enter your developer/contact email when requested.
8. Review the information.
9. Finish the setup.

Google's current Drive quickstart describes the Google Auth platform areas as Branding, Audience and Data Access. citeturn0search1

### If Google shows “Testing” or “Test users”

For a personal app that is not published to the public, add the Google account you will use with the app as a **test user** if Google asks you to do so.

Use the same Gmail/Google account that contains the Drive folder you want to use.

Do not add random people. Only add the accounts that should test the application.

---

# Part 5 — Create the OAuth Client ID

This is the most important part.

1. Open **Google Auth platform → Clients**.
2. Click **Create Client**.
3. For application type, choose **Web application**.
4. Give it a name such as:
   `FinMate Web`
5. Find **Authorized JavaScript origins**.
6. Click **Add URI**.

## What should you enter as the JavaScript origin?

If you use GitHub Pages with a URL like:

`https://MYUSERNAME.github.io/local-wealth-manager/`

the authorized JavaScript origin is:

`https://MYUSERNAME.github.io`

**Do not include** `/local-wealth-manager/` in the OAuth origin.

The origin consists of the scheme + host + optional port.

### Example

Application URL:

`https://sivakumar123.github.io/local-wealth-manager/`

Authorized JavaScript origin:

`https://sivakumar123.github.io`

### If you later use a custom domain

Suppose the app becomes:

`https://wealth.example.com/`

Add:

`https://wealth.example.com`

### If you test locally

You may also add the exact localhost origin you use, for example:

`http://localhost:8000`

Do not add `file:///C:/...` because `file://` is not a valid PWA origin for this OAuth flow.

Google's current web-app credential instructions specifically require an **Authorized JavaScript origin** for client-side JavaScript applications. Google also notes that client secrets are not used for web applications. citeturn0search0turn0search4

## Authorized redirect URI

For this PWA's token-client flow, you do not need to invent a redirect endpoint. The Google Identity Services browser token flow uses the authorized JavaScript origin.

If Google shows an **Authorized redirect URIs** section, leave it empty unless you later add a server-side OAuth flow.

## Create it

1. Click **Create**.
2. Google will show the new OAuth client.
3. Copy the **Client ID**.
4. It normally looks similar to:

`123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

Keep this value. It is not the same thing as a client secret.

---

# Part 6 — Create the Google Picker API key

The Picker needs a developer/API key in addition to the OAuth client ID. Google's Picker documentation describes this API-key requirement. citeturn0search0

1. Open **APIs & Services → Credentials**.
2. Click **Create credentials**.
3. Choose **API key**.
4. Google creates a key beginning with something similar to:

`AIza...`

5. Copy it.

Do not publish an unrestricted key. Restrict it before using the application.

---

# Part 7 — Restrict the API key

This step is strongly recommended.

1. In the API key details page, find **Application restrictions**.
2. Choose **Websites** / HTTP referrers if that is the option shown.
3. Add your application website.

For a GitHub Pages site such as:

`https://MYUSERNAME.github.io/local-wealth-manager/`

add a website restriction covering your GitHub Pages site. A safe pattern is:

`https://MYUSERNAME.github.io/*`

4. Google's Picker documentation also notes that the Picker runs in an iframe hosted on `docs.google.com`; when restricting the key by website, add the required Google Docs origin as instructed by Google if the Picker reports an invalid developer key. citeturn0search0

## API restrictions

1. Choose **Restrict key**.
2. Select the APIs used by the app:
   - Google Picker API
   - Google Drive API
3. Save.

## Google Cloud project number / Picker App ID

The app also has an optional **Google Cloud project number (Picker App ID)** field in Advanced Google connection setup. If you use it, enter the numeric **Project number** shown on your Google Cloud project information page. It is different from the OAuth Client ID.

Google's Picker documentation describes `setAppId` as the Drive App ID and uses the Cloud project number for this purpose. citeturn0search0

The exact names displayed can change slightly in Google Cloud Console.

---

# Part 8 — Put the credentials into FinMate

Open the FinMate HTTPS URL.

1. Open **Sync**.
2. You will see **Connect Google Drive**.
3. Before pressing it the first time, expand **Advanced Google connection setup**.
4. Paste your **OAuth Client ID** into **OAuth Client ID**.
5. Paste your **Google Picker API key** into **Google Picker API key**.
6. If you have the numeric Google Cloud project number, paste it into **Google Cloud project number (Picker App ID)**.
7. Leave the vault filename as:
   `Local-Wealth-Manager-vault.json`
8. If you want automatic synchronization after saving, select **Yes** for automatic sync.
9. Click **Save connection settings**.

This is the only place where you should normally need to enter the technical Google credentials.

---

# Part 9 — Use the friendly “Connect Google Drive” flow

Now click **Connect Google Drive**.

The intended sequence is:

1. Google opens the authorization prompt.
2. Choose your Google account.
3. Review the permissions.
4. Allow access.
5. FinMate opens Google Picker.
6. Select an existing dedicated folder, or select the folder you want to use for the vault.
7. The app remembers the folder ID locally.
8. The Sync screen changes to **Google Drive connected**.
9. Press **Sync now**.
10. The app creates/updates the encrypted vault file.

From then on, you should not have to copy folder IDs or deal with Cloud Console during normal use.

The Cloud Console steps above are one-time application setup, not normal day-to-day use.

---

# Part 10 — What Google Drive actually receives

The application encrypts the vault before sending it to Drive.

Drive stores a file similar to:

`Local-Wealth-Manager-vault.json`

The file contains encrypted ciphertext rather than your readable financial records.

Your master password is not uploaded to Google Drive.

---

# Part 11 — Recommended first synchronization

Do this on the laptop first:

1. Open the app.
2. Unlock it.
3. Go to **Sync**.
4. Connect Google Drive.
5. Choose a dedicated folder such as:
   `FinMate`
6. Press **Sync now**.
7. Open Google Drive separately and verify that the vault file exists.

Then on Android:

1. Open the same HTTPS application URL.
2. Open **Sync**.
3. Connect to the same Google account.
4. Select the same folder.
5. Use **Retrieve from Drive**.
6. Continue using the same master password.

Avoid editing the vault on both devices simultaneously. Sync one device, finish your changes, then sync the other device.

---

# Part 12 — Common errors

## Error: “origin is not allowed”

Your OAuth client does not contain the exact website origin.

For a GitHub Pages URL:

`https://username.github.io/local-wealth-manager/`

the origin should be:

`https://username.github.io`

Check spelling and HTTPS.

## Error: “Google Picker API key is invalid”

Check:

- Google Picker API is enabled.
- API key is copied correctly.
- API key is restricted to the correct website.
- Google Docs origin is included when required by Google's Picker restriction guidance.
- Google Drive API is enabled if your application uses direct Drive API calls.

## Error: “Access blocked” / app not verified

If the OAuth application is still in testing, make sure the Google account you are using is listed as a test user where Google's current consent-screen configuration requires it.

## Error: “Google sign-in library is unavailable”

Open the app from its HTTPS URL in normal Chrome. Do not use `file:///...`.

## Error: “folder access failed”

Reconnect Google Drive and choose the folder again. Also confirm that you are using the same Google account that owns or can access the folder.

---

# Official Google references

- Google Drive JavaScript quickstart: https://developers.google.com/workspace/drive/api/quickstart/js
- Google Picker web guide: https://developers.google.com/workspace/drive/picker/guides/web-picker
- Google credentials guide: https://developers.google.com/workspace/guides/create-credentials

## FinMate v2.4: fixing "Google sign-in was closed before authorization completed"

If the Google warning page appears and you click Continue but FinMate reports that the authorization window was closed, check these items in order:

1. In FinMate open Sync → Advanced Google connection setup.
2. Copy the value shown as "Authorized JavaScript origin for this FinMate page".
3. In Google Cloud → Google Auth platform → Clients, open the Web application OAuth client used by FinMate.
4. Under Authorized JavaScript origins, add the exact origin copied from FinMate.
5. Do not append a GitHub Pages repository path to the origin. Example: for `https://example.github.io/finmate/`, enter `https://example.github.io`.
6. In Google Auth platform → Audience, confirm that your Google account is listed under Test users while the app is in Testing.
7. Confirm the Drive API is enabled for the same Google Cloud project as the OAuth client.
8. In FinMate save the Client ID again, refresh the page, and retry Connect Google Drive.
9. If Chrome asks whether pop-ups are allowed for the FinMate URL, allow them.

The unverified/testing warning itself is expected for an OAuth app left in Testing. For a personal app or a small known group of testers, Google allows proceeding through the tester warning; the test users still need to be managed in the OAuth project. For production distribution to arbitrary Google accounts, move to a production configuration and complete Google's applicable verification requirements.
