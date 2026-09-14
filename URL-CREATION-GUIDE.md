# Create an HTTPS URL for FinMate — no developer tools required

This guide uses GitHub Pages because the whole process can be done in Google Chrome. You do not need Git, Node.js, npm, VS Code or a command prompt.

## 1. Create/sign in to GitHub

Open:

https://github.com/

Create an account or sign in.

## 2. Create a repository

1. Click **+** at the top-right.
2. Select **New repository**.
3. Repository name: `local-wealth-manager`
4. Choose **Public**.
5. Click **Create repository**.

## 3. Upload the app

1. Open the repository.
2. Click **Add file** → **Upload files**.
3. Extract the FinMate ZIP on your laptop.
4. Select the application files/folders.
5. Confirm that `index.html` is directly in the repository root.
6. Confirm the `icons` folder is uploaded too.
7. Click **Commit changes**.

Do not create an extra nested folder such as:

`local-wealth-manager/local-wealth-manager/index.html`

The correct structure is:

`local-wealth-manager/index.html`

## 4. Enable Pages

1. Open repository **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Branch: `main`.
5. Folder: `/(root)`.
6. Click **Save**.
7. Wait for deployment.

## 5. Your URL

GitHub normally gives a URL in this form:

`https://YOUR-USERNAME.github.io/local-wealth-manager/`

Example only:

`https://exampleuser.github.io/local-wealth-manager/`

Do not type `exampleuser`; use your own GitHub username.

## 6. Test it

Open the URL in Chrome on the laptop.

The URL must begin with:

`https://`

not:

`file:///`

## 7. Use the same URL on Android

Open the exact same URL in Chrome on Android. Then use Chrome's **Install app** or **Add to Home screen** option.

## 8. Updating the app later

When a newer ZIP is supplied:

1. Open the GitHub repository.
2. Upload the new files, replacing the old files.
3. Commit the changes.
4. Wait for Pages to redeploy.
5. Refresh Chrome.

Your application code can be updated without moving your Google Drive vault, but keep an encrypted backup before major upgrades.
