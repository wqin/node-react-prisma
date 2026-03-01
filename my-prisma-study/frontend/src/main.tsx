import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

async function init() {
  try {
    const res = await fetch("/config.json");
    if (res.ok) {
      (window as any).__RUNTIME__ = await res.json();
    }
  } catch (e) {
    // Ignore — fall back to build-time env
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}

init();
