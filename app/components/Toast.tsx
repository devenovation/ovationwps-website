"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastApi {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TOAST_DURATION_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((cur) => [...cur, { id, variant, title, description }]);
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const api: ToastApi = useMemo(
    () => ({
      success: (t, d) => push("success", t, d),
      error: (t, d) => push("error", t, d),
      info: (t, d) => push("info", t, d),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-4 right-4 z-[2000] flex w-full max-w-[360px] flex-col gap-2"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setEnter(true));
  }, []);
  const styles = VARIANT_STYLES[toast.variant];
  return (
    <div
      role="status"
      data-testid={`toast-${toast.variant}`}
      className={`pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl border bg-white px-4 py-3 shadow-[0_12px_36px_rgba(15,30,60,0.18)] transition-all duration-300 dark:bg-navy ${
        styles.border
      } ${enter ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
    >
      <div
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${styles.iconBg} ${styles.iconColor}`}
      >
        {styles.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.92rem] font-semibold text-navy dark:text-white">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 break-words text-[0.82rem] leading-[1.55] text-ink-500 dark:text-white/65">
            {toast.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="-m-1 grid h-7 w-7 shrink-0 place-items-center rounded-md text-ink-500 transition-colors hover:bg-ink-100 dark:text-white/55 dark:hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { border: string; iconBg: string; iconColor: string; icon: ReactNode }
> = {
  success: {
    border: "border-emerald-200 dark:border-emerald-500/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    iconColor: "text-emerald-700 dark:text-emerald-300",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  error: {
    border: "border-brand-red/30 dark:border-brand-red-soft/30",
    iconBg: "bg-brand-red-light dark:bg-brand-red/20",
    iconColor: "text-brand-red dark:text-brand-red-soft",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  info: {
    border: "border-ink-200 dark:border-white/15",
    iconBg: "bg-ink-100 dark:bg-white/10",
    iconColor: "text-ink-700 dark:text-white/80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}
