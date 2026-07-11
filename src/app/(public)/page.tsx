import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { StatsBand } from "@/components/sections/StatsBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { ProviderCTA } from "@/components/sections/ProviderCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "ServiceHub — Find Trusted Local Services Near You",
  description:
    "Discover and book 500+ verified home service professionals near you. Cleaning, plumbing, electrical, painting and more. Instant booking, transparent pricing.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoriesSection />
      <FeaturedServices />
      <HowItWorks />
      <StatsBand />
      <Testimonials />
      <ProviderCTA />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
