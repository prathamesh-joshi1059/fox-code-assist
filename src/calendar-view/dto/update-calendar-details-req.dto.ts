import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCalendarDetailsReqDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default: 'john.doe@example.com',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: 'my_calendar',
  })
  calendarName: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
  })
  isDefault?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: false,
  })
  isFavorite?: boolean = false;
}