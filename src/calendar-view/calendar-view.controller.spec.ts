import { Test, TestingModule } from '@nestjs/testing';
import { CalendarViewController } from './calendar-view.controller';
import { CalendarViewService } from './calendar-view.service';
import { CreateCalendarViewReqDTO } from './dto/create-calendar-view-req.dto';
import { GetCalendarViewReqDTO } from './dto/get-calendar-view-req.dto';
import { GetCalendarViewRespDTO } from './dto/get-calendar-view-resp.dto';
import { CreateCalendarViewRespDTO } from './dto/create-calendar-view-resp.dto';
import { OrderService } from '../orders/order.service';
import { UpdateCalendarDetailsReqDTO } from './dto/update-calendar-details-req.dto';
import { UpdateCalendarDetailsRespDTO } from './dto/update-calendar-details-resp.dto';

describe('CalendarViewController', () => {
  let controller: CalendarViewController;
  let service: CalendarViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarViewController],
      providers: [
        {
          provide: CalendarViewService,
          useValue: {
            getCalendarView: jest.fn(),
            createCalendarView: jest.fn(),
            updateCalendarDetails: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            getOrdersByQuery: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CalendarViewController>(CalendarViewController);
    service = module.get<CalendarViewService>(CalendarViewService);
    jest.clearAllMocks();
  });

  describe('getCalendarView', () => {
    it('should return default calendar view data', async () => {
      const body: GetCalendarViewReqDTO = {
        userId: 'john.doe@example.com',
        userName: 'John Doe',
      };
      const calendarViewData: GetCalendarViewRespDTO = {
        defaultCalendarView: 'calendar1',
        calendarList: [{ calendarName: 'calendar1', branches: ['NYC'] }],
        orders: [
          {
            projectType: 'Event',
            clientName: 'Marshfield Chamber of Commerce',
            startDate: '2024-05-31T11:54:59.633Z',
            endDate: '2024-06-08T11:54:24.348Z',
            address: 'Harbormaster Building',
            phone: '339-221-4605',
            orderId: 'W-112544',
            fences: [
              {
                fenceType: 'Panel w/Posts',
                noOfUnits: 10,
              },
            ],
            workType: 'PU',
            driver: 'Justinn Wickstead',
            isPlaceholder: false,
          },
        ],
      };

      jest
        .spyOn(service, 'getCalendarView')
        .mockResolvedValue(calendarViewData);

      const result = await controller.getCalendarView(body);

      expect(result.status).toBe('Success');
      expect(result.statusCode).toBe(1000);
      expect(result.message).toBe('Fetched Default Calendar');
      expect(result.data).toEqual([calendarViewData]);
    });

    it('should return an error response when an error occurs', async () => {
      const body: GetCalendarViewReqDTO = {
        userId: 'user123',
        userName: 'John Doe',
      };
      const error = new Error('Failed to fetch calendar view');

      jest.spyOn(service, 'getCalendarView').mockRejectedValue(error);

      const result = await controller.getCalendarView(body);

      expect(result.status).toBe('Fail');
      expect(result.statusCode).toBe(1002);
      expect(result.message).toBe(
        'Error occurred while fetching default calendar view',
      );
      expect(result.data).toEqual([error.message]);
    });
  });

  describe('createCalendarView', () => {
    it('should create a new calendar view', async () => {
      const body: CreateCalendarViewReqDTO = {
        userId: 'john.doe@example.com',
        calendarName: 'calendar1',
        regions: ['South'],
        areas: ['Florida'],
        branches: ['MEL'],
        isDefault: false,
        isFavorite: true,
      };
      const createResponse: CreateCalendarViewRespDTO = {
        message: 'Calendar view created successfully',
      };

      jest
        .spyOn(service, 'createCalendarView')
        .mockResolvedValue(createResponse);

      const result = await controller.createCalendarView(body);

      expect(result.status).toBe('Success');
      expect(result.statusCode).toBe(1000);
      expect(result.message).toBe('Calendar view created');
      expect(result.data).toEqual([createResponse]);
    });

    it('should return an error response when an error occurs during creation', async () => {
      const body: CreateCalendarViewReqDTO = {
        userId: 'john.doe@example.com',
        calendarName: 'calendar1',
        regions: ['South'],
        areas: ['Florida'],
        branches: ['MEL'],
        isDefault: false,
        isFavorite: true,
      };
      const error = new Error('Failed to create calendar view');

      jest.spyOn(service, 'createCalendarView').mockRejectedValue(error);

      const result = await controller.createCalendarView(body);

      expect(result.status).toBe('Fail');
      expect(result.statusCode).toBe(1003);
      expect(result.message).toBe('Calendar view Creation Failed');
      expect(result.data).toEqual([error.message]);
    });
  });

  describe('updateCalendarDetails', () => {
    it('should update calendar details successfully', async () => {
      const body: UpdateCalendarDetailsReqDTO = {
        userId: 'john.doe@example.com',
        calendarName: 'my_calendar',
        isDefault: true,
        isFavorite: false,
      };

      const updatedCalendarView: UpdateCalendarDetailsRespDTO = {
        calendarList: [
          {
            calendarName: 'my_calendar',
            branches: ['NYC'],
            isFavorite: false,
            isDefault: true,
          },
        ],
      };

      jest
        .spyOn(service, 'updateCalendarDetails')
        .mockResolvedValueOnce(updatedCalendarView);

      const result = await controller.updateCalendarDetails(body);

      expect(service.updateCalendarDetails).toHaveBeenCalledWith(body);
      expect(result.status).toBe('Success');
      expect(result.statusCode).toBe(1000);
      expect(result.message).toBe('Calendar Updated Successfully');
      expect(result.data).toEqual([updatedCalendarView]);
    });

    it('should return an error response when an error occurs', async () => {
      const body: UpdateCalendarDetailsReqDTO = {
        userId: 'john.doe@example.com',
        calendarName: 'my_calendar',
        isDefault: true,
        isFavorite: false,
      };

      const errorMessage = 'Failed to update calendar details';
      const error = new Error(errorMessage);

      jest.spyOn(service, 'updateCalendarDetails').mockRejectedValueOnce(error);

      const result = await controller.updateCalendarDetails(body);

      expect(result.status).toBe('Fail');
      expect(result.statusCode).toBe(1008);
      expect(result.message).toBe(
        'Error occurred while updating calendar details',
      );
      expect(result.data).toEqual([errorMessage]);
    });
    it('should return an empty calendarList when the calendar view is not found', async () => {
      const body: UpdateCalendarDetailsReqDTO = {
        userId: 'john.doe@example.com',
        calendarName: 'non_existent_calendar',
        isDefault: true,
        isFavorite: false,
      };

      const mockResponse: UpdateCalendarDetailsRespDTO = {
        calendarList: [],
      };

      jest
        .spyOn(service, 'updateCalendarDetails')
        .mockResolvedValueOnce(mockResponse);

      const result = await controller.updateCalendarDetails(body);

      expect(result.status).toBe('Success');
      expect(result.statusCode).toBe(1000);
      expect(result.message).toBe('Calendar Updated Successfully');
      expect(result.data).toEqual([mockResponse]);
    });
  });
});
