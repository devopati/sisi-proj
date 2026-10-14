import { useSyncExternalStore } from "react";

/**
 * Chrome, Edge and Android browsers fire "beforeinstallprompt" when the app
 * can be installed. We keep that event and show our own "Install app" button.
 *
 * Safari never fires it: on an iPhone people use Share → Add to Home Screen.
 */

// TypeScript doesn't know this event yet, so describe the parts we use
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// The event can fire before React renders anything,
// so start listening as soon as this file loads
let savedPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault(); // hide the browser's own pop-up, we show a button instead
  savedPrompt = event as BeforeInstallPromptEvent;
  notify();
});

window.addEventListener("appinstalled", () => {
  savedPrompt = null;
  notify();
});

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// const { canInstall, install } = useInstallPrompt();
export const useInstallPrompt = () => {
  const prompt = useSyncExternalStore(subscribe, () => savedPrompt);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt(); // shows the browser's install dialog
    await prompt.userChoice; // waits for "accepted" or "dismissed"
    savedPrompt = null; // each event can only be used once
    notify();
  };

  return { canInstall: prompt !== null, install };
};
