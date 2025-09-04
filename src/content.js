const script = document.createElement('script');
script.src = chrome.runtime.getURL('assets/index.js'); // Vite output path
document.body.appendChild(script);
