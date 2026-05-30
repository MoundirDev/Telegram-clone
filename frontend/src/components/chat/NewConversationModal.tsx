'use client';

import { useState } from 'react';
import {
  useSearchUsers,
  useCreatePrivateConversation,
  useCreateGroupConversation,
} from '@/hooks/useApi';
import { User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { IconSearch } from '@/components/ui/Icons';
import clsx from 'clsx';
import { useToastStore } from '@/lib/toastStore';

interface NewConversationModalProps {
  onClose: () => void;
  onSelectConversation: (id: string) => void;
}

export default function NewConversationModal({
  onClose,
  onSelectConversation,
}: NewConversationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');

  const { data: searchResults, isLoading: isSearching } = useSearchUsers(searchQuery);
  const { mutate: createPrivate, isPending: isCreatingPrivate } =
    useCreatePrivateConversation();
  const { mutate: createGroup, isPending: isCreatingGroup } =
    useCreateGroupConversation();
  const toast = useToastStore(s => s.show);

  const handleUserClick = (u: User) => {
    if (tab === 'direct') {
      createPrivate(u.id, {
        onSuccess: conversation => onSelectConversation(conversation.id),
        onError: e => toast(e instanceof Error ? e.message : 'Could not start chat', 'error'),
      });
    } else {
      setSelectedUsers(prev =>
        prev.find(x => x.id === u.id) ? prev.filter(x => x.id !== u.id) : [...prev, u]
      );
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    createGroup(
      { name: groupName.trim(), memberIds: selectedUsers.map(u => u.id) },
      {
        onSuccess: conversation => onSelectConversation(conversation.id),
        onError: e => toast(e instanceof Error ? e.message : 'Could not create group', 'error'),
      }
    );
  };

  const searchUsers = (searchResults?.users || []) as User[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-tg-sidebar rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-tg-border">
          <h2 className="text-lg font-semibold text-tg-title">New Message</h2>
          <button
            type="button"
            onClick={onClose}
            className="tg-btn-icon w-8 h-8 text-tg-muted"
          >
            ×
          </button>
        </header>

        <div className="flex border-b border-tg-border">
          {(['direct', 'group'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={clsx(
                'flex-1 py-2.5 text-[15px] font-medium transition-colors',
                tab === t
                  ? 'text-tg-blue border-b-2 border-tg-blue'
                  : 'text-tg-muted hover:text-tg-title'
              )}
            >
              {t === 'direct' ? 'New Chat' : 'New Group'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 tg-scrollbar">
          <div className="relative mb-4">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tg-muted" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="tg-search-input pl-9"
              autoFocus
            />
          </div>

          {tab === 'group' && (
            <>
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="tg-search-input rounded-xl mb-3"
              />
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedUsers.map(u => (
                    <span
                      key={u.id}
                      className="inline-flex items-center gap-1 bg-tg-blue/10 text-tg-blue text-sm px-3 py-1 rounded-full"
                    >
                      {u.username}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedUsers(selectedUsers.filter(x => x.id !== u.id))
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {isSearching || isCreatingPrivate ? (
            <p className="text-center text-tg-muted py-6 text-[15px]">Searching…</p>
          ) : searchUsers.length > 0 ? (
            <ul className="space-y-0.5">
              {searchUsers.map(u => {
                const selected = selectedUsers.some(x => x.id === u.id);
                return (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => handleUserClick(u)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left',
                        selected ? 'bg-tg-blue/10' : 'hover:bg-tg-hover'
                      )}
                    >
                      <Avatar name={u.username} src={u.avatar} size="sm" />
                      <div>
                        <p className="text-[15px] font-medium text-tg-title">{u.username}</p>
                        <p className="text-[13px] text-tg-muted">{u.email}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : searchQuery ? (
            <p className="text-center text-tg-muted py-6">No users found</p>
          ) : (
            <p className="text-center text-tg-muted py-6 text-[15px]">
              Type to search contacts
            </p>
          )}
        </div>

        {tab === 'group' && (
          <footer className="p-4 border-t border-tg-border">
            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={
                !groupName.trim() || selectedUsers.length === 0 || isCreatingGroup
              }
              className="tg-btn-primary w-full"
            >
              {isCreatingGroup ? 'Creating…' : 'Create group'}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
