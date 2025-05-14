import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleType } from './role-type.enum';
import type { Role } from '../../prisma/generated/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: RoleType; description?: string }): Promise<Role> {
    return this.prisma.role.create({
      data,
    });
  }

  async findByName(name: RoleType): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: { name },
    });
  }

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async findOne(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: { name?: RoleType; description?: string }): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Role> {
    return this.prisma.role.delete({
      where: { id },
    });
  }
} 