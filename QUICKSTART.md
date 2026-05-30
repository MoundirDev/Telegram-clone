# 🚀 Quick Reference Guide

## Quick Start (5 minutes)

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev

# Access http://localhost:3000
```

## Directory Quick Reference

```
backend/
├── src/app.ts                    # Express server entry
├── src/controllers/              # Request handlers
├── src/models/                   # Mongoose schemas
├── src/routes/                   # API routes
├── src/middleware/               # Auth, errors, uploads
├── src/services/storageService  # File upload abstraction
└── uploads/                      # Local files

frontend/
├── src/app/page.tsx             # Chat page
├── src/app/login/page.tsx       # Login
├── src/app/register/page.tsx    # Register
├── src/components/chat/         # Chat components
├── src/hooks/useApi.ts          # React Query hooks
├── src/lib/api.ts               # Axios client
└── src/lib/store.ts             # Zustand auth
```

## Key Files to Know

### Backend
- `src/app.ts` - Main server (routes, middleware)
- `src/config/database.ts` - MongoDB connection
- `src/middleware/auth.ts` - JWT verification
- `src/services/storageService.ts` - File upload (swappable providers)
- `src/controllers/messageController.ts` - Message logic

### Frontend
- `src/app/layout.tsx` - Root layout
- `src/components/chat/ChatWindow.tsx` - Main chat UI
- `src/hooks/useApi.ts` - All API hooks (React Query)
- `src/lib/api.ts` - Axios client with auth
- `src/lib/store.ts` - Auth store (Zustand)

## Common Commands

### Backend
```bash
npm run dev          # Start dev server
npm run build        # Build TypeScript
npm start            # Run compiled JS
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
```

## Authentication Flow

1. User enters email/password
2. Frontend calls `POST /api/auth/login`
3. Backend returns `{ token, user }`
4. Frontend stores token in localStorage
5. Frontend sets `Authorization: Bearer <token>` header
6. All requests include token
7. Backend verifies with JWT middleware

## Adding a New Feature

### Example: Add emoji reaction to messages

**Backend:**
1. Add field to Message model: `reactions: []`
2. Create controller: `addReaction()`
3. Add route: `POST /api/messages/:id/reactions`
4. Add middleware check: verify user in conversation

**Frontend:**
1. Create component: `<EmojiPicker />`
2. Create hook: `useAddReaction()`
3. Update MessageBubble to show reactions
4. Add click handler to call hook

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://...
JWT_SECRET=your-secret
PORT=5000
CLIENT_URL=http://localhost:3000
STORAGE_PROVIDER=local
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Troubleshooting

### "Cannot connect to MongoDB"
- Start MongoDB: `mongod`
- Check MONGO_URI in .env
- Check firewall if using Atlas

### "Token invalid" on every request
- Clear localStorage: `localStorage.clear()`
- Logout and login again
- Check JWT_SECRET matches frontend

### "CORS error"
- Check CLIENT_URL in backend .env
- Verify frontend URL matches CORS origin
- Restart backend after changing

### "Files not uploading"
- Check UPLOAD_DIR exists: `./uploads`
- Verify file size < MAX_FILE_SIZE
- Check file type in ALLOWED_FILE_TYPES

## Testing Checklist

- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can search for users
- [ ] Can send text message
- [ ] Can send file/image
- [ ] Can create group
- [ ] Can add/remove members
- [ ] Messages display correctly
- [ ] File attachments show
- [ ] User appears/disappears online
- [ ] Settings page works
- [ ] Can logout

## Performance Tips

**Backend:**
- Add database indexes (already in schema)
- Use pagination for messages (implemented)
- Cache user searches if needed

**Frontend:**
- Use React Query for data caching (implemented)
- Memoize chat components if needed
- Lazy load conversation list

## Real-Time Integration (Socket.io)

See comments marked with `// TODO: Integrate Socket.io`

Key files to update:
- `backend/src/controllers/messageController.ts`
- `backend/src/controllers/userController.ts`
- `frontend/src/components/chat/ChatWindow.tsx`

## Deployment Checklist

- [ ] Set production NODE_ENV
- [ ] Use strong JWT_SECRET
- [ ] Use MongoDB Atlas (not local)
- [ ] Set secure CORS origin
- [ ] Use environment variables
- [ ] Enable HTTPS
- [ ] Set up file storage (Cloudinary/Supabase)
- [ ] Monitor error logs
- [ ] Set up email notifications (optional)

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

---

For detailed information, see [SETUP.md](./SETUP.md)
