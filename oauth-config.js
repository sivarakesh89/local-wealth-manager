/*
 * FinMate site-wide OAuth Worker configuration.
 *
 * IMPORTANT: Put ONLY your public Cloudflare Worker URL here.
 * Example:
 *   oauthBackend: 'https://finmate-google-oauth.example.workers.dev'
 *
 * Never put GOOGLE_CLIENT_SECRET, API keys, refresh tokens, or financial data here.
 * This file is intentionally public so a brand-new browser can discover the same
 * secure OAuth Worker before it has retrieved/unlocked the encrypted FinMate vault.
 */
window.FINMATE_OAUTH_CONFIG = {
  oauthBackend: ''
};
