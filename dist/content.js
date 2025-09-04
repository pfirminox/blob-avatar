let host = null;
let script = null;

const appURL = chrome.runtime.getURL("app.js");
const glbURL = chrome.runtime.getURL("assets/blob.glb");
const dracoURL = chrome.runtime.getURL("assets/draco/");

window.__BLOB_EXTENSION_CONFIG = { appURL, glbURL, dracoURL };

function mount() {
  if (script) return; // already mounted

  // 1. Create container div in the page
  if (!host) {
    host = document.createElement("div");
    host.id = "blob-extension";
    document.body.appendChild(host);
  }

  // 2. Inject React app
  script = document.createElement("script");
  script.src = chrome.runtime.getURL("app.js");
  script.type = "module";
  document.body.appendChild(script);
}

function unmount() {
  if (script) {
    script.remove();
    script = null;
  }
  if (host) {
    host.remove();
    host = null;
  }
}

mount();

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "add-blob-app") mount();
  if (msg.type === "remove-blob-app") unmount();
});
