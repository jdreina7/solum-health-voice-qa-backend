import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { RoleType } from '../../types/role.type';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
    required: true
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User role',
    enum: RoleType,
    example: RoleType.USER,
    required: true
  })
  @IsEnum(RoleType)
  role: RoleType;
} 