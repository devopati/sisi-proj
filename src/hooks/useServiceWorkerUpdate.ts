import { useEffect, useState } from "react";

export const useServiceWorkerUpdate = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;
    let installingWorker: ServiceWorker | null = null;

    const checkForWaitingWorker = () => {
      if (registration?.waiting) setWaitingWorker(registration.waiting);
    };

    const handleStateChange = () => {
      if (installingWorker?.state === "installed" && navigator.serviceWorker.controller) {
        checkForWaitingWorker();
      }
    };

    const handleUpdateFound = () => {
      installingWorker = registration?.installing ?? null;
      installingWorker?.addEventListener("statechange", handleStateChange);
    };

    void navigator.serviceWorker.ready
      .then((readyRegistration) => {
        registration = readyRegistration;
        registration.addEventListener("updatefound", handleUpdateFound);
        checkForWaitingWorker();
      })
      .catch((error: unknown) => {
        console.error("Could not check for a service worker update:", error);
      });

    return () => {
      registration?.removeEventListener("updatefound", handleUpdateFound);
      installingWorker?.removeEventListener("statechange", handleStateChange);
    };
  }, []);

  const applyUpdate = () => {
    if (!waitingWorker) return;

    const reloadWhenControlled = () => window.location.reload();
    navigator.serviceWorker.addEventListener("controllerchange", reloadWhenControlled, { once: true });
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  return { updateReady: waitingWorker !== null, applyUpdate };
};
