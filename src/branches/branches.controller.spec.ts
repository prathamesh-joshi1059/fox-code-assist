import { Test, TestingModule } from '@nestjs/testing';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { ResponseDTO } from '../common/dto/resp.dto';
import { BranchRespDTO } from './dto/branches-resp.dto';

describe('BranchesController', () => {
  let controller: BranchesController;
  let service: BranchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchesController],
      providers: [
        {
          provide: BranchesService,
          useValue: {
            getAllBranches: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchesController>(BranchesController);
    service = module.get<BranchesService>(BranchesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBranches', () => {
    it('should return all branches', async () => {
      const branches: BranchRespDTO[] = [
        {
          area: 'Texas',
          branchId: 'PCF',
          regionName: 'South',
          branchName: 'PointComfort,TX(PCF)',
        },
        {
          area: 'LosAngeles',
          branchId: 'PLA',
          regionName: 'West',
          branchName: 'Placentia,CA',
        },
      ];

      jest.spyOn(service, 'getAllBranches').mockResolvedValue(branches);

      const result = await controller.getAllBranches();

      expect(result.status).toBe('Success');
      expect(result.statusCode).toBe(1000);
      expect(result.message).toBe('Branches Found');
      expect(result.data).toEqual(branches);
    });
  });
});
