import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from '../../../src/import/import.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { GoogleSheetsService } from '../../../src/google-sheets/google-sheets.service';
import * as xlsx from 'xlsx';

describe('ImportService', () => {
  let service: ImportService;
  let prismaService: PrismaService;
  let googleSheetsService: GoogleSheetsService;

  const mockPrismaService = {
    question: {
      createMany: jest.fn(),
    },
  };

  const mockGoogleSheetsService = {
    getSheetData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: GoogleSheetsService,
          useValue: mockGoogleSheetsService,
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
    prismaService = module.get<PrismaService>(PrismaService);
    googleSheetsService = module.get<GoogleSheetsService>(GoogleSheetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('importFromExcel', () => {
    it('should import data from Excel file', async () => {
      const mockFile = {
        buffer: Buffer.from('mock excel data'),
        originalname: 'test.xlsx',
      };

      const mockData = [
        { Question: 'What is 2+2?', Answer: '4' },
        { Question: 'What is the capital of France?', Answer: 'Paris' },
      ];

      const mockResult = { count: 2 };

      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };

      jest.spyOn(xlsx, 'read').mockReturnValue(mockWorkbook as any);
      jest.spyOn(xlsx.utils, 'sheet_to_json').mockReturnValue(mockData);
      mockPrismaService.question.createMany.mockResolvedValue(mockResult);

      const result = await service.importFromExcel(mockFile as Express.Multer.File);

      expect(result).toEqual(mockResult);
      expect(xlsx.read).toHaveBeenCalledWith(mockFile.buffer, { type: 'buffer' });
      expect(xlsx.utils.sheet_to_json).toHaveBeenCalled();
      expect(mockPrismaService.question.createMany).toHaveBeenCalledWith({
        data: mockData.map(row => ({
          question: row.Question,
          answer: row.Answer,
        })),
      });
    });

    it('should throw error for invalid Excel format', async () => {
      const mockFile = {
        buffer: Buffer.from('mock excel data'),
        originalname: 'test.txt',
      };

      await expect(service.importFromExcel(mockFile as Express.Multer.File)).rejects.toThrow(
        'Invalid Excel format',
      );
    });

    it('should throw error for invalid data format', async () => {
      const mockFile = {
        buffer: Buffer.from('mock excel data'),
        originalname: 'test.xlsx',
      };

      const invalidData = [
        { WrongColumn: 'What is 2+2?', AnotherColumn: '4' },
      ];

      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };

      jest.spyOn(xlsx, 'read').mockReturnValue(mockWorkbook as any);
      jest.spyOn(xlsx.utils, 'sheet_to_json').mockReturnValue(invalidData);

      await expect(service.importFromExcel(mockFile as Express.Multer.File)).rejects.toThrow(
        'Invalid data format. Required columns: Question, Answer',
      );
    });
  });

  describe('importFromGoogleSheets', () => {
    it('should import data from Google Sheets', async () => {
      const mockData = [
        { Question: 'What is 2+2?', Answer: '4' },
        { Question: 'What is the capital of France?', Answer: 'Paris' },
      ];

      const mockResult = { count: 2 };

      mockGoogleSheetsService.getSheetData.mockResolvedValue(mockData);
      mockPrismaService.question.createMany.mockResolvedValue(mockResult);

      const result = await service.importFromGoogleSheets('sheetId', 'Sheet1');

      expect(result).toEqual(mockResult);
      expect(mockGoogleSheetsService.getSheetData).toHaveBeenCalledWith('sheetId', 'Sheet1');
      expect(mockPrismaService.question.createMany).toHaveBeenCalledWith({
        data: mockData.map(row => ({
          question: row.Question,
          answer: row.Answer,
        })),
      });
    });

    it('should throw error for invalid data format', async () => {
      const invalidData = [
        { WrongColumn: 'What is 2+2?', AnotherColumn: '4' },
      ];

      mockGoogleSheetsService.getSheetData.mockResolvedValue(invalidData);

      await expect(service.importFromGoogleSheets('sheetId', 'Sheet1')).rejects.toThrow(
        'Invalid data format. Required columns: Question, Answer',
      );
    });
  });
}); 