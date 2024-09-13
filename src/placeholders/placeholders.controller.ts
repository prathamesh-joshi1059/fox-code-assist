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

  // Creates a new placeholder
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
  ): Promise<ResponseDTO<Array<CreatePlaceholderRespDTO | Error>>> {
    try {
      const placeholderData: CreatePlaceholderRespDTO | Error =
        await this.placeholdersService.createPlaceholder(body);

      const placeholderResponse: ResponseDTO<
        Array<CreatePlaceholderRespDTO | Error>
      > = {
        status: 'Success',
        statusCode: 1000,
        message: 'Placeholder Created',
        data: [placeholderData],
      };

      return placeholderResponse;
    } catch (error) {
      const errorResponse = {
        status: 'Fail',
        statusCode: 1005,
        message: 'Error creating placeholder',
        data: [error.message],
      };

      return errorResponse;
    }
  }

  // Updates an existing placeholder
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
  ): Promise<ResponseDTO<Array<UpdatePlaceholderRespDTO | Error>>> {
    try {
      const placeholderData = await this.placeholdersService.updatePlaceholder(
        orderId,
        updatePlaceholderDto,
      );
      const placeholderResponse: ResponseDTO<
        Array<UpdatePlaceholderRespDTO | Error>
      > = {
        status: 'Success',
        statusCode: 1000,
        message: 'Placeholder Updated',
        data: [placeholderData],
      };
      return placeholderResponse;
    } catch (error) {
      const errorResponse = {
        status: 'Fail',
        statusCode: 1006,
        message: 'Error updating placeholder',
        data: [error.message],
      };
      return errorResponse;
    }
  }

  // Deletes a placeholder
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
  ): Promise<ResponseDTO<Array<string | Error>>> {
    try {
      const collection = 'placeholder';
      const message = await this.placeholdersService.deletePlaceholder(
        collection,
        orderId,
      );
      const placeholderResponse: ResponseDTO<Array<string | Error>> = {
        status: 'Success',
        statusCode: 1000,
        message: typeof message === 'string' ? message : message.message,
        data: [message],
      };
      return placeholderResponse;
    } catch (error) {
      const errorResponse = {
        status: 'Fail',
        statusCode: 1010,
        message: 'Error deleting placeholder',
        data: [error.message],
      };
      return errorResponse;
    }
  }
}
