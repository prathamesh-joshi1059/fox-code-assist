import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCalendarViewReqDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true, example: 'john.doe@example.com' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: "John's Calendar" })
  calendarName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ type: [String], required: true, example: ['South'] })
  regions: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ type: [String], required: true, example: ['Florida'] })
  areas: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ type: [String], required: true, example: ['MEL'] })
  branches: string[];

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  isDefault: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  isFavorite: boolean;
}