# 🚀 Quick Start - Deploy to Render

## ✅ Your Backend is Already Configured for CORS!

Just follow these steps:

---

## 📦 1. Deploy Backend to Render

### Create PostgreSQL Database
1. New → PostgreSQL
2. Copy the **Internal Database URL**

### Create Web Service
1. New → Web Service → Connect your Git repo
2. Configure:
   - **Build Command**: `npm run render:build`
   - **Start Command**: `npm start`
   - **Environment Variables**:

```env
DATABASE_URL=<paste-internal-database-url-here>
JWT_SECRET=<generate-random-32-character-string>
NODE_ENV=production
FRONTEND_URL=https://your-frontend-will-be-here.onrender.com
```

3. Deploy and copy your backend URL

---

## 🎨 2. Deploy Frontend to Render

### Create Static Site or Web Service
1. New → Static Site (or Web Service) → Connect repo
2. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:

```env
VITE_API_URL=https://your-backend-from-step1.onrender.com/api
```

3. Deploy and copy your frontend URL

---

## 🔄 3. Update Backend CORS

Now that you have your frontend URL:

1. Go back to your **backend service** on Render
2. Click **"Environment"** tab
3. **Update** `FRONTEND_URL` with your actual frontend URL:
   ```
   FRONTEND_URL=https://your-actual-frontend.onrender.com
   ```
4. Click **"Save Changes"** (will auto-redeploy)

---

## ✅ 4. Test It!

Visit your frontend URL and try:
- Registering a new user
- Logging in
- Creating/editing users

Everything should work! 🎉

---

## 📝 Environment Variables Cheat Sheet

### Backend on Render
```env
DATABASE_URL=postgresql://user:pass@host:5432/db    # From Render PostgreSQL
JWT_SECRET=your-very-strong-random-secret-key-here  # Generate secure random string
NODE_ENV=production                                  # Enables production mode
FRONTEND_URL=https://your-frontend.onrender.com     # Your frontend URL (no trailing /)
```

### Frontend on Render
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🐛 Troubleshooting

### CORS Error?
- Check `FRONTEND_URL` exactly matches your frontend URL
- Check `NODE_ENV=production` is set on backend
- Check no trailing slash in `FRONTEND_URL`

### Database Error?
- Use **Internal Database URL** (not External)
- Check database and backend are in same region
- Run migrations in Shell: `npm run prisma:migrate:deploy`

### 502 Bad Gateway?
- Wait a few minutes (cold start)
- Check build logs for errors
- Verify all dependencies are in `package.json`

---

## 📚 More Information

- **Full Deployment Guide**: `RENDER_DEPLOYMENT.md`
- **CORS Details**: `CORS_SETUP_GUIDE.md`
- **Environment Variables**: `ENVIRONMENT_SETUP.md`

---

## 💡 Quick Tips

- **Free tier**: Services spin down after 15 min → First request takes 30-50 seconds
- **Database**: Free PostgreSQL expires after 90 days
- **Production Ready**: Upgrade to Starter ($7/month per service) for always-on
- **Logs**: Check Render Dashboard → Your Service → Logs for errors

---

Good luck! 🚀

