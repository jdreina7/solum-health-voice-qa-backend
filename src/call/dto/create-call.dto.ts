import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsInt, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCallDto {
  @ApiProperty({
    description: 'Call ID',
    example: 'call-123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Agent ID',
    example: 'agent-123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @ApiProperty({
    description: 'Call start time',
    example: '2024-03-20T10:00:00Z',
    required: true
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    description: 'Call end time',
    example: '2024-03-20T10:30:00Z',
    required: false
  })
  @IsDate()
  @IsOptional()
  endTime?: Date;

  @ApiProperty({
    description: 'Call duration in seconds',
    example: 1800,
    required: false
  })
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  endedReason: string;

  @ApiProperty({
    description: 'Call recording URL',
    example: 'https://storage.example.com/calls/call-123.mp3',
    required: false
  })
  @IsUrl()
  @IsNotEmpty()
  recordingUrl: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  outcome?: string;
} 