import { ApiProperty } from '@nestjs/swagger';

export class CreateCalendarViewRespDTO {
  @ApiProperty()
  message: string = '';
}