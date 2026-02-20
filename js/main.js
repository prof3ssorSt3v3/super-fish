import { FetchError, NavEvent } from './utils.js';
const log = console.log;
const warn = console.warn;
const allowedPages = ['#apple', '#banana', '#carrot'];
document.addEventListener('DOMContentLoaded', init);

async function init() {
  //dom ready
  await registerSW(); //register the service worker before adding listeners
  addListeners();
  handleInitialURL(); //when the page first loads / reloads
}
async function registerSW() {
  return await navigator.serviceWorker.register('./sw.js', { type: 'module' });
}
function addListeners() {
  //listeners for messaging
  navigator.serviceWorker.addEventListener('message', handleMessage);
  navigator.serviceWorker.addEventListener('messageerror', handleMessageError);
  //listeners for form submission
  document.querySelector('.banana form').addEventListener('submit', handleForm);
  //listeners for mouse events
  document.querySelector('nav.main-nav').addEventListener('click', handleNavClick);
  //listeners for navigation
  window.addEventListener('popstate', handlePop);
  document.body.addEventListener('navevent', handleNav);
}
function checkToken() {
  //you got a token???
  const hasToken = true;
  return hasToken;
}
function handleInitialURL() {
  //Page has just loaded
  //validate the hash or set a default one
  //trigger a custom nav event OR call a nav faking function
  if (!checkToken()) {
    warn('No Token. No Nav');
    return;
    //or send the user back to login page, home page, etc
  }
  validHashNavigate();
}
function validHashNavigate() {
  let url = new URL(location.href);
  //turn location.href into a URL object so we get searchParams
  if (!url.hash || !allowedPages.includes(url.hash)) {
    //no hash value.. we want a default value
    //check for invalid hash values
    url.hash = '#apple';
    history.replaceState({}, null, url);
  }
  if (url.hash != '#carrot') {
    //remove querystring
    url.search = '';
  }
  let navEv = new NavEvent({ url });
  document.body.dispatchEvent(navEv);
}
function handlePop(ev) {
  //use hit back/forward button
  //trigger a custom nav event OR call a nav faking function
  if (!checkToken()) {
    warn('No Token. No Nav');
    return;
    //or send the user back to login page, home page, etc
  }

  validHashNavigate();
}
function handleNavClick(ev) {
  ev.preventDefault();
  let anchor = ev.target;
  //exit if it was not an anchor
  if (!anchor.classList.contains('nav-link') || anchor.localName != 'a') return;
  //user clicked to navigate to a page
  //trigger a custom nav event OR call a nav faking function
  if (!checkToken()) {
    warn('No Token. No Nav');
    return;
    //or send the user back to login page, home page, etc
  }
  let url = new URL(anchor.href);
  //clear querystring when clicking links
  if (url.hash != '#carrot') {
    //remove querystring
    url.search = '';
  }
  history.pushState({}, null, url);

  let navEv = new NavEvent({ url });
  document.body.dispatchEvent(navEv);
}
function handleNav(ev) {
  //handle the custom nav event
  //This is the function that updates the display and triggers data handling
  // log(ev);
  log(ev.detail); //URL object
  const { url } = ev.detail; //destructure the url from ev.detail
  //change the value in the <body> attribute to trigger CSS changes
  document.body.setAttribute('data-page', url.hash.replace('#', ''));
  switch (url.hash) {
    case '#apple':
      document.body.style.backgroundColor = 'red';
      sendMessage({ action: 'list' });
      break;
    case '#banana':
      document.body.style.backgroundColor = 'yellow';
      break;
    case '#carrot':
      document.body.style.backgroundColor = 'orange';
      let params = url.searchParams;
      let file = params.get('file');
      let div = document.querySelector('.carrot div.data');
      if (file) {
        div.textContent = file;
        sendMessage({ action: 'read', file });
      } else {
        div.textContent = 'No file provided in querystring.';
      }
      break;
    default:
    //WTF????
  }
}

function handleMessage(ev) {
  //message from service worker
  const { action } = ev.data;
  switch (action) {
    case 'save':
      //save ev.data.info as a file in the cache
      if ('error' in ev.data) {
        //Failed to save
        warn(ev.data.error);
        log(ev.data.message);
        //PUT SOMETHING ON THE PAGE FOR THE USER TOO...
      } else {
        //success
        document.getElementById('info').value = '';
        //clear out the textarea
        log(ev.data.message);
      }
      break;
    case 'list':
      //get the list of file request names from cache
      log(ev.data.files);
      writeToAppleList(ev.data.files);
      break;
    case 'read':
      //get the contents of one file from the cache
      //output to <div class="data">
      // log(ev.data.json);
      writeToCarrot(ev.data.json);
      break;
    default:
    //No such action
  }
}
function writeToCarrot(str) {
  let div = document.querySelector('.carrot div.data');
  div.innerHTML += `<pre>${str}</pre>`;
}
function writeToAppleList(files) {
  const list = document.querySelector('.datalist');
  list.innerHTML = files
    .map((file) => {
      let filePath = new URL(file).pathname;
      let href = `${location.origin}?file=${encodeURIComponent(filePath)}#carrot`;
      return `<li><a href="${href}">${file}</a></li>`;
    })
    .join('');
}
function handleMessageError(ev) {
  //error sending/receiving message to/from service worker
}
function handleForm(ev) {
  //form submitted
  ev.preventDefault();
  const fd = new FormData(ev.target);
  let str = fd.get('info'); //what was written inside the textarea by the user
  sendMessage({ action: 'save', info: str });
}
function sendMessage(msg) {
  //send the msg object to the service worker
  navigator.serviceWorker.ready.then((reg) => {
    reg.active.postMessage(msg);
    //send a message to the currently activated service worker
  });
}
