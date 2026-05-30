'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const options = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
] as const;

interface ThemeToggleProps {
  variant?: 'segmented' | 'compact';
  className?: string;
}

export default function ThemeToggle({ variant = 'segmented', className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={clsx(
          'h-10 rounded-xl bg-tg-search-bg animate-pulse',
          variant === 'segmented' ? 'w-full' : 'w-10',
          className
        )}
      />
    );
  }

  const active = theme ?? 'system';

  if (variant === 'compact') {
    const next =
      resolvedTheme === 'dark' ? 'light' : 'dark';
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className={clsx('tg-btn-icon', className)}
        aria-label={`Switch to ${next} theme`}
        title={`Theme: ${resolvedTheme}`}
      >
        {resolvedTheme === 'dark' ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.5 5.5 0 0 1-4.4 2.26 5.5 5.5 0 0 1-5.38-6.64A9 9 0 0 0 12 3z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5M2 13h2v2H2v-2m18 0h2v2h-2v-2M11 2v2h2V2h-2m0 18v2h2v-2h-2M4.22 4.22l1.42 1.42 1.42-1.42-1.42-1.42-1.42 1.42m12.72 12.72 1.42 1.42 1.42-1.42-1.42-1.42-1.42 1.42M4.22 19.78l1.42-1.42 1.42 1.42-1.42 1.42-1.42-1.42m12.72-12.72 1.42-1.42 1.42 1.42-1.42 1.42-1.42-1.42" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div
      className={clsx(
        'flex p-1 rounded-xl gap-1 bg-tg-search-bg border border-tg-border',
        className
      )}
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={active === opt.value}
          onClick={() => setTheme(opt.value)}
          className={clsx(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[13px] font-medium transition-colors',
            active === opt.value
              ? 'bg-tg-sidebar text-tg-blue shadow-sm'
              : 'text-tg-muted hover:text-tg-title'
          )}
        >
          <span aria-hidden>{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
