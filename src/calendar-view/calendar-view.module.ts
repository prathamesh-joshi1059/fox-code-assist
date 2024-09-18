import { Module } from '@nestjs/common';
import { CalendarViewService } from './calendar-view.service';
import { CalendarViewController } from './calendar-view.controller';
import { FirestoreModule } from '../common/firestore/firestore.module';
import { OrderModule } from 'src/orders/order.module';

@Module({
  imports: [FirestoreModule, OrderModule],
  controllers: [CalendarViewController],
  providers: [CalendarViewService],
})
export class CalendarViewModule {}