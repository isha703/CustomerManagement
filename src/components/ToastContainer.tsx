import React, { useEffect, useState } from 'react';
import { AppToastEvent } from '../utils/toast';

type ToastItem = { id: number; message: string; type: AppToastEvent['type']; ttl: number };

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<AppToastEvent>;
      const { message, type = 'info', ttl = 4000 } = ce.detail || {};
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const item: ToastItem = { id, message, type, ttl };
      setToasts((s) => [item, ...s]);
      setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), ttl);
    };
    window.addEventListener('app-toast', handler as EventListener);
    return () => window.removeEventListener('app-toast', handler as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-2 w-full max-w-md px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-md px-4 py-2 rounded shadow-md text-sm ${
              t.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : t.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;