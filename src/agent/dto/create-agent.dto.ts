import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AgentType {
  HUMAN = 'HUMAN',
  AI = 'AI',
}

export enum AgentMode {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
}

export class CreateAgentDto {
  @ApiProperty({
    description: 'Agent ID',
    example: 'agent-123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Agent name',
    example: 'John Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Agent type',
    enum: AgentType,
    example: AgentType.HUMAN,
    required: true
  })
  @IsEnum(AgentType)
  @IsNotEmpty()
  type: AgentType;

  @ApiProperty({
    description: 'Agent mode',
    enum: AgentMode,
    example: AgentMode.ACTIVE,
    required: true
  })
  @IsEnum(AgentMode)
  @IsNotEmpty()
  mode: AgentMode;

  @ApiProperty({
    description: 'Company ID',
    example: 'company-123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  companyId: string;
} 