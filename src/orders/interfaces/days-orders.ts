import { GeoPoint } from '@google-cloud/firestore';

export interface DaysOrderData {
  project_type: string;
  client_name: string;
  address: string;
  order_id: string;
  fences: {
    fence_type: string;
    no_of_units: number;
  }[];
  work_type: string;
  driver: string;
  notes: string;
  acumatica_url?: string;
  branch?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  phone?: string | null;
  geo_point?: GeoPoint;
}
