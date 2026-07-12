"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, CornerDownRight, MessageSquare, Reply } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api-client";

interface ReviewCardProps {
  id: string;
  serviceId: string;
  rating: number;
  comment: string;
  images: string[];
  providerReply?: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  isProviderOwner?: boolean;
}

export function ReviewCard({
  id,
  serviceId,
  rating,
  comment,
  images,
  providerReply,
  createdAt,
  user,
  isProviderOwner = false,
}: ReviewCardProps) {
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const replyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/reviews/${id}/reply`, {
        providerReply: replyText,
      });
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Reply submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews", serviceId] });
      setReplyText("");
      setShowReplyForm(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || "Failed to submit reply.");
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Reply text cannot be empty.");
      return;
    }
    replyMutation.mutate();
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-sm space-y-4">
      {/* Reviewer Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface leading-tight">{user.name}</h4>
            <span className="text-[10px] text-on-surface/50">
              {new Date(createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Rating stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating ? "text-secondary fill-secondary" : "text-outline-variant"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-sm text-on-surface/80 leading-relaxed break-words">{comment}</p>

      {/* Review Images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <a key={idx} href={img} target="_blank" rel="noreferrer" className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant hover:opacity-90 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="User review submission" className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}

      {/* Provider Reply block */}
      {providerReply ? (
        <div className="flex gap-2 pl-4 border-l-2 border-outline-variant mt-2">
          <CornerDownRight className="w-4 h-4 text-on-surface/40 shrink-0 mt-1" />
          <div className="bg-surface-container/60 rounded-xl p-3 flex-1">
            <span className="text-[11px] font-bold text-primary block mb-0.5">Response from provider:</span>
            <p className="text-xs text-on-surface/80 leading-relaxed">{providerReply}</p>
          </div>
        </div>
      ) : (
        isProviderOwner && !showReplyForm && (
          <button
            onClick={() => setShowReplyForm(true)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer mt-1"
          >
            <Reply className="w-3.5 h-3.5" />
            <span>Reply to review</span>
          </button>
        )
      )}

      {/* Inline Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="flex gap-2 pl-4 border-l-2 border-primary mt-2">
          <div className="flex-1 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response as the service provider..."
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary h-16 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={replyMutation.isPending}
                className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
              >
                {replyMutation.isPending ? "Replying..." : "Submit Reply"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
export default ReviewCard;
