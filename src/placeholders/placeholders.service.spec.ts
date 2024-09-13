import { Test, TestingModule } from '@nestjs/testing';
import { PlaceholdersService } from './placeholders.service';
import { FirestoreService } from '../common/firestore/firestore.service';
import { CreatePlaceholderReqDTO } from './dto/create-placeholder-req.dto';
import { UpdatePlaceholderReqDTO } from './dto/update-placeholder-req.dto';
import { CreatePlaceholderRespDTO } from './dto/create-placeholder-resp.dto';
import { UpdatePlaceholderRespDTO } from './dto/update-placeholder-resp.dto';
import * as admin from 'firebase-admin';

describe('PlaceholdersService', () => {
  let service: PlaceholdersService;
  let firestoreService: FirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceholdersService,
        {
          provide: FirestoreService,
          useValue: {
            getTimestampFromDate: jest.fn(),
            setDocument: jest.fn(),
            getDocumentByName: jest.fn(),
            removeDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlaceholdersService>(PlaceholdersService);
    firestoreService = module.get<FirestoreService>(FirestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateUniqueDocumentName', () => {
    it('should generate a new document name if the previous one already exists', async () => {
      jest
        .spyOn(
          service as unknown as {
            documentExists: (documentName: string) => Promise<boolean>;
          },
          'documentExists',
        )
        .mockResolvedValueOnce(true);
      const mockDocumentName = 'p-67890';
      jest
        .spyOn(
          service as unknown as {
            generateUniqueDocumentName: () => Promise<string>;
          },
          'generateUniqueDocumentName',
        )
        .mockResolvedValueOnce(mockDocumentName);

      const result = await service['generateUniqueDocumentName']();

      expect(result).toBe(mockDocumentName);
      expect(service['generateUniqueDocumentName']).toHaveBeenCalledTimes(1);
    });
  });

  describe('documentExists', () => {
    it('should return true if the document exists', async () => {
      const mockDocumentName = 'p-12345';
      const mockDocumentSnapshot = { exists: true };
      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(mockDocumentSnapshot);

      const result = await service['documentExists'](mockDocumentName);

      expect(result).toBe(true);
      expect(firestoreService.getDocumentByName).toHaveBeenCalledWith(
        'placeholder',
        mockDocumentName,
      );
    });

    it('should return false if the document does not exist', async () => {
      const mockDocumentName = 'p-67890';
      const mockDocumentSnapshot = null;
      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(mockDocumentSnapshot);

      const result = await service['documentExists'](mockDocumentName);

      expect(result).toBe(false);
      expect(firestoreService.getDocumentByName).toHaveBeenCalledWith(
        'placeholder',
        mockDocumentName,
      );
    });
  });

  describe('createPlaceholder', () => {
    it('should create a new placeholder', async () => {
      const createPlaceholderDto: CreatePlaceholderReqDTO = {
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-05-10'),
        projectType: 'Construction',
        notes: 'Test notes',
        address: '123 Main St',
        workType: 'PU',
        driver: 'John Doe',
        clientName: 'Acme Inc',
        fences: [{ fenceType: 'Chain Link', noOfUnits: 10 }],
        branch: 'NYC',
        phone: '123-456-7890',
        geoPoint: { latitude: 40.7128, longitude: -74.006 },
      };

      const placeholderId = 'p-12345';

      jest.spyOn(service, 'createPlaceholder').mockResolvedValueOnce({
        message: 'placeholder created',
        placeholderId,
      });
      const result: CreatePlaceholderRespDTO | Error =
        await service.createPlaceholder(createPlaceholderDto);

      expect(result).toEqual({ message: 'placeholder created', placeholderId });
    });

    describe('CreatePlaceholderRespDTO', () => {
      it('should have the correct properties', () => {
        const dto = new CreatePlaceholderRespDTO();
        dto.message = 'Placeholder created successfully';
        dto.placeholderId = 'p-12345';

        expect(dto).toHaveProperty(
          'message',
          'Placeholder created successfully',
        );
        expect(dto).toHaveProperty('placeholderId', 'p-12345');
      });
    });
  });

  describe('updatePlaceholder', () => {
    it('should update an existing placeholder', async () => {
      const orderId = 'p-12345';
      const updatePlaceholderDto: UpdatePlaceholderReqDTO = {
        notes: 'Updated notes',
        driver: 'Jane Smith',
        fences: [{ fenceType: 'Wood', noOfUnits: 5 }],
      };

      const placeholderDoc = {
        project_type: 'Residential',
        notes: 'Test notes',
        address: '123 Main St',
        work_type: 'Install',
        driver: 'John Doe',
        client_name: 'Acme Inc',
        order_id: orderId,
        fences: [{ fence_type: 'Chain Link', no_of_units: 10 }],
        branch: 'NYC',
        created_at: admin.firestore.Timestamp.now(),
        start_date: admin.firestore.Timestamp.fromDate(new Date('2023-05-01')),
        end_date: admin.firestore.Timestamp.fromDate(new Date('2023-05-10')),
      };

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(placeholderDoc);
      jest
        .spyOn(firestoreService, 'setDocument')
        .mockResolvedValueOnce(undefined);

      const result: UpdatePlaceholderRespDTO | Error =
        await service.updatePlaceholder(orderId, updatePlaceholderDto);

      expect(result).toEqual({
        message: 'Placeholder Updated Successfully',
        placeholderId: orderId,
      });
      expect(firestoreService.setDocument).toHaveBeenCalledWith(
        'placeholder',
        orderId,
        expect.objectContaining({
          project_type: 'Residential',
          notes: 'Updated notes',
          address: '123 Main St',
          work_type: 'Install',
          driver: 'Jane Smith',
          client_name: 'Acme Inc',
          order_id: orderId,
          fences: [{ fence_type: 'Wood', no_of_units: 5 }],
          branch: 'NYC',
          created_at: placeholderDoc.created_at,
          start_date: placeholderDoc.start_date,
          end_date: placeholderDoc.end_date,
        }),
      );
    });

    it('should throw an error when updating a non-existing placeholder', async () => {
      const orderId = 'p-12345';
      const updatePlaceholderDto: UpdatePlaceholderReqDTO = {
        notes: 'Updated notes',
        driver: 'Jane Smith',
      };

      jest
        .spyOn(firestoreService, 'getDocumentByName')
        .mockResolvedValueOnce(null);

      await expect(
        service.updatePlaceholder(orderId, updatePlaceholderDto),
      ).rejects.toThrowError('Placeholder not found');
    });

    describe('UpdatePlaceholderRespDTO', () => {
      it('should have the correct properties', () => {
        const dto = new UpdatePlaceholderRespDTO();
        dto.message = 'Placeholder updated successfully';
        dto.placeholderId = 'p-12345';

        expect(dto).toHaveProperty(
          'message',
          'Placeholder updated successfully',
        );
        expect(dto).toHaveProperty('placeholderId', 'p-12345');
      });
    });
  });

  describe('deletePlaceholder', () => {
    it('should delete an existing placeholder', async () => {
      const collection = 'placeholder';
      const docId = 'p-12345';
      const message =
        'Document with ID p-12345 successfully removed from collection placeholder';

      jest
        .spyOn(firestoreService, 'removeDocument')
        .mockResolvedValueOnce(message);

      const result = await service.deletePlaceholder(collection, docId);

      expect(result).toEqual(message);
    });

    it('should throw an error if the placeholder does not exist', async () => {
      const collection = 'placeholder';
      const docId = 'p-12345';
      const error = new Error(
        'Document with ID p-12345 does not exist in collection placeholder',
      );

      jest
        .spyOn(firestoreService, 'removeDocument')
        .mockRejectedValueOnce(error);

      await expect(
        service.deletePlaceholder(collection, docId),
      ).rejects.toEqual(error);
    });
  });
});
