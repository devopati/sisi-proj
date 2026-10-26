import { createContext, useContext, useState, type ReactNode } from "react";

type Toast = {
  id: string;
  message: string;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm shadow-lg"
          >
            <span className="text-ink">{toast.message}</span>
            <button type="button" onClick={() => dismissToast(toast.id)} className="font-bold text-muted hover:text-ink">
              ×
            </button>
          </div>
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
};

export default ToastProvider;
