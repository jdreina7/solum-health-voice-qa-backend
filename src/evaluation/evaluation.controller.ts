import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../login/roles.decorator';
import { UserRole } from '../login/roles.enum';
import { LoginGuard } from '../login/login.guard';
import { RolesGuard } from '../login/roles.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Evaluations')
@Controller('evaluations')
@UseGuards(LoginGuard, RolesGuard)
@Roles(UserRole.EVALUATOR, UserRole.ADMIN)
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new evaluation' })
  @ApiResponse({ status: 201, description: 'Evaluation created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationService.create(createEvaluationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all evaluations' })
  @ApiResponse({ status: 200, description: 'Return all evaluations' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.evaluationService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evaluation by id' })
  @ApiResponse({ status: 200, description: 'Return evaluation by id' })
  @ApiResponse({ status: 404, description: 'Evaluation not found' })
  findOne(@Param('id') id: string) {
    return this.evaluationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update evaluation' })
  @ApiResponse({ status: 200, description: 'Evaluation updated successfully' })
  @ApiResponse({ status: 404, description: 'Evaluation not found' })
  update(@Param('id') id: string, @Body() updateEvaluationDto: UpdateEvaluationDto) {
    return this.evaluationService.update(id, updateEvaluationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete evaluation' })
  @ApiResponse({ status: 200, description: 'Evaluation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Evaluation not found' })
  remove(@Param('id') id: string) {
    return this.evaluationService.remove(id);
  }
} 