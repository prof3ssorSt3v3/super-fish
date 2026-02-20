import { FetchError } from './js/utils.js';

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
  const { action } = ev.data;
  switch (action) {
    case 'save':
      //save ev.data.info as a file in the cache
      addToCache(ev.data.info); //the string from the textarea
      break;
    case 'list':
      //get the list of file request names from cache
      getListFromCache();
      break;
    case 'read':
      //get the contents of one file from the cache
      console.log('Read', ev.data.file);
      getFromCache(ev.data.file);
      break;
    default:
    //No such action
  }
});

function sendMessage(msg, client) {
  //send a message to the client or all clients
  clients.matchAll().then((clients) => {
    //send the response to all the clients
    for (let c of clients) {
      c.postMessage(msg);
      //send the message to all the clients
    }
  });
}
function addToCache(str) {
  //add some JSON data to a new file in the cache
  let filename = crypto.randomUUID() + '.json';
  let file = new File([str], filename, { type: 'application/json' });
  let req = new Request(`/datafolder/${filename}`);
  //our fake URL for our json file
  let res = new Response(file, { status: 200 });
  caches
    .open(cacheName)
    .then((cache) => {
      //now save the file
      return cache.put(req, res);
    })
    .then(() => {
      //finished saving... tell the client
      sendMessage({ action: 'save', message: 'Yep All good whatever' });
    })
    .catch((err) => {
      sendMessage({ action: 'save', message: 'Bad data. Bad data.', error: err.message });
    });
}
function getFromCache(filename) {
  //return data from a JSON file in the cache
  caches
    .open(cacheName)
    .then((cache) => {
      return cache.match(filename);
    })
    .then((res) => {
      if (!res || !res.ok) throw new FetchError('No file match');
      return res.text();
    })
    .then((txt) => {
      // console.log(txt);
      sendMessage({ action: 'read', json: txt });
    })
    .catch((err) => {
      sendMessage({ action: 'read', error: err.message, message: 'No file' });
    });
}
function deleteFromCache() {
  //get rid of a file in the cache
}
function getListFromCache() {
  //get the list of files in the cache
  caches
    .open(cacheName)
    .then((cache) => cache.keys())
    .then((keys) => {
      let files = keys
        .map((key) => {
          // console.log(key);
          //each key is a Request object
          if (key.url.endsWith('.json')) {
            // console.log(key.url);
            return key.url;
          } //else undefined
        })
        .filter((key) => key); //remove undefined
      sendMessage({ action: 'list', files });
    });
}
