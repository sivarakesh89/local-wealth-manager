#!/usr/bin/env node
'use strict';
// FinMate split-media recovery helper. Runs locally; no network access.
// Requires Node.js 20+. Source vault and password are never uploaded.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const readline = require('node:readline');
const ITERATIONS = 210000;
const TARGET_SHARD_BYTES = 8 * 1024 * 1024;
const MEDIA_RE = /^data:(image\/[^;,]+|application\/(?:pdf|octet-stream));base64,/i;

function b64(s, label) {
  if (typeof s !== 'string' || !s.length || !/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error(`${label} is not valid Base64.`);
  return Buffer.from(s, 'base64');
}
function decryptGcm(cipherAndTag, iv, key) {
  if (cipherAndTag.length < 16) throw new Error('Encrypted payload is too short.');
  const d = crypto.createDecipheriv('aes-256-gcm', key, iv);
  d.setAuthTag(cipherAndTag.subarray(cipherAndTag.length - 16));
  return Buffer.concat([d.update(cipherAndTag.subarray(0, cipherAndTag.length - 16)), d.final()]);
}
function encryptGcm(plain, iv, key) {
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  return Buffer.concat([c.update(plain), c.final(), c.getAuthTag()]);
}
function askHidden(prompt) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    if (typeof input.setRawMode !== 'function') return reject(new Error('Run this script inside Windows Terminal or PowerShell, not by double-clicking it.'));
    process.stdout.write(prompt);
    let answer = '';
    const wasRaw = input.isRaw;
    const cleanup = () => { input.removeListener('data', onData); try { input.setRawMode(Boolean(wasRaw)); } catch {} process.stdout.write('\n'); };
    const onData = chunk => {
      for (const ch of chunk.toString('utf8')) {
        if (ch === '\u0003') { cleanup(); reject(new Error('Cancelled by user.')); return; }
        if (ch === '\r' || ch === '\n') { cleanup(); resolve(answer); return; }
        if (ch === '\u0008' || ch === '\u007f') { answer = answer.slice(0, -1); continue; }
        if (ch >= ' ') answer += ch;
      }
    };
    input.on('data', onData); input.setRawMode(true); input.resume();
  });
}
function cleanPath(s) {
  let v = String(s || '').trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  if (v.startsWith('file://')) v = decodeURIComponent(v.replace(/^file:\/\//, ''));
  return path.resolve(v);
}
function uniqueDir(base) {
  let out = path.join(base, `FinMate-Split-Recovery-${new Date().toISOString().replace(/[:.]/g, '-')}`), n = 2;
  while (fs.existsSync(out)) out = path.join(base, `FinMate-Split-Recovery-${Date.now()}-${n++}`);
  fs.mkdirSync(out, { recursive: false }); return out;
}
function writeNew(file, value) { fs.writeFileSync(file, value, { flag: 'wx' }); }
function isMedia(s) { return typeof s === 'string' && s.length > 1000 && MEDIA_RE.test(s); }

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Please run in a normal PowerShell / Windows Terminal window.');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  try {
    console.log('\nFinMate Split Gold-Media Recovery (offline; no network access)');
    console.log('This reads the large encrypted gold-media recovery vault and creates a compact core vault plus encrypted media shards.');
    console.log('Keep the original recovery vault unchanged. Use the new v3.46 recovery build to import the core first, then all media shards.');
    const source = cleanPath(await new Promise(resolve => rl.question('\nFull path to FinMate-Recovered-Gold-Media-vault.json: ', resolve)));
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) throw new Error('The selected recovery file does not exist.');
    console.log(`Source size: ${(fs.statSync(source).size / 1048576).toFixed(1)} MiB`);
    console.log('Reading encrypted source into memory. Use a laptop/desktop with plenty of free RAM.');
    const rawText = fs.readFileSync(source, 'utf8');
    const rec = JSON.parse(rawText);
    if (rec?.version < 3 || !rec?.iv || !rec?.data || !rec?.passwordWrap?.salt || !rec?.passwordWrap?.iv || !rec?.passwordWrap?.data) throw new Error('This is not a supported FinMate v3 encrypted vault.');
    const password = await askHidden('Enter the master password for this recovery file (input hidden): ');
    const wrappingKey = crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), b64(rec.passwordWrap.salt, 'Password salt'), ITERATIONS, 32, 'sha256');
    const key = decryptGcm(b64(rec.passwordWrap.data, 'Password wrapper data'), b64(rec.passwordWrap.iv, 'Password wrapper IV'), wrappingKey);
    if (key.length !== 32) throw new Error('Unwrapped data key has an unexpected length.');
    console.log('Password wrapper verified. Decrypting vault…');
    const plain = decryptGcm(b64(rec.data, 'Encrypted vault data'), b64(rec.iv, 'Vault IV'), key);
    let state;
    try { state = JSON.parse(plain.toString('utf8')); } catch { throw new Error('Decryption succeeded but the content was not valid FinMate JSON.'); }
    if (!state || typeof state !== 'object' || Array.isArray(state)) throw new Error('Decrypted content is not a FinMate state object.');
    state.security = { ...(state.security || {}), pinWrap: null, biometric: null };
    const mediaRecords = [];
    const refByIdentity = new Map();
    function transformEntry(entry) {
      if (!entry || typeof entry !== 'object') return;
      const entryId = String(entry.id || 'no-id');
      function visit(obj, pathParts) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) { for (let i = 0; i < obj.length; i++) visit(obj[i], pathParts.concat(String(i))); return; }
        for (const field of Object.keys(obj)) {
          const value = obj[field];
          if (isMedia(value)) {
            const identity = `${entryId}|${pathParts.concat(field).join('.')}|${crypto.createHash('sha256').update(value).digest('hex')}`;
            let ref = refByIdentity.get(identity);
            if (!ref) {
              ref = crypto.randomUUID(); refByIdentity.set(identity, ref);
              const mime = value.slice(5, value.indexOf(';')) || 'application/octet-stream';
              const iv = crypto.randomBytes(12);
              const encrypted = encryptGcm(Buffer.from(value, 'utf8'), iv, key);
              mediaRecords.push({ ref, name: String(obj.name || (field === 'data' ? 'Attachment' : field)), type: String(obj.type || mime), size: Number(obj.size || 0), iv: iv.toString('base64'), data: encrypted.toString('base64') });
            }
            if (field === 'data' && !Array.isArray(obj)) { obj.mediaRef = ref; obj[field] = ''; }
            else obj[field] = { mediaRef: ref, name: String(obj.name || field), type: String(obj.type || ''), data: '' };
          } else if (value && typeof value === 'object') visit(value, pathParts.concat(field));
        }
      }
      visit(entry, []);
    }
    // Process both canonical profile records and top-level compatibility arrays. Stable identities avoid duplicate shard payloads.
    for (const p of (Array.isArray(state.profiles) ? state.profiles : [])) {
      if (Array.isArray(p.goldJewelry)) for (const item of p.goldJewelry) transformEntry(item);
    }
    if (Array.isArray(state.goldJewelry)) for (const item of state.goldJewelry) transformEntry(item);
    if (!mediaRecords.length) throw new Error('No gold-jewellery photo/invoice data URLs were found. No output files were created.');
    console.log(`Found ${mediaRecords.length} unique gold-jewellery attachment(s). Building encrypted shards…`);
    const shards = []; let current = [], currentBytes = 0;
    for (const item of mediaRecords) {
      const bytes = Buffer.byteLength(JSON.stringify(item), 'utf8') + 64;
      if (current.length && currentBytes + bytes > TARGET_SHARD_BYTES) { shards.push(current); current = []; currentBytes = 0; }
      current.push(item); currentBytes += bytes;
    }
    if (current.length) shards.push(current);
    const outDir = uniqueDir(path.dirname(source));
    const coreIv = crypto.randomBytes(12);
    const coreCipher = encryptGcm(Buffer.from(JSON.stringify(state), 'utf8'), coreIv, key);
    const coreRec = { ...rec, version: 3, pinWrap: null, biometric: null, pinEnabled: false, biometricEnabled: false, iv: coreIv.toString('base64'), data: coreCipher.toString('base64') };
    writeNew(path.join(outDir, 'FinMate-Recovered-Core-vault.json'), JSON.stringify(coreRec));
    const shardNames = [];
    for (let i = 0; i < shards.length; i++) {
      const name = `FinMate-Media-Shard-${String(i + 1).padStart(3, '0')}-of-${String(shards.length).padStart(3, '0')}.json`;
      const shard = { kind: 'finmate-media-shard-v1', version: 1, index: i + 1, total: shards.length, items: shards[i] };
      writeNew(path.join(outDir, name), JSON.stringify(shard)); shardNames.push(name);
    }
    const manifest = [
      'FinMate Split Media Recovery Manifest',
      `Created: ${new Date().toISOString()}`,
      `Source: ${path.basename(source)}`,
      `Unique encrypted attachments: ${mediaRecords.length}`,
      `Media shard files: ${shards.length}`,
      'Core vault: FinMate-Recovered-Core-vault.json',
      '',
      'Import order:',
      '1. In FinMate v3.46 Split Media Recovery Build, retrieve the Core vault from local JSON first.',
      '2. Unlock it using the same master password.',
      '3. Open Settings > Google Drive section and choose Import recovery media shards.',
      '4. Select ALL files listed below in one selection. The app imports and validates them one at a time.',
      '5. Open several gold-jewellery entries and verify their photos/invoices.',
      '6. Do not sync to Drive until all records and attachments are verified.',
      '', 'Shard files:', ...shardNames, '',
      'Security: Each attachment payload is AES-GCM encrypted with the original vault data key. The shard files do not contain plaintext photos or invoices.',
      'Original source file was not modified. Keep it until recovery is fully verified.'
    ].join('\n');
    writeNew(path.join(outDir, 'MANIFEST.txt'), manifest);
    console.log('\nSplit recovery package created:');
    console.log(outDir);
    console.log(`Core vault: ${(fs.statSync(path.join(outDir, 'FinMate-Recovered-Core-vault.json')).size / 1048576).toFixed(2)} MiB`);
    console.log(`Attachments: ${mediaRecords.length}; shards: ${shards.length}`);
    console.log('No network requests were made. The original source was not changed.');
  } finally { rl.close(); }
}
main().catch(e => { console.error(`\nRecovery failed: ${e.message || e}`); process.exitCode = 1; });
