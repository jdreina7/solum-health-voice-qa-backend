import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluationDto } from './create-evaluation.dto';

export class UpdateEvaluationDto extends PartialType(CreateEvaluationDto) {
  @ApiProperty({
    description: 'Call ID',
    example: 'call-123',
    required: false
  })
  @IsString()
  @IsOptional()
  callId?: string;

  @ApiProperty({
    description: 'Evaluator ID',
    example: 'user-123',
    required: false
  })
  @IsString()
  @IsOptional()
  evaluatorId?: string;

  @ApiProperty({
    description: 'Overall score (1-5)',
    example: 4,
    required: false,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  score?: number;

  @ApiProperty({
    description: 'Evaluation comments',
    example: 'The agent handled the call professionally and resolved the issue effectively.',
    required: false
  })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({
    description: 'Areas for improvement',
    example: 'Could improve on active listening skills.',
    required: false
  })
  @IsString()
  @IsOptional()
  areasForImprovement?: string;
} 