# 🏗️ Architecture & Design Decisions

## Core Principles

### 1. REST API Only (No Real-Time Yet)
- **Decision**: Build complete REST API without WebSockets or Socket.io
- **Reasoning**: Allows focusing on core functionality and clean architecture
- **Benefit**: Clear separation of concerns, easier to maintain
- **Future**: Socket.io integration will be straightforward addition

### 2. Abstract Storage Layer
- **Decision**: Implement provider pattern for file storage
- **Reasoning**: Supports multiple storage options without code changes
- **Benefit**: Easy migration from local to cloud storage
- **Providers**: Local (implemented), Cloudinary (stub), Supabase (stub)

### 3. TypeScript Throughout
- **Decision**: Full TypeScript in backend and frontend
- **Reasoning**: Type safety, better IDE support, fewer runtime errors
- **Benefit**: Confident refactoring, self-documenting code

### 4. Separation of Concerns
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic (storage, calculations)
- **Models**: Data schema and validation
- **Middleware**: Cross-cutting concerns (auth, errors)
- **Utilities**: Reusable helper functions

---

## Backend Architecture

### Request Flow
```
HTTP Request
    ↓
CORS Headers
    ↓
Express Middleware (JSON parsing)
    ↓
Routes (identify endpoint)
    ↓
Auth Middleware (verify JWT token)
    ↓
Controller (handle logic)
    ↓
Service Layer (business logic)
    ↓
Database Models (MongoDB)
    ↓
Response Handler (send response)
    ↓
Error Handler (catch errors)
    ↓
HTTP Response
```

### Error Handling Strategy
- **Custom ApiError class** with status codes
- **Global error handler** middleware catches all errors
- **Type-specific handling** for validation, MongoDB, auth errors
- **Standardized response format** for consistency

### Validation Layers
- **Input validation** in controllers
- **Schema validation** in Mongoose models
- **Business logic validation** in services
- **Custom validation rules** in validations/ folder

---

## Frontend Architecture

### Data Flow
```
User Input
    ↓
React Component
    ↓
Custom Hook (useAuth, useApi)
    ↓
API Client (axios)
    ↓
Backend API
    ↓
Response
    ↓
React Query (caching)
    ↓
Zustand Store (auth state)
    ↓
Component Re-render
```

### State Management Strategy
- **Global auth**: Zustand (login, user, token)
- **API data**: React Query (conversations, messages)
- **Component state**: React hooks (forms, UI)
- **URL state**: Next.js routing (selected conversation)

### Component Organization
```
components/
├── auth/            # Authentication related
├── chat/            # Chat interface
├── layout/          # Page layouts
└── common/          # Reusable components

pages/
├── page.tsx         # Main chat page
├── login/           # Auth pages
├── register/
└── settings/        # User settings
```

---

## Database Design

### Relationships
```
User
  ↓
Conversation (members: [User])
  ↓
Message (senderId: User, conversationId: Conversation)
```

