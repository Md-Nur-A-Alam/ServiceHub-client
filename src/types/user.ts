export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "customer" | "provider" | "admin";
  emailVerified: boolean;
  savedServices: string[];
  provider?: {
    bio: string;
    verified: boolean;
  };
  createdAt: string;
}
