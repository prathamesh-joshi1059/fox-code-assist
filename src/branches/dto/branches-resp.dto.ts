import { ApiProperty } from '@nestjs/swagger';

export class BranchRespDTO {
  @ApiProperty()
  area!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  regionName!: string;

  @ApiProperty()
  branchName!: string;
}