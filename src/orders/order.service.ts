import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { GetOrdersByMonthRespDTO } from './dto/get-orders-by-month-resp.dto';
import { UpdateNotesReqDTO } from './dto/update-notes-req.dto';
import { UpdateNotesRespDTO } from './dto/update-notes-resp.dto';
import { Timestamp } from '@google-cloud/firestore';
import { DaysOrderData } from './interfaces/days-orders';
import { MonthsOrdersData } from './interfaces/months-orders';

@Injectable()
export class OrderService {
  constructor(private readonly firestoreService: FirestoreService) {}

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
          startDate: (item.start_date as Timestamp)?.toDate() ?? null,
          endDate: (item.end_date as Timestamp)?.toDate() ?? null,
          address: item.address,
          phone: item.phone ?? null,
          orderId: item.order_id,
          fences: item.fences.map(({ fence_type, no_of_units }) => ({
            fenceType: fence_type,
            noOfUnits: no_of_units,
          })),
          workType: item.work_type,
          driver: item.driver,
          isPlaceholder,
        }));

      return [...mapData(placeholdersSnapshot as MonthsOrdersData[], true), 
              ...mapData(ordersSnapshot as MonthsOrdersData[], false)];
    } catch (error) {
      throw new Error(`Error fetching monthly orders: ${error.message}`);
    }
  }

  async getDaysOrderData(
    branches: string[],
    date: string,
  ): Promise<Array<DaysOrderData | Error>> {
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
          fences: item.fences.map(({ fence_type, no_of_units }) => ({
            fenceType: fence_type,
            noOfUnits: no_of_units,
          })),
          workType: item.work_type,
          driver: item.driver,
          notes: item.notes,
          url: isPlaceholder ? null : item.acumatica_url,
          branch: item.branch,
          startDate: (item.start_date as Timestamp)?.toDate() ?? null,
          endDate: (item.end_date as Timestamp)?.toDate() ?? null,
          geoPoint: item.geo_point
            ? {
                latitude: item.geo_point.latitude,
                longitude: item.geo_point.longitude,
              }
            : null,
          phone: item.phone ?? null,
          isPlaceholder,
        }));

      return [...mapData(placeholdersSnapshot as DaysOrderData[], true), 
              ...mapData(ordersSnapshot as DaysOrderData[], false)];
    } catch (error) {
      throw new Error(`Error fetching daily orders: ${error.message}`);
    }
  }

  async updateNotes(
    body: UpdateNotesReqDTO,
  ): Promise<UpdateNotesRespDTO | Error> {
    const { orderId, notes } = body;
    try {
      const updateOrderNotes = async (collection: string) => {
        const orderDoc = await this.firestoreService.getDocumentByName(collection, orderId);
        if (orderDoc) {
          const updateStatus = await this.firestoreService.updateSingleDoc(
            collection,
            orderId,
            'notes',
            notes,
          );
          return { message: updateStatus ? 'Notes updated successfully' : 'Notes Not Updated' };
        }
        return null;
      };

      const orderResponse = await updateOrderNotes('orders') || await updateOrderNotes('placeholder');
      
      return orderResponse || { message: 'Order not found' };
    } catch (error) {
      throw new Error(`Error updating notes: ${error.message}`);
    }
  }
}