import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company ID',
    example: 'company-123',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corp',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Company description',
    example: 'A leading technology company',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Main St, City, Country',
    required: false
  })
  @IsString()
  @IsOptional()
  address?: string;
} 