# 🚨 Fix CORS on Render - Production Deployment

## The Problem

You're seeing CORS errors on your deployed Render app:
```
Access to fetch at 'https://your-backend.onrender.com/api/...' from origin 
'https://your-frontend.onrender.com' has been blocked by CORS policy
```

## ✅ The Solution (5 Minutes)

### Step 1: Check Your Render Backend Logs

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **backend service**
3. Click **"Logs"** tab
4. Look for this section when the service starts:

```
============================================================
🔒 CORS CONFIGURATION
============================================================
Environment: 🔴 PRODUCTION
NODE_ENV: production
Port: 10000

📍 Allowed Origins:
   ⚠️  WARNING: No production origins configured!
   ⚠️  Set FRONTEND_URL environment variable
============================================================
```

If you see the warning, **FRONTEND_URL is not set!** That's your issue.

### Step 2: Set FRONTEND_URL Environment Variable

1. Stay in your backend service on Render
2. Click **"Environment"** in the left sidebar
3. Look for `FRONTEND_URL` variable

**Is it there?**

#### Option A: FRONTEND_URL doesn't exist
Click **"Add Environment Variable"**:
- **Key**: `FRONTEND_URL`
- **Value**: `https://your-frontend-name.onrender.com`
  
  ⚠️ **Important:** 
  - Use the EXACT URL from your frontend deployment
  - Use `https://` (Render uses HTTPS)
  - NO trailing slash: ✅ `https://app.onrender.com` ❌ `https://app.onrender.com/`

Click **"Save Changes"** → Service will auto-redeploy

#### Option B: FRONTEND_URL exists but might be wrong
1. Click the pencil icon to edit it
2. Make sure it **exactly matches** your frontend URL
3. Check for typos, extra slashes, http vs https
4. Click **"Save Changes"** → Service will auto-redeploy

### Step 3: Wait for Deployment & Check Logs

1. Wait for backend to redeploy (1-2 minutes)
2. Check logs again - you should now see:

```
============================================================
🔒 CORS CONFIGURATION
============================================================
Environment: 🔴 PRODUCTION
NODE_ENV: production

📍 Allowed Origins:
   ✅ http://localhost:5173 (development fallback)
   ✅ http://localhost:5174 (development fallback)
   ✅ http://localhost:3000 (development fallback)
   ✅ https://your-frontend.onrender.com (FRONTEND_URL)
============================================================
```

### Step 4: Test Your Frontend

1. Visit your frontend URL
2. Try to login/register
3. Open browser DevTools (F12) → Console
4. Should work now! ✅

---

## 🔍 Debugging CORS Issues on Render

### How to Find Your Exact Frontend URL

1. Go to Render Dashboard
2. Click on your **frontend service** (Static Site or Web Service)
3. Look at the top - you'll see the URL
4. Copy it exactly: `https://your-app-name.onrender.com`

**Common mistakes:**
- ❌ `http://` instead of `https://`
- ❌ Adding trailing slash `/`
- ❌ Wrong app name
- ❌ Including paths like `/home`

### Check Backend Logs for CORS Blocks

If still having issues, check backend logs for requests:

```
❌ CORS BLOCKED!
   Origin: https://my-frontend.onrender.com
   Allowed origins: ["http://localhost:5173", "https://different-frontend.onrender.com"]
   Environment: production
   FRONTEND_URL: https://different-frontend.onrender.com
   CORS_ORIGIN: NOT SET
```

This tells you:
- What origin tried to connect
- What origins are allowed
- What FRONTEND_URL is set to

**The fix:** Update FRONTEND_URL to match the actual origin!

### Check Frontend Console

Open your frontend → F12 → Console:

**Error 1: Failed to fetch**
```
TypeError: Failed to fetch
```
**Cause:** Backend not running or wrong API URL  
**Fix:** Check backend is deployed and VITE_API_URL is correct

**Error 2: CORS policy**
```
Access to fetch... has been blocked by CORS policy
```
**Cause:** FRONTEND_URL not set or doesn't match  
**Fix:** Update FRONTEND_URL in backend environment variables

**Error 3: Network error**
```
NetworkError when attempting to fetch resource
```
**Cause:** Backend URL wrong in frontend  
**Fix:** Check VITE_API_URL in frontend environment variables

---

## 📋 Complete Environment Variables Checklist

### Render Backend Service

Required environment variables:

| Variable | Example | Status |
|----------|---------|--------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | ✅ Auto-set by Render |
| `JWT_SECRET` | `random-32-char-string` | ⚠️ YOU must set this |
| `NODE_ENV` | `production` | ⚠️ YOU must set this |
| `FRONTEND_URL` | `https://your-app.onrender.com` | ⚠️ YOU must set this |
| `PORT` | `10000` | ✅ Auto-set by Render |

