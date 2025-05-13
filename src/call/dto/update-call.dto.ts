import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsInt, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCallDto {
  @ApiProperty({
    description: 'Agent ID',
    example: 'agent-123',
    required: false
  })
  @IsString()
  @IsOptional()
  agentId?: string;

  @ApiProperty({
    description: 'Call start time',
    example: '2024-03-20T10:00:00Z',
    required: false
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startTime?: Date;

  @ApiProperty({
    description: 'Call end time',
    example: '2024-03-20T10:30:00Z',
    required: false
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endTime?: Date;

  @ApiProperty({
    description: 'Call duration in seconds',
    example: 1800,
    required: false
  })
  @IsInt()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Call recording URL',
    example: 'https://storage.example.com/calls/call-123.mp3',
    required: false
  })
  @IsUrl()
  @IsOptional()
  recordingUrl?: string;
} 