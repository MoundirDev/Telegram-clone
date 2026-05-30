# 💬 Telegram Clone - Full-Stack Messaging Application

A production-ready, full-stack real-time messaging application inspired by Telegram, built with modern technologies. This is a REST API-based application with clear architecture for future real-time integration.

## ✨ Features Implemented

### ✅ Authentication System
- User registration with validation
- JWT-based login and session management
- Secure password hashing with bcryptjs
- Current user endpoint
- Logout functionality

### ✅ User System
- User profiles with avatars
- User search by username or email
- Profile updates (username, bio, avatar)
- Presence tracking (online status and last seen)
- User status indicators in conversations

### ✅ Conversations
- Private 1-on-1 conversations
- Group chat creation and management
- Add/remove members from groups
- Group name and settings management
- Conversation listing with sorting
- Last message preview

### ✅ Messaging
- Send text messages via REST API
- File and image attachments
- Message pagination (20 per page)
- Message timestamps
- Attachment preview in chat UI
- Conversation history retrieval

### ✅ File Upload System
- Abstract storage layer (Local, Cloudinary, Supabase ready)
- Image and document support
- File validation and size limits
- Configurable storage provider

### ✅ Modern UI
- Telegram-inspired design
- Responsive layout (works on mobile)
- Dark mode support (configured)
- Loading states and skeletons
- Empty states
- Error handling

## 💻 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **File Handling**: Multer
- **Validation**: Custom validation rules

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Language**: TypeScript

## 📁 Project Structure

```
Telegram-Clone/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Main Express application
│   │   ├── config/
│   │   │   └── database.ts        # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── conversationController.ts
│   │   │   └── messageController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT authentication
│   │   │   ├── errorHandler.ts
│   │   │   └── upload.ts          # File upload middleware
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Conversation.ts
│   │   │   └── Message.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── conversationRoutes.ts
│   │   │   └── messageRoutes.ts
│   │   ├── services/
│   │   │   └── storageService.ts  # Abstract storage layer
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── errors.ts
│   │   │   └── response.ts
│   │   └── validations/
│   │       └── index.ts
│   ├── uploads/                   # Local file storage
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── page.tsx           # Chat page
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── PrivateRoute.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatSidebar.tsx
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── ChatHeader.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   └── NewConversationModal.tsx
│   │   │   ├── layout/
│   │   │   │   └── ClientLayout.tsx
│   │   │   └── common/
│   │   │       └── LoadingSkeleton.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts         # Auth hook
│   │   │   └── useApi.ts          # API hooks (React Query)
│   │   ├── lib/
│   │   │   ├── api.ts             # Axios API client
│   │   │   ├── store.ts           # Zustand store
│   │   │   └── queryClient.ts     # React Query setup
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript types
│   │   ├── styles/
│   │   │   └── globals.css        # Global styles
│   ├── public/                    # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update .env with your settings**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/telegram-clone
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRY=7d
   CLIENT_URL=http://localhost:3000
   STORAGE_PROVIDER=local
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=10485760
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Update .env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will run on `http://localhost:3000`

5. **Access the application**
   - Navigate to `http://localhost:3000`
   - Register a new account or login
   - Start chatting!

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response: { token, user }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: user object
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```
GET /api/users/:userId
Authorization: Bearer <token>

Response: user object
```

#### Update Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "username": "new_username",
  "bio": "My bio",
  "avatar": <file>
}

Response: updated user object
```

#### Search Users
```
GET /api/users/search?q=username
Authorization: Bearer <token>

Response: { count, users }
```

#### Update Presence
```
PUT /api/users/presence
Authorization: Bearer <token>
Content-Type: application/json

{
  "isOnline": true
}

Response: { isOnline, lastSeen }
```

### Conversation Endpoints

#### Create Private Conversation
```
POST /api/conversations/private
Authorization: Bearer <token>
Content-Type: application/json

{
  "otherUserId": "user_id"
}

Response: conversation object
```

#### Create Group Conversation
```
POST /api/conversations/group
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Group Name",
  "memberIds": ["user_id_1", "user_id_2"]
}

Response: conversation object
```

#### Get All Conversations
```
GET /api/conversations
Authorization: Bearer <token>

Response: { count, conversations }
```

#### Get Conversation Details
```
GET /api/conversations/:conversationId
Authorization: Bearer <token>

Response: conversation object
```

#### Update Group Conversation
```
PUT /api/conversations/:conversationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Group Name"
}

