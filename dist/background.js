let enabled = false;

function injectIntoActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      console.log(`Inject Blob to active tab, id:${tabs[0]?.id}`);
      chrome.tabs.sendMessage(tabs[0].id, { type: "add-blob-app" });
    }
  });
}

function injectIntoActiveTabWindow(windowId) {
  if (!enabled || windowId === chrome.windows.WINDOW_ID_NONE) return;

  // Inject blob into the active tab of the newly focused window
  chrome.tabs.query({ active: true, windowId }, (tabs) => {
    if (tabs[0]?.id) {
      console.log(`Inject Blob to active tab in new window, id: ${tabs[0].id}`);
      chrome.tabs.sendMessage(tabs[0].id, { type: "add-blob-app" });
    }
  });
}

function removeFromAllTabs() {
  console.log('Remove Blob from all tabs');
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) chrome.tabs.sendMessage(tab.id, { type: "remove-blob-app" });
    }
  });
}
chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log("Window focus changed:", windowId);

  // Remove blob from all tabs
  removeFromAllTabs();
  injectIntoActiveTabWindow(windowId)

});
chrome.tabs.onActivated.addListener(() => {
  console.log('Activated Tab');

  if (!enabled) {console.log("enabled =", enabled); return;}
  removeFromAllTabs();
  injectIntoActiveTab();
});

/*chrome.tabs.onHighlighted.addListener(() => {
  console.log('Highlighted Tab');

  if (!enabled) {console.log("enabled =", enabled); return;}
  removeFromAllTabs();
  injectIntoActiveTab();
});*/


chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (enabled && info.status === "complete") {
    console.log('Tab Updated', tabId);
    chrome.tabs.sendMessage(tabId, { type: "add-blob-app" });
  }
});

chrome.action.onClicked.addListener(() => {
  enabled = !enabled;
  console.log("Background: action clicked, enabled =", enabled);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    console.log("Background: sending message to tab", tabs[0].id);

    chrome.tabs.sendMessage(tabs[0].id, { type: enabled? "add-blob-app" : "remove-blob-app"}, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Background: sendMessage error:", chrome.runtime.lastError.message);
      } else {
        console.log("Background: message delivered, response:", response);
      }
    });
  });
});
