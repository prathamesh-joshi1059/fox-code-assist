import { ApiProperty } from '@nestjs/swagger';

export class GetCalendarViewRespDTO {
  @ApiProperty({ nullable: true })
  defaultCalendarView?: string;

  @ApiProperty({ type: [Object], nullable: true })
  calendarList?: Array<Object>;

  @ApiProperty({ type: [Object], nullable: true })
  orders?: Array<Object>;
}