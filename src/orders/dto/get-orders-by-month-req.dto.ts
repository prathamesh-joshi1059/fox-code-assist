import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUppercase,
  Matches,
} from 'class-validator';

export class GetOrdersByMonthReqDTO {
  @ApiProperty({ type: [String], example: ['MEL'] })
  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUppercase({ each: true })
  @Matches(/^...$/, { each: true, message: 'Branches must have a length of 3' })
  branches: string[];

  @ApiProperty({ example: '2024-05' })
  @IsString()
  @IsNotEmpty()
  @IsDateString({ strict: true }, { message: 'yearMonth must be in the format YYYY-MM' })
  yearMonth: string;
}