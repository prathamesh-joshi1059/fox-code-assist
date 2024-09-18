import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetOrdersByDayReqDTO {
  @ApiProperty({ type: [String], example: ['MEL'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Matches(/^...$/, { each: true, message: 'Branches must have a length of 3' })
  branches: string[];

  @ApiProperty({ type: String, example: '2021-12-12' })
  @IsString()
  @IsNotEmpty()
  @IsDateString({ strict: true }, { message: 'date must be in the format YYYY-MM-DD' })
  date: string;
}