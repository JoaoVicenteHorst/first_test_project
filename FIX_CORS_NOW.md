# 🚨 FIX CORS NOW - Step by Step

## The Problem
Your `.env` file is configured for PostgreSQL, but you need SQLite for local development.

## The Solution (2 minutes)

### Step 1: Edit `.env` File

1. Open `.env` in your editor
2. Find the line that says:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/user_management?schema=public"
   ```
3. **Change it to:**
   ```
   DATABASE_URL="file:./dev.db"
   ```
4. Make sure these lines are also there:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET="your-secret-key-change-in-production"
   ```
5. **Save the file**

### Step 2: Run Setup Script

Open PowerShell in your project directory and run:

```powershell
.\setup-local.bat
```

This will:
- Generate Prisma client
- Create SQLite database
- Run migrations
- Seed with test users

**OR** run commands manually:

```powershell
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 3: Start Your Servers

**Terminal 1 - Backend:**
```powershell
npm run server:dev
```

You should see:
```
🔒 CORS Configuration:
   Environment: Development
   ✅ Allowing all localhost origins
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

### Step 4: Test

1. Open browser to `http://localhost:5173`
2. Try to register/login
3. **CORS should work now!** ✅

---

## Still Having CORS Issues?

### Check #1: Backend Console
Your backend should show:
```
🔒 CORS Configuration:
   Environment: Development
   ✅ Allowing all localhost origins
```

If it doesn't, restart it.

### Check #2: Frontend URL
Make sure your browser shows: `http://localhost:5173` (not 5174 or other port)

### Check #3: Browser Console
Open DevTools (F12) → Console tab

If you see CORS error, check the exact error message.

Common errors:

❌ **"Failed to fetch"** → Backend not running
❌ **"CORS policy: No 'Access-Control-Allow-Origin'"** → Backend needs restart
❌ **"Network error"** → Wrong API URL in frontend

### Check #4: Run Diagnostics

```powershell
node test-cors.js
```

Should show:
```
🔒 Mode: 🟢 DEVELOPMENT
✅ Allowed Origins:
   • All http://localhost:* origins
```

---

## What Your Configuration Does

### Development Mode (what you have now):
```
Frontend (http://localhost:5173)
    ↓
    → Makes request to backend
    ↓
Backend (http://localhost:5000)
    ↓
    → Checks origin: "localhost:5173"
    ↓
    → ✅ ALLOWED (development mode allows all localhost)
    ↓
    → Sends response with CORS headers
```

### Why It Should Work:
1. Your `NODE_ENV=development` (or undefined = development)
2. Backend allows ALL `localhost` origins in development
3. Your frontend is on `localhost:5173`
4. ✅ Match! CORS works!

---

## Quick Test

Open frontend, open browser console (F12), paste this:

```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(data => {
    console.log('✅ SUCCESS! CORS is working!', data);
  })
  .catch(err => {
    console.error('❌ FAILED! CORS not working:', err.message);
  });
```

Expected output:
```
✅ SUCCESS! CORS is working! {status: "ok", message: "Server is running"}
```

---

## Nuclear Option (If Nothing Else Works)

1. **Close all terminals** (Ctrl+C to stop servers)
2. **Edit `.env`** - make sure `DATABASE_URL="file:./dev.db"`
3. **Delete dev.db** if it exists: `Remove-Item dev.db`
4. **Run setup**: `.\setup-local.bat`
5. **Start backend**: `npm run server:dev`
6. **Start frontend** in new terminal: `npm run dev`
7. **Clear browser cache** (Ctrl+Shift+Delete)
8. **Open private window**: `http://localhost:5173`
9. **Test**

---

## Need More Help?

1. Check what port your frontend is actually running on
2. Check backend logs for "❌ CORS blocked origin:" messages
3. Share the exact error from browser console
4. Run `node test-cors.js` and share output

Your CORS configuration is correct! Just need to fix the database connection. 🎯

