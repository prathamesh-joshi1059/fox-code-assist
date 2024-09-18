import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { CalendarViewService } from './calendar-view.service';
import { GetCalendarViewReqDTO } from './dto/get-calendar-view-req.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCalendarViewReqDTO } from './dto/create-calendar-view-req.dto';
import { ResponseDTO } from '../common/dto/resp.dto';
import { UpdateCalendarDetailsReqDTO } from './dto/update-calendar-details-req.dto';

@ApiTags('Calendar-View')
@Controller('/calendar-view')
@UsePipes(ValidationPipe)
export class CalendarViewController {
  constructor(private readonly calendarViewService: CalendarViewService) {}

  @Post('/default')
  @ApiBearerAuth('Authorization')
  @HttpCode(200)
  @ApiResponse({
    status: 1000,
    schema: {
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Default Calendar View Found',
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 1002,
    content: {
      'application/json': {
        example: {
          status: 'Fail',
          statusCode: 1002,
          message: 'Default Calendar View Not Found',
          data: [],
        },
      },
    },
  })
  async getCalendarView(
    @Body() body: GetCalendarViewReqDTO,
  ): Promise<ResponseDTO<null | any[]>> {
    try {
      const calendarViewData = await this.calendarViewService.getCalendarView(body);
      const message = calendarViewData?.defaultCalendarView
        ? 'Fetched Default Calendar'
        : 'Default Calendar View Not Found';
      const data = calendarViewData ? [calendarViewData] : [];
      return {
        status: 'Success',
        statusCode: 1000,
        message,
        data,
      };
    } catch (error) {
      return {
        status: 'Fail',
        statusCode: 1002,
        message: 'Error occurred while fetching default calendar view',
        data: [error.message],
      };
    }
  }

  @Post('/create-calendar-view')
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 1000,
    schema: {
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Calendar view created',
        data: [{}],
      },
    },
  })
  @ApiResponse({
    status: 1003,
    content: {
      'application/json': {
        example: {
          status: 'Fail',
          statusCode: 1003,
          message: 'Error occurred while creating calendar view',
          data: ['error message'],
        },
      },
    },
  })
  async createCalendarView(
    @Body() body: CreateCalendarViewReqDTO,
  ): Promise<ResponseDTO<any[]>> {
    try {
      const view = await this.calendarViewService.createCalendarView(body);
      return {
        status: 'Success',
        statusCode: 1000,
        message: 'Calendar view created',
        data: [view],
      };
    } catch (error) {
      return {
        status: 'Fail',
        statusCode: 1003,
        message: 'Calendar view Creation Failed',
        data: [error.message],
      };
    }
  }

  @Post('/update-calendar-details')
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 1000,
    schema: {
      example: {
        status: 'Success',
        statusCode: 1000,
        message: 'Calendar Updated Successfully',
        data: [{}],
      },
    },
  })
  @ApiResponse({
    status: 1008,
    content: {
      'application/json': {
        example: {
          status: 'Fail',
          statusCode: 1008,
          message: 'Error occurred while updating calendar details',
          data: ['error message'],
        },
      },
    },
  })
  async updateCalendarDetails(
    @Body() body: UpdateCalendarDetailsReqDTO,
  ): Promise<ResponseDTO<any[]>> {
    try {
      const updatedView = await this.calendarViewService.updateCalendarDetails(body);
      return {
        status: 'Success',
        statusCode: 1000,
        message: 'Calendar Updated Successfully',
        data: [updatedView],
      };
    } catch (error) {
      return {
        status: 'Fail',
        statusCode: 1008,
        message: 'Error occurred while updating calendar details',
        data: [error.message],
      };
    }
  }
}