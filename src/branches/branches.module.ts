import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { FirestoreModule } from '../common/firestore/firestore.module';

@Module({
  imports: [FirestoreModule],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}