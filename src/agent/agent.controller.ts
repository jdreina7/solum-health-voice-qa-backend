import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../login/roles.decorator';
import { UserRole } from '../login/roles.enum';
import { LoginGuard } from '../login/login.guard';
import { RolesGuard } from '../login/roles.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Agents')
@Controller('agents')
@UseGuards(LoginGuard, RolesGuard)
@Roles(UserRole.USER, UserRole.ADMIN)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentService.create(createAgentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({ status: 200, description: 'Return all agents' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.agentService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by id' })
  @ApiResponse({ status: 200, description: 'Return agent by id' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  findOne(@Param('id') id: string) {
    return this.agentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update agent' })
  @ApiResponse({ status: 200, description: 'Agent updated successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete agent' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  remove(@Param('id') id: string) {
    return this.agentService.remove(id);
  }
} 