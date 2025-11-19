import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FORCE seed (will delete existing data)...');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  WARNING: Force seeding in production!');
    console.log('⚠️  This will DELETE ALL existing users!');
  }

  // Clear existing data
  const deletedCount = await prisma.user.deleteMany();
  console.log(`🗑️  Deleted ${deletedCount.count} existing user(s)`);

  // Hash password for initial users (password: "admin123")
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create initial users
  console.log('📝 Creating initial users...');

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active'
    }
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'Manager',
      status: 'Active'
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'User',
      status: 'Active'
    }
  });

  console.log('\n✅ Force seed completed successfully!');
  console.log('=====================================');
  console.log('📋 Created users (all with password: "admin123"):');
  console.log(`  👑 Admin:   ${admin.email}`);
  console.log(`  👔 Manager: ${manager.email}`);
  console.log(`  👤 User:    ${user.email}`);
  console.log('=====================================');
  console.log('💡 You can now login with any of these accounts\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during force seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

