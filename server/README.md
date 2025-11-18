# Backend Server

Express.js server with Prisma ORM for user management.

## API Endpoints

### Health Check
```
GET /api/health
```

Returns server status.

### Users

**Get all users**
```
GET /api/users
```

**Get user by ID**
```
GET /api/users/:id
```

**Create user**
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "status": "Active"
}
```

**Update user**
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "status": "Inactive"
}
```

**Delete user**
```
DELETE /api/users/:id
```

## Error Handling

All endpoints return JSON with error messages:

```json
{
  "error": "Error message here"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Server Error

## Database Connection

The server uses Prisma Client to connect to the database.

Connection string is set in `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/user_management"
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run server:dev
```

Production mode:
```bash
npm run server
```

## Environment Variables

- `DATABASE_URL`: Database connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## Graceful Shutdown

The server handles SIGINT and SIGTERM signals to:
1. Close database connection
2. Finish pending requests
3. Exit cleanly

