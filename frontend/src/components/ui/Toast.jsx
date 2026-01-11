import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = {
  success: () => {},
  error: () => {},
  info: () => {},
};

let toastListeners = [];

export const toast = {
  success: (message) => emitToast('success', message),
  error: (message) => emitToast('error', message),
  info: (message) => emitToast('info', message),
};

const emitToast = (type, message) => {
  const id = Math.random().toString(36).substr(2, 9);
  toastListeners.forEach((listener) => listener({ id, type, message }));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'flex w-full max-w-sm items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 transition-all',
            {
              'border-l-4 border-green-500': toast.type === 'success',
              'border-l-4 border-red-500': toast.type === 'error',
              'border-l-4 border-blue-500': toast.type === 'info',
            }
          )}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
          
          <p className="flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
