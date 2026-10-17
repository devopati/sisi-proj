import { useEffect, useState } from "react";

export const UpdatePrompt = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  useEffect(() => {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) setWaitingWorker(registration.waiting);

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
            }
          });
        }
      });
    });
  }, []);

  const onRefresh = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  };

  useEffect(() => {
    const handleControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );
    return () =>
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
  }, []);

  if (!waitingWorker) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-800 text-white p-4 rounded shadow-lg z-50">
      <p className="font-semibold">A new version is ready.</p>
      <button
        onClick={onRefresh}
        className="mt-2 bg-white text-green-900 px-4 py-1 rounded font-bold hover:bg-gray-100"
      >
        Refresh
      </button>
    </div>
  );
};
