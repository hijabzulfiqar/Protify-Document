"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastComponent({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
          textColor: "text-green-900",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: AlertCircle,
          iconColor: "text-red-600",
          textColor: "text-red-900",
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: Info,
          iconColor: "text-blue-600",
          textColor: "text-blue-900",
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          icon: Info,
          iconColor: "text-gray-600",
          textColor: "text-gray-900",
        };
    }
  };

  const styles = getToastStyles();
  const Icon = styles.icon;

  return (
    <div
      className={`${styles.bg} border rounded-lg p-4 shadow-lg transform transition-all duration-300 animate-in slide-in-from-right-full`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${styles.textColor}`}>
            {toast.title}
          </h4>
          {toast.description && (
            <p className={`text-sm ${styles.textColor} opacity-90 mt-1`}>
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
