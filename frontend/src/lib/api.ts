import { AuthResponse, Conversation, Message, User } from '@/types';
import {
  addMessage,
  createToken,
  findPrivateConversation,
  findUserByEmail,
  findUserById,
  generateId,
  getConversationMessages,
  getAllConversationMessages,
  clearConversationMessages,
  deleteConversation as removeConversationFromDb,
  addMemberToGroupConversation,
  getMockDb,
  getUserFromToken,
  persistMockDb,
  simulateDelay,
  stripPassword,
  userInConversation,
} from './mockDb';
import { DEMO_EMAIL, DEMO_PASSWORD, MockUser } from './mockData';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class MockApiClient {
  private currentToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.currentToken = token;
      }
    }
  }

  private getCurrentUser(): MockUser {
    const user =
      getUserFromToken(this.currentToken) ||
      getUserFromToken(
        typeof window !== 'undefined' ? localStorage.getItem('token') : null
      );
    if (!user) {
      throw new ApiError('Unauthorized');
    }
    return user;
  }

  private authResponse(user: MockUser): AuthResponse {
    const token = createToken(user.id);
    this.setToken(token);
    return { token, user: stripPassword(user) };
  }

  setToken(token: string) {
    this.currentToken = token || null;
  }

  clearToken() {
    this.currentToken = null;
  }

  async register(username: string, email: string, password: string, confirmPassword: string) {
    await simulateDelay();

    if (password !== confirmPassword) {
      throw new ApiError('Passwords do not match');
    }
    if (findUserByEmail(email)) {
      throw new ApiError('Email already registered');
    }

    const db = getMockDb();
    const user: MockUser = {
      id: generateId('user'),
      username,
      email,
      password,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    persistMockDb();
    return this.authResponse(user);
  }

  async login(email: string, password: string) {
    await simulateDelay();

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new ApiError('Invalid email or password');
    }
    user.isOnline = true;
    user.lastSeen = new Date().toISOString();
    persistMockDb();
    return this.authResponse(user);
  }

  async getCurrentUserProfile() {
    await simulateDelay(80);
    return stripPassword(this.getCurrentUser());
  }

  async logout() {
    await simulateDelay(50);
    const user = getUserFromToken(this.currentToken);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date().toISOString();
      persistMockDb();
    }
    this.clearToken();
  }

  async getUserProfile(userId: string) {
    await simulateDelay(80);
    const user = findUserById(userId);
    if (!user) {
      throw new ApiError('User not found');
    }
    return stripPassword(user);
  }

  async updateUserProfile(formData: FormData) {
    await simulateDelay();
    const current = this.getCurrentUser();
    const username = formData.get('username');
    const bio = formData.get('bio');
    const avatarFile = formData.get('avatar');

    if (typeof username === 'string' && username.trim()) {
      current.username = username.trim();
    }
    if (typeof bio === 'string') {
      current.bio = bio;
    }
    if (avatarFile instanceof File) {
      current.avatar = URL.createObjectURL(avatarFile);
    }

    persistMockDb();

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(stripPassword(current)));
    }

    return stripPassword(current);
  }

  async searchUsers(query: string) {
    await simulateDelay(100);
    const current = this.getCurrentUser();
    const q = query.trim().toLowerCase();
    const users = getMockDb()
      .users.filter(
        u =>
          u.id !== current.id &&
          (u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      )
      .slice(0, 20)
      .map(stripPassword);

    return { count: users.length, users };
  }

  async updatePresence(isOnline: boolean) {
    await simulateDelay(50);
    const current = this.getCurrentUser();
    current.isOnline = isOnline;
    current.lastSeen = new Date().toISOString();
    persistMockDb();
    return stripPassword(current);
  }

  async createPrivateConversation(otherUserId: string) {
    await simulateDelay();
    const current = this.getCurrentUser();
    const other = findUserById(otherUserId);
    if (!other) {
      throw new ApiError('User not found');
    }

    const existing = findPrivateConversation(current.id, otherUserId);
    if (existing) {
      return { ...existing, members: existing.members.map(m => ({ ...m })) };
    }

    const conversation: Conversation = {
      id: generateId('conv'),
      type: 'private',
      members: [stripPassword(other), stripPassword(current)],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    getMockDb().conversations.unshift(conversation);
    getMockDb().messagesByConversation[conversation.id] = [];
    persistMockDb();
    return conversation;
  }

  async createGroupConversation(name: string, memberIds: string[]) {
    await simulateDelay();
    const current = this.getCurrentUser();
    const members: User[] = [stripPassword(current)];

    for (const id of memberIds) {
      if (id === current.id) continue;
      const user = findUserById(id);
      if (user) {
        members.push(stripPassword(user));
      }
    }

    const conversation: Conversation = {
      id: generateId('conv'),
      type: 'group',
      name,
      members,
      admins: [current.id],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    getMockDb().conversations.unshift(conversation);
    getMockDb().messagesByConversation[conversation.id] = [];
    persistMockDb();
    return conversation;
  }

  async getConversations() {
    await simulateDelay();
    const current = this.getCurrentUser();
    const conversations = getMockDb()
      .conversations.filter(c => userInConversation(c, current.id))
      .map(c => ({
        ...c,
        members: c.members.map(m => ({ ...m })),
        lastMessage: c.lastMessage ? { ...c.lastMessage } : undefined,
      }));

    return { count: conversations.length, conversations };
  }

  async getConversationDetails(conversationId: string) {
    await simulateDelay(80);
    const current = this.getCurrentUser();
    const conversation = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conversation || !userInConversation(conversation, current.id)) {
      throw new ApiError('Conversation not found');
    }
    return {
      ...conversation,
      members: conversation.members.map(m => ({ ...m })),
    };
  }

  async updateGroupConversation(conversationId: string, name: string) {
    await simulateDelay();
    const conversation = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conversation) {
      throw new ApiError('Conversation not found');
    }
    conversation.name = name;
    persistMockDb();
    return conversation;
  }

  async addMemberToGroup(conversationId: string, userId: string) {
    await simulateDelay();
    const conv = addMemberToGroupConversation(conversationId, userId);
    if (!conv) throw new ApiError('Could not add member');
    return {
      ...conv,
      members: conv.members.map(m => ({ ...m })),
    };
  }

  async removeMemberFromGroup(conversationId: string, userId: string) {
    await simulateDelay();
    const current = this.getCurrentUser();
    const conv = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conv || conv.type !== 'group') throw new ApiError('Not a group');
    conv.members = conv.members.filter(m => m.id !== userId);
    if (conv.members.length === 0 || userId === current.id) {
      removeConversationFromDb(conversationId);
      return { deleted: true as const };
    }
    persistMockDb();
    return { deleted: false as const, conversation: conv };
  }

  async clearChatHistory(conversationId: string) {
    await simulateDelay();
    const current = this.getCurrentUser();
    const conv = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conv || !userInConversation(conv, current.id)) {
      throw new ApiError('Conversation not found');
    }
    clearConversationMessages(conversationId);
    return { success: true };
  }

  async deleteConversation(conversationId: string) {
    await simulateDelay();
    const current = this.getCurrentUser();
    const conv = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conv || !userInConversation(conv, current.id)) {
      throw new ApiError('Conversation not found');
    }
    removeConversationFromDb(conversationId);
    return { success: true };
  }

  async searchMessagesInChat(conversationId: string, query: string) {
    await simulateDelay(80);
    const q = query.trim().toLowerCase();
    if (!q) return { count: 0, messages: [] };
    const current = this.getCurrentUser();
    const conv = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conv || !userInConversation(conv, current.id)) {
      throw new ApiError('Conversation not found');
    }
    const messages = getAllConversationMessages(conversationId).filter(
      m =>
        m.content.toLowerCase().includes(q) ||
        m.attachments.some(a => a.filename.toLowerCase().includes(q))
    );
    return { count: messages.length, messages };
  }

  async sendMessage(conversationId: string, content: string, files?: File[]) {
    await simulateDelay();
    const current = stripPassword(this.getCurrentUser());
    const conversation = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conversation || !userInConversation(conversation, current.id)) {
      throw new ApiError('Conversation not found');
    }

    const attachments: Message['attachments'] = [];
    if (files?.length) {
      for (const file of files) {
        const type = file.type.startsWith('image/') ? 'image' : 'file';
        attachments.push({
          filename: file.name,
          url: URL.createObjectURL(file),
          type,
          size: file.size,
        });
      }
    }

    const trimmed = content.trim();
    if (!trimmed && attachments.length === 0) {
      throw new ApiError('Message content or attachment is required');
    }

    return addMessage(conversationId, current, trimmed, attachments);
  }

  async getMessages(conversationId: string, page = 1) {
    await simulateDelay(100);
    const current = this.getCurrentUser();
    const conversation = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conversation || !userInConversation(conversation, current.id)) {
      throw new ApiError('Conversation not found');
    }
    return getConversationMessages(conversationId, page);
  }

  async getAllMessages(conversationId: string) {
    await simulateDelay(80);
    const current = this.getCurrentUser();
    const conversation = getMockDb().conversations.find(c => c.id === conversationId);
    if (!conversation || !userInConversation(conversation, current.id)) {
      throw new ApiError('Conversation not found');
    }
    const messages = getAllConversationMessages(conversationId);
    return { count: messages.length, messages };
  }

  async getMessage(messageId: string) {
    await simulateDelay(80);
    const database = getMockDb();
    for (const messages of Object.values(database.messagesByConversation)) {
      const found = messages.find(m => m.id === messageId);
      if (found) {
        return { ...found, senderId: { ...found.senderId } };
      }
    }
    throw new ApiError('Message not found');
  }
}

export const apiClient = new MockApiClient();

export { DEMO_EMAIL, DEMO_PASSWORD };
