import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

interface ExcelRow {
  Question: string;
  Answer: string;
}

@Injectable()
export class GoogleSheetsService {
  private sheets;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async getSheetData(sheetId: string, sheetName: string): Promise<ExcelRow[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!A:B`,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      // Skip header row and convert to objects
      return rows.slice(1).map(row => ({
        Question: row[0] || '',
        Answer: row[1] || '',
      }));
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw new Error('Failed to fetch sheet data');
    }
  }
} 