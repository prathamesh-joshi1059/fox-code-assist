export class GetOrdersByMonthRespDTO {
  projectType: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  address: string;
  phone?: string | null;
  orderId: string;
  fences: Array<{
    noOfUnits: number;
    fenceType: string;
  }>;
  workType: string;
  driver: string;
  isPlaceholder: boolean;

  constructor(partial: Partial<GetOrdersByMonthRespDTO>) {
    Object.assign(this, partial);
    this.startDate = this.startDate instanceof Date ? this.startDate : new Date(this.startDate);
    this.endDate = this.endDate instanceof Date ? this.endDate : new Date(this.endDate);
    this.phone = this.phone ?? null;
  }
}