### Indexing Strategy
- **User**: username, email (fast lookups, search)
- **Conversation**: members (find user's chats), createdAt (sorting)
- **Message**: conversationId+createdAt (pagination), senderId (user's messages)

### Presence Tracking
- **isOnline**: Boolean flag
- **lastSeen**: Timestamp when user last active
- **No real-time sync**: Updated via REST API calls

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional details"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Server Error

---

## Authentication Design

### JWT Flow
1. **Registration**: Hash password → Create user → Generate token
2. **Login**: Find user → Verify password → Generate token
3. **Protected Endpoints**: Extract token → Verify signature → Get user ID
4. **Logout**: No token revocation (stateless), client discards token

### Token Payload
```typescript
{
  id: string         // User ID
  email: string      // User email
  iat: number        // Issued at
  exp: number        // Expires at
}
```

### Storage
- **Backend**: No token storage (stateless)
- **Frontend**: localStorage (persists across tabs)
- **Axios**: Automatically includes in Authorization header

---

## File Upload Design

### Abstract Storage Provider
```typescript
interface IStorageProvider {
  upload(file: Express.Multer.File): Promise<UploadResult>
  delete(filename: string): Promise<void>
  getUrl(filename: string): string
}
```

### Supported Providers
1. **Local** (default)
   - Files stored in `backend/uploads/`
   - URL: `http://localhost:5000/uploads/filename`
   - Good for: Development, testing

2. **Cloudinary** (stub ready)
   - Cloud-based image service
   - CDN delivery
   - Good for: Production, large scale

3. **Supabase** (stub ready)
   - Cloud file storage
   - PostgreSQL integration
   - Good for: Managed solution

### Migration Steps
1. Update `STORAGE_PROVIDER` in .env
2. Implement provider class
3. No changes needed to upload endpoint
4. All files automatically use new provider

---

## Security Measures

### Password Security
- Hashed with bcryptjs (10 salt rounds)
- Never returned in API responses
- Minimum length enforced (6 characters)

### JWT Security
- Secret key from environment
- Expiration time set (7 days default)
- Verified on every protected endpoint

### Input Validation
- Email format checked
- Username format enforced
- Conversation members verified
- File types validated
- File size limited (10MB default)

### CORS Protection
- Client URL whitelisted
- Credentials included where needed
- Preflight requests handled

---

## Performance Considerations

### Database Queries
- **Indexes on frequently queried fields**
- **Lean queries** for read-only operations
- **Populate selectively** (don't load unnecessary fields)
- **Pagination** for large datasets (20 messages per page)

### Frontend Optimization
- **React Query caching** reduces API calls
- **Lazy loading** for images
- **Memoization** for expensive components
- **Virtual scrolling** potential for long lists

### File Uploads
- **Size limits** prevent large uploads
- **Type validation** before processing
- **Async upload** doesn't block UI
- **Progress tracking** can be added

---

## Scalability Path

### Short Term (Add now)
1. **Socket.io** for real-time (see TODO comments)
2. **Message reactions** (emoji)
3. **Typing indicators**
4. **Message read receipts**
5. **User blocking**

### Medium Term (Add later)
1. **Cloudinary/Supabase** integration
2. **Push notifications**
3. **Message search**
4. **Voice/video calls**
5. **Message encryption**

### Long Term (Consider)
1. **Microservices** architecture
2. **Redis** caching layer
3. **Elasticsearch** for search
4. **CDN** for static files
5. **Multi-region deployment**

---

## Testing Strategy

### Unit Tests (potential)
- Input validation functions
- Password hashing/comparison
- JWT token generation

### Integration Tests (potential)
- Auth flow (register → login → protected route)
- Message sending and retrieval
- Conversation creation

### E2E Tests (potential)
- Full user journey
- Chat functionality
- File uploads

---

## Known Limitations

### Current (Intentional)
1. **No real-time updates** (WebSocket)
2. **No message read receipts**
3. **No typing indicators**
4. **No message editing**
5. **No message deletion**

### Improvements When Adding Socket.io
1. Instant message delivery
2. Live presence updates
3. Typing notifications
4. Read receipts
5. Delete/edit with live sync

---

## Code Organization Principles

### Backend
- **One controller per resource** (auth, user, conversation, message)
- **Reusable middleware** (auth, error, upload)
- **Services for business logic** (storage abstraction)
- **Utils for helpers** (JWT, response formatting)
- **Models for schemas** (with validation)

### Frontend
- **One hook per API endpoint** (useMessages, useSendMessage)
- **Reusable components** (MessageBubble, ChatSidebar)
- **Pages for routes** (login, chat, settings)
- **Types in one place** (types/index.ts)
- **Centralized API client** (lib/api.ts)

---

## Debugging Tips

### Backend
- Check MongoDB connection: `MongooseConnectionError`
- Verify JWT token: `jwt.verify()` in browser console
- Monitor request logs: Enable console logging
- Database queries: Use MongoDB Compass

### Frontend
- Check localStorage: `console.log(localStorage)`
- React Query DevTools: `@tanstack/react-query-devtools`
- API calls: Network tab in browser DevTools
- Component state: React DevTools browser extension

---

## Conclusion

This architecture balances:
- **Simplicity** (REST API without complexity of real-time)
- **Scalability** (clean separation, abstractions)
- **Maintainability** (clear code organization)
- **Extensibility** (ready for Socket.io, new features)
- **Security** (validation, authentication, hashing)
- **Performance** (pagination, indexing, caching)

See SETUP.md for complete deployment and integration guides.
