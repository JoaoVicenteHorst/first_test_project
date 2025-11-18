# Setup Checklist ✅

Use this checklist to ensure your Prisma backend is set up correctly.

## Prerequisites

- [ ] Node.js v18+ installed
- [ ] npm or yarn installed
- [ ] PostgreSQL installed (or plan to use SQLite)
- [ ] Code editor (VS Code recommended)

## Installation Steps

### 1. Dependencies
- [ ] Run `npm install`
- [ ] Verify no errors in installation

### 2. Environment Configuration
- [ ] Create `.env` file in root directory
- [ ] Add `DATABASE_URL` to `.env`
- [ ] Add `PORT=5000` to `.env`
- [ ] Verify `.env` is in `.gitignore`

### 3. Database Choice

**Option A: PostgreSQL**
- [ ] PostgreSQL service is running
- [ ] Database `user_management` created
- [ ] DATABASE_URL format: `postgresql://user:password@localhost:5432/user_management`
- [ ] Test connection: `psql -d user_management`

**Option B: SQLite** (Easier)
- [ ] Update `prisma/schema.prisma` provider to `"sqlite"`
- [ ] DATABASE_URL set to: `file:./dev.db`

### 4. Prisma Setup
- [ ] Run `npm run prisma:generate`
- [ ] Verify Prisma Client generated (check node_modules/@prisma/client)
- [ ] Run `npm run prisma:migrate`
- [ ] Name your migration (e.g., "init")
- [ ] Verify migration created in `prisma/migrations/`
- [ ] Run `npm run prisma:seed`
- [ ] Verify 3 users seeded

### 5. Backend Testing
- [ ] Run `npm run server` or `npm run server:dev`
- [ ] See message: "🚀 Server running on http://localhost:5000"
- [ ] Test health endpoint: `curl http://localhost:5000/api/health`
- [ ] Test users endpoint: `curl http://localhost:5000/api/users`
- [ ] Verify 3 users returned

### 6. Frontend Testing
- [ ] Run `npm run dev` (in new terminal)
- [ ] Open http://localhost:5173 in browser
- [ ] See "User Management" header
- [ ] See 3 users in table (John Doe, Jane Smith, Bob Johnson)
- [ ] Loading spinner appears briefly on page load

### 7. CRUD Operations Testing

**Create:**
- [ ] Click "Add New User" button
- [ ] Modal opens
- [ ] Fill in: Name, Email, Role, Status
- [ ] Click "Create"
- [ ] New user appears in table
- [ ] Modal closes

**Read:**
- [ ] Refresh page
- [ ] Users persist (data from database)
- [ ] Stats show correct count

**Update:**
- [ ] Click ✏️ (edit) icon on a user
- [ ] Modal opens with existing data
- [ ] Change user's status to "Inactive"
- [ ] Click "Update"
- [ ] User updated in table
- [ ] Badge color changes

**Delete:**
- [ ] Click 🗑️ (delete) icon on a user
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] User removed from table
- [ ] Stats updated

### 8. Error Handling Testing

**Duplicate Email:**
- [ ] Try creating user with existing email
- [ ] Error message appears
- [ ] User not created

**Backend Offline:**
- [ ] Stop backend server (Ctrl+C)
- [ ] Refresh frontend
- [ ] Error message appears
- [ ] "Retry" button visible
- [ ] Start backend
- [ ] Click "Retry"
- [ ] Data loads successfully

### 9. Database Tools

**Prisma Studio:**
- [ ] Run `npm run prisma:studio`
- [ ] Opens at http://localhost:5555
- [ ] See "users" model
- [ ] Can view/edit records
- [ ] Close Prisma Studio (Ctrl+C)

### 10. Development Workflow

**Hot Reload - Frontend:**
- [ ] Edit `src/App.jsx` (change title)
- [ ] Page updates without full reload

**Auto Restart - Backend:**
- [ ] With `npm run server:dev` running
- [ ] Edit `server/index.js` (change PORT message)
- [ ] Server restarts automatically

**Database Reset:**
- [ ] Run `npm run prisma:reset`
- [ ] Database cleared and re-seeded
- [ ] 3 default users back

