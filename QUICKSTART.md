# Quick Start Guide

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js (v18+)
- PostgreSQL OR use SQLite for quick testing

## Setup in 5 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

**Option A: PostgreSQL**
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/user_management?schema=public"
PORT=5000
```

**Option B: SQLite (Easiest for testing)**
```env
DATABASE_URL="file:./dev.db"
PORT=5000
```

If using SQLite, also update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"  # Change from "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Setup Database

```bash
npm run setup
```

This will:
- Generate Prisma Client
- Create database tables
- Add sample data

### 4. Start Backend Server

**Terminal 1:**
```bash
npm run server:dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📊 API available at http://localhost:5000/api
```

### 5. Start Frontend

**Terminal 2:**
```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

## That's It! 🎉

You should now see the User Management interface with 3 sample users.

## Quick Commands

```bash
# View database in GUI
npm run prisma:studio

# Reset database (if something goes wrong)
npm run prisma:reset

# Check API
curl http://localhost:5000/api/users
```

## Troubleshooting

### "Can't reach database server"

**PostgreSQL:**
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo service postgresql status

# Create database if missing
createdb user_management
```

**SQLite:**
- Make sure you updated `prisma/schema.prisma` to use "sqlite"
- Make sure DATABASE_URL in `.env` is: `DATABASE_URL="file:./dev.db"`

### "Port 5000 already in use"

Change the port in `.env`:
```env
PORT=5001
```

### "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Start Fresh

```bash
npm run prisma:reset
```

## Next Steps

- Check out `README.md` for full documentation
- Read `BACKEND_SETUP.md` for detailed backend guide
- Explore the API at http://localhost:5000/api/users
- Open Prisma Studio: `npm run prisma:studio`

## Need Help?

1. Check the detailed `README.md`
2. Review `BACKEND_SETUP.md`
3. Check server logs in Terminal 1
4. Try resetting the database: `npm run prisma:reset`

Happy coding! 💻

