import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ServiceCard } from "@/components/cards/ServiceCard";

const featuredServices = [
  {
    id: "feat-1",
    title: "Professional Home Deep Cleaning",
    category: "Cleaning",
    providerName: "SparkleClean Pro",
    location: "Austin, TX",
    price: 85,
    ratingAvg: 4.9,
    ratingCount: 234,
    imageEmoji: "🧹",
    imageBg: "bg-primary/10",
    shortDesc: "Thorough top-to-bottom clean of your home including bathrooms, kitchen, and bedrooms.",
    badges: ["Top Rated"],
  },
  {
    id: "feat-2",
    title: "Emergency Plumbing Repair",
    category: "Plumbing",
    providerName: "QuickFix Plumbers",
    location: "Chicago, IL",
    price: 120,
    ratingAvg: 4.8,
    ratingCount: 178,
    imageEmoji: "🔧",
    imageBg: "bg-secondary/10",
    shortDesc: "Fast response plumbing repairs for leaks, blockages, and pipe issues.",
    badges: ["Fast Response"],
  },
  {
    id: "feat-3",
    title: "Interior Room Painting",
    category: "Painting",
    providerName: "BrushMaster Studios",
    location: "Seattle, WA",
    price: 199,
    ratingAvg: 4.9,
    ratingCount: 112,
    imageEmoji: "🎨",
    imageBg: "bg-tertiary/10",
    shortDesc: "Professional interior painting with premium paints, clean lines, and zero mess.",
    badges: ["Insured"],
  },
  {
    id: "feat-4",
    title: "Lawn Care & Mowing",
    category: "Landscaping",
    providerName: "GreenThumb Services",
    location: "Nashville, TN",
    price: 60,
    ratingAvg: 4.7,
    ratingCount: 291,
    imageEmoji: "🌿",
    imageBg: "bg-primary/10",
    shortDesc: "Weekly or bi-weekly lawn mowing, edging, and cleanup for any yard size.",
    badges: [],
  },
  {
    id: "feat-5",
    title: "Electrical Panel Inspection",
    category: "Electrical",
    providerName: "VoltSafe Electricians",
    location: "Denver, CO",
    price: 150,
    ratingAvg: 5.0,
    ratingCount: 67,
    imageEmoji: "⚡",
    imageBg: "bg-secondary/10",
    shortDesc: "Certified electrical inspection for safety, compliance, and fault detection.",
    badges: ["Certified"],
  },
  {
    id: "feat-6",
    title: "Custom Cabinet Installation",
    category: "Carpentry",
    providerName: "WoodCraft Pros",
    location: "Portland, OR",
    price: 320,
    ratingAvg: 4.8,
    ratingCount: 44,
    imageEmoji: "🪚",
    imageBg: "bg-tertiary/10",
    shortDesc: "Precision cabinet fitting and custom woodwork for kitchens and bathrooms.",
    badges: [],
  },
];

export function FeaturedServices() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <Container>
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight tracking-tight text-on-surface">Featured Services</h2>
            <p className="text-sm text-on-surface/60 mt-1">
              Hand-picked top-rated services this week
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
          >
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* xl shows 4, but we slice to 8 max */}
          {featuredServices.slice(0, 8).map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Browse all services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedServices;
