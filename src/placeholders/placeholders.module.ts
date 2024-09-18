import { Module } from '@nestjs/common';
import { PlaceholdersService } from './placeholders.service';
import { PlaceholdersController } from './placeholders.controller';
import { FirestoreModule } from '../common/firestore/firestore.module';

@Module({
  imports: [FirestoreModule],
  controllers: [PlaceholdersController],
  providers: [PlaceholdersService],
})
export class PlaceholdersModule {}