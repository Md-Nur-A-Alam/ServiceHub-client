import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await apiClient.get("/services");
      return response.data;
    },
  });
}
