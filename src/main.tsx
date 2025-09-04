import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Create a container div in the page
const appContainer = document.createElement("div");
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
createRoot(appContainer).render(<App />);