Response: updated conversation object
```

#### Add Member to Group
```
POST /api/conversations/:conversationId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id"
}
```

#### Remove Member from Group
```
DELETE /api/conversations/:conversationId/members/:userId
Authorization: Bearer <token>
```

### Message Endpoints

#### Send Message
```
POST /api/messages
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "conversationId": "conv_id",
  "content": "Message text",
  "attachments": [<files>]  // Optional
}

Response: message object
```

#### Get Messages
```
GET /api/conversations/:conversationId/messages?page=1
Authorization: Bearer <token>

Response: { page, totalPages, totalMessages, count, messages }
```

#### Get Message by ID
```
GET /api/messages/:messageId
Authorization: Bearer <token>

Response: message object
```

## 🔒 Authentication Flow

1. User registers or logs in
2. Server returns JWT token
3. Token stored in localStorage and Zustand store
4. Token sent with every request in `Authorization: Bearer <token>` header
5. Backend validates token with JWT middleware
6. If token invalid/expired, API returns 401 Unauthorized
7. Frontend automatically redirects to login on 401

## 📦 Database Schema

### User
```typescript
{
  username: string (unique)
  email: string (unique)
  password: string (hashed)
  avatar?: string (URL)
  bio?: string
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}
```

### Conversation
```typescript
{
  type: 'private' | 'group'
  name?: string (for groups)
  members: ObjectId[] (User IDs)
  admins: ObjectId[] (for groups)
  lastMessage?: ObjectId (Message reference)
  createdAt: Date
  updatedAt: Date
}
```

### Message
```typescript
{
  conversationId: ObjectId
  senderId: ObjectId (User reference)
  content: string
  attachments: [{
    filename: string
    url: string
    type: 'image' | 'file'
    size: number
  }]
  createdAt: Date
  updatedAt: Date
}
```

## 🔄 Future Real-Time Integration

The application is structured to easily integrate Socket.io for real-time features. Look for `TODO` comments in the code:

**Backend**:
- `src/controllers/messageController.ts` - `sendMessage()` function
- `src/controllers/userController.ts` - `updatePresence()` function
- `src/controllers/authController.ts` - `logout()` function

**Frontend**:
- Create a `socket.ts` service in `src/lib/`
- Listen to Socket.io events in components
- Emit events when needed
- Update hooks to handle real-time data

### Integration Steps:
1. Install Socket.io packages
2. Initialize Socket.io server in backend
3. Create Socket.io event handlers
4. Connect frontend Socket.io client
5. Emit/listen to events in controllers and components

## 💾 File Upload System

The application uses an abstract file storage layer that supports:

### Local Storage (Default)
- Files stored in `backend/uploads/`
- Good for development and testing

### Cloudinary (TODO)
- Requires API credentials
- Scalable cloud storage
- Update `CloudinaryStorageProvider` in `src/services/storageService.ts`

### Supabase (TODO)
- Requires Supabase project
- File storage with CDN
- Update `SupabaseStorageProvider` in `src/services/storageService.ts`

To switch providers, update `STORAGE_PROVIDER` in `.env`

## 🧪 Testing the Application

### Test Credentials
After setting up, you can create test accounts through the registration page, or use:
- Email: test@example.com
- Password: password123

### Test Flow
1. Register two user accounts
2. Login with first account
3. Search for second user
4. Start a private conversation
5. Send messages and files
6. Create a group with both users
7. Test group chat

## ⚙️ Configuration

### Environment Variables

**Backend (.env)**
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRY` - Token expiration time
- `CLIENT_URL` - Frontend URL for CORS
- `STORAGE_PROVIDER` - local|cloudinary|supabase
- `MAX_FILE_SIZE` - Maximum file size in bytes

**Frontend (.env.local)**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` - Socket.io server URL (for future use)

## 🚀 Deployment

### Backend Deployment
1. Build: `npm run build`
2. Start: `npm start`
3. Use process manager (PM2, Docker, etc.)

### Frontend Deployment
1. Build: `npm run build`
2. Start: `npm start`
3. Deploy to Vercel, Netlify, or self-hosted

## 🤝 Contributing

Feel free to fork, modify, and use this project as a learning resource or starting point for your own messaging application.

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🎯 Learning Outcomes

This project teaches:
- Full-stack application architecture
- RESTful API design
- JWT authentication
- MongoDB and Mongoose
- Next.js and React patterns
- TypeScript usage
- File upload handling
- Error handling and validation
- Responsive UI design
- State management with Zustand
- Data fetching with React Query

## 📞 Support

For issues or questions, feel free to open an issue in the repository.

---

**Built with ❤️ as a learning project**
