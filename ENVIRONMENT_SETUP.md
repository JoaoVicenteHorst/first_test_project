# Environment Variables Setup Guide

This guide explains how to configure environment variables for both local development and production deployment on Render.

---

## 📋 Quick Setup Summary

### For Local Development:
1. Copy `env.example` to `.env` in project root
2. Keep default values for local development
3. Start backend: `npm run server:dev`
4. Start frontend: `npm run dev`

### For Render Production:
1. **Backend**: Set environment variables in Render Dashboard
2. **Frontend**: Deploy with `VITE_API_URL` pointing to backend

---

## 🔧 Local Development Setup

### Step 1: Create Backend .env File

Copy the example file:
```bash
# Windows PowerShell
Copy-Item env.example .env

# Linux/Mac
cp env.example .env
```

Your `.env` should contain:
```env
# Database (use SQLite for quick local setup)
DATABASE_URL="file:./dev.db"

# Server Configuration
PORT=5000
NODE_ENV="development"

# JWT Secret (can use default for local dev)
JWT_SECRET="your-secret-key-change-in-production"

# CORS - Not needed for local development
# FRONTEND_URL is automatically handled by the CORS config
```

### Step 2: Frontend Configuration (Optional)

The frontend automatically connects to `http://localhost:5000/api` by default.

If you need a custom configuration, create `.env` in project root:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Development Servers

```bash
# Terminal 1 - Start Backend
npm run server:dev

# Terminal 2 - Start Frontend
npm run dev
```

✅ CORS will automatically allow `localhost` origins in development mode!

---

## 🚀 Render Production Setup

### Backend Environment Variables

When creating your Web Service on Render, add these environment variables:

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | ✅ Yes | Internal Database URL from Render PostgreSQL |
| `JWT_SECRET` | `<strong-random-string>` | ✅ Yes | Min 32 characters, use a password generator |
| `NODE_ENV` | `production` | ✅ Yes | Enables production mode & strict CORS |
| `PORT` | `10000` | ⚠️ Auto | Render sets this automatically |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` | ✅ Yes | Your deployed frontend URL |
| `CORS_ORIGIN` | `https://custom-domain.com` | ❌ Optional | Additional allowed origin |

#### How to Add Environment Variables on Render:

1. Go to your backend service in Render Dashboard
2. Click **"Environment"** in the left sidebar
3. Click **"Add Environment Variable"**
4. Enter Key and Value
5. Click **"Save Changes"** (service will auto-redeploy)

#### Generate Secure JWT_SECRET:

```bash
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Linux/Mac
openssl rand -base64 32

# Or use: https://www.grc.com/passwords.htm
```

### Frontend Environment Variables

#### Option 1: Render Static Site

If deploying frontend as a Static Site on Render:

1. Go to your frontend service
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com/api`

#### Option 2: Render Web Service

If deploying frontend as a Web Service:

1. Add environment variable in Render Dashboard:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com/api`

2. Update build command to:
   ```
   npm run build
   ```

#### Option 3: Other Hosting (Vercel, Netlify)

Add environment variable in your hosting platform:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔄 CORS Configuration Flow

### How It Works:

```
┌─────────────────────────────────────────────────────┐
│  Frontend (https://frontend.onrender.com)          │
│  ↓ Makes request to backend API                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Backend CORS Middleware                            │
│  ↓ Checks request origin                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Development Mode (NODE_ENV=development)            │
│  ✅ Allow: All localhost origins                    │
│  ✅ Allow: 127.0.0.1 origins                        │
└─────────────────────────────────────────────────────┘
                        OR
┌─────────────────────────────────────────────────────┐
│  Production Mode (NODE_ENV=production)              │
│  ✅ Allow: FRONTEND_URL                             │
│  ✅ Allow: CORS_ORIGIN (if set)                     │
│  ❌ Block: Everything else                          │
└─────────────────────────────────────────────────────┘
```

### Development Mode
- `NODE_ENV=development` or not set
- **Automatically allows**: All `localhost` and `127.0.0.1` origins
- No configuration needed for local development

### Production Mode
- `NODE_ENV=production`
- **Only allows**: URLs in `FRONTEND_URL` and `CORS_ORIGIN`
- Blocks all unauthorized origins for security

---

## 🧪 Testing CORS Configuration

### Test 1: Health Check (No CORS)

```bash
curl https://your-backend.onrender.com/api/health
```

Expected:
```json
{"status":"ok","message":"Server is running"}
```

### Test 2: CORS Preflight Request

```bash
curl -X OPTIONS https://your-backend.onrender.com/api/users \
  -H "Origin: https://your-frontend.onrender.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

Look for these headers in response:
```
Access-Control-Allow-Origin: https://your-frontend.onrender.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Test 3: From Browser Console

