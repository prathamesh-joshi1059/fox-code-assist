import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { GetOrdersByMonthRespDTO } from './dto/get-orders-by-month-resp.dto';
import { getOrdersByDayRespDTO } from './dto/get-orders-by-day-resp.dto';
import { UpdateNotesReqDTO } from './dto/update-notes-req.dto';
import { UpdateNotesRespDTO } from './dto/update-notes-resp.dto';
import { Timestamp } from '@google-cloud/firestore';
import { DaysOrderData } from './interfaces/days-orders';
import { MonthsOrdersData } from './interfaces/months-orders';

@Injectable()
export class OrderService {
  constructor(private readonly firestoreService: FirestoreService) {}

  // Retrieves order data for specified branches and month
  async getMonthsOrderData(
    branches: string[],
    yearMonth: string,
  ): Promise<Array<GetOrdersByMonthRespDTO | Error>> {
    try {
      const [placeholdersSnapshot, ordersSnapshot] = await Promise.all([
        this.firestoreService.getMonthsOrdersByQuery(
          'placeholder',
          'branch',
          branches,
          yearMonth,
        ),
        this.firestoreService.getMonthsOrdersByQuery(
          'orders',
          'branch',
          branches,
          yearMonth,
        ),
      ]);

      const mapData = (data: MonthsOrdersData[], isPlaceholder: boolean) =>
        data.map((item) => ({
          projectType: item.project_type,
          clientName: item.client_name,
          startDate: (
            item.start_date as unknown as Timestamp
          )?.toDate() as Date | null,
          endDate: (
            item.end_date as unknown as Timestamp
          )?.toDate() as Date | null,
          address: item.address,
          phone: item.phone ? item.phone : null,
          orderId: item.order_id,
          fences: item.fences.map(({ fence_type, no_of_units }) => ({
            fenceType: fence_type,
            noOfUnits: no_of_units,
          })),
          workType: item.work_type,
          driver: item.driver,
          isPlaceholder,
        }));

      const placeholdersData = mapData(
        placeholdersSnapshot as MonthsOrdersData[],
        true,
      );
      const ordersData = mapData(ordersSnapshot as MonthsOrdersData[], false);

      const orderArray = [...ordersData, ...placeholdersData];
      return orderArray;
    } catch (error) {
      throw error;
    }
  }

  // Retrieves order data for specified branches and date
  async getDaysOrderData(
    branches: string[],
    date: string,
  ): Promise<Array<getOrdersByDayRespDTO | Error>> {
    try {
      const [placeholdersSnapshot, ordersSnapshot] = await Promise.all([
        this.firestoreService.getDaysOrdersByQuery(
          'placeholder',
          'branch',
          branches,
          date,
        ),
        this.firestoreService.getDaysOrdersByQuery(
          'orders',
          'branch',
          branches,
          date,
        ),
      ]);

      const mapData = (data: DaysOrderData[], isPlaceholder: boolean) =>
        data.map((item) => ({
          projectType: item.project_type,
          clientName: item.client_name,
          address: item.address,
          orderId: item.order_id,
          fences: item.fences.map(
            (fence: { fence_type: string; no_of_units: number }) => ({
              fenceType: fence.fence_type,
              noOfUnits: fence.no_of_units,
            }),
          ),
          workType: item.work_type,
          driver: item.driver,
          notes: item.notes,
          url: isPlaceholder ? null : item.acumatica_url,
          branch: item.branch,
          startDate: (
            item.start_date as unknown as Timestamp
          )?.toDate() as Date | null,
          endDate: (
            item.end_date as unknown as Timestamp
          )?.toDate() as Date | null,
          geoPoint: item.geo_point
            ? {
                latitude: item.geo_point.latitude,
                longitude: item.geo_point.longitude,
              }
            : null,
          phone: item.phone ? item.phone : null,
          isPlaceholder,
        }));

      const placeholdersData = mapData(
        placeholdersSnapshot as DaysOrderData[],
        true,
      );
      const ordersData = mapData(ordersSnapshot as DaysOrderData[], false);

      const orderArray = [...ordersData, ...placeholdersData];
      return orderArray;
    } catch (error) {
      throw error;
    }
  }

  // Updates notes for specified order
  async updateNotes(
    body: UpdateNotesReqDTO,
  ): Promise<UpdateNotesRespDTO | Error> {
    const { orderId, notes } = body;
    try {
      const orderDoc = await this.firestoreService.getDocumentByName(
        'orders',
        orderId,
      );
      if (orderDoc) {
        const updateStatus = await this.firestoreService.updateSingleDoc(
          'orders',
          orderId,
          'notes',
          notes,
        );
        const message: string = updateStatus
          ? 'Notes updated successfully'
          : 'Notes Not Updated';

        return { message };
      }
      const placeholderDoc = await this.firestoreService.getDocumentByName(
        'placeholder',
        orderId,
      );
      if (placeholderDoc) {
        const updateStatus = await this.firestoreService.updateSingleDoc(
          'placeholder',
          orderId,
          'notes',
          notes,
        );

        const message: string = updateStatus
          ? 'Notes updated successfully'
          : 'Notes Not Updated';

        return { message };
      }
      return { message: 'Order not found' };
    } catch (error) {
      throw error;
    }
  }
}
