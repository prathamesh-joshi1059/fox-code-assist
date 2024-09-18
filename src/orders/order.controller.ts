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
    return this.handleOrderDataResponse(
      () => this.orderService.getMonthsOrderData(orderReqDTO.branches, orderReqDTO.yearMonth),
      1000,
      1001,
      'Orders Not Found',
    );
  }

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
    return this.handleOrderDataResponse(
      () => this.orderService.getDaysOrderData(getOrdersByDay.branches, getOrdersByDay.date),
      1000,
      1007,
      'Orders Not Found',
    );
  }

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
    return this.handleUpdateNotesResponse(body);
  }

  private async handleOrderDataResponse(
    fetchOrders: () => Promise<Array<any>>,
    successCode: number,
    errorCode: number,
    notFoundMessage: string,
  ): Promise<ResponseDTO<Array<any>>> {
    try {
      const orders = await fetchOrders();
      return {
        status: 'Success',
        statusCode: successCode,
        message: !orders.length ? notFoundMessage : 'Orders Found',
        data: orders,
      };
    } catch (error) {
      return {
        status: 'Fail',
        statusCode: errorCode,
        message: 'Error occurred while fetching orders',
        data: [error.message],
      };
    }
  }

  private async handleUpdateNotesResponse(
    body: UpdateNotesReqDTO,
  ): Promise<ResponseDTO<Array<UpdateNotesRespDTO | Error>>> {
    try {
      const updateNotes = await this.orderService.updateNotes(body);
      return {
        status: 'Success',
        statusCode: 1000,
        message: updateNotes.message,
        data: [updateNotes],
      };
    } catch (error) {
      return {
        status: 'Fail',
        statusCode: 1009,
        message: 'Error occurred while updating notes',
        data: [error.message],
      };
    }
  }
}