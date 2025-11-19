# Render Deployment Guide

This guide will walk you through deploying your CRUD Admin Panel backend to Render.

## Prerequisites

- GitHub, GitLab, or Bitbucket account
- Render account (free tier available at https://render.com)
- Your code pushed to a Git repository

---

## Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `user-management-db`
   - **Database**: `user_management`
   - **Region**: Choose closest to your users
   - **Plan**: Free or Starter ($7/month for production)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** - it looks like:
   ```
   postgresql://user:password@hostname:5432/database
   ```

---

## Step 2: Deploy Backend Web Service

### 2.1 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. **Connect your repository**:
   - Click "Connect account" for GitHub/GitLab/Bitbucket
   - Authorize Render to access your repositories
   - Select your project repository

### 2.2 Configure Service

**Basic Configuration:**
- **Name**: `crud-admin-backend` (or your preferred name)
- **Region**: Same as your database (for best performance)
- **Branch**: `main` (or your deployment branch)
- **Root Directory**: Leave blank
- **Runtime**: `Node`
- **Build Command**: `npm run render:build`
- **Start Command**: `npm start`
- **Plan**: Free or Starter ($7/month)

### 2.3 Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value | Description |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Internal Database URL from Step 1 |
| `JWT_SECRET` | `<generate-random-string>` | Strong random string (32+ characters) |
| `NODE_ENV` | `production` | Sets environment to production |
| `PORT` | `10000` | Render's default port (auto-assigned) |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` | Your deployed frontend URL |

**Generate a secure JWT_SECRET:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use online generator: https://www.grc.com/passwords.htm
```

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-5 minutes)
3. Monitor logs for any errors

---

## Step 3: Test Your Backend

Once deployed, test these endpoints:

### Health Check
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Register a Test User
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Step 4: Seed Database (Optional)

To add initial admin user and test data:

1. Go to your Web Service in Render Dashboard
2. Click **"Shell"** tab on the left
3. Wait for shell to connect
4. Run:
   ```bash
   npm run prisma:seed
   ```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Manager user: `manager@example.com` / `manager123`
- Regular user: `user@example.com` / `user123`

---

## Step 5: Configure Frontend

### 5.1 Update Frontend API URL

Your frontend needs to know where the backend is deployed.

**Option A: Environment Variable (Recommended)**

Create `.env.production` in your frontend root:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

**Option B: Update `src/api/users.js` and `src/api/auth.js`**

Update the BASE_URL:
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 
                 import.meta.env.PROD 
                   ? 'https://your-backend.onrender.com/api'
                   : 'http://localhost:5000/api';
```

### 5.2 Deploy Frontend to Render

1. Create another **Web Service** for frontend
2. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview` or use a static site
   - **Environment Variables**: Add `VITE_API_URL` with your backend URL

### 5.3 Update CORS in Backend

After deploying frontend, update the `FRONTEND_URL` environment variable in your backend service:

1. Go to backend service → **Environment** tab
2. Edit `FRONTEND_URL` to your actual frontend URL
3. Service will auto-redeploy

---

## CORS Configuration Explained

Your backend now uses dynamic CORS configuration:

### Development Mode (`NODE_ENV=development`)
- ✅ Allows all `localhost` origins automatically
- ✅ Allows `127.0.0.1` origins
- ✅ No configuration needed for local development

### Production Mode (`NODE_ENV=production`)
- ✅ Only allows origins specified in environment variables
- ✅ `FRONTEND_URL` - Your main frontend URL
- ✅ `CORS_ORIGIN` - Additional custom domain (optional)
- ❌ Blocks all other origins for security

### CORS Features
- Credentials support (cookies, auth headers)
- Supports: GET, POST, PUT, DELETE, OPTIONS
- Allows: Content-Type and Authorization headers
- Works with Postman, mobile apps (no origin)

---

## Troubleshooting

### Issue: CORS Error in Browser

**Symptoms:**
```
Access to fetch at 'https://backend.onrender.com/api/...' from origin 'https://frontend.onrender.com' 
has been blocked by CORS policy
```

**Solution:**
1. Check `FRONTEND_URL` environment variable in backend
2. Make sure it exactly matches your frontend URL (no trailing slash)
3. Verify `NODE_ENV=production` is set
4. Check backend logs for CORS errors

### Issue: Database Connection Error

**Symptoms:**
```
Error: Can't reach database server at `hostname:5432`
```

**Solution:**
1. Verify `DATABASE_URL` is the **Internal** URL (not External)
2. Make sure database and web service are in the same region
3. Check database is running (not paused)
4. Run migrations: Go to Shell → `npm run prisma:migrate:deploy`

### Issue: Service Keeps Spinning Down

**Symptoms:**
- First request takes 30-50 seconds
- Service goes to sleep after inactivity

**Solution:**
- This is normal on **Free tier** (spins down after 15 min)
- Upgrade to **Starter plan** ($7/month) for always-on service
- Or use a service like [UptimeRobot](https://uptimerobot.com/) to ping every 10 minutes

### Issue: Build Fails

**Common errors:**

1. **Missing dependencies**
   ```
   Cannot find module 'prisma'
   ```
   Solution: Make sure `prisma` is in `devDependencies`

2. **Migration fails**
   ```
   Error: Could not find migrations directory
   ```
   Solution: Commit `prisma/migrations/` directory to Git

3. **Prisma generate fails**
   ```
   Prisma schema not found
   ```
   Solution: Ensure `prisma/schema.prisma` exists in repository

---

## Security Checklist

Before going to production:

- [ ] Use strong, unique `JWT_SECRET` (32+ characters)
- [ ] Never commit `.env` file to Git
- [ ] Use Internal Database URL (not External)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `FRONTEND_URL` correctly
- [ ] Enable 2FA on your Render account
- [ ] Regularly update dependencies
- [ ] Monitor logs for suspicious activity
- [ ] Consider enabling SSL/TLS for database
- [ ] Set up error monitoring (e.g., Sentry)

---

## Monitoring & Maintenance

### View Logs
1. Go to your service in Render Dashboard
2. Click **"Logs"** tab
3. Monitor for errors and performance issues

### Database Management
1. Click **"Prisma Studio"** is not available on Render
2. Use the **Shell** to run Prisma commands:
   ```bash
   npx prisma studio
   ```
3. Or connect with a PostgreSQL client using External Database URL

### Update Environment Variables
1. Go to service → **Environment** tab
2. Edit variables
3. Service auto-redeploys

### Manual Deploy
1. Go to service page
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Or use **"Clear build cache & deploy"** if having issues

---

## Free Tier Limitations

Render Free tier includes:

✅ **Included:**
- 750 hours/month of service time
- 100 GB bandwidth
- PostgreSQL database (90 days, then expires)
- Automatic SSL certificates
- Continuous deployment from Git

❌ **Limitations:**
- Services spin down after 15 minutes of inactivity
- 512 MB RAM
- 0.1 CPU share
- Database expires after 90 days (backup data!)
- Cold starts take 30-50 seconds

**Recommended for Production:**
- Upgrade to **Starter plan** ($7/month)
- Database **Starter plan** ($7/month) - doesn't expire
- Total: $14/month for production-ready setup

---

## Useful Commands

### In Render Shell

```bash
# Check environment
node --version
npm --version

# View Prisma schema
npx prisma db pull

# Run migrations
npm run prisma:migrate:deploy

# Seed database
npm run prisma:seed

# Generate Prisma Client
npm run prisma:generate

# Check database connection
npx prisma db execute --stdin <<< "SELECT NOW();"
```

### Local Testing

```bash
# Test with production-like environment
NODE_ENV=production \
DATABASE_URL="your-render-db-url" \
JWT_SECRET="your-production-secret" \
FRONTEND_URL="http://localhost:5173" \
npm run server
```

---

## Need Help?

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Prisma Documentation**: https://www.prisma.io/docs
- **Check service logs** in Render Dashboard for detailed errors

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Render or Vercel/Netlify
3. ✅ Update CORS configuration
4. ✅ Test all functionality
5. ⏭️ Set up custom domain (optional)
6. ⏭️ Configure monitoring and alerts
7. ⏭️ Set up automated backups
8. ⏭️ Plan for scaling if needed

Good luck with your deployment! 🚀

