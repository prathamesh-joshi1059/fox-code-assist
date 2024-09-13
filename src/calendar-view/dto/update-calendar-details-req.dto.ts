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

  @ApiProperty({
    default: 'my_calendar',
  })
  @IsString()
  @IsNotEmpty()
  calendarName: string;

  @ApiProperty({
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  @ApiProperty({
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;
}
