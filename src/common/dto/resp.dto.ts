import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO<T> {
  @ApiProperty({ example: 'Success' })
  status: string = 'Success';
  @ApiProperty({ example: 200 })
  statusCode: number = 200;
  @ApiProperty({ example: 'Data Fetched Successfully' })
  message: string = 'Data Fetched Successfully';
  @ApiProperty({ example: [] })
  data: T = {} as T;
}