import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleType } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getTotalUsers() {
    return this.prisma.client.user.count();
  }

  async getTotalAgents() {
    return this.prisma.client.agent.count();
  }

  async getTotalCalls() {
    return this.prisma.client.call.count();
  }

  async getTotalEvaluations() {
    return this.prisma.client.evaluation.count();
  }

  async getTotalCompanies() {
    return this.prisma.client.company.count();
  }

  async getStats(userRole: string) {
    console.log(userRole);
    const stats: any = {};

    // Admin can see all stats
    if (userRole.toLocaleUpperCase() === RoleType.ADMIN) {
      stats.totalUsers = await this.getTotalUsers();
      stats.totalAgents = await this.getTotalAgents();
      stats.totalCalls = await this.getTotalCalls();
      stats.totalEvaluations = await this.getTotalEvaluations();
      stats.totalCompanies = await this.getTotalCompanies();
    } 
    // User can see agents, calls, and evaluations
    else if (userRole.toLocaleUpperCase() === RoleType.USER) {
      stats.totalAgents = await this.getTotalAgents();
      stats.totalCalls = await this.getTotalCalls();
      stats.totalEvaluations = await this.getTotalEvaluations();
    }
    // Evaluator can see calls and evaluations
    else if (userRole.toLocaleUpperCase() === RoleType.EVALUATOR) {
      stats.totalCalls = await this.getTotalCalls();
      stats.totalEvaluations = await this.getTotalEvaluations();
    }

    return stats;
  }
} 