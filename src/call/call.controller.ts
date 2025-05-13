import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Calls')
@Controller('calls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new call' })
  @ApiResponse({ status: 201, description: 'Call created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCallDto: CreateCallDto) {
    return this.callService.create(createCallDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calls' })
  @ApiResponse({ status: 200, description: 'Return all calls' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query('agentId') agentId?: string) {
    if (agentId) {
      return this.callService.findByAgent(agentId);
    }
    return this.callService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get call by id' })
  @ApiResponse({ status: 200, description: 'Return call by id' })
  @ApiResponse({ status: 404, description: 'Call not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.callService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update call' })
  @ApiResponse({ status: 200, description: 'Call updated successfully' })
  @ApiResponse({ status: 404, description: 'Call not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateCallDto: UpdateCallDto) {
    return this.callService.update(id, updateCallDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete call' })
  @ApiResponse({ status: 200, description: 'Call deleted successfully' })
  @ApiResponse({ status: 404, description: 'Call not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.callService.remove(id);
  }
} 