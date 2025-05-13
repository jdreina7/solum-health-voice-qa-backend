import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    return this.prisma.agent.create({
      data: createAgentDto,
      include: {
        company: true,
      },
    });
  }

  async findAll() {
    return this.prisma.agent.findMany({
      include: {
        company: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.agent.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
  }

  async update(id: string, updateAgentDto: UpdateAgentDto) {
    return this.prisma.agent.update({
      where: { id },
      data: updateAgentDto,
      include: {
        company: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.agent.delete({
      where: { id },
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.agent.findMany({
      where: { companyId },
      include: {
        company: true,
      },
    });
  }
} 