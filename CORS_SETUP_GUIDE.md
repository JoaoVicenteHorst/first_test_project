# CORS Setup Quick Guide

## 🎯 What You Need to Do

Your CORS is already configured! Here's what you need to set up:

---

## For Render Deployment

### Step 1: Deploy Backend to Render

When creating your backend Web Service, add these environment variables:

```env
DATABASE_URL=<your-render-postgres-internal-url>
JWT_SECRET=<generate-a-strong-32-char-random-string>
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

**Important Notes:**
- `FRONTEND_URL` must **exactly match** your deployed frontend URL
- No trailing slash: ✅ `https://app.com` ❌ `https://app.com/`
- Use **Internal Database URL** from Render PostgreSQL

### Step 2: Deploy Frontend

Add this environment variable to your frontend deployment:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Step 3: Update Backend CORS

After deploying frontend:
1. Go to your backend service on Render
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` with your actual frontend URL
4. Service will auto-redeploy

✅ **Done!** CORS will now allow your frontend to access the backend.

---

## For Local Development

### Backend (.env file)

Create `.env` in project root (copy from `env.example`):

```env
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV="development"
JWT_SECRET="your-secret-key-change-in-production"
```

### Frontend (Optional)

The frontend automatically uses `http://localhost:5000/api` by default.

If you need custom configuration, create `.env` in project root:

```env
VITE_API_URL=http://localhost:5000/api
```

✅ **In development mode**, CORS automatically allows all `localhost` origins!

---

## How Your CORS Works

```javascript
// Your backend CORS configuration (already set up in server/index.js)

Development Mode (NODE_ENV=development):
  ✅ Allows: All localhost origins (automatically)
  ✅ Allows: 127.0.0.1 origins
  ✅ No configuration needed!

Production Mode (NODE_ENV=production):
  ✅ Allows: Only FRONTEND_URL
  ✅ Allows: CORS_ORIGIN (optional, for additional domains)
  ❌ Blocks: Everything else (for security)
```

---

## Testing Your Setup

### 1. Test Backend Health

```bash
# Replace with your backend URL
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","message":"Server is running"}
```

### 2. Test from Browser

Open your deployed frontend, open DevTools Console, run:

```javascript
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log);
```

Should show: `{status: "ok", message: "Server is running"}`

If you see CORS error → Check `FRONTEND_URL` in backend environment variables!

---

## Common Issues & Solutions

### Issue: "blocked by CORS policy"

**Cause**: `FRONTEND_URL` not set or doesn't match actual frontend URL

**Solution**:
1. Go to Render Dashboard → Your Backend Service
2. Click "Environment" tab
3. Check `FRONTEND_URL` exactly matches your frontend URL
4. Check `NODE_ENV=production` is set
5. Save (service will redeploy)

### Issue: Works locally but not in production

**Cause**: `NODE_ENV` not set to `production`

**Solution**: Add `NODE_ENV=production` in Render backend environment variables

### Issue: Need to allow multiple domains

**Solution**: Add second domain to `CORS_ORIGIN` environment variable:

```env
FRONTEND_URL=https://main-app.onrender.com
CORS_ORIGIN=https://staging-app.onrender.com
```

For more than 2 domains, update the `allowedOrigins` array in `server/index.js`

---

## Environment Variables Reference

### Render Backend (Required)

| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Database connection |
| `JWT_SECRET` | `random-32-char-string` | JWT token signing |
| `NODE_ENV` | `production` | Enables production mode |
| `FRONTEND_URL` | `https://app.onrender.com` | CORS allowed origin |

### Render Frontend (Required)

| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `VITE_API_URL` | `https://backend.onrender.com/api` | Backend API endpoint |

---

## Need More Help?

- Full deployment guide: See `RENDER_DEPLOYMENT.md`
- Environment variables: See `ENVIRONMENT_SETUP.md`
- Check backend logs in Render Dashboard for errors
- Use browser DevTools Network tab to inspect CORS headers

Your CORS is already configured! Just set the environment variables and deploy. 🚀

