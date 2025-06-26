import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const plainPassword = 'password'; // Use a more secure password in a real application

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  console.log(`Creating admin user...`);
  
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  console.log(`Admin user created successfully:`);
  console.log({ id: admin.id, username: admin.username });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 