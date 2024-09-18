import { Body, Injectable } from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { GetCalendarViewReqDTO } from './dto/get-calendar-view-req.dto';
import { CreateCalendarViewReqDTO } from './dto/create-calendar-view-req.dto';
import { GetCalendarViewRespDTO } from './dto/get-calendar-view-resp.dto';
import { CreateCalendarViewRespDTO } from './dto/create-calendar-view-resp.dto';
import { OrderService } from '../orders/order.service';
import { UpdateCalendarDetailsRespDTO } from './dto/update-calendar-details-resp.dto';
import { UpdateCalendarDetailsReqDTO } from './dto/update-calendar-details-req.dto';

@Injectable()
export class CalendarViewService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly orderService: OrderService,
  ) {}

  async getCalendarView(
    @Body() body: GetCalendarViewReqDTO,
  ): Promise<GetCalendarViewRespDTO> {
    const { userId, userName } = body;

    try {
      const userDoc = await this.firestoreService.getDocumentByName('Users', userId);

      if (!userDoc) {
        const newUserData = {
          user_id: userId,
          user_name: userName,
          default_calendar_view: null,
        };
        await this.firestoreService.setDocument('Users', userId, newUserData);
        return {
          defaultCalendarView: null,
          orders: [],
          calendarList: [],
        };
      }

      const { default_calendar_view } = userDoc;

      if (default_calendar_view) {
        const calendarViewData = await this.firestoreService.getDocumentByName(
          `Users/${userId}/calendar_views`,
          default_calendar_view,
        );
        const { branches } = calendarViewData;
        const yearMonth = new Date().toISOString().slice(0, 7);
        const orders = await this.orderService.getMonthsOrderData(branches, yearMonth);
        const calendars = await this.firestoreService.getCollection(
          `Users/${userId}/calendar_views`,
        );
        const calendarList = calendars.map((calendar) => ({
          calendarName: calendar.calendar_name,
          branches: calendar.branches,
          isFavorite: calendar.is_favorite,
          isDefault: calendar.is_default,
        }));
        return {
          defaultCalendarView: default_calendar_view,
          orders,
          calendarList,
        };
      }

      return {
        defaultCalendarView: null,
        calendarList: [],
        orders: [],
      };
    } catch (error) {
      throw new Error('Failed to retrieve calendar view');
    }
  }

  async createCalendarView(
    @Body() body: CreateCalendarViewReqDTO,
  ): Promise<CreateCalendarViewRespDTO> {
    const {
      userId,
      calendarName,
      regions,
      areas,
      branches,
      isDefault,
      isFavorite,
    } = body;

    try {
      const calendarView = await this.firestoreService.getCollection(
        `Users/${userId}/calendar_views`,
      );

      const calendarViewData = {
        branches,
        regions,
        areas,
        calendar_name: calendarName,
        is_default: calendarView.length === 0 ? true : isDefault,
        is_favorite: isFavorite,
      };

      await this.firestoreService.setDocument(
        `Users/${userId}/calendar_views`,
        calendarName,
        calendarViewData,
      );

      const batch = this.firestoreService.firestore.batch();
      const userRef = this.firestoreService.firestore.collection('Users').doc(userId);

      if (calendarViewData.is_default) {
        batch.update(userRef, { default_calendar_view: calendarName });
        await this.firestoreService.updateDocumentsWithField(
          `Users/${userId}/calendar_views`,
          calendarName,
          'is_default',
          false,
        );
      }

      await batch.commit();

      return { message: 'Calendar view created successfully' };
    } catch (error) {
      throw new Error('Failed to create calendar view');
    }
  }

  async updateCalendarDetails(
    body: UpdateCalendarDetailsReqDTO,
  ): Promise<UpdateCalendarDetailsRespDTO> {
    const { userId, calendarName, isDefault, isFavorite } = body;

    try {
      const batch = this.firestoreService.firestore.batch();
      const calendarViewRef = this.firestoreService.firestore
        .collection(`Users/${userId}/calendar_views`)
        .doc(calendarName);
      const docSnapshot = await calendarViewRef.get();

      if (!docSnapshot.exists) {
        return { calendarList: [] };
      }

      const viewData = docSnapshot.data();
      batch.update(calendarViewRef, {
        is_default: isDefault ?? viewData.is_default,
        is_favorite: isFavorite ?? viewData.is_favorite,
      });

      if (isDefault) {
        const userRef = this.firestoreService.firestore.collection('Users').doc(userId);
        batch.update(userRef, { default_calendar_view: calendarName });
        await this.firestoreService.updateDocumentsWithField(
          `Users/${userId}/calendar_views`,
          calendarName,
          'is_default',
          false,
        );
      }

      await batch.commit();

      const calendars = await this.firestoreService.getCollection(
        `Users/${userId}/calendar_views`,
      );
      const calendarList = calendars.map((calendar) => ({
        calendarName: calendar.calendar_name,
        branches: calendar.branches,
        isFavorite: calendar.is_favorite,
        isDefault: calendar.is_default,
      }));
      
      return { calendarList };
    } catch (error) {
      throw new Error('Failed to update calendar details');
    }
  }
}