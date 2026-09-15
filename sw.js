const CACHE='finmate-pwa-v2.2';
const ASSETS=['./','./index.html','./app.css','./app.js','./manifest.webmanifest','./favicon.png','./icons/finmate-icon-48.png','./icons/finmate-icon-192.png','./icons/finmate-icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const c=x.clone();caches.open(CACHE).then(c=>c.put(e.request,c));return x}).catch(()=>caches.match('./index.html'))))});
