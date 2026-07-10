export interface Booking {
  _id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
  notes?: string;
  createdAt: string;
}
