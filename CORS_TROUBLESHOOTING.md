# CORS Troubleshooting Guide

## 🔧 Quick Fix for Local Development

### Step 1: Check Your .env File

Make sure you have a `.env` file in your project root with this content:

```env
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
JWT_SECRET="your-secret-key-change-in-production"
```

**Important**: 
- `NODE_ENV=development` (no quotes)
- This tells the backend to allow all localhost origins

### Step 2: Run Diagnostics

```bash
node test-cors.js
```

This will show you exactly what CORS configuration is active.

### Step 3: Restart Your Backend

```bash
# Stop your backend (Ctrl+C)
# Then start it again
npm run server:dev
```

You should see:
```
🔒 CORS Configuration:
   Environment: Development
   ✅ Allowing all localhost origins
```

### Step 4: Check Your Frontend URL

Your frontend should be running on one of these:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174`
- `http://localhost:3000`

Check your browser address bar!

---

## 🐛 Common Issues & Solutions

### Issue 1: "Access to fetch has been blocked by CORS policy"

**Full error:**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Causes & Solutions:**

#### A) Backend not running
```bash
# Check if backend is running:
curl http://localhost:5000/api/health

# If error, start backend:
npm run server:dev
```

#### B) Wrong NODE_ENV
Open `.env` file and check:
```env
NODE_ENV=development  # ← Should be exactly this (no quotes!)
```

Then restart backend.

#### C) Frontend running on different port
Check your browser URL. If it's not `localhost:5173`, update your backend:

In `server/index.js`, the allowed origins include:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:3000`

If you're using a different port, either:
1. Change your frontend port to 5173, or
2. Add your port to the allowed list

---

### Issue 2: "Preflight request didn't succeed"

**Full error:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource
```

**Solutions:**

#### A) Check backend is accessible
```bash
# Test from command line:
curl http://localhost:5000/api/health

# Should return:
# {"status":"ok","message":"Server is running"}
```

#### B) Check for port conflicts
```bash
# Windows PowerShell - Check if port 5000 is in use:
netstat -ano | findstr :5000

# If something else is using port 5000, change it in .env:
PORT=5001
```

---

### Issue 3: Works in Postman but not in Browser

This is normal! Postman doesn't enforce CORS. Browsers do.

**Solution:** Make sure your frontend origin is allowed (see Issue 1)

---

### Issue 4: CORS Error with Specific Routes (like /api/users)

**Error:**
```
CORS policy: Response to preflight request doesn't pass access control check
```

**Cause:** OPTIONS request not handled properly

**Solution:** Already fixed in your backend! The CORS middleware handles OPTIONS automatically.

If still having issues:
1. Check browser DevTools → Network tab
2. Look for OPTIONS request (preflight)
3. Check Response Headers should include:
   - `Access-Control-Allow-Origin: http://localhost:5173`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`

---

### Issue 5: "Credentials flag is true, but Access-Control-Allow-Credentials header is missing"

**Already fixed!** Your backend includes:
```javascript
credentials: true
```

If still seeing this:
1. Restart backend
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🧪 Testing CORS

### Test 1: Backend Health Check

```bash
# Should work (no CORS needed for simple requests):
curl http://localhost:5000/api/health
```

Expected:
```json
{"status":"ok","message":"Server is running"}
```

### Test 2: Browser Console Test

1. Open your frontend (`http://localhost:5173`)
2. Open DevTools → Console
3. Run:

```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ CORS working:', data))
  .catch(err => console.error('❌ CORS error:', err));
```

### Test 3: Full Auth Test

```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
})
  .then(r => r.json())
  .then(data => console.log('✅ Auth working:', data))
  .catch(err => console.error('❌ Error:', err));
```

---

## 🔍 Debugging Steps

### 1. Check Browser DevTools Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Look for failed request
5. Click on it
6. Check "Headers" section

**What to look for:**
- Request URL: Should be `http://localhost:5000/api/...`
- Request Method: POST, GET, etc.
- Status Code: If 0 or failed → CORS issue
- Response Headers: Should have `Access-Control-Allow-Origin`

### 2. Check Backend Console

Your backend now logs CORS info:
```
🔒 CORS Configuration:
   Environment: Development
   ✅ Allowing all localhost origins
```

If you see:
```
❌ CORS blocked origin: http://localhost:5173
```

Then your `NODE_ENV` is set to `production` by mistake.

### 3. Check Frontend Console

Look for errors like:
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

Take note of:
- The origin it's trying from (`http://localhost:5173`)
- The URL it's trying to access (`http://localhost:5000/...`)

### 4. Verify Environment

Run:
```bash
node test-cors.js
```

Should show:
```
📋 Environment Variables:
   NODE_ENV: development
   
🔒 Mode: 🟢 DEVELOPMENT

✅ Allowed Origins:
   • All http://localhost:* origins
```

---

## 🎯 Complete Reset (Nuclear Option)

If nothing works, try this:

```bash
# 1. Stop both servers (Ctrl+C in both terminals)

# 2. Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# 3. Make sure .env exists with correct content
# Check that .env has: NODE_ENV=development

# 4. Clear browser cache completely
# Browser settings → Clear browsing data → Cached files

# 5. Start backend
npm run server:dev

# 6. Start frontend in new terminal
npm run dev

# 7. Test in private/incognito browser window
```

---

## 📞 Still Not Working?

Check these final things:

### ✅ Checklist:
- [ ] `.env` file exists in project root
- [ ] `.env` has `NODE_ENV=development` (no quotes)
- [ ] Backend is running (`npm run server:dev`)
- [ ] Frontend is running (`npm run dev`)
- [ ] Backend logs show "🟢 DEVELOPMENT" mode
- [ ] Frontend is on `http://localhost:5173` (check browser)
- [ ] No firewall blocking localhost connections
- [ ] Not using https:// for localhost (should be http://)
- [ ] Browser console shows the actual error message
- [ ] DevTools Network tab shows the failed request

### 🔬 Get Diagnostic Info:

Run and share output:
```bash
node test-cors.js
```

### 💬 Common Questions:

**Q: Do I need to restart after changing .env?**
A: Yes! Always restart your backend after changing environment variables.

**Q: Can I just disable CORS?**
A: You could, but it's a security risk. The current config allows all localhost in development.

**Q: Why does Postman work but browser doesn't?**
A: Postman doesn't enforce CORS. Browsers do for security.

**Q: Should I use http or https for localhost?**
A: Use `http://` for local development. HTTPS requires certificates.

---

## 🚀 For Production (Render)

Different rules for production:

```env
# In Render backend environment:
NODE_ENV=production
FRONTEND_URL=https://your-actual-frontend.onrender.com
```

Then CORS will only allow your production frontend, blocking everything else.

---

Still having issues? Share:
1. Output of `node test-cors.js`
2. Backend console logs
3. Browser console error message
4. Network tab screenshot from DevTools

Good luck! 🍀

