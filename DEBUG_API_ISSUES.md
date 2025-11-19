# 🔧 Debug "Unexpected token '<'" Error

## What This Error Means

The error `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` means your frontend tried to parse HTML as JSON. This happens when:

1. ❌ API URL is wrong (pointing to HTML page instead of API)
2. ❌ Backend is returning 404 error page
3. ❌ Backend isn't deployed/running
4. ❌ Route doesn't exist on backend

---

## ✅ I Just Fixed the Error Handling

Your API files now:
- ✅ Check content-type before parsing
- ✅ Show helpful error messages
- ✅ Log what went wrong in console
- ✅ Handle HTML responses gracefully

**But we still need to find the root cause!**

---

## 🔍 Step 1: Check Browser Console

1. Open your frontend (on Render or locally)
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to login/register
5. Look for error messages

You should now see more detailed errors like:
```
API Error: Expected JSON but received text/html
```

And logs showing what was received (first 200 characters).

---

## 🔍 Step 2: Check API URL

Open browser console and check what API URL is being used:

```javascript
// Paste this in console:
console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
```

### Local Development:
Should be: `http://localhost:5000/api`

### On Render:
Should be: `https://your-backend-name.onrender.com/api`

**If wrong URL → Need to set VITE_API_URL environment variable!**

---

## 🔍 Step 3: Test Backend Directly

Test if your backend is actually running and returning JSON:

### On Render:

```bash
curl https://your-backend-name.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"Server is running"}
```

If you get HTML instead → Backend issue!

### Locally:

```bash
curl http://localhost:5000/api/health
```

---

## 🔍 Step 4: Check Network Tab

1. Browser DevTools (F12) → **Network** tab
2. Try to login
3. Find the request to `/auth/login`
4. Click on it
5. Look at:
   - **Request URL**: Is it correct?
   - **Status Code**: What status did it return?
   - **Response**: What did it return? (JSON or HTML?)

---

## 🚨 Common Issues & Fixes

### Issue 1: Wrong API URL

**Symptoms:**
- Request goes to wrong URL
- Gets 404 HTML page
- Error: "Unexpected token '<'"

**Check:**
```javascript
// In browser console:
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

**Fix for Render:**
1. Go to your frontend service on Render
2. Click "Environment" tab
3. Add/update:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
   ⚠️ Make sure to include `/api` at the end!
4. Save and redeploy

**Fix locally:**
Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```
Restart dev server.

---

### Issue 2: Backend Not Running

**Symptoms:**
- `curl` to backend fails
- Network error or 404
- Can't reach backend

**Check:**
- Is backend deployed on Render?
- Is it showing "Live" status?
- Check backend logs for errors

**Fix:**
1. Go to backend service on Render
2. Check it's deployed and running
3. Check logs for errors
4. If needed, manually deploy: "Manual Deploy" → "Clear build cache & deploy"

---

### Issue 3: Backend Returning HTML

**Symptoms:**
- Backend returns 404 or 500
- Gets HTML error page instead of JSON
- Error about DOCTYPE

**Check backend logs for:**
- Errors during startup
- Database connection issues
- Missing environment variables

**Common causes:**
- Database not connected (check DATABASE_URL)
- Migrations not run
- Backend crashed on startup

**Fix:**
1. Check backend logs on Render
2. Look for error messages
3. Common fixes:
   - Run migrations: Shell → `npm run prisma:migrate:deploy`
   - Check DATABASE_URL is set
   - Check all required env vars are set

---

### Issue 4: Route Doesn't Exist

**Symptoms:**
- Specific route returns 404
- Other routes work fine

**Check:**
- Is the route defined in `server/index.js`?
- Typo in route name?
- Is it `/api/auth/login` or just `/auth/login`?

**Fix:**
- Make sure frontend and backend routes match
- Frontend: `${API_URL}/auth/login`
- Backend: `app.post('/api/auth/login', ...)`

---

## 🧪 Quick Test Script

Paste this in your browser console to diagnose:

```javascript
// Test 1: Check API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('📍 API URL:', API_URL);

// Test 2: Test health endpoint
console.log('🧪 Testing health endpoint...');
fetch(`${API_URL}/health`)
  .then(async (response) => {
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    const text = await response.text();
    console.log('Response preview:', text.substring(0, 200));
    
    try {
      const json = JSON.parse(text);
      console.log('✅ Health check successful:', json);
    } catch (e) {
      console.error('❌ Not JSON! Backend returning:', text.substring(0, 100));
    }
  })
  .catch(err => {
    console.error('❌ Network error:', err.message);
    console.log('💡 Check: Is backend running? Is API_URL correct?');
  });

// Test 3: Check CORS
console.log('🔒 Testing CORS...');
fetch(`${API_URL}/health`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => console.log('✅ CORS working!'))
  .catch(err => console.error('❌ CORS error:', err.message));
```

This will show you:
- What API URL is configured
- If backend is returning JSON or HTML
- If there's a network/CORS issue

---

## 📋 Render Deployment Checklist

Make sure these are set correctly on Render:

### Backend Service Environment Variables:
```
DATABASE_URL = <auto-set-by-postgres>
JWT_SECRET = <random-32-chars>
NODE_ENV = production
FRONTEND_URL = https://your-frontend.onrender.com
PORT = <auto-set-by-render>
```

### Frontend Service Environment Variables:
```
VITE_API_URL = https://your-backend.onrender.com/api
```

⚠️ Common mistakes:
- Forgetting `/api` at end of VITE_API_URL
- Using `http://` instead of `https://` on Render
- Wrong backend name in URL

---

## 🎯 Most Likely Causes

Based on "Unexpected token '<'" error:

1. **80% chance**: `VITE_API_URL` not set correctly
   - Check it's set in Render frontend environment
   - Check it includes `/api` at the end
   - Check it's the right backend URL

2. **15% chance**: Backend not running
   - Check backend is deployed on Render
   - Check backend logs for errors
   - Try `curl`ing the backend directly

3. **5% chance**: Backend route doesn't exist
   - Check backend has `/api/auth/login` route
   - Check for typos in routes

---

## 💡 Next Steps

1. **Check browser console** - More detailed errors now
2. **Run the test script above** - Diagnose the issue
3. **Verify VITE_API_URL** - Most common cause
4. **Test backend with curl** - Make sure it's running
5. **Check backend logs** - Look for errors

The improved error handling will now tell you exactly what's wrong! 🎯

---

## 🆘 Still Stuck?

Share these details:
1. Output of the test script above
2. Value of VITE_API_URL (from console)
3. Backend URL (from Render)
4. Response from `curl https://your-backend.onrender.com/api/health`
5. Any errors from browser console

This will help identify the exact issue!

