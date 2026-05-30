/**
 * TypeScript Configuration for Backend
 * Compilation options for Express server
 */

export const TypeScriptConfig = {
  backend: {
    target: 'ES2020',
    module: 'commonjs',
    lib: ['ES2020'],
    outDir: './dist',
    rootDir: './src',
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  },
  frontend: {
    target: 'ES2020',
    useDefineForClassFields: true,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    moduleResolution: 'bundler',
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: 'preserve',
    strict: true,
  },
};

/**
 * Database Models Summary
 */
export const DatabaseModels = {
  User: {
    fields: [
      'username: string (unique)',
      'email: string (unique)',
      'password: string (hashed)',
      'avatar?: string (URL)',
      'bio?: string',
      'isOnline: boolean',
      'lastSeen: Date',
      'createdAt: Date',
      'updatedAt: Date',
    ],
    indexes: ['username', 'email'],
  },
  Conversation: {
    fields: [
      "type: 'private' | 'group'",
      'name?: string (for groups)',
      'members: ObjectId[] (User IDs)',
      'admins: ObjectId[] (for groups)',
      'lastMessage?: ObjectId (Message reference)',
      'createdAt: Date',
      'updatedAt: Date',
    ],
    indexes: ['members', 'createdAt'],
  },
  Message: {
    fields: [
      'conversationId: ObjectId',
      'senderId: ObjectId (User reference)',
      'content: string',
      'attachments: Array<{filename, url, type, size}>',
      'createdAt: Date',
      'updatedAt: Date',
    ],
    indexes: ['conversationId, createdAt', 'senderId'],
  },
};

/**
 * API Endpoints
 */
export const APIEndpoints = {
  auth: [
    'POST /api/auth/register',
    'POST /api/auth/login',
    'GET /api/auth/me',
    'POST /api/auth/logout',
  ],
  users: [
    'GET /api/users/:userId',
    'GET /api/users/search?q=query',
    'PUT /api/users/profile',
    'PUT /api/users/presence',
  ],
  conversations: [
    'POST /api/conversations/private',
    'POST /api/conversations/group',
    'GET /api/conversations',
    'GET /api/conversations/:conversationId',
    'PUT /api/conversations/:conversationId',
    'POST /api/conversations/:conversationId/members',
    'DELETE /api/conversations/:conversationId/members/:userId',
  ],
  messages: [
    'POST /api/messages',
    'GET /api/conversations/:conversationId/messages?page=1',
    'GET /api/messages/:messageId',
  ],
};

/**
 * File Upload Configuration
 */
export const FileUploadConfig = {
  maxFileSize: 10485760, // 10MB
  allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'mp4'],
  uploadDir: './uploads',
  storageProviders: ['local', 'cloudinary', 'supabase'],
};

/**
 * Authentication Configuration
 */
export const AuthConfig = {
  jwtExpiry: '7d',
  passwordMinLength: 6,
  usernameMinLength: 3,
  usernameMaxLength: 30,
};

/**
 * Pagination Configuration
 */
export const PaginationConfig = {
  messagesPerPage: 20,
  maxSearchResults: 20,
};
