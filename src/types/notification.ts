export interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
