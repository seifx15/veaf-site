/* VEAF site service worker: makes the site installable and quick to open.
   Pages and images come from the cache and refresh in the background;
   data.json is always fetched fresh first (cache only when offline);
   the sign-in service on another origin is never touched. */
var CACHE = "veaf-v1";
var CORE = ["./", "index.html", "style.css", "app.js", "manifest.webmanifest", "img/logo-sm.png", "img/logo-64.png", "img/logo-192.png", "img/logo.webp"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  var url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  var fresh = fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  });
  if (/\/data\.json$/.test(url.pathname) || /\.(js|css|html|webmanifest)$/.test(url.pathname) || url.pathname.slice(-1) === "/") {
    // network first so a website update shows at once; the cache keeps it working offline
    e.respondWith(fresh.catch(function () { return caches.match(req); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) { fresh.catch(function () {}); return hit || fresh; }));
});
