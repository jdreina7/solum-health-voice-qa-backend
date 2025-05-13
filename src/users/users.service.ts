import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; password: string; name: string; role: RoleType }) {
    // Obtener el rol especificado
    const role = await this.prisma.role.findFirst({
      where: { name: data.role },
    });

    if (!role) {
      throw new Error(`Role ${data.role} not found`);
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
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

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
      },
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