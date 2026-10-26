import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import AuthProvider from "./hooks/AuthProvider.tsx";
import ThemeProvider from "./hooks/themeContext.tsx";
import ToastProvider from "./hooks/toastContext.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/registerServiceWorker.ts";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
