import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ImportDto {
  @ApiProperty({
    description: 'Google Sheets URL',
    example: 'https://docs.google.com/spreadsheets/d/1234567890/edit',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

@ApiTags('Import')
@Controller('import')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('sheets')
  @ApiOperation({ summary: 'Import data from Google Sheets' })
  @ApiResponse({ status: 200, description: 'Data imported successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async importFromSheets(@Body() importDto: ImportDto) {
    return this.importService.importFromGoogleSheets(importDto.url);
  }
} 