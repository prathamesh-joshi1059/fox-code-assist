import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './orders/order.controller';
import { OrderModule } from './orders/order.module';
import { FirestoreModule } from './common/firestore/firestore.module';
import { AzureADStrategy } from './common/guards/authentication/authentication.guard';
import { CalendarViewModule } from './calendar-view/calendar-view.module';
import { BranchesModule } from './branches/branches.module';
import { PlaceholdersModule } from './placeholders/placeholders.module';

// Root module of the application
@Module({
  imports: [
    ConfigModule.forRoot(),
    OrderModule,
    FirestoreModule,
    CalendarViewModule,
    BranchesModule,
    PlaceholdersModule,
  ],
  controllers: [OrderController],
  providers: [AzureADStrategy],
})
export class AppModule {}
