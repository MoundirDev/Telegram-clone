'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore } from '@/lib/store';
import { useConversations } from '@/hooks/useApi';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import EmptyChat from './EmptyChat';

export default function ChatShell() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    null
  );
  const { data: conversationsData, isLoading: chatsLoading } = useConversations();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-tg-panel">
        <div className="w-10 h-10 border-2 border-tg-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const showChat = !!selectedConversationId;

  return (
    <div className="flex h-dvh w-full max-w-[100vw] overflow-hidden bg-tg-panel">
      {/* Left: chat list */}
      <aside
        className={clsx(
          'flex h-dvh w-full shrink-0 flex-col overflow-hidden border-tg-border bg-tg-sidebar md:w-[420px] md:border-r',
          showChat ? 'hidden md:flex' : 'flex'
        )}
      >
        <ChatSidebar
          conversations={conversationsData?.conversations ?? []}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          isLoading={chatsLoading}
        />
      </aside>

      {/* Right: active chat — full screen on phone */}
      <main
        className={clsx(
          'flex h-dvh min-w-0 flex-1 flex-col overflow-hidden bg-tg-chat-bg',
          showChat
            ? 'fixed inset-0 z-30 w-full md:static md:z-auto'
            : 'hidden md:flex'
        )}
      >
        {showChat && selectedConversationId ? (
          <ChatWindow
            key={selectedConversationId}
            conversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <EmptyChat />
        )}
      </main>
    </div>
  );
}
