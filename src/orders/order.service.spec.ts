import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FirestoreService } from '../common/firestore/firestore.service';
import { getOrdersByDayRespDTO } from './dto/get-orders-by-day-resp.dto';
import { UpdateNotesReqDTO } from './dto/update-notes-req.dto';

describe('OrderService', () => {
  let orderService: OrderService;
  let firestoreService: FirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FirestoreService,
          useValue: {
            getMonthsOrdersByQuery: jest.fn(),
            getDaysOrdersByQuery: jest.fn(),
            getDocumentByName: jest.fn(),
            updateSingleDoc: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    firestoreService = module.get<FirestoreService>(FirestoreService);
    jest.clearAllMocks();
  });

  describe('getMonthsOrderData', () => {
    const ordersData = [
      {
        project_type: 'Event',
        client_name: 'Marshfield Chamber of Commerce',
        start_date: { toDate: () => new Date('2024-05-01') },
        end_date: { toDate: () => new Date('2024-05-10') },
        address: 'Harbormaster Building',
        phone: '339-221-4605',
        order_id: 'W-112544',
        fences: [
          {
            fence_type: 'Panel w/Posts',
            no_of_units: 10,
          },
        ],
        work_type: 'PU',
        driver: 'Justinn Wickstead',
        isPlaceholder: false,
      },
    ];
    const placeholdersData = [
      {
        project_type: 'Construction',
        client_name: 'Mingle Contracting',
        start_date: { toDate: () => new Date('2024-05-01') },
        end_date: { toDate: () => new Date('2024-05-10') },
        address: '221 baker st',
        phone: '339-221-4605',
        order_id: 'p-18416',
        fences: [
          {
            fence_type: 'Barricade',
            no_of_units: 20,
          },
        ],
        work_type: 'DEL',
        driver: 'Mark vayne',
        isPlaceholder: true,
      },
    ];

    it('should return an array of orders and placeholders for the given branches and month', async () => {
      const branches = ['MEL'];
      const month = '2024-05';

      jest
        .spyOn(firestoreService, 'getMonthsOrdersByQuery')
        .mockResolvedValueOnce(ordersData)
        .mockResolvedValueOnce(placeholdersData);

      const result = await orderService.getMonthsOrderData(branches, month);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        projectType: 'Construction',
        clientName: 'Mingle Contracting',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-05-10'),
        address: '221 baker st',
        phone: '339-221-4605',
        orderId: 'p-18416',
        fences: [{ fenceType: 'Barricade', noOfUnits: 20 }],
        workType: 'DEL',
        driver: 'Mark vayne',
        isPlaceholder: false,
      });

      expect(result[1]).toEqual({
        projectType: 'Event',
        clientName: 'Marshfield Chamber of Commerce',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-05-10'),
        address: 'Harbormaster Building',
        phone: '339-221-4605',
        orderId: 'W-112544',
        fences: [{ fenceType: 'Panel w/Posts', noOfUnits: 10 }],
        workType: 'PU',
        driver: 'Justinn Wickstead',
        isPlaceholder: true,
      });
    });

    it('should return an empty array when branches array is empty', async () => {
      const branches = [];
      const month = '2024-05';

      jest
        .spyOn(firestoreService, 'getMonthsOrdersByQuery')
        .mockResolvedValue([]);

      const result = await orderService.getMonthsOrderData(branches, month);
      expect(result).toHaveLength(0);
    });

    it('should return an empty array when branches do not exist', async () => {
      const branches = ['INVALID_BRANCH'];
      const month = '2024-05';

      jest
        .spyOn(firestoreService, 'getMonthsOrdersByQuery')
        .mockResolvedValue([]);

      const result = await orderService.getMonthsOrderData(branches, month);
      expect(result).toHaveLength(0);
    });

    it('should throw an error when Firestore query fails', async () => {
      const branches = ['MEL'];
      const month = '2024-05';

      jest
        .spyOn(firestoreService, 'getMonthsOrdersByQuery')
        .mockRejectedValue(new Error('Firestore query failed'));

      await expect(
        orderService.getMonthsOrderData(branches, month),
      ).rejects.toThrow('Firestore query failed');
    });
  });

  describe('getDaysOrderData', () => {
    const ordersData = [
      {
        project_type: 'Event',
        client_name: 'Marshfield Chamber of Commerce',
        address: 'Harbormaster Building',
        order_id: 'W-112544',
        fences: [
          {
            fence_type: 'Panel w/Posts',
            no_of_units: 10,
          },
        ],
        work_type: 'PU',
        driver: 'Justinn Wickstead',
        notes: 'Special instructions',
        url: 'https://example.com/order/W-112544',
        geo_point: {
          latitude: 38.8888206,
          longitude: -77.0175513,
        },
        phone: '607-765-0301',
        isPlaceholder: false,
      },
    ];

    const placeholdersData = [
      {
        project_type: 'Construction',
        client_name: 'United Site Services',
        address: '10432 Patriot Hwy',
        order_id: 'P-122281',
        fences: [
          {
            fence_type: 'Barricade',
            no_of_units: 20,
          },
        ],
        work_type: 'DEL',
        driver: 'Leesa Maudett',
        notes: null,
        url: null,
        geo_point: null,
        phone: '607-765-0301',
        isPlaceholder: true,
      },
    ];

    it('should return an array of orders and placeholders for the given branches and date', async () => {
      const branches = ['MEL'];
      const date = '2024-06-15';

      jest
        .spyOn(firestoreService, 'getDaysOrdersByQuery')
        .mockResolvedValueOnce(ordersData)
        .mockResolvedValueOnce(placeholdersData);

      const result = await orderService.getDaysOrderData(branches, date);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        projectType: 'Construction',
        clientName: 'United Site Services',
        address: '10432 Patriot Hwy',
        orderId: 'P-122281',
        fences: [{ fenceType: 'Barricade', noOfUnits: 20 }],
        workType: 'DEL',
        driver: 'Leesa Maudett',
        notes: null,
        url: undefined,
        geoPoint: null,
        isPlaceholder: false,
        branch: undefined,
        startDate: undefined,
        endDate: undefined,
        phone: '607-765-0301',
      });
      expect(result[1]).toEqual({
        projectType: 'Event',
        clientName: 'Marshfield Chamber of Commerce',
        address: 'Harbormaster Building',
        orderId: 'W-112544',
        fences: [{ fenceType: 'Panel w/Posts', noOfUnits: 10 }],
        workType: 'PU',
        driver: 'Justinn Wickstead',
        notes: 'Special instructions',
        url: null,
        geoPoint: {
          latitude: 38.8888206,
          longitude: -77.0175513,
        },
        isPlaceholder: true,
        branch: undefined,
        startDate: undefined,
        endDate: undefined,
        phone: '607-765-0301',
      });
    });

    it('should return an empty array when branches array is empty', async () => {
      const branches = [];
      const date = '2024-06-15';

      jest
        .spyOn(firestoreService, 'getDaysOrdersByQuery')
        .mockResolvedValue([]);

      const result = await orderService.getDaysOrderData(branches, date);
      expect(result).toHaveLength(0);
    });

    it('should return an empty array when branches do not exist', async () => {
      const branches = ['INVALID_BRANCH'];
      const date = '2024-06-15';

      jest
        .spyOn(firestoreService, 'getDaysOrdersByQuery')
        .mockResolvedValue([]);

      const result = await orderService.getDaysOrderData(branches, date);
      expect(result).toHaveLength(0);
    });

    it('should throw an error when Firestore query fails', async () => {
      const branches = ['MEL'];
      const date = '2024-06-15';

      jest
        .spyOn(firestoreService, 'getDaysOrdersByQuery')
        .mockRejectedValue(new Error('Firestore query failed'));

      await expect(
        orderService.getDaysOrderData(branches, date),
      ).rejects.toThrow('Firestore query failed');
    });
  });

  describe('updateNotes', () => {
    it('should update notes for an order and return success message', async () => {
      const body: UpdateNotesReqDTO = {
        orderId: 'W-112544',
        notes: 'Updated notes',
      };
      const orderDoc = {
        /* mock order document */
      };

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(orderDoc);
      jest
        .spyOn(firestoreService, 'updateSingleDoc')
        .mockResolvedValueOnce(true);

      const result = await orderService.updateNotes(body);

      expect(result).toEqual({ message: 'Notes updated successfully' });
      expect(firestoreService.getDocumentByName).toHaveBeenCalledWith(
        'orders',
        'W-112544',
      );
      expect(firestoreService.updateSingleDoc).toHaveBeenCalledWith(
        'orders',
        'W-112544',
        'notes',
        'Updated notes',
      );
    });
    it('should update notes for a placeholder and return success message', async () => {
      const body: UpdateNotesReqDTO = {
        orderId: 'P-122281',
        notes: 'Updated placeholder notes',
      };
      const placeholderDoc = {
        /* mock placeholder document */
      };

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(placeholderDoc);
      jest
        .spyOn(firestoreService, 'updateSingleDoc')
        .mockResolvedValueOnce(true);

      const result = await orderService.updateNotes(body);

      expect(result).toEqual({ message: 'Notes updated successfully' });
      expect(firestoreService.getDocumentByName).toHaveBeenCalledWith(
        'orders',
        'P-122281',
      );
      expect(firestoreService.getDocumentByName).toHaveBeenCalledWith(
        'placeholder',
        'P-122281',
      );
      expect(firestoreService.updateSingleDoc).toHaveBeenCalledWith(
        'placeholder',
        'P-122281',
        'notes',
        'Updated placeholder notes',
      );
    });
    it('should return "Order not found" message when order and placeholder are not found', async () => {
      const body: UpdateNotesReqDTO = {
        orderId: 'INVALID_ID',
        notes: 'Updated notes',
      };

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const result = await orderService.updateNotes(body);

      expect(result).toEqual({ message: 'Order not found' });
      expect(firestoreService.getDocumentByName).toHaveBeenCalledWith(
        'orders',
        'INVALID_ID',
      );
      expect(firestoreService.getDocumentByName).toHaveBeenCalledWith(
        'placeholder',
        'INVALID_ID',
      );
    });
    it('should throw an error when Firestore operation fails', async () => {
      const body: UpdateNotesReqDTO = {
        orderId: 'W-112544',
        notes: 'Updated notes',
      };
      const errorMessage = 'Firestore operation failed';

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(orderService.updateNotes(body)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
