// -------- sw.js v16 --------
// Service worker do app instalado: guarda a "casca" (tela, ícones) para
// abrir mesmo sem internet. Os dados nunca ficam aqui — a API (outra
// origem, script.google.com) passa direto pela rede.
// Ao mudar o index.html, suba a versão do CACHE para os celulares
// pegarem a tela nova.
const CACHE = 'jl-casca-v17';
const CASCA = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CASCA)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Rede primeiro (tela sempre atualizada); sem rede, a cópia guardada.
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
// -------- sw.js v16 --------
