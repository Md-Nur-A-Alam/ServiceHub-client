"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { Container } from "@/components/layout/Container";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SkeletonCard } from "@/components/cards/SkeletonCard";
import { Heart, Search } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { data: wishlist = [], isLoading, isError } = useWishlist();

  return (
    <div className="bg-background min-h-screen py-8">
      <Container>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
            <Heart className="w-5 h-5 fill-error" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface font-display">My Wishlist</h1>
            <p className="text-sm text-on-surface/60">Services you have saved for later</p>
          </div>
        </div>

        {isError ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-outline-variant rounded-2xl bg-surface/50 text-center">
            <h3 className="text-xl font-bold text-on-surface mb-2">Failed to load wishlist</h3>
            <p className="text-on-surface/60 max-w-md">There was an issue loading your wishlisted services. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-outline-variant rounded-2xl bg-surface/50 text-center">
            <Heart className="w-12 h-12 text-on-surface/20 mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">Your wishlist is empty</h3>
            <p className="text-on-surface/60 max-w-md mb-6">
              Explore the available services, find the perfect providers, and tap the heart icon to save services here.
            </p>
            <Link
              href="/explore"
              className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:brightness-110 transition-all shadow-sm text-sm"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {wishlist.map((service: any) => (
              <ServiceCard
                key={service.id || service._id}
                id={service.id || service._id}
                title={service.title}
                category={service.category}
                providerName={service.providerName}
                location={service.location}
                price={service.price}
                ratingAvg={service.ratingAvg}
                ratingCount={service.ratingCount}
                imageEmoji={service.imageEmoji}
                imageBg={service.imageBg}
                shortDesc={service.shortDesc}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
