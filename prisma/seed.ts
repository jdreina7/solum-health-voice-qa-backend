import { PrismaClient, RoleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear roles
  const roles = [
    { name: RoleType.USER, description: 'Regular user' },
    { name: RoleType.EVALUATOR, description: 'Call evaluator' },
    { name: RoleType.ADMIN, description: 'System administrator' },
  ];

  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name }
    });

    if (existingRole) {
      await prisma.role.update({
        where: { id: existingRole.id },
        data: role
      });
    } else {
      await prisma.role.create({
        data: role
      });
    }
  }

  // Crear usuarios admin iniciales
  const adminUsers = [
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      roleId: 'admin',
    },
    {
      email: 'superadmin@example.com',
      password: await bcrypt.hash('superadmin123', 10),
      name: 'Super Admin',
      roleId: 'admin',
    },
  ];

  for (const user of adminUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Roles and admin users initialized successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 