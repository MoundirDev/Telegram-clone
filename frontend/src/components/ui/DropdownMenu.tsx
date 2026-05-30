'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

export interface DropdownItem {
  id: string;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  open: boolean;
  onClose: () => void;
  anchorClassName?: string;
  align?: 'left' | 'right';
}

export default function DropdownMenu({
  items,
  open,
  onClose,
  anchorClassName = 'right-0 top-full mt-1',
  align = 'right',
}: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={clsx(
        'absolute z-50 min-w-[200px] py-1.5 rounded-xl bg-tg-sidebar border border-tg-border shadow-xl',
        align === 'right' ? anchorClassName : 'left-0 top-full mt-1'
      )}
    >
      {items.map(item => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={clsx(
            'w-full text-left px-4 py-2.5 text-[15px] transition-colors disabled:opacity-40',
            item.destructive
              ? 'text-red-500 hover:bg-red-500/10'
              : 'text-tg-title hover:bg-tg-hover'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
