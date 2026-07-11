import { apiClient } from "../api-client";
import { ServiceCardProps } from "@/components/cards/ServiceCard";

export interface FetchServicesParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
  rating?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export interface FetchServicesResponse {
  success: boolean;
  data: {
    items: ServiceCardProps[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export const fetchServices = async (params: FetchServicesParams): Promise<FetchServicesResponse> => {
  // Filter out empty params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
  );

  const response = await apiClient.get<FetchServicesResponse>("/services", {
    params: cleanParams,
  });
  return response.data;
};
