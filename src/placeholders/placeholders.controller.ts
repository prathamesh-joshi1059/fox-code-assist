import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlaceholdersService } from './placeholders.service';
import { CreatePlaceholderReqDTO } from './dto/create-placeholder-req.dto';
import { ResponseDTO } from 'src/common/dto/resp.dto';
import { UpdatePlaceholderReqDTO } from './dto/update-placeholder-req.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePlaceholderRespDTO } from './dto/create-placeholder-resp.dto';
import { UpdatePlaceholderRespDTO } from './dto/update-placeholder-resp.dto';

@Controller('placeholders')
@ApiTags('Placeholders')
@ApiBearerAuth('Authorization')
@UsePipes(ValidationPipe)
export class PlaceholdersController {
  constructor(private readonly placeholdersService: PlaceholdersService) {}

  @Post()
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Placeholder Created',
        data: [{}],
      },
    },
  })
  @ApiResponse({
    status: 1005,
    description: 'Error creating placeholder',
    schema: {
      type: 'object',
      example: {
        status: 'Fail',
        statusCode: 1005,
        message: 'Error creating placeholder',
        data: ['Error message'],
      },
    },
  })
  async createPlaceholder(
    @Body() body: CreatePlaceholderReqDTO,
  ): Promise<ResponseDTO<CreatePlaceholderRespDTO | Error>> {
    return this.handleResponse(() => this.placeholdersService.createPlaceholder(body), 'Placeholder Created', 1000, 1005, 'Error creating placeholder');
  }

  @Patch('/:orderId')
  @ApiResponse({
    status: 1000,
    schema: {
      type: 'object',
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Placeholder Updated',
        data: [{}],
      },
    },
  })
  @ApiResponse({
    status: 1006,
    schema: {
      type: 'object',
      example: {
        status: 'Fail',
        statusCode: 1006,
        message: 'Error updating Placeholder',
        data: ['Error message'],
      },
    },
  })
  async updatePlaceholder(
    @Param('orderId') orderId: string,
    @Body() updatePlaceholderDto: UpdatePlaceholderReqDTO,
  ): Promise<ResponseDTO<UpdatePlaceholderRespDTO | Error>> {
    return this.handleResponse(() => this.placeholdersService.updatePlaceholder(orderId, updatePlaceholderDto), 'Placeholder Updated', 1000, 1006, 'Error updating placeholder');
  }

  @Delete('/:orderId')
  @ApiResponse({
    status: 1000,
    description: 'Placeholder deleted successfully',
    schema: {
      type: 'object',
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Placeholder deleted',
        data: ['Placeholder with orderId <orderId> deleted successfully'],
      },
    },
  })
  @ApiResponse({
    status: 1010,
    description: 'Error deleting placeholder',
    schema: {
      type: 'object',
      example: {
        status: 'Fail',
        statusCode: 1010,
        message: 'Error deleting placeholder',
        data: ['Error message'],
      },
    },
  })
  async deletePlaceholder(
    @Param('orderId') orderId: string,
  ): Promise<ResponseDTO<string | Error>> {
    return this.handleResponse(() => this.placeholdersService.deletePlaceholder('placeholder', orderId), 'Placeholder deleted', 1000, 1010, 'Error deleting placeholder');
  }

  private async handleResponse<T>(serviceCall: () => Promise<T>, successMessage: string, successCode: number, errorCode: number, errorMessage: string): Promise<ResponseDTO<T | Error>> {
    try {
      const data = await serviceCall();
      return {
        status: 'Success',
        statusCode: successCode,
        message: successMessage,
        data: [data],
      };
    } catch (error) {
      return {
        status: 'Fail',
        statusCode: errorCode,
        message: errorMessage,
        data: [error.message],
      };
    }
  }
}