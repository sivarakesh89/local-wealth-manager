const CACHE='finmate-pwa-v3.71.0-silver-purity-700';
const ASSETS=['./','./index.html','./app.css','./app-v3.71.0.js','./app.js','./gold-rate-calculator.js','./gold-rate-calculator.css','./manifest.webmanifest','./oauth-config.js','./contact-config.js','./privacy.html','./terms.html','./help.html','./favicon.png','./icons/finmate-icon-48.png','./icons/finmate-icon-192.png','./icons/finmate-icon-512.png'];
const SHELL=new Set(['./','./index.html','./app-v3.71.0.js','./app.js','./app.css','./gold-rate-calculator.js','./gold-rate-calculator.css','./manifest.webmanifest','./sw.js']);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data==='FINMATE_SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 const path=url.pathname;
 const isShell=path.endsWith('/index.html')||path.endsWith('/app-v3.71.0.js')||path.endsWith('/app.js')||path.endsWith('/app.css')||path.endsWith('/manifest.webmanifest')||path.endsWith('/sw.js')||path.endsWith('/');
 if(isShell){
  event.respondWith(fetch(new Request(event.request,{cache:'no-store'})).then(response=>{
   if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
   return response;
  }).catch(()=>caches.match(event.request,{ignoreSearch:true}).then(cached=>cached||caches.match('./index.html'))));
  return;
 }
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match('./index.html'))));
});
