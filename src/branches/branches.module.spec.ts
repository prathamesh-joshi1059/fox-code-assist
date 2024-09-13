import { Test } from '@nestjs/testing';
import { BranchesModule } from './branches.module';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';

describe('BranchesModule', () => {
  // Test case to verify module compilation and dependency injection
  it('should compile the module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BranchesModule],
    }).compile();
    expect(moduleRef).toBeDefined();
    expect(moduleRef.get(BranchesService)).toBeDefined();
    expect(moduleRef.get(BranchesController)).toBeDefined();
  });
});
