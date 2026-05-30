'use client';

import { useState } from 'react';
import { useSearchInChat } from '@/hooks/useApi';
import { formatMessageTime } from '@/lib/chatUtils';
import { IconBack, IconSearch } from '@/components/ui/Icons';
import { Message } from '@/types';

interface ChatSearchPanelProps {
  conversationId: string;
  onClose: () => void;
  onJumpToMessage: (messageId: string) => void;
}

export default function ChatSearchPanel({
  conversationId,
  onClose,
  onJumpToMessage,
}: ChatSearchPanelProps) {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchInChat(conversationId, query);
  const results = (data?.messages ?? []) as Message[];

  return (
    <div className="flex flex-col border-b border-tg-border bg-tg-sidebar shrink-0">
      <div className="flex items-center gap-2 px-2 py-2 min-h-[56px]">
        <button type="button" onClick={onClose} className="tg-btn-icon text-tg-blue" aria-label="Close search">
          <IconBack />
        </button>
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tg-muted pointer-events-none" />
          <input
            type="search"
            autoFocus
            placeholder="Search in this chat"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="tg-search-input pl-9 py-2 text-sm w-full"
          />
        </div>
      </div>

      {query.trim() && (
        <div className="max-h-48 overflow-y-auto tg-scrollbar border-t border-tg-border">
          {isLoading ? (
            <p className="p-4 text-center text-tg-muted text-sm">Searching…</p>
          ) : results.length > 0 ? (
            <ul>
              {results.map(msg => (
                <li key={msg.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onJumpToMessage(msg.id);
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-tg-hover border-b border-tg-border/50 last:border-0"
                  >
                    <p className="text-[13px] text-tg-blue font-medium">{msg.senderId.username}</p>
                    <p className="text-[14px] text-tg-title truncate">{msg.content || '📎 Attachment'}</p>
                    <p className="text-[12px] text-tg-muted mt-0.5">
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-tg-muted text-sm">No messages found</p>
          )}
        </div>
      )}
    </div>
  );
}
