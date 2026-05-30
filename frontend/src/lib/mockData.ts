import { Conversation, Message, User } from '@/types';

export const DEMO_EMAIL = 'demo@example.com';
export const DEMO_PASSWORD = 'password123';

export interface MockUser extends User {
  password: string;
}

export interface MockDatabase {
  users: MockUser[];
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();

export const SEED_USERS: MockUser[] = [
  {
    id: 'user-demo',
    username: 'demo',
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    bio: 'Demo account — explore the app with mock data',
    isOnline: true,
    lastSeen: hoursAgo(0),
    createdAt: hoursAgo(720),
  },
  {
    id: 'user-alice',
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123',
    bio: 'Product designer',
    isOnline: true,
    lastSeen: hoursAgo(0),
    createdAt: hoursAgo(500),
  },
  {
    id: 'user-bob',
    username: 'bob',
    email: 'bob@example.com',
    password: 'password123',
    bio: 'Full-stack developer',
    isOnline: false,
    lastSeen: hoursAgo(2),
    createdAt: hoursAgo(400),
  },
  {
    id: 'user-charlie',
    username: 'charlie',
    email: 'charlie@example.com',
    password: 'password123',
    bio: 'Weekend hike enthusiast',
    isOnline: false,
    lastSeen: hoursAgo(5),
    createdAt: hoursAgo(300),
  },
  {
    id: 'user-diana',
    username: 'diana',
    email: 'diana@example.com',
    password: 'password123',
    isOnline: true,
    lastSeen: hoursAgo(0),
    createdAt: hoursAgo(200),
  },
];

const alice = SEED_USERS[1];
const bob = SEED_USERS[2];
const charlie = SEED_USERS[3];
const demo = SEED_USERS[0];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-alice',
    type: 'private',
    members: [alice, demo],
    updatedAt: hoursAgo(1),
    createdAt: hoursAgo(100),
  },
  {
    id: 'conv-bob',
    type: 'private',
    members: [bob, demo],
    updatedAt: hoursAgo(3),
    createdAt: hoursAgo(80),
  },
  {
    id: 'conv-weekend',
    type: 'group',
    name: 'Weekend Plans',
    members: [demo, alice, bob, charlie],
    admins: ['user-demo'],
    updatedAt: hoursAgo(0.5),
    createdAt: hoursAgo(50),
  },
];

const msg = (
  id: string,
  conversationId: string,
  sender: User,
  content: string,
  createdAt: string,
  attachments: Message['attachments'] = []
): Message => ({
  id,
  conversationId,
  senderId: sender,
  content,
  attachments,
  createdAt,
});

export const SEED_MESSAGES: Record<string, Message[]> = {
  'conv-alice': [
    msg('m1', 'conv-alice', alice, 'Hey! Are we still on for coffee tomorrow?', hoursAgo(5)),
    msg('m2', 'conv-alice', demo, 'Yes! How about 10am at the usual place?', hoursAgo(4.5)),
    msg('m3', 'conv-alice', alice, 'Perfect, see you then ☕', hoursAgo(4)),
    msg('m4', 'conv-alice', alice, 'Also I found a great article on UI patterns — sending it later', hoursAgo(1)),
  ],
  'conv-bob': [
    msg('m5', 'conv-bob', bob, 'Did you push the latest changes to the repo?', hoursAgo(8)),
    msg('m6', 'conv-bob', demo, 'Just merged the auth refactor branch. All tests green.', hoursAgo(7)),
    msg('m7', 'conv-bob', bob, 'Nice work. I will review tonight.', hoursAgo(3)),
  ],
  'conv-weekend': [
    msg('m8', 'conv-weekend', charlie, 'Who is in for the hike on Saturday?', hoursAgo(6)),
    msg('m9', 'conv-weekend', alice, 'Count me in! 🥾', hoursAgo(5)),
    msg('m10', 'conv-weekend', demo, 'Same here. I can drive if we leave early.', hoursAgo(4)),
    msg('m11', 'conv-weekend', bob, 'Might be late but I can meet at the trailhead.', hoursAgo(2)),
    msg('m12', 'conv-weekend', charlie, 'Trail opens at 7am — let us aim for 6:30 meetup.', hoursAgo(0.5)),
  ],
};

export function attachLastMessages(db: MockDatabase): void {
  for (const conv of db.conversations) {
    const messages = db.messagesByConversation[conv.id] || [];
    if (messages.length > 0) {
      conv.lastMessage = messages[messages.length - 1];
    }
  }
}

export function createSeedDatabase(): MockDatabase {
  const db: MockDatabase = {
    users: SEED_USERS.map(u => ({ ...u })),
    conversations: SEED_CONVERSATIONS.map(c => ({
      ...c,
      members: c.members.map(m => ({ ...m })),
    })),
    messagesByConversation: Object.fromEntries(
      Object.entries(SEED_MESSAGES).map(([id, messages]) => [
        id,
        messages.map(m => ({ ...m, senderId: { ...m.senderId } })),
      ])
    ),
  };
  attachLastMessages(db);
  return db;
}
