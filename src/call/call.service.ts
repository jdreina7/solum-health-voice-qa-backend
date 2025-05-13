import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallService {
  constructor(private prisma: PrismaService) {}

  async create(createCallDto: CreateCallDto) {
    return this.prisma.call.create({
      data: createCallDto,
      include: {
        agent: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.call.findMany({
      include: {
        agent: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.call.findUnique({
      where: { id },
      include: {
        agent: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async update(id: string, updateCallDto: UpdateCallDto) {
    return this.prisma.call.update({
      where: { id },
      data: updateCallDto,
      include: {
        agent: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.call.delete({
      where: { id },
    });
  }

  async findByAgent(agentId: string) {
    return this.prisma.call.findMany({
      where: { agentId },
      include: {
        agent: {
          include: {
            company: true,
          },
        },
      },
    });
  }
} 