'use client';

import { useEffect, useRef } from 'react';

const EMOJIS = [
  '😀', '😂', '🥰', '😍', '🤔', '😎', '👍', '👎', '🙏', '👏',
  '🔥', '❤️', '💯', '✅', '❌', '🎉', '💬', '📎', '📷', '🎵',
  '😢', '😡', '🤝', '💪', '🚀', '⭐', '☕', '🍕', '🌙', '☀️',
];

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ open, onClose, onSelect }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 p-2 rounded-2xl bg-tg-sidebar border border-tg-border shadow-xl z-50 w-[min(320px,90vw)]"
    >
      <div className="grid grid-cols-8 gap-0.5 max-h-40 overflow-y-auto tg-scrollbar">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-tg-hover transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
