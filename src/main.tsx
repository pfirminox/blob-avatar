import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'

// Create a container div in the page
const rootDiv = document.createElement("div");
rootDiv.id = "r3f-root";
rootDiv.style.position = "fixed";
rootDiv.style.top = "0";
rootDiv.style.left = "0";
rootDiv.style.width = "300px"; // Adjust size as needed
rootDiv.style.height = "300px";
rootDiv.style.zIndex = "9999";
rootDiv.style.pointerEvents = "auto"; // Enable pointer events
document.body.appendChild(rootDiv);

// Render the React app without StrictMode
createRoot(rootDiv).render(<App />);