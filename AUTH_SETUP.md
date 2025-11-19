# Authentication Setup Guide

## 🎉 Authentication System Completed!

Your CRUD Admin Panel now has a complete authentication system with:

- ✅ **Login & Register Pages** - Beautiful UI for user authentication
- ✅ **JWT Token Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - Admin, Manager, and User roles
- ✅ **Admin Restrictions** - Only admins can create Admin/Manager accounts
- ✅ **Protected Routes** - All CRUD operations require authentication
- ✅ **Password Hashing** - Secure bcrypt password storage

---

## 🚀 Setup Instructions

### Step 1: Fix PostgreSQL Permissions (IMPORTANT!)

You encountered a permission error earlier. Fix it by running these commands in PostgreSQL:

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Inside psql, run:
\c user_management

# Grant permissions (replace 'your_user' with your database username)
GRANT ALL PRIVILEGES ON SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO your_user;

# Exit
\q
```

**OR use the postgres superuser** (quick fix):

Update your `.env` file to use the postgres user:
```env
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/user_management?schema=public"
```

---

### Step 2: Run Database Migration

After fixing permissions, run the migration:

```bash
npm run prisma:migrate
```

This will:
- Add the `password` field to the User table
- Create the migration files

---

### Step 3: Seed the Database

Create initial test users (including an admin):

```bash
npm run prisma:seed
```

This creates 3 test accounts:
- **Admin**: `admin@example.com` / `admin123`
- **Manager**: `manager@example.com` / `admin123`
- **User**: `user@example.com` / `admin123`

---

### Step 4: Add JWT Secret to .env

Make sure your `.env` file has a JWT secret:

```env
JWT_SECRET="your-secret-key-change-in-production"
```

**IMPORTANT**: Change this to a strong random string in production!

---

### Step 5: Start the Application

**Terminal 1** - Start backend:
```bash
npm run server:dev
```

**Terminal 2** - Start frontend:
```bash
npm run dev
```

---

## 📖 How to Use

### Registration
1. New users can register with email/password
2. New registrations are automatically set to "User" role
3. Only admins can create Admin/Manager accounts through the user management panel

### Login
1. Use one of the seeded accounts or register a new one
2. JWT token is stored in localStorage
3. Token expires after 7 days

### User Management
- **All Users**: Can view the user list (when logged in)
- **All Users**: Can create new "User" role accounts
- **Admins Only**: Can create Admin/Manager role accounts
- **Admins Only**: Can change user roles to Admin/Manager
- **All Users**: Cannot delete their own account

### Role Restrictions
- Self-registration always creates "User" role
- Only admins can:
  - Create Admin accounts
  - Create Manager accounts
  - Change roles to Admin/Manager

---

## 🔒 Security Features

1. **Password Hashing**: Passwords hashed with bcrypt (10 rounds)
2. **JWT Tokens**: Secure token-based authentication
3. **Protected API Routes**: All user CRUD operations require authentication
4. **Role Validation**: Backend validates role restrictions
5. **No Password Leaks**: Passwords never sent in API responses
6. **Active User Check**: Inactive users cannot login

---

## 🎨 What Was Added

### Backend (`server/`)
- `middleware/auth.js` - Authentication & authorization middleware
- Auth routes (login, register, me) in `server/index.js`
- Protected CRUD routes with role-based restrictions
- Password hashing with bcryptjs

### Frontend (`src/`)
- `context/AuthContext.jsx` - Authentication state management
- `components/Login.jsx` - Login page
- `components/Register.jsx` - Registration page
- `components/UserManagement.jsx` - Protected dashboard
- `components/Auth.css` - Beautiful auth page styling
- `api/auth.js` - Auth API client
- Updated `api/users.js` - Added JWT token headers

### Database
- Added `password` field to User model
- Updated seed file with hashed passwords

---

## 🐛 Troubleshooting

### "Permission denied for schema public"
- Follow Step 1 above to fix PostgreSQL permissions

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run prisma:generate
```

### "Invalid or expired token"
- Clear localStorage and login again
- Token might have expired (7 days)

### Can't create Admin accounts
- Make sure you're logged in as an Admin
- Check the role restrictions in the UI

---

## 🔄 Next Steps

You can now:
1. Run the migration to update your database
2. Seed the database with test users
3. Start using the authentication system!

**Remember**: The first time you run this, you'll need to either:
- Use the seeded admin account (`admin@example.com` / `admin123`)
- Register as a User, then manually update the database to make yourself an Admin

Enjoy your secure CRUD Admin Panel! 🎉



