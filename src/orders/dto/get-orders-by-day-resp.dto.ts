import { ApiProperty } from '@nestjs/swagger';

export class getOrdersByDayRespDTO {
  @ApiProperty()
  projectType: string;

  @ApiProperty()
  clientName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  fences: Array<{
    noOfUnits: number;
    fenceType: string;
  }>;

  @ApiProperty()
  workType: string;

  @ApiProperty()
  driver: string;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  url: string | null;

  @ApiProperty()
  isPlaceholder: boolean;
}
