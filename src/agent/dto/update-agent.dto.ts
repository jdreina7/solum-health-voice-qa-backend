import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AgentType, AgentMode } from './create-agent.dto';

export class UpdateAgentDto {
  @ApiProperty({
    description: 'Agent name',
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Agent type',
    enum: AgentType,
    example: AgentType.HUMAN,
    required: false
  })
  @IsEnum(AgentType)
  @IsOptional()
  type?: AgentType;

  @ApiProperty({
    description: 'Agent mode',
    enum: AgentMode,
    example: AgentMode.ACTIVE,
    required: false
  })
  @IsEnum(AgentMode)
  @IsOptional()
  mode?: AgentMode;

  @ApiProperty({
    description: 'Company ID',
    example: 'company-123',
    required: false
  })
  @IsString()
  @IsOptional()
  companyId?: string;
} 