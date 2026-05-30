'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Conversation } from '@/types';
import { useAuthStore } from '@/lib/store';
import {
  formatChatListTime,
  getConversationTitle,
  getOtherMember,
} from '@/lib/chatUtils';
import Avatar from '@/components/ui/Avatar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { IconCompose, IconMenu, IconSearch, IconSettings } from '@/components/ui/Icons';
import NewConversationModal from './NewConversationModal';
import SidebarMenu from './SidebarMenu';
import LoadingSkeleton from '../common/LoadingSkeleton';
import clsx from 'clsx';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isLoading: boolean;
}

export default function ChatSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
}: ChatSidebarProps) {
  const { user } = useAuthStore();
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    const title = getConversationTitle(conv, user?.id).toLowerCase();
    const preview = conv.lastMessage?.content?.toLowerCase() ?? '';
    return title.includes(q) || preview.includes(q);
  });

  return (
    <>
      <aside className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-tg-sidebar">
        {/* Profile strip */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-tg-sidebar border-b border-tg-border min-h-[56px]">
          <button
            type="button"
            onClick={() => setShowMenu(true)}
            className="tg-btn-icon text-tg-blue flex-shrink-0"
            aria-label="Open menu"
          >
            <IconMenu className="w-6 h-6" />
          </button>
          <Link href="/settings" className="flex items-center gap-3 flex-1 min-w-0 group min-w-0">
            <Avatar name={user?.username ?? 'You'} src={user?.avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-tg-title truncate group-hover:text-tg-blue transition-colors">
                {user?.username ?? 'Account'}
              </p>
              <p className="text-[13px] text-tg-muted truncate">{user?.email}</p>
            </div>
          </Link>
          <ThemeToggle variant="compact" />
        </div>

        {/* Search + new chat */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-tg-border">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tg-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="tg-search-input pl-9 py-2 text-sm w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowNewConversationModal(true)}
            className="tg-btn-icon text-tg-blue flex-shrink-0"
            aria-label="New chat"
          >
            <IconCompose />
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 min-h-0 overflow-y-auto tg-scrollbar">
          {isLoading ? (
            <div className="p-2">
              <LoadingSkeleton count={6} />
            </div>
          ) : filteredConversations.length > 0 ? (
            <ul>
              {filteredConversations.map(conv => {
                const isSelected = selectedConversationId === conv.id;
                const title = getConversationTitle(conv, user?.id);
                const other =
                  conv.type === 'private'
                    ? getOtherMember(conv.members, user?.id)
                    : undefined;
                const isOnline = other?.isOnline ?? false;
                const time = formatChatListTime(
                  conv.lastMessage?.createdAt ?? conv.updatedAt
                );

                return (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => onSelectConversation(conv.id)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                        isSelected ? 'bg-tg-selected' : 'hover:bg-tg-hover'
                      )}
                    >
                      <Avatar
                        name={title}
                        src={other?.avatar}
                        size="md"
                        isGroup={conv.type === 'group'}
                        online={conv.type === 'private' && isOnline && !isSelected}
                      />
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span
                            className={clsx(
                              'text-[15px] font-semibold truncate',
                              isSelected ? 'text-tg-selected-text' : 'text-tg-title'
                            )}
                          >
                            {title}
                          </span>
                          {time && (
                            <span
                              className={clsx(
                                'text-xs flex-shrink-0',
                                isSelected ? 'text-tg-selected-text/75' : 'text-tg-muted'
                              )}
                            >
                              {time}
                            </span>
                          )}
                        </div>
                        <p
                          className={clsx(
                            'text-[14px] truncate mt-0.5',
                            isSelected ? 'text-tg-selected-text/85' : 'text-tg-muted'
                          )}
                        >
                          {conv.lastMessage?.content ||
                            (conv.type === 'group' ? 'Group' : 'No messages yet')}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <p className="text-tg-muted text-[15px]">No chats yet</p>
              <button
                type="button"
                onClick={() => setShowNewConversationModal(true)}
                className="mt-3 text-tg-blue text-[15px] font-medium hover:underline"
              >
                Start messaging
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-tg-border p-2 flex-shrink-0">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-tg-title hover:bg-tg-hover transition-colors text-[15px]"
          >
            <IconSettings className="w-5 h-5 text-tg-muted" />
            Settings
          </Link>
        </div>
      </aside>

      <SidebarMenu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        onNewChat={() => setShowNewConversationModal(true)}
      />

      {showNewConversationModal && (
        <NewConversationModal
          onClose={() => setShowNewConversationModal(false)}
          onSelectConversation={id => {
            onSelectConversation(id);
            setShowNewConversationModal(false);
          }}
        />
      )}
    </>
  );
}
