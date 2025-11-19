@echo off
echo ========================================
echo Setting up Local Development Environment
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo Error generating Prisma Client!
    pause
    exit /b 1
)
echo.

echo Step 2: Running Database Migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo Error running migrations!
    echo.
    echo Make sure your .env file has:
    echo DATABASE_URL="file:./dev.db"
    echo.
    pause
    exit /b 1
)
echo.

echo Step 3: Seeding Database...
call npx prisma db seed
echo.

echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: npm run server:dev
echo 2. Start frontend: npm run dev
echo 3. Visit http://localhost:5173
echo.
pause

