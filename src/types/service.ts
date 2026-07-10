export interface Service {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  images: string[];
  price: number;
  category: string;
  location: string;
  providerId: string;
  ratingAvg: number;
  ratingCount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
