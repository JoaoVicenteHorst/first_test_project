import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.user.deleteMany();
  console.log('🗑️  Cleared existing users');

  // Hash password for initial users (password: "admin123")
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create initial users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active'
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'User',
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

  console.log('✅ Created initial users:');
  console.log('  👤 Admin:', admin.email, '(password: admin123)');
  console.log('  👤 User:', user.email, '(password: admin123)');
  console.log('  👤 Manager:', manager.email, '(password: admin123)');
  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

