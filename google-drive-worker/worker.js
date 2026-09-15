/* FinMate Secure Google OAuth Worker
 * Deploy as a Cloudflare Worker with a KV namespace binding named FINMATE_KV.
 * Store GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and APP_ORIGIN as Worker secrets/vars.
 * This worker never receives FinMate financial data. It only exchanges Google OAuth
 * codes/tokens. The PWA continues to upload only its already-encrypted vault to Drive.
 */
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const APP_ORIGIN = 'https://sivarakash89.github.io';

function cors(headers = {}) {
  return {
    ...headers,
    'Access-Control-Allow-Origin': APP_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}
function json(data, status=200) {
  return new Response(JSON.stringify(data), {status, headers: cors({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'})});
}
function safeReturn(raw) {
  try {
    const u = new URL(raw || APP_ORIGIN + '/');
    if (u.origin !== APP_ORIGIN) return APP_ORIGIN + '/';
    return u.origin + (u.pathname || '/') + (u.search || '');
  } catch { return APP_ORIGIN + '/'; }
}
async function sha256Hex(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, {status:204, headers:cors()});
    const url = new URL(request.url);
    const redirectUri = url.origin + '/callback';

    if (url.pathname === '/health') return json({ok:true, service:'FinMate Google OAuth bridge'});

    if (url.pathname === '/start') {
      const returnTo = safeReturn(url.searchParams.get('return_to'));
      const state = crypto.randomUUID();
      await env.FINMATE_KV.put('state:'+state, JSON.stringify({returnTo, createdAt:Date.now()}), {expirationTtl:600});
      const p = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: SCOPES,
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true',
        state,
      });
      return Response.redirect(AUTH_URL+'?'+p.toString(), 302);
    }

    if (url.pathname === '/callback') {
      const state = url.searchParams.get('state');
      const code = url.searchParams.get('code');
      const err = url.searchParams.get('error');
      const saved = state ? await env.FINMATE_KV.get('state:'+state, {type:'json'}) : null;
      if (!saved) return new Response('Invalid or expired OAuth state. Return to FinMate and try again.', {status:400});
      await env.FINMATE_KV.delete('state:'+state);
      if (err) return Response.redirect(saved.returnTo+'?finmate_oauth_error='+encodeURIComponent(err), 302);
      if (!code) return new Response('Google returned no authorization code.', {status:400});

      const body = new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });
      const tokenResp = await fetch(TOKEN_URL, {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body});
      const tokens = await tokenResp.json();
      if (!tokenResp.ok) return new Response('Google token exchange failed: '+JSON.stringify(tokens), {status:502});

      const ticket = crypto.randomUUID();
      await env.FINMATE_KV.put('ticket:'+ticket, JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        expires_in: tokens.expires_in || 3600,
        createdAt: Date.now(),
      }), {expirationTtl:180});
      return Response.redirect(saved.returnTo+'?finmate_oauth='+encodeURIComponent(ticket), 302);
    }

    if (url.pathname === '/redeem' && request.method === 'GET') {
      const ticket = url.searchParams.get('ticket');
      if (!ticket) return json({error:'missing_ticket'},400);
      const item = await env.FINMATE_KV.get('ticket:'+ticket, {type:'json'});
      if (!item) return json({error:'ticket_expired'},410);
      await env.FINMATE_KV.delete('ticket:'+ticket);
      return json(item);
    }

    if (url.pathname === '/refresh' && request.method === 'POST') {
      let input; try { input = await request.json(); } catch { return json({error:'invalid_json'},400); }
      if (!input?.refresh_token) return json({error:'missing_refresh_token'},400);
      const body = new URLSearchParams({
        refresh_token: input.refresh_token,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
      });
      const r = await fetch(TOKEN_URL, {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
      const j = await r.json();
      if (!r.ok) return json({error:j.error||'refresh_failed',error_description:j.error_description||''},502);
      return json({access_token:j.access_token,expires_in:j.expires_in||3600});
    }

    return json({error:'not_found'},404);
  }
};
