"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  serviceId: string;
  className?: string;
}

export function WishlistButton({ serviceId, className = "" }: WishlistButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { data: wishlist = [] } = useWishlist();

  const isWishlisted = wishlist.some(
    (item: any) => item.id === serviceId || item._id === serviceId
  );

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isWishlisted) {
        const response = await apiClient.delete(`/favorites/${serviceId}`);
        return { active: false, data: response.data };
      } else {
        const response = await apiClient.post(`/favorites`, { serviceId });
        return { active: true, data: response.data };
      }
    },
    onMutate: async () => {
      const cacheKey = ["wishlist", session?.user?.id];
      await queryClient.cancelQueries({ queryKey: cacheKey });
      const previousWishlist = queryClient.getQueryData(cacheKey);

      queryClient.setQueryData(cacheKey, (old: any[] = []) => {
        const exists = old.some((item: any) => item.id === serviceId || item._id === serviceId);
        if (exists) {
          return old.filter((item: any) => item.id !== serviceId && item._id !== serviceId);
        } else {
          return [...old, { id: serviceId, _id: serviceId }];
        }
      });

      return { previousWishlist };
    },
    onError: (err: any, _, context) => {
      const cacheKey = ["wishlist", session?.user?.id];
      queryClient.setQueryData(cacheKey, context?.previousWishlist);
      toast.error(err?.response?.data?.error?.message || "Failed to update wishlist.");
    },
    onSuccess: (data) => {
      toast.success(data.active ? "Saved to wishlist" : "Removed from wishlist");
    },
    onSettled: () => {
      const cacheKey = ["wishlist", session?.user?.id];
      queryClient.invalidateQueries({ queryKey: cacheKey });
      // Invalidate session to sync changes
      authClient.getSession();
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.info("Please log in to add items to your wishlist.");
      router.push("/login");
      return;
    }

    if (session.user.role !== "customer") {
      toast.warn("Only customer accounts can use the wishlist.");
      return;
    }

    toggleMutation.mutate();
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
      className={`w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm border flex items-center justify-center transition-all duration-200 cursor-pointer ${
        isWishlisted
          ? "text-error border-error bg-error/10 scale-110"
          : "text-on-surface/50 border-outline-variant hover:text-error hover:border-error hover:scale-105"
      } ${className}`}
      disabled={toggleMutation.isPending}
    >
      <Heart className={`w-4 h-4 transition-transform duration-200 ${isWishlisted ? "fill-error" : ""}`} />
    </button>
  );
}
