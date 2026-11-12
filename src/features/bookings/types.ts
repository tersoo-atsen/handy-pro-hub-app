export interface Booking {
  id: string;
  job_id: string;
  bid_id: string | null;
  customer_id: string;
  artisan_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  agreed_amount: number;
  scheduled_start: string | null;
  scheduled_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  customer_notes: string | null;
  artisan_notes: string | null;
  created_at: string;
  updated_at: string;
}
