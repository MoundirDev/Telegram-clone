# 💬 Telegram-Clone

A Telegram-inspired messaging UI built with Next.js. **All data is mocked in the browser** — no backend or database required. Conversations, messages, and auth persist in `localStorage` for demo purposes.

## ✨ Features

- Register and login (mock auth)
- Private and group chats with seeded demo conversations
- Send text messages and local file/image attachments (blob URLs)
- User search and new conversations
- Profile settings

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router), React 18, TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Data** | In-memory mock API + `localStorage` (`src/lib/mockData.ts`, `mockDb.ts`) |
| **State** | Zustand + React Query |

## 📁 Project Structure

```
Telegram-Clone/
└── frontend/
    ├── src/
    │   ├── app/           # Pages (login, chat, settings)
    │   ├── components/    # UI components
    │   ├── hooks/         # React Query & auth hooks
    │   ├── lib/           # Mock API, store, seed data
    │   └── types/
    └── public/
```

## 🛠️ Run locally

### Prerequisites

- Node.js 18+

### Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo login

| Field | Value |
|---|---|
| Email | `demo@example.com` |
| Password | `password123` |

You can also register a new account; data stays in your browser until you clear site storage.

## 🔄 Reset mock data

Clear **localStorage** for the site (or remove the key `telegram-clone-mock-db`) and refresh to reload the default seed conversations.
