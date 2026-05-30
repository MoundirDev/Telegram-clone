'use client';

import { IconTelegram } from '@/components/ui/Icons';

export default function EmptyChat() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center tg-chat-wallpaper">
      <div className="flex flex-col items-center max-w-md px-8 text-center">
        <div className="mb-8 rounded-full border border-tg-border bg-tg-sidebar/90 p-6 shadow-header">
          <IconTelegram className="h-20 w-20" />
        </div>
        <h2 className="mb-2 text-[32px] font-light tracking-tight text-tg-title">
          Telegram Clone
        </h2>
        <p className="max-w-xs text-[15px] leading-relaxed text-tg-muted">
          Select a chat from the list to start messaging.
        </p>
      </div>
    </div>
  );
}
