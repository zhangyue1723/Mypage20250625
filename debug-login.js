const { PrismaClient } = require('./src/generated/prisma');

async function debug() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Debugging Login Issues ===');
    
    // Check environment variables
    console.log('1. Environment Variables:');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'undefined');
    console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Check database connection
    console.log('\n2. Database Connection:');
    await prisma.$connect();
    console.log('   ✓ Database connected successfully');
    
    // Check if users table exists and has data
    console.log('\n3. Users Table:');
    const users = await prisma.user.findMany();
    console.log('   User count:', users.length);
    
    if (users.length > 0) {
      console.log('   Users:');
      users.forEach(user => {
        console.log(`     - ID: ${user.id}, Username: ${user.username}`);
      });
    } else {
      console.log('   ⚠️  No users found in database');
    }
    
    // Test finding admin user
    console.log('\n4. Admin User Check:');
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (adminUser) {
      console.log('   ✓ Admin user found:', { id: adminUser.id, username: adminUser.username });
    } else {
      console.log('   ⚠️  Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debug(); 