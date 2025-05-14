import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ImportDto } from './dto/import.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../login/roles.decorator';
import { UserRole } from '../login/roles.enum';

@ApiTags('import')
@Controller('import')
@Roles(UserRole.ADMIN)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import data from Excel file' })
  @ApiResponse({ status: 200, description: 'Data imported successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    return this.importService.importFromExcel(file);
  }

  @Post('google-sheets')
  @ApiOperation({ summary: 'Import data from Google Sheets' })
  @ApiResponse({ status: 200, description: 'Data imported successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async importFromGoogleSheets(@Body() importDto: ImportDto) {
    // Extraer el ID de la hoja y el nombre de la hoja de la URL
    const sheetId = this.extractSheetId(importDto.url);
    const sheetName = this.extractSheetName(importDto.url) || 'Sheet1'; // Por defecto 'Sheet1' si no se especifica

    return this.importService.importFromGoogleSheets(sheetId, sheetName);
  }

  private extractSheetId(url: string): string {
    // La URL de Google Sheets tiene el formato: https://docs.google.com/spreadsheets/d/{sheetId}/edit#gid={gid}
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid Google Sheets URL');
    }
    return match[1];
  }

  private extractSheetName(url: string): string | null {
    // La URL puede incluir el nombre de la hoja como parámetro: .../edit#gid={gid}&sheet={sheetName}
    const match = url.match(/[?&]sheet=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
} 