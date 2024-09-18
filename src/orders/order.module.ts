import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { FirestoreModule } from '../common/firestore/firestore.module';

@Module({
  imports: [FirestoreModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}