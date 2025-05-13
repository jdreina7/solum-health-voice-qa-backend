import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { RoleType } from '../../types/role.type';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User role',
    enum: RoleType,
    example: RoleType.USER,
    required: false
  })
  @IsEnum(RoleType)
  @IsOptional()
  role?: RoleType;
} 