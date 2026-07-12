"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { Heart, Loader2, Star, Eye, Inbox } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export function FavoritesTab() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { data: wishlist = [], isLoading } = useWishlist();

  const removeMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await apiClient.patch(`/users/me/wishlist/${serviceId}`);
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success("Removed from wishlist");
      const cacheKey = ["wishlist", session?.user?.id];
      queryClient.invalidateQueries({ queryKey: cacheKey });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to update wishlist");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-on-surface font-display">
          My Wishlist
        </h2>
        <p className="text-xs text-on-surface/50 mt-0.5">
          Your saved local service listings for quick access and booking
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface/40">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-on-surface text-sm">Wishlist is Empty</h4>
            <p className="text-xs text-on-surface/50 mt-1 max-w-[280px]">
              Explore local service categories and save listings to your wishlist.
            </p>
          </div>
          <Link
            href="/explore"
            className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl hover:brightness-105 transition-all mt-2"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((service: any) => {
            const id = service.id || service._id;
            const emoji = service.images?.[0] || service.imageEmoji || "🛠️";
            return (
              <div
                key={id}
                className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-xs hover:border-primary/50 transition-colors flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    {emoji.startsWith("http://") || emoji.startsWith("https://") || emoji.startsWith("/") ? (
                      <img
                        src={emoji}
                        alt={service.title}
                        className="w-12 h-12 object-cover rounded-xl border border-outline-variant"
                      />
                    ) : (
                      <span className="w-12 h-12 text-3xl flex items-center justify-center bg-surface-container-high/40 rounded-xl">
                        {emoji}
                      </span>
                    )}
                    <button
                      onClick={() => removeMutation.mutate(id)}
                      disabled={removeMutation.isPending}
                      className="w-8 h-8 rounded-full border border-error/20 bg-error/5 hover:bg-error/15 text-error flex items-center justify-center cursor-pointer transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-error text-error" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-base line-clamp-1">{service.title}</h3>
                    <p className="text-xs text-on-surface/50 mt-0.5 capitalize">{service.category} &bull; {service.location}</p>
                    <p className="text-xs text-on-surface/70 mt-2 line-clamp-2">{service.shortDesc}</p>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-outline-variant bg-surface-container/30 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs font-semibold text-on-surface/80">
                    <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                    <span>{service.ratingAvg || "0.0"} ({service.ratingCount || 0})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-on-surface">${service.price}/hr</span>
                    <Link
                      href={`/services/${id}`}
                      className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface/70 hover:text-on-surface transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
