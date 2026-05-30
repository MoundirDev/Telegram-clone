'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useAllMessages,
  useSendMessage,
  useConversationDetails,
  useClearChatHistory,
  useDeleteConversation,
  useLeaveGroup,
} from '@/hooks/useApi';
import { useAuthStore } from '@/lib/store';
import { formatDateSeparator, isSameDay } from '@/lib/chatUtils';
import { useToastStore } from '@/lib/toastStore';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import ChatSearchPanel from './ChatSearchPanel';
import ConversationInfoPanel from './ConversationInfoPanel';
import DateSeparator from './DateSeparator';
import LoadingSkeleton from '../common/LoadingSkeleton';

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
}

export default function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const toast = useToastStore(s => s.show);

  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const { data: conversationData, isLoading: loadingConversation } =
    useConversationDetails(conversationId);
  const { data: messagesData, isLoading: loadingMessages } = useAllMessages(conversationId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: clearHistory } = useClearChatHistory();
  const { mutate: deleteConv } = useDeleteConversation();
  const { mutate: leaveGroup } = useLeaveGroup();

  const isGroup = conversationData?.type === 'group';
  const messages = messagesData?.messages ?? [];

  useEffect(() => {
    setShowSearch(false);
    setShowInfo(false);
    setHighlightId(null);
  }, [conversationId]);

  const scrollToBottom = (smooth = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (!highlightId) {
      requestAnimationFrame(() => scrollToBottom(false));
    }
  }, [conversationId, messages.length, highlightId]);

  useEffect(() => {
    if (!highlightId) return;
    const node = document.getElementById(`msg-${highlightId}`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const t = setTimeout(() => setHighlightId(null), 2000);
    return () => clearTimeout(t);
  }, [highlightId, messages]);

  const handleSendMessage = (content: string, files?: File[]) => {
    sendMessage(
      { conversationId, content, files },
      {
        onSuccess: () => requestAnimationFrame(() => scrollToBottom(true)),
        onError: e => toast(e instanceof Error ? e.message : 'Send failed', 'error'),
      }
    );
  };

  const runClear = () => {
    if (!confirm('Clear all messages in this chat?')) return;
    clearHistory(conversationId, {
      onSuccess: () => toast('Chat history cleared', 'success'),
      onError: e => toast(e instanceof Error ? e.message : 'Failed', 'error'),
    });
  };

  const runDeleteOrLeave = () => {
    if (isGroup) {
      if (!user || !confirm('Leave this group?')) return;
      leaveGroup(
        { conversationId, userId: user.id },
        {
          onSuccess: () => {
            toast('You left the group', 'success');
            onBack();
          },
          onError: e => toast(e instanceof Error ? e.message : 'Failed', 'error'),
        }
      );
    } else {
      if (!confirm('Delete this chat?')) return;
      deleteConv(conversationId, {
        onSuccess: () => {
          toast('Chat deleted', 'success');
          onBack();
        },
        onError: e => toast(e instanceof Error ? e.message : 'Failed', 'error'),
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-tg-chat-bg">
      {/* Header — top of page */}
      <div className="w-full shrink-0">
        {showSearch ? (
          <ChatSearchPanel
            conversationId={conversationId}
            onClose={() => setShowSearch(false)}
            onJumpToMessage={id => setHighlightId(id)}
          />
        ) : loadingConversation || !conversationData ? (
          <header className="h-14 w-full bg-tg-sidebar border-b border-tg-border animate-pulse" />
        ) : (
          <ChatHeader
            conversation={conversationData}
            onBack={onBack}
            onOpenSearch={() => setShowSearch(true)}
            onOpenInfo={() => setShowInfo(true)}
            onClearChat={runClear}
            onDeleteChat={runDeleteOrLeave}
          />
        )}
      </div>

      {/* Messages — fills space between header and input */}
      <div
        ref={scrollContainerRef}
        className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden tg-scrollbar tg-chat-wallpaper"
      >
        <div className="w-full px-3 py-3 sm:px-4">
          {loadingMessages ? (
            <div className="space-y-3 py-2">
              <LoadingSkeleton count={5} variant="message" />
            </div>
          ) : messages.length > 0 ? (
            <div className="w-full flex flex-col gap-0">
              {messages.map((message, index) => {
                const prev = messages[index - 1];
                const next = messages[index + 1];
                const showDate =
                  !prev || !isSameDay(prev.createdAt, message.createdAt);
                const showSenderName =
                  isGroup &&
                  message.senderId.id !== user?.id &&
                  (!prev || prev.senderId.id !== message.senderId.id);
                const isGroupedWithPrev =
                  !!prev &&
                  prev.senderId.id === message.senderId.id &&
                  isSameDay(prev.createdAt, message.createdAt);
                const isGroupedWithNext =
                  !!next &&
                  next.senderId.id === message.senderId.id &&
                  isSameDay(message.createdAt, next.createdAt);

                return (
                  <div
                    key={message.id}
                    id={`msg-${message.id}`}
                    className={
                      highlightId === message.id
                        ? 'rounded-lg ring-2 ring-tg-blue/60'
                        : undefined
                    }
                  >
                    {showDate && (
                      <DateSeparator label={formatDateSeparator(message.createdAt)} />
                    )}
                    <MessageBubble
                      message={message}
                      showSenderName={showSenderName}
                      isGroupedWithPrev={isGroupedWithPrev}
                      isGroupedWithNext={isGroupedWithNext}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-[15px] text-tg-muted">
              No messages yet — send the first one
            </p>
          )}
        </div>
      </div>

      {/* Input — bottom of page */}
      <div className="w-full shrink-0 border-t border-tg-border bg-tg-sidebar pb-[env(safe-area-inset-bottom)]">
        <MessageInput
          key={conversationId}
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </div>

      {showInfo && conversationData && (
        <ConversationInfoPanel
          conversation={conversationData}
          onClose={() => setShowInfo(false)}
          onDeleted={onBack}
        />
      )}
    </div>
  );
}
