'use client';

import { useState } from 'react';
import { Conversation } from '@/types';
import { useAuthStore } from '@/lib/store';
import { formatLastSeen, getConversationTitle, getOtherMember } from '@/lib/chatUtils';
import Avatar from '@/components/ui/Avatar';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { IconBack, IconMore, IconSearch } from '@/components/ui/Icons';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onOpenSearch: () => void;
  onOpenInfo: () => void;
  onClearChat: () => void;
  onDeleteChat: () => void;
}

export default function ChatHeader({
  conversation,
  onBack,
  onOpenSearch,
  onOpenInfo,
  onClearChat,
  onDeleteChat,
}: ChatHeaderProps) {
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isGroup = conversation.type === 'group';
  const other = getOtherMember(conversation.members, user?.id);
  const title = getConversationTitle(conversation, user?.id);

  const subtitle = isGroup
    ? `${conversation.members.length} members`
    : other
      ? formatLastSeen(other.isOnline, other.lastSeen)
      : '';

  const menuItems = [
    { id: 'info', label: isGroup ? 'Group info' : 'View contact', onClick: onOpenInfo },
    { id: 'search', label: 'Search messages', onClick: onOpenSearch },
    { id: 'clear', label: 'Clear history', onClick: onClearChat },
    {
      id: 'delete',
      label: isGroup ? 'Leave group' : 'Delete chat',
      onClick: onDeleteChat,
      destructive: true,
    },
  ];

  return (
    <header className="relative flex items-center gap-2 px-2 py-2 bg-tg-sidebar border-b border-tg-border shadow-header min-h-[56px] z-10 shrink-0">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="md:hidden tg-btn-icon text-tg-blue"
          aria-label="Back"
        >
          <IconBack />
        </button>
      )}

      <button
        type="button"
        onClick={onOpenInfo}
        className="flex items-center gap-3 flex-1 min-w-0 text-left rounded-lg hover:bg-tg-hover px-2 py-1 transition-colors"
      >
        <Avatar
          name={title}
          src={other?.avatar}
          size="header"
          isGroup={isGroup}
          online={!isGroup && other?.isOnline}
        />
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-tg-title truncate">{title}</h2>
          <p
            className={`text-[13px] truncate ${
              !isGroup && other?.isOnline ? 'text-tg-online' : 'text-tg-muted'
            }`}
          >
            {subtitle}
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={onOpenSearch}
        className="tg-btn-icon hidden sm:flex"
        aria-label="Search in chat"
      >
        <IconSearch />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(v => !v)}
          className="tg-btn-icon"
          aria-label="More"
          aria-expanded={menuOpen}
        >
          <IconMore />
        </button>
        <DropdownMenu
          items={menuItems}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </header>
  );
}
