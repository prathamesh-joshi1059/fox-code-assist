import { ApiProperty } from '@nestjs/swagger';

// Common Response DTO to send response in fixed format
export class ResponseDTO<T> {
  @ApiProperty({ example: 'Success' })
  status: string;
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'Data Fetched Successfully' })
  message: string;
  @ApiProperty({ example: [] })
  data: T;
}
