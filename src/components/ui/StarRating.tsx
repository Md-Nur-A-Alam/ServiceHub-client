import * as React from "react";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-secondary">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}
