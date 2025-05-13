import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Evaluations')
@Controller('evaluations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new evaluation' })
  @ApiResponse({ status: 201, description: 'Evaluation created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationService.create(createEvaluationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all evaluations' })
  @ApiResponse({ status: 200, description: 'Return all evaluations' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query('callId') callId?: string) {
    if (callId) {
      return this.evaluationService.findByCall(callId);
    }
    return this.evaluationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evaluation by id' })
  @ApiResponse({ status: 200, description: 'Return evaluation by id' })
  @ApiResponse({ status: 404, description: 'Evaluation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.evaluationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update evaluation' })
  @ApiResponse({ status: 200, description: 'Evaluation updated successfully' })
  @ApiResponse({ status: 404, description: 'Evaluation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateEvaluationDto: UpdateEvaluationDto) {
    return this.evaluationService.update(id, updateEvaluationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete evaluation' })
  @ApiResponse({ status: 200, description: 'Evaluation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Evaluation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.evaluationService.remove(id);
  }
} 