import { ApiProperty } from '@nestjs/swagger';

export class GetCalendarViewRespDTO {
  @ApiProperty()
  defaultCalendarView: string | null;
  @ApiProperty()
  calendarList: Array<Object | null>;
  @ApiProperty()
  orders: Array<Object | null>;
}
