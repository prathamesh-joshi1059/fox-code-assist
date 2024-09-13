import { Test, TestingModule } from '@nestjs/testing';
import { BranchesService } from './branches.service';
import { FirestoreService } from '../common/firestore/firestore.service';
import { BranchRespDTO } from './dto/branches-resp.dto';

describe('BranchesService', () => {
  let service: BranchesService;
  let firestoreService: FirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchesService,
        {
          provide: FirestoreService,
          useValue: {
            getCollection: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BranchesService>(BranchesService);
    firestoreService = module.get<FirestoreService>(FirestoreService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllBranches', () => {
    it('should return an array of BranchRespDTO objects', async () => {
      const mockBranches = [
        {
          area: 'Florida',
          branch_id: 'MUL',
          region_name: 'South',
          branch_name: 'Mulberry,FL(MUL)',
        },
        {
          area: 'Texas',
          branch_id: 'PCF',
          region_name: 'South',
          branch_name: 'PointComfort,TX(PCF)',
        },
      ];

      jest
        .spyOn(firestoreService, 'getCollection')
        .mockResolvedValue(mockBranches);

      const result = await service.getAllBranches();

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          area: 'Florida',
          branchId: 'MUL',
          regionName: 'South',
          branchName: 'Mulberry,FL(MUL)',
        },
        {
          area: 'Texas',
          branchId: 'PCF',
          regionName: 'South',
          branchName: 'PointComfort,TX(PCF)',
        },
      ]);
    });

    it('should handle errors thrown by the FirestoreService', async () => {
      const errorMessage = 'Failed to fetch branches';
      jest
        .spyOn(firestoreService, 'getCollection')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.getAllBranches()).rejects.toThrowError(errorMessage);
    });

    describe('BranchesRespDTO', () => {
      it('should have the correct properties', () => {
        const dto = new BranchRespDTO();
        dto.branchId = 'MEL';

        expect(dto).toHaveProperty('branchId', 'MEL');
      });
    });
  });
});
