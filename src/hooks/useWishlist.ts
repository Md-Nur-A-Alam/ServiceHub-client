import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

export function useWishlist() {
  const { data: session } = authClient.useSession();
  
  return useQuery({
    queryKey: ["wishlist", session?.user?.id],
    queryFn: async () => {
      if (!session) return [];
      const response = await apiClient.get("/users/me/wishlist");
      return response.data.data || [];
    },
    enabled: !!session,
  });
}
