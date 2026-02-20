import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@carrelay.co.il';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456!';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('✅ Admin user already exists');
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      name: 'מנהל מערכת',
      email: adminEmail,
      phone: '0500000000',
      passwordHash,
      role: 'ADMIN',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log(`✅ Admin user created: ${adminEmail}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
