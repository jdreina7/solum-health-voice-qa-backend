import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { google } from 'googleapis';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async importFromExcel(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return this.prisma.client.question.createMany({
      data: data.map((row: any) => ({
        question: row.question,
        answer: row.answer,
      })),
    });
  }

  async importFromGoogleSheets(sheetId: string, sheetName: string) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in sheet');
    }

    const [headers, ...data] = rows;
    const questions = data.map((row: any[]) => ({
      question: row[headers.indexOf('question')],
      answer: row[headers.indexOf('answer')],
    }));

    return this.prisma.client.question.createMany({
      data: questions,
    });
  }
} 