# 💬 Telegram-Clone

A modern, full-stack real-time messaging application inspired by Telegram. Built with a clean UI and a robust backend, it supports private conversations, group chats, and live presence indicators — all in real time.

## ✨ Features

- **Authentication**: Secure register and login with JWT-based sessions.
- **1-on-1 Messaging**: Private real-time conversations between users.
- **Group Chats**: Create and manage group conversations with multiple members.
- **Online Status & Last Seen**: See whether contacts are online or when they were last active.
- **File & Image Sharing**: Send images and files directly inside conversations.
- **Real-Time Updates**: All messages and presence events are pushed instantly via WebSockets.

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router), React 18 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) |
| **Real-Time** | [Socket.io](https://socket.io/) |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Storage** | Local storage or cloud bucket (e.g. Cloudinary / Supabase Storage) |

## 📁 Project Structure

```
Telegram-Clone/
├── frontend/          # Next.js application
│   ├── app/           # App Router pages and layouts
│   ├── components/    # Reusable UI components
│   └── lib/           # API clients, socket setup, helpers
│
└── backend/           # Node.js + Express server
    ├── models/        # Mongoose schemas (User, Message, Conversation)
    ├── routes/        # REST API routes
    ├── controllers/   # Route handlers
    ├── middleware/     # Auth middleware, error handling
    └── socket/        # Socket.io event handlers
```

## 🛠️ Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/MoundirDev/Telegram-Clone.git
cd Telegram-Clone
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/telegram-clone
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## 🔌 Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `message:send` | Client → Server | Send a new message |
| `message:receive` | Server → Client | Receive a new message |
| `user:online` | Client → Server | Notify server the user is active |
| `user:offline` | Client → Server | Notify server the user disconnected |
| `presence:update` | Server → Client | Broadcast online/offline status to contacts |
| `typing:start` | Client → Server | User started typing |
| `typing:stop` | Client → Server | User stopped typing |

## 🔒 Security

- Passwords are hashed using **bcrypt** before being stored.
- All protected routes require a valid **JWT** sent in the `Authorization` header.
- File uploads are validated by type and size before being accepted.

## 🚧 Roadmap

- [ ] Message read receipts (double checkmarks)
- [ ] Message reactions (emoji)
- [ ] Voice messages
- [ ] Push notifications
- [ ] End-to-end encryption

## 👨‍💻 Contributing

Feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change.