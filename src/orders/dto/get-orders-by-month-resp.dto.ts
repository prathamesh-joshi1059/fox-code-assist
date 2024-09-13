export class GetOrdersByMonthRespDTO {
  projectType: string;
  clientName: string;
  startDate: string | Date;
  endDate: string | Date;
  address: string;
  phone: string | null;
  orderId: string;
  fences: Array<{
    noOfUnits: number;
    fenceType: string;
  }>;
  workType: string;
  driver: string;
  isPlaceholder: boolean;
}
