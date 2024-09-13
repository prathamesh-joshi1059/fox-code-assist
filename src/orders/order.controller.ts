import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetOrdersByMonthReqDTO } from './dto/get-orders-by-month-req.dto';
import { ResponseDTO } from '../common/dto/resp.dto';
import { GetOrdersByMonthRespDTO } from './dto/get-orders-by-month-resp.dto';
import { GetOrdersByDayReqDTO } from './dto/get-orders-by-day-req.dto';
import { getOrdersByDayRespDTO } from './dto/get-orders-by-day-resp.dto';
import { UpdateNotesReqDTO } from './dto/update-notes-req.dto';
import { UpdateNotesRespDTO } from './dto/update-notes-resp.dto';

@ApiTags('Orders')
@Controller('/orders')
@UsePipes(ValidationPipe)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Retrieves order data for specified branches and month
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 1000,
    description: 'Success',
    schema: {
      type: 'object',
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Orders Found',
        data: [{}],
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 1001,
    description: 'Orders not found',
    schema: {
      example: {
        status: 'Fail',
        statusCode: 1001,
        message: 'Error occurred while fetching orders',
        data: ['error message'],
      },
    },
  })
  @Post('month-view')
  @HttpCode(200)
  async getMonthsOrderData(
    @Body(new ValidationPipe({ transform: true }))
    orderReqDTO: GetOrdersByMonthReqDTO,
  ): Promise<ResponseDTO<Array<GetOrdersByMonthRespDTO | Error>>> {
    try {
      const { branches, yearMonth } = orderReqDTO;
      const orders: Array<GetOrdersByMonthRespDTO | Error> =
        await this.orderService.getMonthsOrderData(branches, yearMonth);

      const orderResponse = {
        status: 'Success',
        statusCode: 1000,
        message: !orders.length ? 'Orders Not Found' : 'Orders Found',
        data: orders,
      };
      return orderResponse;
    } catch (error) {
      const errorResponse = {
        status: 'Fail',
        statusCode: 1001,
        message: 'Error occurred while fetching orders',
        data: [error.message],
      };
      return errorResponse;
    }
  }

  // Retrieves order data for specified branches and date
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 1000,
    description: 'Success',
    schema: {
      type: 'object',
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Orders Found',
        data: [{}],
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 1007,
    description: 'Orders not found',
    schema: {
      example: {
        status: 'Fail',
        statusCode: 1007,
        message: 'Error occurred while fetching orders',
        data: ['error message'],
      },
    },
  })
  @Post('day-view')
  @HttpCode(200)
  async getDaysOrderData(
    @Body(new ValidationPipe({ transform: true }))
    getOrdersByDay: GetOrdersByDayReqDTO,
  ): Promise<ResponseDTO<Array<getOrdersByDayRespDTO | Error>>> {
    try {
      const { branches, date } = getOrdersByDay;
      const orders: Array<getOrdersByDayRespDTO | Error> =
        await this.orderService.getDaysOrderData(branches, date);

      const orderResponse = {
        status: 'Success',
        statusCode: 1000,
        message: !orders.length ? 'Orders Not Found' : 'Orders Found',
        data: orders,
      };
      return orderResponse;
    } catch (error) {
      const errorResponse = {
        status: 'Fail',
        statusCode: 1007,
        message: 'Error occurred while fetching orders',
        data: [error.message],
      };
      return errorResponse;
    }
  }

  // Updates notes for specified order
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 1000,
    description: 'Success',
    schema: {
      type: 'object',
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Notes updated successfully',
        data: [{}],
      },
    },
  })
  @ApiTags('Update-Notes')
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 1009,
    description: 'Error occurred while updating notes',
    schema: {
      example: {
        status: 'Fail',
        statusCode: 1009,
        message: 'Error occurred while updating notes',
        data: ['error message'],
      },
    },
  })
  @Post('/update-notes')
  async updateNotes(
    @Body() body: UpdateNotesReqDTO,
  ): Promise<ResponseDTO<Array<UpdateNotesRespDTO | Error>>> {
    try {
      const updateNotes: UpdateNotesRespDTO =
        await this.orderService.updateNotes(body);

      const updateNotesResponse = {
        status: 'Success',
        statusCode: 1000,
        message: `${updateNotes.message}`,
        data: [updateNotes],
      };
      return updateNotesResponse;
    } catch (error) {
      const errorResponse = {
        status: 'Fail',
        statusCode: 1009,
        message: 'Error occurred while updating notes',
        data: [error.message],
      };
      return errorResponse;
    }
  }
}
