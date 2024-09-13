import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from '../common/dto/resp.dto';
import { BranchRespDTO } from './dto/branches-resp.dto';

@ApiTags('Branches')
@Controller('branches')
@UsePipes(ValidationPipe)
@ApiBearerAuth('Authorization')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  // Retrieves all branches and returns a formatted response
  @Get()
  @ApiResponse({
    status: 1000,
    schema: {
      example: {
        status: 'Status',
        statusCode: 1000,
        message: 'Branches Found',
        data: [{}],
      },
    },
  })
  async getAllBranches(): Promise<ResponseDTO<BranchRespDTO[]>> {
    const branches = await this.branchesService.getAllBranches();
    return {
      status: 'Success',
      statusCode: 1000,
      message: 'Branches Found',
      data: branches,
    };
  }
}
