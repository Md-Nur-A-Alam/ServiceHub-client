"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Star, MessageSquare, CornerDownRight, Loader2, Send, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";

interface ReviewsTabProps {
  role: string;
}

export function ReviewsTab({ role }: ReviewsTabProps) {
  const queryClient = useQueryClient();
  const [replyTextMap, setReplyTextMap] = useState<{ [reviewId: string]: string }>({});
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  // Fetch reviews relevant to the user's role
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const response = await apiClient.get("/reviews/user/me");
      return response.data.data || [];
    }
  });

  // Reply to review mutation (Provider Only)
  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: string; reply: string }) => {
      const response = await apiClient.patch(`/reviews/${reviewId}/reply`, { providerReply: reply });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Reply submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      setActiveReplyBox(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || "Failed to submit reply.");
    }
  });

  const handleReplySubmit = (reviewId: string) => {
    const replyText = replyTextMap[reviewId];
    if (!replyText || !replyText.trim()) {
      toast.error("Reply content cannot be empty.");
      return;
    }
    replyMutation.mutate({ reviewId, reply: replyText });
  };

  const getStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-secondary">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-secondary" : "text-outline-variant"}`}
          />
        ))}
      </div>
    );
  };

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
          Service Reviews
        </h2>
        <p className="text-xs text-on-surface/50 mt-0.5">
          {role === "customer"
            ? "Reviews you have posted for completed bookings"
            : role === "provider"
            ? "Reviews and feedback received on your service listings"
            : "Monitor reviews posted across the platform"
          }
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-surface border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface/40">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-on-surface text-sm">No Reviews Found</h4>
              <p className="text-xs text-on-surface/50 mt-1 max-w-[280px]">
                {role === "customer"
                  ? "You have not submitted any reviews yet."
                  : role === "provider"
                  ? "No reviews have been left for your services yet."
                  : "No reviews exist on the platform."
                }
              </p>
            </div>
          </div>
        ) : (
          reviews.map((review: any) => (
            <div
              key={review._id}
              className="bg-surface border border-outline-variant rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-bold text-sm font-display">
                    {review.user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">{review.user?.name || "Customer"}</h4>
                    <p className="text-xs text-on-surface/50 mt-0.5">
                      Service: <span className="font-semibold">{review.service?.title || "Deleted Service"}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-1.5">
                  {getStars(review.rating)}
                  <span className="text-[11px] text-on-surface/40">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Review Body */}
              <p className="text-sm text-on-surface/80 leading-relaxed italic">
                "{review.comment}"
              </p>

              {/* Review Photos (if any) */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2">
                  {review.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-outline-variant bg-surface-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Attached review item" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Provider Reply */}
              {review.providerReply ? (
                <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-4 flex gap-3">
                  <CornerDownRight className="w-4 h-4 text-on-surface/40 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-on-surface/60">Provider Reply</div>
                    <p className="text-sm text-on-surface/85 leading-relaxed">
                      {review.providerReply}
                    </p>
                  </div>
                </div>
              ) : (
                role === "provider" && (
                  <div className="pt-2">
                    {activeReplyBox === review._id ? (
                      <div className="space-y-3">
                        <textarea
                          placeholder="Type your response to this customer review..."
                          value={replyTextMap[review._id] || ""}
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [review._id]: e.target.value })}
                          className="w-full p-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleReplySubmit(review._id)}
                            disabled={replyMutation.isPending}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/95 transition-colors disabled:opacity-55 cursor-pointer"
                          >
                            {replyMutation.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Submit Reply</span>
                          </button>
                          <button
                            onClick={() => setActiveReplyBox(null)}
                            className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveReplyBox(review._id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply to this review</span>
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
