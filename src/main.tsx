import { createRoot } from 'react-dom/client'
import App from './App.tsx'

let appContainer: HTMLElement | null = null;
let root: any | null = null;

const Mount = () =>{
  if(appContainer) return;

  // Create a container div in the page
  appContainer = document.createElement("div");
  appContainer.setAttribute("id", "blob-extension");
  Object.assign(appContainer.style, {
    position: "fixed",   // stays in place even when scrolling
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "2147483647", // max safe integer for z-index
    pointerEvents: "none" // (optional) so clicks pass through
  });
  document.body.appendChild(appContainer);

  // Render the React app without StrictMode
  root = createRoot(appContainer).render(<App />);
}

const Unmount = () =>{
  if(root){
    root.unmount();
    root = null;
  }
  if(appContainer){
    appContainer.remove();
    appContainer = null;
  }
}

//Mounting and Unmounting Event Listeners from Chrome
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "add-blob-app")  Mount();
    if (msg.type === "remove-blob-app") Unmount();
});