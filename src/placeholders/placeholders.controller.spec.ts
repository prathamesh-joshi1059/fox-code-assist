import { Test, TestingModule } from '@nestjs/testing';
import { PlaceholdersController } from './placeholders.controller';
import { PlaceholdersService } from './placeholders.service';
import { CreatePlaceholderReqDTO } from './dto/create-placeholder-req.dto';
import { UpdatePlaceholderReqDTO } from './dto/update-placeholder-req.dto';
import { ResponseDTO } from 'src/common/dto/resp.dto';
import { CreatePlaceholderRespDTO } from './dto/create-placeholder-resp.dto';
import { UpdatePlaceholderRespDTO } from './dto/update-placeholder-resp.dto';
import { FirestoreService } from '../common/firestore/firestore.service';

describe('PlaceholdersController', () => {
  let controller: PlaceholdersController;
  let service: PlaceholdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceholdersController],
      providers: [
        PlaceholdersService,
        {
          provide: FirestoreService,
          useValue: {
            getTimestampFromDate: jest.fn(),
            setDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlaceholdersController>(PlaceholdersController);
    service = module.get<PlaceholdersService>(PlaceholdersService);
  });

  describe('createPlaceholder', () => {
    it('should create a placeholder and return success response', async () => {
      const createPlaceholderDto: CreatePlaceholderReqDTO = {
        endDate: new Date('2024-05-21'),
        projectType: 'Construction',
        notes: 'user notes',
        address: '{{$randomStreetAddress}}',
        workType: 'DEL',
        driver: '{{$randomFullName}}',
        clientName: 'Mingle Contracting',
        startDate: new Date('2024-05-23'),
        fences: [{ fenceType: 'Barricade', noOfUnits: 20 }],
        branch: 'NYC',
        geoPoint: { latitude: 40.7128, longitude: -74.006 },
      };
      const createPlaceholderRespDto: CreatePlaceholderRespDTO = {
        message: 'placeholder created',
        placeholderId: 'p-12345',
      };
      jest
        .spyOn(service, 'createPlaceholder')
        .mockResolvedValue(createPlaceholderRespDto);

      const result = await controller.createPlaceholder(createPlaceholderDto);

      expect(service.createPlaceholder).toHaveBeenCalledWith(
        createPlaceholderDto,
      );
      expect(result).toEqual({
        status: 'Success',
        statusCode: 1000,
        message: 'Placeholder Created',
        data: [createPlaceholderRespDto],
      });
    });

    it('should handle errors and return error response', async () => {
      const createPlaceholderDto: CreatePlaceholderReqDTO = {
        endDate: new Date('2024-05-21'),
        projectType: 'Construction',
        notes: 'user notes',
        address: '{{$randomStreetAddress}}',
        workType: 'DEL',
        driver: '{{$randomFullName}}',
        clientName: 'Mingle Contracting',
        startDate: new Date('2024-05-23'),
        fences: [{ fenceType: 'Barricade', noOfUnits: 20 }],
        branch: 'NYC',
        geoPoint: { latitude: 40.7128, longitude: -74.006 },
      };
      const error = new Error('Error creating placeholder');
      jest.spyOn(service, 'createPlaceholder').mockRejectedValue(error);

      const result = await controller.createPlaceholder(createPlaceholderDto);

      expect(service.createPlaceholder).toHaveBeenCalledWith(
        createPlaceholderDto,
      );
      expect(result).toEqual({
        status: 'Fail',
        statusCode: 1005,
        message: 'Error creating placeholder',
        data: [error.message],
      });
    });
  });

  describe('updatePlaceholder', () => {
    it('should update a placeholder and return success response', async () => {
      const placeholderId = 'p-12345';
      const updatePlaceholderDto: UpdatePlaceholderReqDTO = {
        endDate: new Date('2024-05-21'),
        projectType: 'Construction',
        notes: 'user notes',
        address: '{{$randomStreetAddress}}',
        workType: 'DEL',
        driver: '{{$randomFullName}}',
        clientName: 'Mingle Contracting',
        startDate: new Date('2024-05-23'),
        fences: [{ fenceType: 'Barricade', noOfUnits: 20 }],
        branch: 'NYC',
      };
      const updatePlaceholderRespDto: UpdatePlaceholderRespDTO = {
        placeholderId: 'p-12345',
        message: 'Placeholder updated',
      };
      jest
        .spyOn(service, 'updatePlaceholder')
        .mockResolvedValue(updatePlaceholderRespDto);

      const result = await controller.updatePlaceholder(
        placeholderId,
        updatePlaceholderDto,
      );

      expect(service.updatePlaceholder).toHaveBeenCalledWith(
        placeholderId,
        updatePlaceholderDto,
      );
      expect(result).toEqual({
        status: 'Success',
        statusCode: 1000,
        message: 'Placeholder Updated',
        data: [updatePlaceholderRespDto],
      });
    });

    it('should handle errors and return error response', async () => {
      const placeholderId = 'p-12345';
      const updatePlaceholderDto: UpdatePlaceholderReqDTO = {
        endDate: new Date('2024-05-21'),
        projectType: 'Construction',
        notes: 'user notes',
        address: '{{$randomStreetAddress}}',
        workType: 'DEL',
        driver: '{{$randomFullName}}',
        clientName: 'Mingle Contracting',
        startDate: new Date('2024-05-23'),
        fences: [{ fenceType: 'Barricade', noOfUnits: 20 }],
        branch: 'NYC',
      };
      const error = new Error('Error updating placeholder');
      jest.spyOn(service, 'updatePlaceholder').mockRejectedValue(error);

      const result = await controller.updatePlaceholder(
        placeholderId,
        updatePlaceholderDto,
      );

      expect(service.updatePlaceholder).toHaveBeenCalledWith(
        placeholderId,
        updatePlaceholderDto,
      );
      expect(result).toEqual({
        status: 'Fail',
        statusCode: 1006,
        message: 'Error updating placeholder',
        data: [error.message],
      });
    });
  });

  describe('deletePlaceholder', () => {
    it('should delete a placeholder and return success response', async () => {
      const orderId = 'p-12345';
      const successMessage =
        'Placeholder with orderId p-12345 deleted successfully';

      jest
        .spyOn(service, 'deletePlaceholder')
        .mockResolvedValue(successMessage);

      const result = await controller.deletePlaceholder(orderId);

      expect(service.deletePlaceholder).toHaveBeenCalledWith(
        'placeholder',
        orderId,
      );
      expect(result).toEqual({
        status: 'Success',
        statusCode: 1000,
        message: successMessage,
        data: [successMessage],
      });
    });

    it('should handle errors and return error response', async () => {
      const orderId = 'p-12345';
      const error = new Error('Error deleting placeholder');

      jest.spyOn(service, 'deletePlaceholder').mockRejectedValue(error);

      const result = await controller.deletePlaceholder(orderId);

      expect(service.deletePlaceholder).toHaveBeenCalledWith(
        'placeholder',
        orderId,
      );
      expect(result).toEqual({
        status: 'Fail',
        statusCode: 1010,
        message: 'Error deleting placeholder',
        data: [error.message],
      });
    });
  });
});
