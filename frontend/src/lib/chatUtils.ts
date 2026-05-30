import { Conversation, User } from '@/types';

const AVATAR_GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-rose-500',
  'from-fuchsia-500 to-pink-600',
  'from-cyan-500 to-blue-500',
  'from-amber-400 to-orange-500',
  'from-indigo-500 to-violet-600',
];

export function getOtherMember(
  members: User[],
  currentUserId: string | undefined
): User | undefined {
  if (!currentUserId) {
    return members[0];
  }
  return members.find(m => m.id !== currentUserId) ?? members[0];
}

export function getConversationTitle(
  conv: Conversation,
  currentUserId: string | undefined
): string {
  if (conv.type === 'group') {
    return conv.name || 'Group';
  }
  return getOtherMember(conv.members, currentUserId)?.username ?? 'Unknown';
}

export function getAvatarGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatMessageTime(date: string): string {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatChatListTime(date?: string): string {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    return formatMessageTime(date);
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'Yesterday';

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (d > weekAgo) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }

  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function formatDateSeparator(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();

  const day = startOfDay(d);
  const today = startOfDay(now);
  const yesterday = startOfDay(new Date(now.getTime() - 86400000));

  if (day === today) return 'Today';
  if (day === yesterday) return 'Yesterday';

  return d.toLocaleDateString([], {
    day: 'numeric',
    month: 'long',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export function formatLastSeen(isOnline: boolean, lastSeen: string): string {
  if (isOnline) return 'online';
  const d = new Date(lastSeen);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 1) return 'last seen just now';
  if (diffMin < 60) return `last seen ${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `last seen ${diffH} h ago`;
  return `last seen ${d.toLocaleDateString()}`;
}
