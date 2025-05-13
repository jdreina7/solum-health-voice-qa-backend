import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async create(createEvaluationDto: CreateEvaluationDto) {
    return this.prisma.evaluation.create({
      data: createEvaluationDto,
      include: {
        call: {
          include: {
            agent: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.evaluation.findMany({
      include: {
        call: {
          include: {
            agent: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        call: {
          include: {
            agent: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateEvaluationDto: UpdateEvaluationDto) {
    return this.prisma.evaluation.update({
      where: { id },
      data: updateEvaluationDto,
      include: {
        call: {
          include: {
            agent: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.evaluation.delete({
      where: { id },
    });
  }

  async findByCall(callId: string) {
    return this.prisma.evaluation.findMany({
      where: { callId },
      include: {
        call: {
          include: {
            agent: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }
} 