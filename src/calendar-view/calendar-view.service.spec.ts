import { Test, TestingModule } from '@nestjs/testing';
import { CalendarViewService } from './calendar-view.service';
import { FirestoreService } from '../common/firestore/firestore.service';
import { OrderService } from '../orders/order.service';
import { CreateCalendarViewReqDTO } from './dto/create-calendar-view-req.dto';
import { GetCalendarViewReqDTO } from './dto/get-calendar-view-req.dto';
import { DocumentSnapshot } from '@google-cloud/firestore';

describe('CalendarViewService', () => {
  let service: CalendarViewService;
  let firestoreService: FirestoreService;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarViewService,
        {
          provide: FirestoreService,
          useValue: {
            getDocumentByName: jest.fn(),
            setDocument: jest.fn(),
            getCollection: jest.fn(),
            updateDocumentsWithField: jest.fn(),
            firestore: {
              batch: jest.fn().mockReturnValue({
                update: jest.fn(),
                commit: jest.fn(),
              }),
              collection: jest.fn().mockReturnValue({
                doc: jest.fn().mockReturnValue({
                  ref: { path: 'Users/john.doe@example.com' },
                  get: jest.fn().mockReturnValue({
                    exists: true,
                    data: jest.fn().mockReturnValue({
                      is_default: false,
                      is_favorite: true,
                    }),
                  }),
                }),
              }),
            },
          },
        },
        {
          provide: OrderService,
          useValue: {
            getMonthsOrderData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CalendarViewService>(CalendarViewService);
    firestoreService = module.get<FirestoreService>(FirestoreService);
    orderService = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  describe('getCalendarView', () => {
    it('should return default calendar view data', async () => {
      const body: GetCalendarViewReqDTO = {
        userId: 'john.doe@example.com',
        userName: 'John Doe',
      };
      const userDoc = {
        default_calendar_view: 'default_view',
      };
      const calendarViewData = {
        branches: ['NYC'],
      };
      const orders = [
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
      ];
      const calendars = [
        {
          calendar_name: 'view1',
          branches: ['NYC'],
          is_favorite: true,
          is_default: false,
        },
      ];

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(userDoc);
      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(calendarViewData);
      jest.spyOn(orderService, 'getMonthsOrderData').mockResolvedValue(orders);
      jest
        .spyOn(firestoreService, 'getCollection')
        .mockResolvedValue(calendars);

      const result = await service.getCalendarView(body);

      expect(result).toEqual({
        defaultCalendarView: 'default_view',
        orders,
        calendarList: [
          {
            calendarName: 'view1',
            branches: ['NYC'],
            isFavorite: true,
            isDefault: false,
          },
        ],
      });
    });

    it('should return null for default calendar view when user doc is not found', async () => {
      const body: GetCalendarViewReqDTO = {
        userId: 'john.doe@example.com',
        userName: 'John Doe',
      };

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(firestoreService, 'setDocument')
        .mockResolvedValueOnce(undefined);

      const result = await service.getCalendarView(body);

      expect(result).toEqual({
        defaultCalendarView: null,
        orders: [],
        calendarList: [],
      });
    });
  });

  describe('createCalendarView', () => {
    it('should create a new calendar view', async () => {
      const body: CreateCalendarViewReqDTO = {
        userId: 'john.doe@example.com',
        calendarName: 'new_view',
        regions: ['South'],
        areas: ['Florida'],
        branches: ['NYC'],
        isDefault: false,
        isFavorite: true,
      };
      const existingCalendarViews = [];

      jest
        .spyOn(firestoreService, 'getCollection')
        .mockResolvedValueOnce(existingCalendarViews);
      jest
        .spyOn(firestoreService.firestore.batch(), 'commit')
        .mockResolvedValueOnce(undefined);

      await service.createCalendarView(body);

      expect(firestoreService.setDocument).toHaveBeenCalledWith(
        'Users/john.doe@example.com/calendar_views',
        'new_view',
        {
          branches: ['NYC'],
          regions: ['South'],
          areas: ['Florida'],
          calendar_name: 'new_view',
          is_default: true,
          is_favorite: true,
        },
      );
      expect(firestoreService.firestore.batch().update).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: { path: 'Users/john.doe@example.com' },
        }),
        { default_calendar_view: 'new_view' },
      );
    });

    it('should throw an error when creating a new calendar view fails', async () => {
      const body: CreateCalendarViewReqDTO = {
        userId: 'john.doe@example.com',
        calendarName: 'new_view',
        regions: ['South'],
        areas: ['Florida'],
        branches: ['NYC'],
        isDefault: false,
        isFavorite: true,
      };
      const existingCalendarViews = [];
      const errorMessage = 'Failed to create calendar view';

      jest
        .spyOn(firestoreService, 'getCollection')
        .mockResolvedValueOnce(existingCalendarViews);
      jest
        .spyOn(firestoreService, 'setDocument')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.createCalendarView(body)).rejects.toThrowError(
        errorMessage,
      );
    });
  });

  describe('updateCalendarDetails', () => {
    it('should update calendar details and set as default', async () => {
      const userId = 'john.doe@example.com';
      const calendarName = 'my_calendar';
      const isDefault = true;
      const isFavorite = false;

      const mockCalendars = [
        {
          calendar_name: 'view1',
          branches: ['NYC'],
          is_favorite: true,
          is_default: false,
        },
        {
          calendar_name: 'view2',
          branches: ['LA'],
          is_favorite: false,
          is_default: false,
        },
      ];

      jest
        .spyOn(firestoreService, 'getCollection')
        .mockResolvedValueOnce(mockCalendars);

      const result = await service.updateCalendarDetails({
        userId,
        calendarName,
        isDefault,
        isFavorite,
      });

      expect(firestoreService.firestore.batch().update).toHaveBeenCalledTimes(
        2,
      );
      expect(firestoreService.updateDocumentsWithField).toHaveBeenCalledWith(
        `Users/${userId}/calendar_views`,
        calendarName,
        'is_default',
        false,
      );
      expect(result).toEqual({
        calendarList: [
          {
            calendarName: 'view1',
            branches: ['NYC'],
            isFavorite: true,
            isDefault: false,
          },
          {
            calendarName: 'view2',
            branches: ['LA'],
            isFavorite: false,
            isDefault: false,
          },
        ],
      });
    });
    it('should update calendar details without setting as default', async () => {
      const userId = 'john.doe@example.com';
      const calendarName = 'my_calendar';
      const isDefault = false;
      const isFavorite = true;

      const mockCalendars = [
        {
          calendar_name: 'view1',
          branches: ['NYC'],
          is_favorite: true,
          is_default: false,
        },
        {
          calendar_name: 'my_calendar',
          branches: ['LA'],
          is_favorite: true,
          is_default: false,
        },
      ];

      jest
        .spyOn(firestoreService, 'getCollection')
        .mockResolvedValueOnce(mockCalendars);

      const result = await service.updateCalendarDetails({
        userId,
        calendarName,
        isDefault,
        isFavorite,
      });

      expect(firestoreService.firestore.batch().update).toHaveBeenCalledTimes(
        1,
      );
      expect(firestoreService.updateDocumentsWithField).not.toHaveBeenCalled();
      expect(result).toEqual({
        calendarList: [
          {
            calendarName: 'view1',
            branches: ['NYC'],
            isFavorite: true,
            isDefault: false,
          },
          {
            calendarName: 'my_calendar',
            branches: ['LA'],
            isFavorite: true,
            isDefault: false,
          },
        ],
      });
    });

    it('should return an error if calendar view is not found', async () => {
      const userId = 'john.doe@example.com';
      const calendarName = 'my_calendar';
      const isDefault = false;
      const isFavorite = true;

      jest
        .spyOn(
          firestoreService.firestore.collection('Users').doc(userId),
          'get',
        )
        .mockResolvedValue({
          exists: false,
          data: () => undefined,
        } as DocumentSnapshot);

      const result = await service.updateCalendarDetails({
        userId,
        calendarName,
        isDefault,
        isFavorite,
      });

      expect(result).toEqual({ calendarList: [] });
    });
  });
});
