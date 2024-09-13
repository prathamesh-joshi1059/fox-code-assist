import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { FirestoreModule } from '../common/firestore/firestore.module';

// Module for managing order-related operations
@Module({
  imports: [FirestoreModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
