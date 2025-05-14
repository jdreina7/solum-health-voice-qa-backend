import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { Role, User, Question } from '../../prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Expose models for testing
  get role() {
    return this.role;
  }

  get user() {
    return this.user;
  }

  get question() {
    return this.question;
  }
} 
