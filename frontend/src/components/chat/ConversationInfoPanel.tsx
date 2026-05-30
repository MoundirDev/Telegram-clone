'use client';

import { useState } from 'react';
import { Conversation } from '@/types';
import { useAuthStore } from '@/lib/store';
import {
  useClearChatHistory,
  useDeleteConversation,
  useUpdateGroupConversation,
  useLeaveGroup,
} from '@/hooks/useApi';
import { getConversationTitle, getOtherMember } from '@/lib/chatUtils';
import { useToastStore } from '@/lib/toastStore';
import Avatar from '@/components/ui/Avatar';
import { IconBack } from '@/components/ui/Icons';

interface ConversationInfoPanelProps {
  conversation: Conversation;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ConversationInfoPanel({
  conversation,
  onClose,
  onDeleted,
}: ConversationInfoPanelProps) {
  const { user } = useAuthStore();
  const toast = useToastStore(s => s.show);
  const isGroup = conversation.type === 'group';
  const other = getOtherMember(conversation.members, user?.id);
  const title = getConversationTitle(conversation, user?.id);

  const [groupName, setGroupName] = useState(conversation.name ?? '');
  const { mutate: clearHistory, isPending: clearing } = useClearChatHistory();
  const { mutate: deleteConv, isPending: deleting } = useDeleteConversation();
  const { mutate: updateGroup, isPending: renaming } = useUpdateGroupConversation();
  const { mutate: leaveGroup, isPending: leaving } = useLeaveGroup();

  const busy = clearing || deleting || renaming || leaving;

  const handleClear = () => {
    if (!confirm('Clear all messages in this chat?')) return;
    clearHistory(conversation.id, {
      onSuccess: () => {
        toast('Chat history cleared', 'success');
        onClose();
      },
      onError: e => toast(e instanceof Error ? e.message : 'Failed', 'error'),
    });
  };

  const handleDelete = () => {
    if (!confirm('Delete this chat? This cannot be undone.')) return;
    deleteConv(conversation.id, {
      onSuccess: () => {
        toast('Chat deleted', 'success');
        onDeleted();
      },
      onError: e => toast(e instanceof Error ? e.message : 'Failed', 'error'),
    });
  };

  const handleRename = () => {
    const name = groupName.trim();
    if (!name) return;
    updateGroup(
      { conversationId: conversation.id, name },
      {
        onSuccess: () => toast('Group renamed', 'success'),
        onError: e => toast(e instanceof Error ? e.message : 'Failed', 'error'),
      }
    );
  };

  const handleLeave = () => {
    if (!user || !confirm('Leave this group?')) return;
    leaveGroup(
      { conversationId: conversation.id, userId: user.id },
      {
        onSuccess: () => {
          toast('You left the group', 'success');
          onDeleted();
        },
        onError: e => toast(e instanceof Error ? e.message : 'Failed', 'error'),
      }
    );
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 md:bg-black/20"
        aria-label="Close"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-tg-sidebar border-l border-tg-border shadow-2xl flex flex-col overflow-hidden">
        <header className="flex items-center gap-2 px-2 py-2 border-b border-tg-border min-h-[56px]">
          <button type="button" onClick={onClose} className="tg-btn-icon text-tg-blue">
            <IconBack />
          </button>
          <h2 className="text-[17px] font-semibold text-tg-title">
            {isGroup ? 'Group info' : 'Contact info'}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto tg-scrollbar p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar
              name={title}
              src={other?.avatar}
              size="lg"
              isGroup={isGroup}
              online={!isGroup && other?.isOnline}
            />
            <h3 className="mt-3 text-xl font-semibold text-tg-title">{title}</h3>
            {!isGroup && other && (
              <>
                <p className="text-tg-muted text-[14px] mt-1">{other.email}</p>
                {other.bio && (
                  <p className="text-tg-title text-[14px] mt-3 max-w-xs">{other.bio}</p>
                )}
                <p className="text-[13px] text-tg-online mt-2">
                  {other.isOnline ? 'online' : 'offline'}
                </p>
              </>
            )}
          </div>

          {isGroup && (
            <div className="mb-6">
              <label className="text-[13px] text-tg-muted ml-1">Group name</label>
              <div className="flex gap-2 mt-1">
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="flex-1 tg-search-input rounded-xl"
                />
                <button
                  type="button"
                  disabled={renaming || !groupName.trim()}
                  onClick={handleRename}
                  className="tg-btn-primary px-4"
                >
                  Save
                </button>
              </div>
              <p className="text-[13px] text-tg-muted mt-4 mb-2">
                {conversation.members.length} members
              </p>
              <ul className="space-y-1 rounded-xl border border-tg-border overflow-hidden">
                {conversation.members.map(m => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 px-3 py-2 bg-tg-search-bg/50"
                  >
                    <Avatar name={m.username} src={m.avatar} size="sm" />
                    <div className="min-w-0 text-left">
                      <p className="text-[15px] font-medium text-tg-title truncate">
                        {m.username}
                        {m.id === user?.id && (
                          <span className="text-tg-muted font-normal"> (you)</span>
                        )}
                      </p>
                      <p className="text-[12px] text-tg-muted truncate">{m.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <button
              type="button"
              disabled={busy}
              onClick={handleClear}
              className="w-full py-3 rounded-xl bg-tg-search-bg text-tg-title text-[15px] hover:bg-tg-hover disabled:opacity-50"
            >
              {clearing ? 'Clearing…' : 'Clear chat history'}
            </button>
            {isGroup && (
              <button
                type="button"
                disabled={busy}
                onClick={handleLeave}
                className="w-full py-3 rounded-xl text-red-500 hover:bg-red-500/10 text-[15px] font-medium disabled:opacity-50"
              >
                {leaving ? 'Leaving…' : 'Leave group'}
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={handleDelete}
              className="w-full py-3 rounded-xl text-red-500 hover:bg-red-500/10 text-[15px] font-medium disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : isGroup ? 'Delete group for everyone' : 'Delete chat'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
