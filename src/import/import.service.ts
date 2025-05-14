import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';
import * as xlsx from 'xlsx';

interface ExcelRow {
  Question: string;
  Answer: string;
}

@Injectable()
export class ImportService {
  constructor(
    private prisma: PrismaService,
    private googleSheetsService: GoogleSheetsService,
  ) {}

  async importFromExcel(file: Express.Multer.File) {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new Error('Invalid Excel format');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json<ExcelRow>(worksheet);

    if (!this.validateExcelData(data)) {
      throw new Error('Invalid data format. Required columns: Question, Answer');
    }

    return this.prisma.question.createMany({
      data: data.map(row => ({
        question: row.Question,
        answer: row.Answer,
      })),
    });
  }

  async importFromGoogleSheets(sheetId: string, sheetName: string) {
    const data = await this.googleSheetsService.getSheetData(sheetId, sheetName);

    if (!this.validateExcelData(data)) {
      throw new Error('Invalid data format. Required columns: Question, Answer');
    }

    return this.prisma.question.createMany({
      data: data.map(row => ({
        question: row.Question,
        answer: row.Answer,
      })),
    });
  }

  private validateExcelData(data: ExcelRow[]): boolean {
    if (!data.length) return false;
    return data.every(row => row.Question && row.Answer);
  }
} 