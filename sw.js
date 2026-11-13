/* VEAF site service worker: makes the site installable and quick to open.
   Pages and images come from the cache and refresh in the background;
   data.json is always fetched fresh first (cache only when offline);
   the sign-in service on another origin is never touched. Also shows the
   squadron's push notifications (new operations, sortie reminders). */
var CACHE = "veaf-v3";
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
    if (res && res.ok) {
      var copy = res.clone(), key = /\/data\.json$/.test(url.pathname) ? new Request(url.origin + url.pathname) : req;
      caches.open(CACHE).then(function (c) { c.put(key, copy); });
    }
    return res;
  });
  if (/\/data\.json$/.test(url.pathname) || /\.(js|css|html|webmanifest)$/.test(url.pathname) || url.pathname.slice(-1) === "/") {
    // network first so a website update shows at once; the cache keeps it working offline
    e.respondWith(fresh.catch(function () { return caches.match(req, { ignoreSearch: true }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) { fresh.catch(function () {}); return hit || fresh; }));
});

self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "VEAF", {
    body: d.body || "", icon: "img/logo-192.png", tag: d.tag || undefined, renotify: !!d.tag,
    data: { url: d.url || "#home" }
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || "#home", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf(self.registration.scope) === 0 && "focus" in list[i]) {
        return list[i].focus().then(function (c) { return c && "navigate" in c ? c.navigate(url) : c; });
      }
    }
    return self.clients.openWindow(url);
  }));
});
