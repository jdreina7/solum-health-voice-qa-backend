import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    return this.prisma.client.agent.create({
      data: createAgentDto,
      include: {
        company: true,
      },
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.client.agent.count(),
      this.prisma.client.agent.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          company: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.client.agent.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
  }

  async update(id: string, updateAgentDto: UpdateAgentDto) {
    return this.prisma.client.agent.update({
      where: { id },
      data: updateAgentDto,
      include: {
        company: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.client.agent.delete({
      where: { id },
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.client.agent.findMany({
      where: { companyId },
      include: {
        company: true,
      },
    });
  }
} 