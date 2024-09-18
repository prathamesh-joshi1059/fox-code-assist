import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNotesReqDTO {
  @ApiProperty({ required: true, example: 'W-109933' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ required: true, example: 'Test Notes' })
  @IsString()
  notes?: string = '';
}