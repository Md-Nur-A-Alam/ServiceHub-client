"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Image as ImageIcon, X } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api-client";

interface ReviewFormProps {
  serviceId: string;
  bookingId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ serviceId, bookingId, onSuccess }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/reviews", {
        serviceId,
        bookingId,
        rating,
        comment,
        images,
      });
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews", serviceId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || "Failed to submit review.");
    },
  });

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      toast.error("Please enter a valid HTTP/HTTPS image URL.");
      return;
    }
    setImages((prev) => [...prev, imageUrl]);
    setImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }
    submitMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-outline-variant rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
      <div>
        <h3 className="font-bold text-on-surface text-base font-display">Write a Review</h3>
        <p className="text-xs text-on-surface/60">Share your experience with other customers</p>
      </div>

      {/* Star Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-on-surface/70">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-on-surface/30 hover:scale-110 transition-transform cursor-pointer"
            >
              <Star
                className={`w-7 h-7 transition-colors duration-150 ${
                  star <= (hoverRating || rating)
                    ? "text-secondary fill-secondary"
                    : "text-outline-variant"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-1">
        <label htmlFor="review-comment" className="text-xs font-semibold text-on-surface/70">Comment</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this service? Was it on time, of good quality, etc.?"
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
        />
      </div>

      {/* Optional Images */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-on-surface/70">Attach Images (Optional)</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste image URL here..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-3 py-2 bg-surface-container border border-outline-variant hover:bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface transition-colors cursor-pointer flex items-center gap-1"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-outline-variant bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Attached review item" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:brightness-110 transition-all text-sm cursor-pointer disabled:opacity-50 mt-2"
      >
        {submitMutation.isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
