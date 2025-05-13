import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleType } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(data: { name: RoleType; description?: string }) {
    return this.prisma.role.create({ data });
  }

  async update(id: string, data: { name?: RoleType; description?: string }) {
    return this.prisma.role.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }
} 