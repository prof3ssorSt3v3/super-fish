//The Service Worker
const version = 1;
const cacheName = `SuperFish-${version}`;
const cacheList = ['/', '/index.html', '/css/main.css', '/js/main.js', '/img/favicon.png'];

self.addEventListener('install', (ev) => {
  caches.open(cacheName).then((cache) => cache.addAll(cacheList).catch((err) => console.log(err)));
});
self.addEventListener('activate', (ev) => {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key != cacheName) {
        caches.delete(key);
      }
    });
  });
});
self.addEventListener('fetch', (ev) => {
  ev.respondWith(fetch(ev.request));
});
self.addEventListener('message', (ev) => {
  //ev.data is the message
  //ev.data.action is the type of instruction from main.js
  //each action will typically have a function associated with it
});

function sendMessage(msg, client) {
  //send a message to the client or all clients
}
function addToCache() {
  //add some JSON data to a new file in the cache
}
function getFromCache() {
  //return data from a JSON file in the cache
}
function deleteFromCache() {
  //get rid of a file in the cache
}
function getListFromCache() {
  //get the list of files in the cache
}
