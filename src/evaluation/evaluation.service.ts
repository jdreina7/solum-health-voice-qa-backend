import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async create(createEvaluationDto: CreateEvaluationDto) {
    return this.prisma.client.evaluation.create({
      data: createEvaluationDto,
      include: {
        call: {
          include: {
            agent: true,
          },
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.client.evaluation.count(),
      this.prisma.client.evaluation.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          call: {
            include: {
              agent: true,
            },
          },
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
    return this.prisma.client.evaluation.findUnique({
      where: { id },
      include: {
        call: {
          include: {
            agent: true,
          },
        },
      },
    });
  }

  async update(id: string, updateEvaluationDto: UpdateEvaluationDto) {
    return this.prisma.client.evaluation.update({
      where: { id },
      data: updateEvaluationDto,
      include: {
        call: {
          include: {
            agent: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.client.evaluation.delete({
      where: { id },
    });
  }

  async findByCall(callId: string) {
    return this.prisma.client.evaluation.findMany({
      where: { callId },
    });
  }
} 