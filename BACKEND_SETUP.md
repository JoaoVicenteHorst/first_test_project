# Backend Setup Guide

Complete guide to setting up the Prisma backend for the CRUD Admin Panel.

## Quick Start

If you just want to get started quickly:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create a .env file with your database URL

# 3. Run complete setup
npm run setup

# 4. Start backend server (in one terminal)
npm run server:dev

# 5. Start frontend (in another terminal)
npm run dev
```

## Detailed Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Frontend dependencies (React, Vite)
- Backend dependencies (Express, Prisma, CORS)
- Development tools (Nodemon)

### Step 2: Choose Your Database

#### PostgreSQL (Recommended for Production)

**Install PostgreSQL:**
- Windows: Download from https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt-get install postgresql`

**Create Database:**
```bash
# Start PostgreSQL service
# Windows: It should start automatically
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Create database
createdb user_management

# Or using psql
psql -U postgres
CREATE DATABASE user_management;
\q
```

**Configure Environment:**
Create `.env` file:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/user_management?schema=public"
PORT=5000
```

Replace `postgres` and `password` with your PostgreSQL username and password.

#### SQLite (Easy for Development)

**Update Prisma Schema:**

Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Configure Environment:**
Create `.env` file:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
```

### Step 3: Initialize Prisma

```bash
# Generate Prisma Client
npm run prisma:generate
```

This creates the Prisma Client based on your schema.

### Step 4: Run Migrations

```bash
# Create and apply migrations
npm run prisma:migrate
```

This will:
1. Create a new migration based on your schema
2. Apply it to your database
3. Generate Prisma Client

You'll be prompted to name your migration (e.g., "init").

### Step 5: Seed the Database

```bash
# Add initial data
npm run prisma:seed
```

This creates 3 sample users:
- John Doe (Admin, Active)
- Jane Smith (User, Active)
- Bob Johnson (Manager, Inactive)

### Step 6: Start the Backend Server

```bash
# Development mode (auto-reload)
npm run server:dev

# Production mode
npm run server
```

The server will start at http://localhost:5000

### Step 7: Test the API

**Test with curl:**
```bash
# Health check
curl http://localhost:5000/api/health

# Get all users
curl http://localhost:5000/api/users
```

**Or open in browser:**
- http://localhost:5000/api/health
- http://localhost:5000/api/users

### Step 8: Start the Frontend

In a new terminal:
```bash
npm run dev
```

The frontend will start at http://localhost:5173

## Understanding Prisma

### What is Prisma?

Prisma is a modern ORM (Object-Relational Mapping) tool that provides:
- Type-safe database access
- Auto-generated queries
- Database migrations
- Introspection and seeding

### Prisma Schema

Located at `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  role      String   @default("User")
  status    String   @default("Active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

This defines:
- **id**: Auto-incrementing primary key
- **email**: Unique constraint
- **role/status**: Default values
- **createdAt/updatedAt**: Automatic timestamps

### Common Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create a new migration
npx prisma migrate dev --name add_new_field

# Apply migrations (production)
npm run prisma:migrate:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (drops all data!)
npm run prisma:reset

# View database schema
npx prisma db pull
```

## API Architecture

### Server Structure

The Express server (`server/index.js`) provides:

1. **Middleware:**
   - CORS for cross-origin requests
   - JSON body parser
   - Error handling

2. **Routes:**
   - `GET /api/health` - Health check
   - `GET /api/users` - List all users
   - `GET /api/users/:id` - Get single user
   - `POST /api/users` - Create user
   - `PUT /api/users/:id` - Update user
   - `DELETE /api/users/:id` - Delete user

3. **Database Connection:**
   - Prisma Client instance
   - Automatic disconnection on shutdown

### Request/Response Format

**Create User (POST /api/users):**
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Admin",
  "status": "Active"
}

// Response (201 Created)
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Admin",
  "status": "Active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Email already exists"
}
```

## Frontend Integration

### API Client

Located at `src/api/users.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const userAPI = {
  async getAll() { /* ... */ },
  async getById(id) { /* ... */ },
  async create(userData) { /* ... */ },
  async update(id, userData) { /* ... */ },
  async delete(id) { /* ... */ }
};
```

### Using the API in React

```javascript
import { userAPI } from './api/users';

// Fetch users
const users = await userAPI.getAll();

// Create user
const newUser = await userAPI.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'User',
  status: 'Active'
});

// Update user
const updated = await userAPI.update(1, { status: 'Inactive' });

// Delete user
await userAPI.delete(1);
```

## Database Seeding

### Seed File

Located at `prisma/seed.js`:

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  
  await prisma.user.createMany({
    data: [
      { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
      // ... more users
    ]
  });
}

main();
```

### Custom Seeding

Edit `prisma/seed.js` to add your own initial data:

```javascript
await prisma.user.create({
  data: {
    name: 'Your Name',
    email: 'your@email.com',
    role: 'Admin',
    status: 'Active'
  }
});
```

Then run:
```bash
npm run prisma:seed
```

## Troubleshooting

### "Prisma Client is not generated"

```bash
npm run prisma:generate
```

### "Can't reach database server"

1. Check if PostgreSQL is running:
```bash
# Windows
Get-Service postgresql*

# Mac
brew services list

# Linux
sudo service postgresql status
```

2. Verify DATABASE_URL in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/user_management"
```

3. Test connection:
```bash
psql -U postgres -d user_management
```

### "Migration failed"

Reset and try again:
```bash
npm run prisma:reset
```

### Port 5000 already in use

Change port in `.env`:
```env
PORT=5001
```

And update frontend API URL in `.env`:
```env
VITE_API_URL="http://localhost:5001/api"
```

### CORS errors

The server is configured to allow all origins. If you still get CORS errors:

1. Check server is running: http://localhost:5000/api/health
2. Check API URL in `src/api/users.js`
3. Clear browser cache

## Next Steps

### Add Authentication

```bash
npm install bcrypt jsonwebtoken
```

Add to schema:
```prisma
model User {
  // ... existing fields
  password String
  token    String?
}
```

### Add More Models

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}

model User {
  // ... existing fields
  posts     Post[]
}
```

### Add Validation

```bash
npm install express-validator
```

```javascript
import { body, validationResult } from 'express-validator';

app.post('/api/users',
  body('email').isEmail(),
  body('name').isLength({ min: 2 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... create user
  }
);
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [React Documentation](https://react.dev)

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Prisma logs
3. Check database connection
4. Verify environment variables
5. Look at server console output

## Summary

You now have:
- ✅ Express.js REST API
- ✅ Prisma ORM with PostgreSQL/SQLite
- ✅ Database migrations and seeding
- ✅ React frontend with API integration
- ✅ Full CRUD operations
- ✅ Error handling and validation

Happy coding! 🚀

