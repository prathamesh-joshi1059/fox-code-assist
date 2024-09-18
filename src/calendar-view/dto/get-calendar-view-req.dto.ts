import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetCalendarViewReqDTO {
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
    default: 'John Doe',
  })
  userName: string;
}