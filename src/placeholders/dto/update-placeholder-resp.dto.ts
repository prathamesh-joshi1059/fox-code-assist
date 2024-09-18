import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaceholderRespDTO {
  @ApiProperty()
  message: string;

  @ApiProperty()
  placeholderId: string;
}