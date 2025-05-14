import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../login/roles.decorator';
import { UserRole } from '../login/roles.enum';
import { LoginGuard } from '../login/login.guard';
import { RolesGuard } from '../login/roles.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Calls')
@Controller('calls')
@UseGuards(LoginGuard, RolesGuard)
@Roles(UserRole.USER, UserRole.EVALUATOR, UserRole.ADMIN)
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new call' })
  @ApiResponse({ status: 201, description: 'Call created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCallDto: CreateCallDto) {
    return this.callService.create(createCallDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calls' })
  @ApiResponse({ status: 200, description: 'Return all calls' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.callService.findAll(paginationDto);
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Get calls by agent' })
  @ApiResponse({ status: 200, description: 'Return calls by agent' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  findByAgent(
    @Param('agentId') agentId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.callService.findByAgent(agentId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get call by id' })
  @ApiResponse({ status: 200, description: 'Return call by id' })
  @ApiResponse({ status: 404, description: 'Call not found' })
  findOne(@Param('id') id: string) {
    return this.callService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update call' })
  @ApiResponse({ status: 200, description: 'Call updated successfully' })
  @ApiResponse({ status: 404, description: 'Call not found' })
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callService.update(id, updateCallDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete call' })
  @ApiResponse({ status: 200, description: 'Call deleted successfully' })
  @ApiResponse({ status: 404, description: 'Call not found' })
  remove(@Param('id') id: string) {
    return this.callService.remove(id);
  }
} 