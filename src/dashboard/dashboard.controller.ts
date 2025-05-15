import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { LoginGuard } from '../login/login.guard';
import { RolesGuard } from '../login/roles.guard';
import { Roles } from '../login/roles.decorator';
import { UserRole } from '../login/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(LoginGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.EVALUATOR)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics based on user role',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', description: 'Total number of users (Admin only)' },
        totalAgents: { type: 'number', description: 'Total number of agents (Admin and User)' },
        totalCalls: { type: 'number', description: 'Total number of calls (All roles)' },
        totalEvaluations: { type: 'number', description: 'Total number of evaluations (All roles)' },
        totalCompanies: { type: 'number', description: 'Total number of companies (Admin only)' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getStats(@Request() req) {
    return this.dashboardService.getStats(req.user.roleId);
  }
} 