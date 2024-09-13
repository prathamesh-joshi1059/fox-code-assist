import { ApiProperty } from '@nestjs/swagger';

export class UpdateCalendarDetailsRespDTO {
  @ApiProperty({
    example: [
      {
        calendarName: 'view1',
        branches: ['NYC'],
        isFavorite: true,
        isDefault: false,
      },
      {
        calendarName: 'view2',
        branches: ['MEL'],
        isFavorite: false,
        isDefault: true,
      },
    ],
  })
  calendarList: Array<{
    calendarName: string;
    branches: string[];
    isFavorite: boolean;
    isDefault: boolean;
  }>;
}
