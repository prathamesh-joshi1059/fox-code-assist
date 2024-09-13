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
import { GetCalendarViewRespDTO } from './dto/get-calendar-view-resp.dto';
import { ResponseDTO } from '../common/dto/resp.dto';
import { CreateCalendarViewRespDTO } from './dto/create-calendar-view-resp.dto';
import { UpdateCalendarDetailsReqDTO } from './dto/update-calendar-details-req.dto';
import { UpdateCalendarDetailsRespDTO } from './dto/update-calendar-details-resp.dto';

@ApiTags('Calendar-View')
@Controller('/calendar-view')
@UsePipes(ValidationPipe)
export class CalendarViewController {
  constructor(private readonly calendarViewService: CalendarViewService) {}

  // Retrieves default calendar view data and orders data for a existing user or creates a new user and returns null data
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
  ): Promise<ResponseDTO<Array<GetCalendarViewRespDTO | Error>>> {
    try {
      const calendarViewData: GetCalendarViewRespDTO =
        (await this.calendarViewService.getCalendarView(
          body,
        )) as GetCalendarViewRespDTO;

      const calendarViewResponse: ResponseDTO<Array<GetCalendarViewRespDTO>> = {
        status: 'Success',
        statusCode: 1000,
        message: !calendarViewData.defaultCalendarView
          ? 'Default Calendar View Not Found'
          : 'Fetched Default Calendar',
        data: [calendarViewData],
      };
      return calendarViewResponse;
    } catch (error) {
      const errorResponse = {
        status: 'Fail',
        statusCode: 1002,
        message: 'Error occurred while fetching default calendar view',
        data: [error.message],
      };
      return errorResponse;
    }
  }

  // Creates a new calendar view for a user
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
  ): Promise<ResponseDTO<(CreateCalendarViewRespDTO | Error)[]>> {
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

  // Updates calendar details like default and favorite for a user
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
    @Body()
    body: UpdateCalendarDetailsReqDTO,
  ): Promise<ResponseDTO<Array<UpdateCalendarDetailsRespDTO | Error>>> {
    try {
      const updatedView =
        await this.calendarViewService.updateCalendarDetails(body);
      const updateResponse = {
        status: 'Success',
        statusCode: 1000,
        message: 'Calendar Updated Successfully',
        data: [updatedView],
      };
      return updateResponse;
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
