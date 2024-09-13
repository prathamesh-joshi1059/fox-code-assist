import { Test } from '@nestjs/testing';
import { PlaceholdersModule } from './placeholders.module';
import { FirestoreModule } from '../common/firestore/firestore.module';

describe('PlaceholdersModule', () => {
  it('should compile the module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PlaceholdersModule, FirestoreModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});
