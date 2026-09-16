# FinMate Secure Google OAuth Worker

This is the recommended long-term Google Drive authentication bridge for the static GitHub Pages FinMate PWA.

## Why this exists

GitHub Pages can host the PWA but cannot securely hold an OAuth client secret or act as an authorization-code endpoint. Google's current guidance recommends authorization-code flow for modern web applications; that model requires a backend endpoint. The worker below provides only that endpoint. It does **not** receive or store the FinMate vault contents.

## Cloudflare setup (dashboard only)

1. Create a Cloudflare account if you do not already have one.
2. Workers & Pages → Create application → Worker → create a Worker.
3. Replace the starter Worker code with `worker.js` from this folder.
4. Create a KV namespace and bind it to the Worker with variable name:
   `FINMATE_KV`
5. Add Worker variables/secrets:
   - `GOOGLE_CLIENT_ID` = your existing FinMate Web OAuth client ID.
   - `GOOGLE_CLIENT_SECRET` = the secret for that OAuth Web client. **Never paste this secret into ChatGPT or GitHub.**
   - `APP_ORIGIN` = `https://sivarakesh89.github.io` (recommended; the Worker also defaults to this value).
6. The Worker URL will look like:
   `https://your-worker-name.your-account.workers.dev`

## Google Cloud OAuth configuration

For the same Web OAuth client:

### Authorized JavaScript origins

Keep:
`https://sivarakesh89.github.io`

### Authorized redirect URIs

Remove the old GitHub Pages redirect entries used by the legacy fallback.
Add the Worker callback exactly:
`https://YOUR-WORKER-DOMAIN/callback`

Do not add tracking query parameters.

## FinMate

In FinMate → Sync → Advanced Google connection setup:

`Secure OAuth backend URL` = your Worker URL, e.g.
`https://your-worker-name.your-account.workers.dev`

Then click **Save secure backend** and **Connect with secure OAuth backend**.

The flow is:
FinMate → Worker → Google consent → Worker callback → one-time ticket → FinMate.

The browser stores the refresh token inside the encrypted FinMate vault after the vault is unlocked. The Worker only exchanges it for a short-lived access token when required; it does not persist the refresh token.

## Privacy

The Worker handles OAuth credentials only. FinMate financial data is still encrypted in the browser before any Drive upload. The Worker never receives the vault plaintext.
