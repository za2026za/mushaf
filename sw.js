// Keeps the mushaf site and downloaded recitations available without internet.
const SITE='mushaf-site-v1', AUDIO='mushaf-audio-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.hostname==='everyayah.com'){e.respondWith(caches.open(AUDIO).then(c=>c.match(r.url).then(hit=>hit||fetch(r))));return}
  if(u.origin!==location.origin)return;
  // page itself: network first so updates arrive; everything else: cache first
  const isPage=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  e.respondWith(caches.open(SITE).then(async c=>{
    if(isPage){try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}catch(err){return (await c.match(r))||(await c.match('./'))||Response.error()}}
    const hit=await c.match(r);if(hit)return hit;
    const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}));
});
