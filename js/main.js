document.addEventListener('DOMContentLoaded', init);

async function init() {
  //dom ready
  await registerSW(); //register the service worker before adding listeners
  addListeners();
}
async function registerSW() {
  return await navigator.serviceWorker.register('./sw.js', { type: 'module' });
}
function addListeners() {
  //listeners for messaging
  //listeners for form submission
  //listeners for mouse events
  //listeners for navigation
}
