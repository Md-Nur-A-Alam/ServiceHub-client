"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { categories } from "@/data/categories";

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-20 bg-surface-container-low">
      <Container>
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight text-on-surface">Browse by Category</h2>
            <p className="text-sm text-on-surface/60 mt-1">
              {categories.length} service categories available in your area
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal scroll-snap on base/sm, grid on md+ */}
        <div
          className="
            flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4
            md:grid md:grid-cols-4 md:overflow-visible md:pb-0
            lg:grid-cols-4
            scrollbar-none
            -mx-4 px-4 md:mx-0 md:px-0
          "
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="
                snap-start shrink-0 w-44 md:w-auto
                group flex flex-col items-center gap-3
                p-5 rounded-2xl bg-surface border border-outline-variant
                hover:border-primary hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200 cursor-pointer
              "
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm text-on-surface">{cat.name}</p>
                <p className="text-xs text-on-surface/50 mt-0.5">{cat.serviceCount} services</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile "View all" link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default CategoriesSection;
