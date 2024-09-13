import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

// Module for Firestore integration
@Module({
  providers: [FirestoreService],
  exports: [FirestoreService],
})
export class FirestoreModule {}
