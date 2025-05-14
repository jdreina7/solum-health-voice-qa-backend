import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../roles/roles.service';
import { RoleType } from '../roles/role-type.enum';
import * as bcrypt from 'bcrypt';
import type { User } from '../../prisma/generated/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
  ) {}

  async create(data: { email: string; password: string; name: string; role: RoleType }): Promise<User> {
    // Obtener el rol especificado
    const role = await this.rolesService.findByName(data.role);
    if (!role) {
      throw new Error('Role not found');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear el usuario
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        roleId: role.id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { role: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        role: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
} 