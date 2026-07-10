export interface Review {
  _id: string;
  serviceId: string;
  userId: string;
  rating: number;
  comment: string;
  images?: string[];
  providerReply?: string;
  createdAt: string;
}
