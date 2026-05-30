/**
 * User types
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Conversation types
 */
export interface Conversation {
  id: string;
  type: 'private' | 'group';
  name?: string;
  members: User[];
  admins?: string[];
  lastMessage?: Message;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * Message types
 */
export interface Attachment {
  filename: string;
  url: string;
  type: 'image' | 'file';
  size: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: User;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Pagination types
 */
export interface PaginatedResponse<T> {
  page: number;
  totalPages: number;
  totalCount: number;
  count: number;
  data: T[];
}

/**
 * Form types
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UpdateProfileFormData {
  username?: string;
  bio?: string;
  avatar?: File;
}

export interface CreateGroupFormData {
  name: string;
  memberIds: string[];
}

/**
 * Store types (for Zustand)
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface ChatState {
  selectedConversation: Conversation | null;
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
