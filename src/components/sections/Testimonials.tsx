"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-16 md:py-20 bg-background">
      <Container>
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight text-on-surface">What Our Customers Say</h2>
          <p className="text-base text-on-surface/60 mt-3">
            Real experiences from real homeowners
          </p>
        </div>

        {/* Carousel (base/sm/md) — single card + arrows */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full shrink-0 px-1">
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current ? "bg-primary w-6" : "bg-outline-variant"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Static 3-up grid (lg+) */}
        <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-surface border border-outline-variant rounded-2xl h-full">
      {/* Quote icon */}
      <Quote className="w-6 h-6 text-primary/30 shrink-0" />

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
        ))}
      </div>

      {/* Content */}
      <p className="text-sm text-on-surface/80 leading-relaxed flex-1">"{t.content}"</p>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-outline-variant">
        <div
          className={`w-10 h-10 rounded-full ${t.avatarColor} flex items-center justify-center text-on-primary text-sm font-bold shrink-0`}
        >
          {t.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-on-surface truncate">{t.name}</p>
          <p className="text-xs text-on-surface/50 truncate">{t.role} · {t.location}</p>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
