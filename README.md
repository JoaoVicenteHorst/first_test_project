# CRUD Admin Panel with Prisma Backend

A full-stack CRUD admin panel with a React frontend and Express + Prisma backend for managing users.

## Features

### Frontend
- ✅ **Create** new users (Admin only)
- ✅ **Read** and display user data in beautiful card layout
- ✅ **Update** existing users (role-based permissions)
- ✅ **Delete** users with confirmation (role-based permissions)
- 🔐 **Role-based visibility** - Users see only their role, Managers see Managers & Users, Admins see everyone
- 🎴 **Card-based interface** - Users organized by role in separate sections
- 🎨 Modern and responsive UI
- ⚡ Lightning fast with Vite
- 📱 Mobile-friendly design
- 🔄 Loading states and error handling

### Backend
- 🚀 RESTful API with Express.js
- 🗄️ Database management with Prisma ORM
- 🔒 JWT-based authentication with role-based access control
- 🔍 Data validation and error handling
- 📊 PostgreSQL database (configurable)
- 🌱 Database seeding with initial data
- 🛡️ Role-based query filtering

## Tech Stack

### Frontend
- React 18
- Vite 5
- CSS3 with modern features

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (or SQLite for development)

## Data Structure

The application manages users with the following fields:
- **ID**: Unique identifier (auto-increment)
- **Name**: User's full name
- **Email**: User's email address (unique)
- **Role**: User role (Admin, Manager, User)
- **Status**: Account status (Active, Inactive)
- **CreatedAt**: Timestamp of creation
- **UpdatedAt**: Timestamp of last update

## Role-Based Access Control

### Visibility Rules
The application implements role-based visibility to control which users can see which accounts:

| Your Role | Can See | Description |
|-----------|---------|-------------|
| **User** | Users only | Can only view other User role accounts |
| **Manager** | Managers & Users | Can view Manager and User role accounts |
| **Admin** | Everyone | Can view all accounts (Admin, Manager, and User) |

### Permission Rules

| Action | User | Manager | Admin |
|--------|------|---------|-------|
| **View users** | ✅ Users only | ✅ Managers & Users | ✅ Everyone |
| **Create users** | ❌ | ❌ | ✅ |
| **Edit own account** | ✅ Email & password only | ✅ All fields | ✅ All fields |
| **Edit other users** | ❌ | ✅ User role only | ✅ All users |
| **Delete own account** | ✅ | ✅ | ❌ |
| **Delete other users** | ❌ | ❌ | ✅ (except self) |
| **Set Admin role** | ❌ | ❌ | ✅ |
| **Set Manager role** | ❌ | ❌ | ✅ |

### Card-Based Interface
Users are organized into separate sections by role:
- **Administrators** section (if visible to your role)
- **Managers** section (if visible to your role)
- **Users** section (always visible to authenticated users)

Each card displays:
- User avatar (first letter of name)
- Full name and email
- User ID and status badge
- Action buttons (Edit/Delete) based on your permissions

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL installed and running (or use SQLite)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended for Production)

1. Create a PostgreSQL database:
```bash
createdb user_management
```

2. Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/user_management?schema=public"
PORT=5000
```

Replace `user`, `password`, and database details with your PostgreSQL credentials.

#### Option B: SQLite (Easy for Development)

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Create a `.env` file:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
```

### 3. Initialize Prisma and Database

Run the following commands to set up your database:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed
```

Or use the quick setup command:
```bash
npm run setup
```

### 4. Run the Application

Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
npm run server
# or for auto-reload during development
npm run server:dev
```

The server will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Available Scripts

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run server` - Start Express server
- `npm run server:dev` - Start server with nodemon (auto-reload)

### Prisma
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and run migrations
- `npm run prisma:migrate:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed database with initial data
- `npm run prisma:reset` - Reset database and re-seed

### Quick Setup
- `npm run setup` - Install dependencies, generate Prisma Client, run migrations, and seed database

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Example API Requests

**Create User:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "status": "Active"
  }'
```

**Get All Users:**
```bash
curl http://localhost:5000/api/users
```

**Update User:**
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "status": "Inactive"
  }'
```

**Delete User:**
```bash
curl -X DELETE http://localhost:5000/api/users/1
```

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Prisma schema definition
│   └── seed.js            # Database seeding script
├── server/
│   └── index.js           # Express server and API routes
├── src/
│   ├── api/
│   │   └── users.js       # Frontend API client
│   ├── App.jsx            # Main React component
│   ├── App.css            # Styles
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (create this)
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Usage

1. **Login**: Sign in with your credentials (role determines what you can see and do)
2. **View Users**: Users are displayed in card format, organized by role sections
3. **Add User**: Click the "Add New User" button to open the creation modal (Admin only)
4. **Edit User**: Click the "Edit" button on any card to edit that user (based on permissions)
5. **Delete User**: Click the "Delete" button on any card to delete that user (based on permissions)
6. **View Stats**: See total users and active users count in the toolbar
7. **Retry on Error**: If there's a connection error, click the "Retry" button
8. **Logout**: Click the "Logout" button in the header to sign out

## Database Management

### View Database with Prisma Studio
```bash
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 to view and edit your database.

### Create New Migration
```bash
npx prisma migrate dev --name description_of_changes
```

### Reset Database
```bash
npm run prisma:reset
```

This will:
1. Drop the database
2. Create a new database
3. Run all migrations
4. Seed the database

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/user_management?schema=public"

# Server port (optional, defaults to 5000)
PORT=5000

# Frontend API URL (optional, defaults to http://localhost:5000/api)
VITE_API_URL="http://localhost:5000/api"
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_ctl status`
- Check your DATABASE_URL in `.env`
- Verify database exists: `psql -l`

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Find the process
  netstat -ano | findstr :5000
  # Kill it (Windows)
  taskkill /PID <PID> /F
  ```

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

### Migration Issues
```bash
npm run prisma:reset
```

## Production Deployment

### 1. Set Environment Variables
Set `DATABASE_URL` to your production database URL.

### 2. Build Frontend
```bash
npm run build
```

### 3. Run Migrations
```bash
npm run prisma:migrate:deploy
```

### 4. Start Server
```bash
npm run server
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT


