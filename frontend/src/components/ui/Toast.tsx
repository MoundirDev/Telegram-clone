'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/lib/toastStore';
import clsx from 'clsx';

export default function Toast() {
  const { message, type, clear } = useToastStore();

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(clear, 3200);
    return () => clearTimeout(t);
  }, [message, clear]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div
        className={clsx(
          'px-4 py-2.5 rounded-xl shadow-lg text-[14px] font-medium text-white pointer-events-auto max-w-[90vw]',
          type === 'success' && 'bg-emerald-600',
          type === 'error' && 'bg-red-500',
          type === 'info' && 'bg-tg-blue'
        )}
        role="status"
      >
        {message}
      </div>
    </div>
  );
}
