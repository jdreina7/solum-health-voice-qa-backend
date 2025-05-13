import { PrismaClient, RoleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear roles por defecto
  const roles = [
    {
      name: RoleType.USER,
      description: 'Regular user with basic access',
    },
    {
      name: RoleType.EVALUATOR,
      description: 'User with evaluation permissions',
    },
    {
      name: RoleType.ADMIN,
      description: 'Administrator with full access',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.name.toLowerCase() },
      update: {},
      create: {
        id: role.name.toLowerCase(),
        ...role,
      },
    });
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