#### How to set them:

1. Go to backend service
2. Click **"Environment"** tab
3. Add each variable:

```
JWT_SECRET = <generate using password generator - 32+ chars>
NODE_ENV = production
FRONTEND_URL = https://your-frontend.onrender.com
```

4. Click **"Save Changes"**

### Render Frontend Service

Required environment variable:

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

#### How to set it:

1. Go to frontend service
2. Click **"Environment"** tab
3. Add variable:

```
VITE_API_URL = https://your-backend-name.onrender.com/api
```

4. Click **"Save Changes"**

---

## 🧪 Testing CORS on Render

### Test 1: Health Check (No Auth Required)

Open terminal and test backend directly:

```bash
curl https://your-backend.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"Server is running"}
```

If this fails, backend isn't running properly!

### Test 2: Browser Console Test

1. Open your frontend: `https://your-frontend.onrender.com`
2. Open DevTools (F12) → Console
3. Paste this:

```javascript
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ CORS working!', data))
  .catch(err => console.error('❌ CORS failed:', err));
```

**Expected:** `✅ CORS working! {status: "ok", ...}`  
**If failed:** Check FRONTEND_URL in backend environment variables

### Test 3: Check Response Headers

1. Frontend → F12 → Network tab
2. Try to login
3. Click on the request to your backend
4. Look at "Response Headers"

Should include:
```
access-control-allow-origin: https://your-frontend.onrender.com
access-control-allow-credentials: true
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
```

If missing, CORS isn't configured correctly.

---

## 🔄 Common Deployment Scenarios

### Scenario 1: Backend Deployed First

1. Deploy backend → Get backend URL
2. Deploy frontend with `VITE_API_URL` pointing to backend
3. Get frontend URL
4. **Update backend** with `FRONTEND_URL`
5. Backend auto-redeploys
6. ✅ Works!

### Scenario 2: Frontend Deployed First

1. Deploy frontend → Get frontend URL
2. Deploy backend with `FRONTEND_URL` set to frontend
3. Get backend URL
4. **Update frontend** with `VITE_API_URL`
5. Frontend redeploys
6. ✅ Works!

### Scenario 3: Both Deployed, CORS Not Working

1. Check backend logs for CORS configuration
2. Compare logged origins with actual frontend URL
3. Update `FRONTEND_URL` to match exactly
4. Both services should work after backend redeploys

---

## 🆘 Still Having Issues?

### Checklist:

- [ ] Backend is deployed and running
- [ ] Frontend is deployed and running
- [ ] `NODE_ENV=production` set on backend
- [ ] `FRONTEND_URL` set on backend
- [ ] `FRONTEND_URL` exactly matches frontend URL (no typos!)
- [ ] `FRONTEND_URL` uses `https://` not `http://`
- [ ] `FRONTEND_URL` has no trailing slash
- [ ] `VITE_API_URL` set on frontend
- [ ] `VITE_API_URL` points to backend with `/api` at end
- [ ] Backend logs show correct CORS configuration
- [ ] Backend logs don't show CORS blocked messages

### Get Diagnostic Info:

**Backend logs should show:**
```
🔒 CORS CONFIGURATION
Environment: 🔴 PRODUCTION
📍 Allowed Origins:
   ✅ https://your-frontend.onrender.com (FRONTEND_URL)
```

**Not showing this?** Your environment variables aren't set correctly.

### Advanced: Multiple Frontends

If you have staging + production frontends:

```env
FRONTEND_URL=https://main-app.onrender.com
CORS_ORIGIN=https://staging-app.onrender.com
```

Both will be allowed!

For more than 2 frontends, you'll need to modify the `allowedOrigins` array in `server/index.js`.

---

## 📱 Custom Domains

Using a custom domain? Update accordingly:

```env
# Instead of:
FRONTEND_URL=https://my-app.onrender.com

# Use:
FRONTEND_URL=https://myapp.com
```

Make sure you're accessing via the custom domain in the browser!

---

## 🔒 Security Note

Your CORS is now configured to:
- ✅ Block all origins except specified ones
- ✅ Allow credentials (cookies, auth headers)
- ✅ Only allow specific HTTP methods
- ✅ Log all blocked attempts

This is secure! Don't set CORS to allow `*` (all origins) in production.

---

## 🎯 Quick Reference

### Set These on Render Backend:
```
NODE_ENV=production
JWT_SECRET=<random-32-char-string>
FRONTEND_URL=https://your-frontend.onrender.com
```

### Set These on Render Frontend:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Check Backend Logs:
Look for "🔒 CORS CONFIGURATION" section at startup

### Test:
```bash
curl https://your-backend.onrender.com/api/health
```

That's it! 🚀

---

Need more help? Check your backend logs and look for the CORS configuration section. It will tell you exactly what's configured!

