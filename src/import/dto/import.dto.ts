import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ImportDto {
  @ApiProperty({
    description: 'URL of the Google Sheets document',
    example: 'https://docs.google.com/spreadsheets/d/1234567890/edit#gid=0',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
} 