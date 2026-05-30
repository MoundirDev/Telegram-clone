import {
  attachLastMessages,
  createSeedDatabase,
  MockDatabase,
  MockUser,
} from './mockData';
import { Conversation, Message, User } from '@/types';

const STORAGE_KEY = 'telegram-clone-mock-db';
const MESSAGES_PER_PAGE = 20;

let db: MockDatabase | null = null;

export function getMockDb(): MockDatabase {
  if (db) {
    return db;
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        db = JSON.parse(stored) as MockDatabase;
        attachLastMessages(db);
        return db;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  db = createSeedDatabase();
  persistMockDb();
  return db;
}

export function persistMockDb(): void {
  if (typeof window !== 'undefined' && db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

export function resetMockDb(): void {
  db = createSeedDatabase();
  persistMockDb();
}

export function stripPassword(user: MockUser): User {
  const { password: _, ...safe } = user;
  return safe;
}

export function findUserById(id: string): MockUser | undefined {
  return getMockDb().users.find(u => u.id === id);
}

export function findUserByEmail(email: string): MockUser | undefined {
  return getMockDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserFromToken(token: string | null): MockUser | null {
  if (!token || !token.startsWith('mock-')) {
    return null;
  }
  const userId = token.slice('mock-'.length);
  return findUserById(userId) ?? null;
}

export function createToken(userId: string): string {
  return `mock-${userId}`;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getConversationMessages(
  conversationId: string,
  page: number
): {
  page: number;
  totalPages: number;
  totalMessages: number;
  count: number;
  messages: Message[];
} {
  const database = getMockDb();
  const all = database.messagesByConversation[conversationId] || [];
  const totalMessages = all.length;
  const totalPages = Math.max(1, Math.ceil(totalMessages / MESSAGES_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * MESSAGES_PER_PAGE;
  const slice = all.slice(skip, skip + MESSAGES_PER_PAGE);

  return {
    page: safePage,
    totalPages,
    totalMessages,
    count: slice.length,
    messages: slice.map(m => ({
      ...m,
      senderId: { ...m.senderId },
    })),
  };
}

export function addMessage(
  conversationId: string,
  sender: User,
  content: string,
  attachments: Message['attachments'] = []
): Message {
  const database = getMockDb();
  const message: Message = {
    id: generateId('msg'),
    conversationId,
    senderId: { ...sender },
    content,
    attachments,
    createdAt: new Date().toISOString(),
  };

  if (!database.messagesByConversation[conversationId]) {
    database.messagesByConversation[conversationId] = [];
  }
  database.messagesByConversation[conversationId].push(message);

  const conv = database.conversations.find(c => c.id === conversationId);
  if (conv) {
    conv.lastMessage = message;
    conv.updatedAt = message.createdAt;
    database.conversations.sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  }

  persistMockDb();
  return message;
}

export function findPrivateConversation(userId: string, otherUserId: string): Conversation | undefined {
  return getMockDb().conversations.find(
    c =>
      c.type === 'private' &&
      c.members.some(m => m.id === userId) &&
      c.members.some(m => m.id === otherUserId)
  );
}

export function userInConversation(conv: Conversation, userId: string): boolean {
  return conv.members.some(m => m.id === userId);
}

export function getAllConversationMessages(conversationId: string): Message[] {
  const database = getMockDb();
  return (database.messagesByConversation[conversationId] || []).map(m => ({
    ...m,
    senderId: { ...m.senderId },
  }));
}

export function clearConversationMessages(conversationId: string): void {
  const database = getMockDb();
  database.messagesByConversation[conversationId] = [];
  const conv = database.conversations.find(c => c.id === conversationId);
  if (conv) {
    conv.lastMessage = undefined;
    conv.updatedAt = new Date().toISOString();
  }
  persistMockDb();
}

export function deleteConversation(conversationId: string): void {
  const database = getMockDb();
  database.conversations = database.conversations.filter(c => c.id !== conversationId);
  delete database.messagesByConversation[conversationId];
  persistMockDb();
}

export function addMemberToGroupConversation(
  conversationId: string,
  userId: string
): Conversation | undefined {
  const database = getMockDb();
  const conv = database.conversations.find(c => c.id === conversationId);
  const user = findUserById(userId);
  if (!conv || conv.type !== 'group' || !user) return undefined;
  if (conv.members.some(m => m.id === userId)) return conv;
  conv.members.push(stripPassword(user));
  conv.updatedAt = new Date().toISOString();
  persistMockDb();
  return conv;
}

export async function simulateDelay(ms = 150): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}