Open your frontend in browser, open DevTools Console:

```javascript
// Test API connection
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Should log: `{status: "ok", message: "Server is running"}`

---

## 🐛 Troubleshooting CORS Issues

### Error: "blocked by CORS policy"

```
Access to fetch at 'https://backend.onrender.com/api/users' from origin 
'https://frontend.onrender.com' has been blocked by CORS policy
```

**Checklist:**
1. ✅ Is `NODE_ENV=production` set on backend?
2. ✅ Is `FRONTEND_URL` set correctly (no trailing slash)?
3. ✅ Does `FRONTEND_URL` exactly match your frontend URL?
4. ✅ Has the backend redeployed after adding `FRONTEND_URL`?

**Solution:**
```bash
# Check your backend environment variables
# Go to Render Dashboard → Your Backend Service → Environment

# Verify these match:
FRONTEND_URL=https://your-frontend.onrender.com  # ← Exact match!
NODE_ENV=production
```

### Error: "Origin null is not allowed"

**Cause**: Opening HTML file directly (file://) or missing Origin header

**Solution**: Always access via HTTP/HTTPS, not file://

### Error: "Credentials flag is true, but Access-Control-Allow-Credentials is missing"

**Cause**: CORS configuration missing credentials support

**Solution**: Already configured in your backend! Just verify `FRONTEND_URL` is set.

### CORS Works in Development but Not Production

**Cause**: `NODE_ENV` not set to `production` on Render

**Solution**:
1. Go to backend service on Render
2. Environment tab
3. Add/update: `NODE_ENV=production`
4. Save (auto-redeploys)

---

## 📱 Multiple Frontend URLs (Advanced)

If you have multiple frontend deployments (staging, production, custom domain):

### Method 1: Update Environment Variable

Add comma-separated origins in your backend code:

```javascript
// server/index.js - Update the allowedOrigins array
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,          // Main production
  process.env.CORS_ORIGIN,           // Staging or custom domain
  'https://app.yourdomain.com',      // Additional custom domain
].filter(Boolean);
```

### Method 2: Use CORS_ORIGIN

Set multiple environment variables on Render:
```
FRONTEND_URL=https://your-frontend.onrender.com
CORS_ORIGIN=https://staging.yourdomain.com
```

For more than 2 URLs, update the backend code as shown in Method 1.

---

## 🔒 Security Best Practices

### ✅ DO:
- Use strong, unique `JWT_SECRET` (32+ characters)
- Set `NODE_ENV=production` in production
- Use specific origins in `FRONTEND_URL`
- Keep `.env` files in `.gitignore`
- Use Internal Database URLs on Render
- Regularly rotate JWT secrets

### ❌ DON'T:
- Don't use `cors()` with no options in production
- Don't allow `*` wildcard origins
- Don't commit `.env` files to Git
- Don't use development secrets in production
- Don't share environment variables publicly

---

## 📝 Environment Variable Checklist

### Local Development (.env)
```bash
✅ DATABASE_URL          # Local DB (SQLite or PostgreSQL)
✅ PORT                  # 5000
✅ NODE_ENV              # "development"
✅ JWT_SECRET            # Any string for local testing
```

### Render Backend (Production)
```bash
✅ DATABASE_URL          # From Render PostgreSQL (Internal URL)
✅ NODE_ENV              # "production"
✅ JWT_SECRET            # Strong random string (32+ chars)
✅ FRONTEND_URL          # Your deployed frontend URL
❓ PORT                  # Auto-set by Render
❓ CORS_ORIGIN           # Optional: Additional domain
```

### Render Frontend (Production)
```bash
✅ VITE_API_URL          # https://your-backend.onrender.com/api
```

---

## 🎯 Quick Commands

### View Environment Variables

```bash
# Linux/Mac
env | grep -E "DATABASE_URL|JWT_SECRET|FRONTEND_URL"

# Windows PowerShell
Get-ChildItem Env: | Where-Object {$_.Name -match "DATABASE_URL|JWT_SECRET|FRONTEND_URL"}
```

### Test Environment in Node

```javascript
// test-env.js
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Run: node test-env.js
```

---

## 📚 Additional Resources

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [CORS MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Package](https://www.npmjs.com/package/cors)

---

## Need Help?

If you're still having issues:

1. Check backend logs in Render Dashboard
2. Verify all environment variables are set correctly
3. Test with curl commands above
4. Check browser DevTools Network tab for CORS headers
5. Ensure frontend and backend URLs are correct

Happy deploying! 🚀

