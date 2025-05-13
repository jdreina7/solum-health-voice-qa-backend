import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export enum EvaluatorType {
  HUMAN = 'HUMAN',
  AI = 'AI',
}

export class CreateEvaluationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Call ID',
    example: 'call-123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  callId: string;

  @IsEnum(EvaluatorType)
  @IsNotEmpty()
  evaluatorType: EvaluatorType;

  @IsString()
  @IsNotEmpty()
  evaluatorName: string;

  @ApiProperty({
    description: 'Overall score (1-5)',
    example: 4,
    required: true,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsNotEmpty()
  reasoningSentiment: string;

  @IsString()
  @IsNotEmpty()
  reasoningProtocol: string;

  @IsString()
  @IsNotEmpty()
  reasoningOutcome: string;

  @IsBoolean()
  @IsNotEmpty()
  qaCheck: boolean;

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