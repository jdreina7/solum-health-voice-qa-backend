import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { google } from 'googleapis';
import { AgentType, AgentMode, EvaluatorType } from '@prisma/client';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  private async getGoogleSheetsClient() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return google.sheets({ version: 'v4', auth });
  }

  private extractSheetId(url: string): string {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid Google Sheets URL');
    }
    return match[1];
  }

  async importFromGoogleSheets(url: string) {
    const sheetsClient = await this.getGoogleSheetsClient();
    const spreadsheetId = this.extractSheetId(url);
    
    const results = {
      companies: 0,
      agents: 0,
      calls: 0,
      evaluations: 0,
      errors: [] as string[],
    };

    try {
      // Obtener la lista de hojas
      const { data } = await sheetsClient.spreadsheets.get({
        spreadsheetId,
      });

      if (!data.sheets) {
        throw new Error('No sheets found in the spreadsheet');
      }

      // Procesar cada hoja
      for (const sheet of data.sheets) {
        try {
          if (!sheet.properties?.title) {
            continue;
          }

          const sheetName = sheet.properties.title;
          
          // Obtener los datos de la hoja
          const { data: { values } } = await sheetsClient.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:Z`,
          });

          if (!values || values.length < 2) continue;

          const headers = values[0];
          const rows = values.slice(1);

          // Crear la compañía
          const company = await this.prisma.company.create({
            data: {
              id: `company-${sheetName.toLowerCase().replace(/\s+/g, '-')}`,
              name: sheetName,
            },
          });
          results.companies++;

          // Procesar cada fila
          for (const row of rows) {
            try {
              const rowData = this.mapRowToObject(headers, row);

              // Crear o actualizar el agente
              const agentId = rowData['assistant'] || rowData['agent_id'];
              if (agentId) {
                await this.prisma.agent.upsert({
                  where: { id: agentId },
                  create: {
                    id: agentId,
                    name: `Agent ${agentId}`,
                    type: AgentType.AI,
                    mode: AgentMode.ACTIVE,
                    companyId: company.id,
                  },
                  update: {
                    name: `Agent ${agentId}`,
                    companyId: company.id,
                  },
                });
                results.agents++;
              }

              // Crear la llamada
              if (rowData['call_id']) {
                const call = await this.prisma.call.create({
                  data: {
                    id: rowData['call_id'],
                    agentId: agentId,
                    startTime: new Date(rowData['call_start_time']),
                    duration: Math.round(parseFloat(rowData['duration']) || 0),
                    endedReason: rowData['ended_reason'],
                    recordingUrl: rowData['recording_url'],
                    summary: rowData['summary'],
                    outcome: rowData['outcome'] || rowData['call_type_value'],
                  },
                });
                results.calls++;

                // Crear la evaluación si existe
                if (rowData['Reviewer'] || rowData['evaluation']) {
                  await this.prisma.evaluation.create({
                    data: {
                      id: `eval-${rowData['call_id']}`,
                      callId: call.id,
                      evaluatorType: EvaluatorType.HUMAN,
                      evaluatorName: rowData['Reviewer'] || 'Unknown',
                      score: this.calculateScore(rowData),
                      reasoningSentiment: rowData['sentiment_reasoning'] || rowData['Feedback QA'] || '',
                      reasoningProtocol: rowData['protocol_reasoning'] || '',
                      reasoningOutcome: rowData['outcome_reasoning'] || '',
                      qaCheck: rowData['QA Check'] === true || rowData['check'] === 'Done',
                      comments: rowData['Comments Engineer'] || rowData['comments_engineer'],
                    },
                  });
                  results.evaluations++;
                }
              }
            } catch (error) {
              results.errors.push(`Error processing row: ${JSON.stringify(error)}`);
            }
          }
        } catch (error) {
          results.errors.push(`Error processing sheet ${sheet.properties?.title || 'Unknown'}: ${error.message}`);
        }
      }
    } catch (error) {
      results.errors.push(`Error accessing Google Sheets: ${error.message}`);
    }

    return results;
  }

  private mapRowToObject(headers: string[], row: any[]): Record<string, any> {
    const result: Record<string, any> = {};
    headers.forEach((header, index) => {
      result[header] = row[index] || null;
    });
    return result;
  }

  private calculateScore(row: Record<string, any>): number {
    if (typeof row['vapi_score'] === 'number') return row['vapi_score'];
    if (typeof row['Vapi QA Score'] === 'number') return row['Vapi QA Score'];
    if (typeof row['protocol_adherence'] === 'number') return row['protocol_adherence'];
    return 0;
  }
} 