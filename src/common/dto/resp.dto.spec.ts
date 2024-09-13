import { ResponseDTO } from './resp.dto';

describe('ResponseDTO', () => {
  it('should have the correct properties', () => {
    const dto = new ResponseDTO<string[]>();
    dto.status = 'Success';
    dto.statusCode = 1000;
    dto.message = 'Operation successful';
    dto.data = ['data1', 'data2'];

    expect(dto).toHaveProperty('status', 'Success');
    expect(dto).toHaveProperty('statusCode', 1000);
    expect(dto).toHaveProperty('message', 'Operation successful');
    expect(dto).toHaveProperty('data', ['data1', 'data2']);
  });
});
