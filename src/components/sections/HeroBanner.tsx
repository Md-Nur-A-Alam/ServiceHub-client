"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, Star, Shield, Clock, Users } from "lucide-react";
import { Container } from "@/components/layout/Container";

const stats = [
  { label: "Active Providers", value: "1,200+", icon: Users },
  { label: "Jobs Completed", value: "45,000+", icon: Star },
  { label: "Verified & Insured", value: "100%", icon: Shield },
  { label: "Avg. Response", value: "< 1 hr", icon: Clock },
];

const floatingCards = [
  {
    title: "House Deep Clean",
    category: "Cleaning",
    rating: 4.9,
    reviews: 234,
    price: "$85",
    emoji: "🧹",
    badge: "Top Rated",
  },
  {
    title: "Leak Repair",
    category: "Plumbing",
    rating: 4.8,
    reviews: 178,
    price: "$120",
    emoji: "🔧",
    badge: "Fast Response",
  },
];

export function HeroBanner() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("loc", location);
    window.location.href = `/explore?${params.toString()}`;
  };

  return (
    <section
      className="relative overflow-hidden bg-background"
      style={{ minHeight: "clamp(60vh, 65vh, 70vh)" }}
    >
      {/* Background gradient decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% -10%, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 70%)",
        }}
      />

      <Container className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-14 md:py-16 lg:py-20">
        {/* Text + search column (55% on lg+) */}
        <div className="flex-1 lg:w-[55%] flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          {/* Eyebrow badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Trusted by 50,000+ homeowners
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight text-on-surface">
            Find Trusted{" "}
            <span
              className="text-primary"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Local Services
            </span>{" "}
            in Minutes
          </h1>

          {/* Subtext */}
          <p className="text-lg text-on-surface/70 max-w-lg">
            Browse 500+ verified home service professionals in your area — from cleaning and plumbing to electrical work and painting. Book instantly, no phone calls needed.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-lg lg:max-w-none">
            {/* Stacked on base/sm, inline pill on md+ */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:bg-surface md:border md:border-outline-variant md:rounded-full md:p-1.5 md:shadow-md">
              {/* "What" field */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 md:py-2.5 rounded-full md:rounded-none md:bg-transparent bg-surface border border-outline-variant md:border-none text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary md:focus:ring-0 min-h-[44px]"
                />
              </div>

              {/* Divider (md+) */}
              <div className="hidden md:block w-px bg-outline-variant self-stretch my-1" />

              {/* "Where" field */}
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 md:py-2.5 rounded-full md:rounded-none md:bg-transparent bg-surface border border-outline-variant md:border-none text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary md:focus:ring-0 min-h-[44px]"
                />
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-full hover:brightness-110 active:brightness-95 transition-all cursor-pointer min-h-[44px] shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap md:flex-nowrap justify-center lg:justify-start gap-3 mt-1">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs"
              >
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-bold text-on-surface">{value}</span>
                <span className="text-on-surface/60">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual composition column (45% on lg+, below text on base/md) */}
        <div className="w-full lg:w-[45%] flex justify-center relative h-72 md:h-80 lg:h-96 shrink-0">
          {/* Background orb */}
          <div
            className="absolute inset-0 rounded-3xl opacity-30"
            style={{
              background: "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent 70%)",
            }}
          />

          {/* Floating service cards */}
          {floatingCards.map((card, i) => (
            <div
              key={card.title}
              className={`absolute bg-surface border border-outline-variant rounded-2xl p-4 shadow-xl w-52 ${
                i === 0 ? "top-4 left-4 lg:left-8 rotate-[-3deg]" : "bottom-8 right-4 lg:right-8 rotate-[2deg]"
              } transition-transform hover:rotate-0 hover:scale-105 duration-300`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{card.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm truncate">{card.title}</p>
                  <p className="text-xs text-on-surface/50">{card.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-secondary fill-secondary" />
                    <span className="text-xs font-bold text-on-surface">{card.rating}</span>
                    <span className="text-xs text-on-surface/40">({card.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant">
                <span className="text-sm font-bold text-primary">{card.price}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {card.badge}
                </span>
              </div>
            </div>
          ))}

          {/* Confirmation toast */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-outline-variant rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 w-56">
            <div className="w-9 h-9 rounded-full bg-tertiary/15 flex items-center justify-center shrink-0">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Booking Confirmed!</p>
              <p className="text-xs text-on-surface/50">Today, 2:00 PM</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroBanner;
