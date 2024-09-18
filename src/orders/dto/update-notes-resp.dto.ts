import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotesRespDTO {
  @ApiProperty()
  message: string = '';
}