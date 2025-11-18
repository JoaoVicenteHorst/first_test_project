# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    http://localhost:5173                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP Requests
                           │ (CRUD Operations)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                              │
│                         (Vite)                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  src/App.jsx                                              │  │
│  │  - User Interface                                         │  │
│  │  - State Management                                       │  │
│  │  - Loading & Error States                                │  │
│  └───────────────────────┬──────────────────────────────────┘  │
│                          │                                       │
│                          │ uses                                  │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  src/api/users.js                                         │  │
│  │  - API Client                                             │  │
│  │  - HTTP Methods (GET, POST, PUT, DELETE)                 │  │
│  │  - Error Handling                                         │  │
│  └───────────────────────┬──────────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           │ HTTP/REST API
                           │ (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPRESS.JS BACKEND                             │
│                  http://localhost:5000                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  server/index.js                                          │  │
│  │                                                           │  │
│  │  API ROUTES:                                             │  │
│  │  ├─ GET    /api/health        (Health check)            │  │
│  │  ├─ GET    /api/users          (Get all users)          │  │
│  │  ├─ GET    /api/users/:id      (Get one user)           │  │
│  │  ├─ POST   /api/users          (Create user)            │  │
│  │  ├─ PUT    /api/users/:id      (Update user)            │  │
│  │  └─ DELETE /api/users/:id      (Delete user)            │  │
│  │                                                           │  │
│  │  MIDDLEWARE:                                             │  │
│  │  ├─ CORS (Cross-Origin)                                 │  │
│  │  ├─ JSON Parser                                          │  │
│  │  └─ Error Handler                                        │  │
│  └───────────────────────┬──────────────────────────────────┘  │
│                          │                                       │
│                          │ uses                                  │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  @prisma/client                                           │  │
│  │  - Type-safe database queries                            │  │
│  │  - CRUD operations                                        │  │
│  │  - Connection pooling                                     │  │
│  └───────────────────────┬──────────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           │ SQL Queries
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                               │
│                    (PostgreSQL / SQLite)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  users table                                              │  │
│  │  ├─ id (Primary Key, Auto-increment)                     │  │
│  │  ├─ name (String)                                         │  │
│  │  ├─ email (String, Unique)                               │  │
│  │  ├─ role (String, Default: "User")                       │  │
│  │  ├─ status (String, Default: "Active")                   │  │
│  │  ├─ createdAt (DateTime)                                 │  │
│  │  └─ updatedAt (DateTime)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Example: Create New User

```
1. USER ACTION
   └─> Clicks "Add New User" button
       └─> Fills form and clicks "Create"

2. FRONTEND (React)
   └─> handleSave() in App.jsx
       └─> userAPI.create(formData) in api/users.js
           └─> POST http://localhost:5000/api/users
               └─> Body: { name, email, role, status }

3. BACKEND (Express)
   └─> Receives POST /api/users
       └─> Validates required fields
           └─> Checks email uniqueness
               └─> prisma.user.create({ data })
                   └─> Returns new user object

4. DATABASE (PostgreSQL/SQLite)
   └─> INSERT INTO users (name, email, role, status)
       └─> Returns inserted row with id

5. RESPONSE FLOW (Backwards)
   └─> Database → Prisma → Express → Frontend
       └─> Frontend updates UI with new user
           └─> Shows success, closes modal
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18         - UI Library                       │  │
│  │  Vite 5           - Build Tool                       │  │
│  │  CSS3             - Styling                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js 4     - Web Framework                    │  │
│  │  CORS             - Cross-Origin Requests            │  │
│  │  Node.js 18+      - Runtime                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma ORM 5     - Database Toolkit                 │  │
│  │  @prisma/client   - Query Builder                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL       - Production Database              │  │
│  │  SQLite           - Development Database             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### READ Operation (GET /api/users)

```
Browser                  Frontend                Backend              Database
   │                        │                       │                     │
   │   Navigate to page     │                       │                     │
   │───────────────────────>│                       │                     │
   │                        │                       │                     │
   │                        │  useEffect() runs     │                     │
   │                        │  fetchUsers()         │                     │
   │                        │                       │                     │
   │                        │  GET /api/users       │                     │
   │                        │──────────────────────>│                     │
   │                        │                       │                     │
   │                        │                       │  SELECT * FROM users│
   │                        │                       │────────────────────>│
   │                        │                       │                     │
   │                        │                       │  [user records]     │
   │                        │                       │<────────────────────│
   │                        │                       │                     │
   │                        │  [JSON array]         │                     │
   │                        │<──────────────────────│                     │
   │                        │                       │                     │
   │   Display users table  │  setUsers(data)       │                     │
   │<───────────────────────│  setLoading(false)    │                     │
   │                        │                       │                     │
```

### CREATE Operation (POST /api/users)

```
Browser                  Frontend                Backend              Database
   │                        │                       │                     │
   │  Click "Add User"      │                       │                     │
   │───────────────────────>│                       │                     │
   │                        │                       │                     │
   │  Fill form & submit    │                       │                     │
   │───────────────────────>│                       │                     │
   │                        │  handleSave()         │                     │
   │                        │                       │                     │
   │                        │  POST /api/users      │                     │
   │                        │  { name, email, ... } │                     │
   │                        │──────────────────────>│                     │
   │                        │                       │  Validate data      │
   │                        │                       │  Check email unique │
   │                        │                       │                     │
   │                        │                       │  INSERT INTO users  │
   │                        │                       │────────────────────>│
   │                        │                       │                     │
   │                        │                       │  {id, name, email...}│
   │                        │                       │<────────────────────│
   │                        │                       │                     │
   │                        │  {new user object}    │                     │
   │                        │<──────────────────────│                     │
   │                        │                       │                     │
   │  Show success          │  Add to users array   │                     │
   │  Close modal           │  Close modal          │                     │
   │<───────────────────────│                       │                     │
   │                        │                       │                     │
```

## File Structure

```
crud-admin/
│
├── Frontend Layer
│   ├── src/
│   │   ├── App.jsx              # Main component (UI logic)
│   │   ├── App.css              # Styles
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Global styles
│   │   └── api/
│   │       └── users.js         # API client (HTTP calls)
│   │
│   └── index.html               # HTML template
│
├── Backend Layer
│   └── server/
│       ├── index.js             # Express server + routes
│       └── README.md            # API documentation
│
├── Data Layer
│   └── prisma/
│       ├── schema.prisma        # Database schema
│       └── seed.js              # Initial data
│
├── Configuration
│   ├── package.json             # Dependencies & scripts
│   ├── vite.config.js           # Vite configuration
│   ├── .env                     # Environment variables
│   └── .gitignore               # Git ignore rules
│
└── Documentation
    ├── README.md                # Main documentation
    ├── QUICKSTART.md            # Quick start guide
    ├── BACKEND_SETUP.md         # Backend setup guide
    ├── PROJECT_SUMMARY.md       # Project summary
    └── ARCHITECTURE.md          # This file
```

## API Contract

### Endpoints

| Endpoint | Method | Request Body | Response | Status Codes |
|----------|--------|-------------|----------|--------------|
| `/api/health` | GET | - | `{status, message}` | 200 |
| `/api/users` | GET | - | `[User]` | 200, 500 |
| `/api/users/:id` | GET | - | `User` | 200, 404, 500 |
| `/api/users` | POST | `{name, email, role?, status?}` | `User` | 201, 400, 500 |
| `/api/users/:id` | PUT | `{name?, email?, role?, status?}` | `User` | 200, 400, 404, 500 |
| `/api/users/:id` | DELETE | - | `{message}` | 200, 404, 500 |

### Data Types

**User Object:**
```typescript
{
  id: number,
  name: string,
  email: string,
  role: "Admin" | "Manager" | "User",
  status: "Active" | "Inactive",
  createdAt: string (ISO 8601),
  updatedAt: string (ISO 8601)
}
```

**Error Object:**
```typescript
{
  error: string
}
```

## Security Considerations

### Current Implementation
- ✅ CORS enabled (allows frontend to call backend)
- ✅ JSON body parsing with limits
- ✅ Email uniqueness validation
- ✅ Input validation (required fields)
- ✅ SQL injection prevention (via Prisma)
- ✅ Error messages don't expose sensitive info

### Future Enhancements
- 🔜 Authentication (JWT tokens)
- 🔜 Authorization (role-based access)
- 🔜 Rate limiting
- 🔜 Input sanitization
- 🔜 HTTPS in production
- 🔜 Password hashing (bcrypt)
- 🔜 Request validation middleware

## Performance Considerations

### Current Setup
- ✅ Prisma connection pooling
- ✅ Efficient queries (no N+1 problems)
- ✅ React state management
- ✅ Vite HMR (fast development)

### Scalability Options
- 🔜 Database indexing
- 🔜 Caching (Redis)
- 🔜 Pagination for large datasets
- 🔜 Load balancing
- 🔜 CDN for static assets
- 🔜 Database read replicas

## Development Workflow

```
1. Start Development Servers
   ┌─────────────────────────┐
   │ Terminal 1:             │
   │ npm run server:dev      │
   │ (Backend with nodemon)  │
   └─────────────────────────┘
   
   ┌─────────────────────────┐
   │ Terminal 2:             │
   │ npm run dev             │
   │ (Frontend with Vite)    │
   └─────────────────────────┘

2. Make Changes
   ├─ Edit React components → Hot reload (Vite)
   ├─ Edit API routes → Auto restart (nodemon)
   └─ Edit Prisma schema → Run migration

3. Database Changes
   ├─ Edit prisma/schema.prisma
   ├─ npm run prisma:migrate
   └─ npm run prisma:generate

4. View Database
   └─ npm run prisma:studio
      └─ Opens GUI at localhost:5555

5. Reset If Needed
   └─ npm run prisma:reset
      └─ Drops, recreates, and seeds DB
```

## Deployment Architecture

### Development
```
Localhost:5173 (Frontend) → Localhost:5000 (Backend) → Local DB
```

### Production (Example)
```
Vercel/Netlify        Heroku/Railway/Render     PostgreSQL
   (Frontend)      →     (Backend)          →    (Database)
     ├─ Static          ├─ Express.js             ├─ Managed DB
     ├─ CDN             ├─ Node.js                ├─ Backups
     └─ Domain          └─ Auto-scale             └─ Monitoring
```

## Summary

This architecture provides:

✅ **Separation of Concerns** - Clear layers (UI, API, Data)
✅ **Scalability** - Can scale each layer independently
✅ **Maintainability** - Well-organized, documented code
✅ **Type Safety** - Prisma provides type-safe database access
✅ **Developer Experience** - Hot reload, auto-restart, GUI tools
✅ **Production Ready** - Error handling, validation, logging
✅ **Flexibility** - Easy to add new features/endpoints

The system follows REST principles and modern web architecture patterns,
making it easy to understand, maintain, and extend.

