import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceholderRespDTO {
  @ApiProperty()
  message: string;
  @ApiProperty()
  placeholderId: string;
}
