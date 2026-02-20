import { FetchError, NavEvent } from './utils.js';
const log = console.log;
const warn = console.warn;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  //dom ready
  await registerSW(); //register the service worker before adding listeners
  addListeners();
  handleInitialURL();
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
function handleInitialURL() {
  //Page has just loaded
  //validate the hash or set a default one
  //trigger a nav event
}
function handleMessage(ev) {
  //message from service worker
}
function handleMessageError(ev) {
  //error sending/receiving message to/from service worker
}
function handleForm(ev) {
  //form submitted
  ev.preventDefault();
  const fd = new FormData(ev.target);
}
function handlePop(ev) {
  //use hit back/forward button
}
function handleNavClick(ev) {
  ev.preventDefault();
  let anchor = ev.target;
  //exit if it was not an anchor
  if (!anchor.classList.includes('nav-link') || anchor.localName != 'a') return;
  //user clicked to navigate to a page
}
function handleNav(ev) {
  //handle the custom nav event
}
