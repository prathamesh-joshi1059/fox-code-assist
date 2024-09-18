export interface MonthsOrdersData {
  project_type: string;
  client_name: string;
  start_date?: Date;
  end_date?: Date;
  address: string;
  phone?: string;
  order_id: string;
  fences: Array<{
    fence_type: string;
    no_of_units: number;
  }>;
  work_type: string;
  driver: string;
}