// order.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { GetOrdersByMonthRespDTO } from './dto/get-orders-by-month-resp.dto';
import { getOrdersByDayRespDTO } from './dto/get-orders-by-day-resp.dto';
import { UpdateNotesReqDTO } from './dto/update-notes-req.dto';
import { UpdateNotesRespDTO } from './dto/update-notes-resp.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            getMonthsOrderData: jest.fn(),
            getDaysOrderData: jest.fn(),
            updateNotes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMonthsOrderData', () => {
    it('should return order data for the given branches and month', async () => {
      const branches = ['NYC', 'MEL'];
      const yearMonth = '2024-06';
      const orders: GetOrdersByMonthRespDTO[] = [
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
        {
          projectType: 'Event',
          clientName: 'United Site Services',
          startDate: '2024-06-08T12:36:26.944Z',
          endDate: '2024-06-09T12:35:47.759Z',
          address: '10432 Patriot Hwy',
          phone: '713-875-9511',
          orderId: 'W-122281',
          fences: [
            {
              fenceType: 'Other',
              noOfUnits: 10,
            },
          ],
          workType: 'DRP',
          driver: 'Leesa Maudett',
          isPlaceholder: false,
        },
      ];

      jest.spyOn(service, 'getMonthsOrderData').mockResolvedValue(orders);

      const result = await controller.getMonthsOrderData({
        branches,
        yearMonth,
      });

      expect(result.data).toEqual(orders);
    });

    it('should return an empty array when no orders are found', async () => {
      const branches = ['NYC', 'MEL'];
      const yearMonth = '2024-06';
      const orders = [];

      jest.spyOn(service, 'getMonthsOrderData').mockResolvedValue(orders);

      const result = await controller.getMonthsOrderData({
        branches,
        yearMonth,
      });
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Orders Not Found');
    });

    it('should handle errors thrown by the service', async () => {
      const branches = ['NYC', 'MEL'];
      const yearMonth = '2024-06';
      const errorMessage = 'Failed to fetch orders';

      jest
        .spyOn(service, 'getMonthsOrderData')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.getMonthsOrderData({
        branches,
        yearMonth,
      });
      expect(result.status).toBe('Fail');
      expect(result.statusCode).toBe(1001);
      expect(result.message).toBe('Error occurred while fetching orders');
      expect(result.data).toContainEqual(errorMessage);
    });

    it('should validate the input data', async () => {
      const branches = [''];
      const yearMonth = '2024-06';

      const result = await controller.getMonthsOrderData({
        branches,
        yearMonth,
      });

      expect(result.status).toBe('Fail');
      expect(result.statusCode).toBe(1001);
      expect(result.message).toBe('Error occurred while fetching orders');
    });
  });

  describe('getDaysOrderData', () => {
    it('should return order data for the given branches and date', async () => {
      const branches = ['NYC', 'MEL'];
      const date = '2024-06-15';
      const orders: getOrdersByDayRespDTO[] = [
        {
          projectType: 'Event',
          clientName: 'Marshfield Chamber of Commerce',
          address: 'Harbormaster Building',
          orderId: 'W-112544',
          fences: [
            {
              fenceType: 'Panel w/Posts',
              noOfUnits: 10,
            },
          ],
          workType: 'PU',
          driver: 'Justinn Wickstead',
          notes: 'Special instructions',
          url: 'https://example.com/order/W-112544',
          isPlaceholder: false,
        },
        {
          projectType: 'Construction',
          clientName: 'United Site Services',
          address: '10432 Patriot Hwy',
          orderId: 'P-122281',
          fences: [
            {
              fenceType: 'Barricade',
              noOfUnits: 20,
            },
          ],
          workType: 'DEL',
          driver: 'Leesa Maudett',
          notes: null,
          url: null,
          isPlaceholder: true,
        },
      ];

      jest.spyOn(service, 'getDaysOrderData').mockResolvedValue(orders);

      const result = await controller.getDaysOrderData({
        branches,
        date,
      });

      expect(result.data).toEqual(orders);
    });

    it('should return an empty array when no orders are found', async () => {
      const branches = ['NYC', 'MEL'];
      const date = '2024-06-15';
      const orders = [];

      jest.spyOn(service, 'getDaysOrderData').mockResolvedValue(orders);

      const result = await controller.getDaysOrderData({
        branches,
        date,
      });
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Orders Not Found');
    });

    it('should handle errors thrown by the service', async () => {
      const branches = ['NYC', 'MEL'];
      const date = '2024-06-15';
      const errorMessage = 'Failed to fetch orders';

      jest
        .spyOn(service, 'getDaysOrderData')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.getDaysOrderData({
        branches,
        date,
      });
      expect(result.status).toBe('Fail');
      expect(result.statusCode).toBe(1007);
      expect(result.message).toBe('Error occurred while fetching orders');
      expect(result.data).toContainEqual(errorMessage);
    });
  });
  describe('updateNotes', () => {
    it('should update the notes and return a success response', async () => {
      const updateNotesReqDTO: UpdateNotesReqDTO = {
        orderId: 'W-112544',
        notes: 'Updated notes',
      };

      const updateNotesRespDTO: UpdateNotesRespDTO = {
        message: 'Notes updated successfully',
      };

      jest.spyOn(service, 'updateNotes').mockResolvedValue(updateNotesRespDTO);

      const result = await controller.updateNotes(updateNotesReqDTO);

      expect(service.updateNotes).toHaveBeenCalledWith(updateNotesReqDTO);
      expect(result.status).toBe('Success');
      expect(result.statusCode).toBe(1000);
      expect(result.message).toBe('Notes updated successfully');
      expect(result.data).toEqual([updateNotesRespDTO]);
    });
    it('should handle errors thrown by the service', async () => {
      const updateNotesReqDTO: UpdateNotesReqDTO = {
        orderId: 'W-112544',
        notes: 'Updated notes',
      };

      const errorMessage = 'Failed to update notes';

      jest
        .spyOn(service, 'updateNotes')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.updateNotes(updateNotesReqDTO);

      expect(result.status).toBe('Fail');
      expect(result.statusCode).toBe(1009);
      expect(result.message).toBe('Error occurred while updating notes');
      expect(result.data).toContain(errorMessage);
    });
  });
});
