let enabled = false;

function injectIntoActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "add-blob-app" });
    }
  });
}

function removeFromAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) chrome.tabs.sendMessage(tab.id, { type: "remove-blob-app" });
    }
  });
}

chrome.action.onClicked.addListener(() => {
  enabled = !enabled;
  if (enabled) injectIntoActiveTab();
  else removeFromAllTabs();
});

chrome.tabs.onActivated.addListener(() => {
  if (!enabled) return;
  removeFromAllTabs();
  injectIntoActiveTab();
});

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (enabled && info.status === "complete") {
    chrome.tabs.sendMessage(tabId, { type: "add-blob-app" });
  }
});
