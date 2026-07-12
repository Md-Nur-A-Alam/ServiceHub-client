"use client";

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { WishlistButton } from "../ui/WishlistButton";

export interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  providerName: string;
  location: string;
  price: number;
  ratingAvg: number;
  ratingCount: number;
  imageEmoji?: string;
  imageBg?: string;
  shortDesc?: string;
  badges?: string[];
}

export function ServiceCard({
  id,
  title,
  category,
  providerName,
  location,
  price,
  ratingAvg,
  ratingCount,
  imageEmoji = "🏠",
  imageBg = "bg-primary/10",
  shortDesc,
  badges = [],
}: ServiceCardProps) {
  return (
    <article className="group flex flex-col bg-surface border border-outline-variant rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Image container — fixed aspect ratio */}
      <div className={`relative w-full aspect-[4/3] ${imageBg} flex items-center justify-center overflow-hidden`}>
        <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
          {imageEmoji}
        </span>
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-sm text-xs font-semibold text-on-surface border border-outline-variant">
          {category}
        </span>
        {/* Wishlist button */}
        <WishlistButton serviceId={id} className="absolute top-3 right-3" />
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {badges.map((b) => (
              <span
                key={b}
                className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-xs font-bold"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div>
          <h3 className="font-bold text-on-surface text-sm leading-snug line-clamp-2">{title}</h3>
          <p className="text-xs text-on-surface/60 mt-0.5">{providerName}</p>
        </div>

        {shortDesc && (
          <p className="text-xs text-on-surface/70 line-clamp-2 leading-relaxed">{shortDesc}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-on-surface/60">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
            <span className="font-bold text-on-surface">{ratingAvg.toFixed(1)}</span>
            <span>({ratingCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{location}</span>
          </div>
        </div>

        {/* Price + CTA — pinned to bottom with mt-auto */}
        <div className="mt-auto pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-on-surface">${price}</span>
            <span className="text-xs text-on-surface/50 ml-1">/ service</span>
          </div>
          <Link
            href={`/services/${id}`}
            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:brightness-110 transition-all shrink-0"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;
