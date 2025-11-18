import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, isAdmin, canCreatePrivilegedAccount } from './middleware/auth.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==================== AUTH ROUTES ====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // New users can only register as "User" role (not Admin or Manager)
    // Admins must create Admin/Manager accounts through the user management panel
    const userRole = role || 'User';
    if (userRole !== 'User') {
      return res.status(403).json({ 
        error: 'Cannot self-register as Admin or Manager. Please register as User.' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        status: 'Active'
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({ 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (user.status !== 'Active') {
      return res.status(403).json({ error: 'Account is inactive. Please contact an administrator.' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ==================== USER CRUD ROUTES (Protected) ====================

// Get all users (Protected - requires authentication)
// Role-based filtering:
// - Users: can see only other users (role === 'User')
// - Managers: can see managers and users
// - Admins: can see everyone
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const currentUserRole = req.user.role;
    let whereClause = {};

    // Apply role-based filtering
    if (currentUserRole === 'User') {
      // Users can only see other users
      whereClause = { role: 'User' };
    } else if (currentUserRole === 'Manager') {
      // Managers can see managers and users
      whereClause = { 
        role: { in: ['Manager', 'User'] } 
      };
    }
    // Admins can see everyone (no filter needed)

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
        // Exclude password from response
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user (Protected)
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
        // Exclude password
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user (Protected - Admin only)
app.post('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Only admins can create Admin role accounts (double-check even though route is admin-only)
    if (role === 'Admin' && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        error: 'Only administrators can create Admin role accounts.' 
      });
    }
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'User',
        status: status || 'Active'
      }
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (Protected - Role-based edit permissions)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;
    const targetUserId = parseInt(id);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });
    
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Authorization logic based on role:
    // - Admin: Can edit any user (all fields)
    // - Manager: Can edit their own account and User role accounts (all fields)
    // - User: Can only edit their own email and password
    
    const isEditingOwnAccount = targetUserId === req.user.id;
    const targetIsUser = existingUser.role === 'User';
    
    if (req.user.role === 'Admin') {
      // Admin can edit anyone
    } else if (req.user.role === 'Manager') {
      // Manager can edit themselves or User role accounts
      if (!isEditingOwnAccount && !targetIsUser) {
        return res.status(403).json({ 
          error: 'Managers can only edit their own account and User role accounts.' 
        });
      }
    } else if (req.user.role === 'User') {
      // Users can only edit their own account
      if (!isEditingOwnAccount) {
        return res.status(403).json({ 
          error: 'You can only edit your own account.' 
        });
      }
    }

    // Prepare update data based on user role
    const updateData = {};

    if (req.user.role === 'User' && isEditingOwnAccount) {
      // Users can only update email and password
      if (email) updateData.email = email;
      if (password) {
        const bcrypt = await import('bcryptjs');
        updateData.password = await bcrypt.default.hash(password, 10);
      }
    } else {
      // Admin and Manager can update all fields (when authorized)
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) {
        const bcrypt = await import('bcryptjs');
        updateData.password = await bcrypt.default.hash(password, 10);
      }
      if (role) updateData.role = role;
      if (status) updateData.status = status;
    }

    // Only admins can set or change roles to Admin
    if (role && role === 'Admin' && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        error: 'Only administrators can set or change roles to Admin.' 
      });
    }

    // Only admins can change roles to Manager
    if (role && role === 'Manager' && role !== existingUser.role && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        error: 'Only administrators can change roles to Manager.' 
      });
    }
    
    // Check if email is being changed and if new email already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const user = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
        // Exclude password
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (Protected - Admin can delete others, users can delete own account)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const targetUserId = parseInt(id);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });
    
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Authorization logic:
    // - Admins can delete any user EXCEPT themselves
    // - Non-admins can only delete their own account
    if (req.user.role === 'Admin') {
      // Admin trying to delete themselves
      if (targetUserId === req.user.id) {
        return res.status(403).json({ 
          error: 'Admins cannot delete their own account.' 
        });
      }
      // Admin can delete any other user
    } else {
      // Non-admin can only delete their own account
      if (targetUserId !== req.user.id) {
        return res.status(403).json({ 
          error: 'You can only delete your own account. Only administrators can delete other users.' 
        });
      }
    }
    
    await prisma.user.delete({
      where: { id: targetUserId }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

