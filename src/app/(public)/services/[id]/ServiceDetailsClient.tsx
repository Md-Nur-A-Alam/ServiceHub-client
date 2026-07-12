"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { useBookings } from "@/hooks/useBooking";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { ReviewCard } from "@/components/cards/ReviewCard";

interface ServiceDetailsClientProps {
  serviceId: string;
  providerId: string;
}

export function ServiceDetailsClient({ serviceId, providerId }: ServiceDetailsClientProps) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const isProviderOwner = userId === providerId;

  // 1. Fetch reviews for the service
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", serviceId],
    queryFn: async () => {
      const res = await apiClient.get(`/reviews/service/${serviceId}`);
      return res.data.data || [];
    },
    enabled: !!serviceId,
  });

  // 2. Fetch bookings to check eligibility for leaving a review
  const { data: bookings = [] } = useBookings();

  // Find all completed bookings for this service
  const completedBookings = bookings.filter(
    (b: any) => (b.serviceId?._id === serviceId || b.serviceId === serviceId) && b.status === "completed"
  );

  // Find if there's any completed booking that does NOT have a review yet
  const unreviewedBooking = completedBookings.find(
    (b: any) => !reviews.some((r: any) => r.bookingId === b._id)
  );

  return (
    <div className="space-y-6">
      {/* Review Eligibility & Form */}
      {unreviewedBooking && (
        <ReviewForm
          serviceId={serviceId}
          bookingId={unreviewedBooking._id}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-on-surface font-display">
            Customer Reviews ({reviews.length})
          </h3>
        </div>

        {isLoadingReviews ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 border border-outline-variant rounded-2xl bg-surface/30 text-center">
            <span className="text-3xl block mb-2">⭐</span>
            <p className="text-sm font-semibold text-on-surface">No reviews yet</p>
            <p className="text-xs text-on-surface/50 mt-1">Be the first to book and share your feedback!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <ReviewCard
                key={review._id}
                id={review._id}
                serviceId={serviceId}
                rating={review.rating}
                comment={review.comment}
                images={review.images}
                providerReply={review.providerReply}
                createdAt={review.createdAt}
                user={review.user}
                isProviderOwner={isProviderOwner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default ServiceDetailsClient;