## Troubleshooting Checklist

### Database Connection Issues
- [ ] Check PostgreSQL is running
- [ ] Check DATABASE_URL is correct
- [ ] Check database exists: `psql -l`
- [ ] Try SQLite instead (easier)

### Port Issues
- [ ] Check PORT in `.env`
- [ ] Check no other app using port 5000
- [ ] Try different port (5001)

### Prisma Issues
- [ ] Run `npm run prisma:generate`
- [ ] Check `node_modules/@prisma/client` exists
- [ ] Try `npm run prisma:reset`
- [ ] Check Prisma version: `npx prisma --version`

### Frontend Issues
- [ ] Check backend is running (Terminal 1)
- [ ] Check frontend is running (Terminal 2)
- [ ] Check browser console for errors (F12)
- [ ] Check API URL in `src/api/users.js`

### Build Issues
- [ ] Delete `node_modules/`
- [ ] Delete `package-lock.json`
- [ ] Run `npm install` again
- [ ] Run `npm run prisma:generate`

## File Verification

Verify these files exist:

### Backend Files
- [ ] `server/index.js` - Express server
- [ ] `prisma/schema.prisma` - Database schema
- [ ] `prisma/seed.js` - Seed data
- [ ] `.env` - Environment variables

### Frontend Files
- [ ] `src/api/users.js` - API client
- [ ] `src/App.jsx` - Updated with API calls
- [ ] `src/App.css` - Updated with loading styles

### Configuration Files
- [ ] `package.json` - Updated with scripts
- [ ] `.gitignore` - Includes .env

### Documentation Files
- [ ] `README.md` - Main docs
- [ ] `QUICKSTART.md` - Quick start
- [ ] `BACKEND_SETUP.md` - Backend guide
- [ ] `PROJECT_SUMMARY.md` - Summary
- [ ] `ARCHITECTURE.md` - Architecture
- [ ] `SETUP_CHECKLIST.md` - This file

## Quick Commands Reference

```bash
# Start backend (development)
npm run server:dev

# Start frontend
npm run dev

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Reset database
npm run prisma:reset

# Open Prisma Studio
npm run prisma:studio

# Complete setup
npm run setup
```

## Success Indicators

You've successfully set up the backend if:

✅ Backend server starts without errors
✅ Frontend connects to backend
✅ Users load from database (not mock data)
✅ Can create new users
✅ Can edit existing users
✅ Can delete users
✅ Changes persist after page refresh
✅ Prisma Studio shows database records
✅ Loading states appear during API calls
✅ Error messages appear when backend is offline

## Common Mistakes

❌ Forgot to create `.env` file
❌ Didn't run `npm run prisma:generate`
❌ Didn't run migrations
❌ DATABASE_URL incorrect format
❌ PostgreSQL not running
❌ Wrong port in API client
❌ Backend not started before frontend
❌ Firewall blocking port 5000

## Next Steps After Setup

1. **Explore the Code**
   - Read through `server/index.js`
   - Understand `src/api/users.js`
   - Study Prisma schema

2. **Read Documentation**
   - `README.md` for full guide
   - `ARCHITECTURE.md` for system design
   - `BACKEND_SETUP.md` for details

3. **Experiment**
   - Add a new field to User model
   - Create a new API endpoint
   - Add data validation
   - Implement search functionality

4. **Deploy**
   - Choose hosting (Vercel, Heroku, Railway)
   - Set up production database
   - Configure environment variables
   - Deploy!

## Support Resources

- **Quick Start:** `QUICKSTART.md`
- **Full Documentation:** `README.md`
- **Backend Details:** `BACKEND_SETUP.md`
- **Architecture:** `ARCHITECTURE.md`
- **Prisma Docs:** https://www.prisma.io/docs
- **Express Docs:** https://expressjs.com

## Completion

Once all items are checked, you have a fully functional full-stack application! 🎉

**Time to complete:** ~5-10 minutes (first time)

---

**Questions or issues?** Check the troubleshooting section in `README.md`

**Ready to build?** Start with `QUICKSTART.md`

**Want to understand the system?** Read `ARCHITECTURE.md`

Happy coding! 🚀

