import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class CallService {
  constructor(private prisma: PrismaService) {}

  async create(createCallDto: CreateCallDto) {
    return this.prisma.client.call.create({
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

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.client.call.count(),
      this.prisma.client.call.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          agent: true,
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
    return this.prisma.client.call.findUnique({
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
    return this.prisma.client.call.update({
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
    return this.prisma.client.call.delete({
      where: { id },
    });
  }

  async findByAgent(agentId: string, paginationDto: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.client.call.count({
        where: { agentId },
      }),
      this.prisma.client.call.findMany({
        where: { agentId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          agent: true,
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
} 