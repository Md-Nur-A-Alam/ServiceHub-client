import { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { BookingCard } from "@/components/sections/BookingCard";
import { Star, MapPin, ShieldCheck, Mail, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceDetailsClient from "./ServiceDetailsClient";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

async function getService(id: string) {
  const serverUrl = process.env.SERVER_PRODUCTION_URL || process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${serverUrl}/api/v1/services/${id}`, {
      next: { revalidate: 10 }, // cache for 10 seconds
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data;
  } catch (error) {
    console.error("Error fetching service details on server:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.id);
  if (!service) {
    return {
      title: "Service Not Found - ServiceHub",
    };
  }

  return {
    title: `${service.title} by ${service.providerName} - ServiceHub`,
    description: service.shortDesc,
    openGraph: {
      title: service.title,
      description: service.shortDesc,
      images: [
        {
          url: service.images?.[0] || "https://images.unsplash.com/photo-1521791136364-7286472b64a2?w=800",
          width: 800,
          height: 600,
          alt: service.title,
        },
      ],
    },
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.id);
  if (!service) {
    notFound();
  }

  // Create JSON-LD Product/Service schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDesc,
    "provider": {
      "@type": "LocalBusiness",
      "name": service.providerName,
      "email": service.providerEmail,
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": service.location,
    },
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    ...(service.ratingCount > 0
      ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": service.ratingAvg,
            "reviewCount": service.ratingCount,
          },
        }
      : {}),
  };

  return (
    <>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-background min-h-screen py-8">
        <Container>
          {/* Breadcrumb */}
          <div className="text-xs text-on-surface/50 mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
            <span>/</span>
            <span className="text-on-surface/80 truncate max-w-[200px]">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details & Reviews */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Header Info */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    {service.category}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight font-display">
                  {service.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-on-surface/65">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-bold text-on-surface">{service.ratingAvg.toFixed(1)}</span>
                    <span>({service.ratingCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span className="capitalize">{service.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span>Verified Provider</span>
                  </div>
                </div>
              </div>

              {/* Service Hero Image */}
              <div className="aspect-[16/9] w-full rounded-2xl bg-surface-container flex items-center justify-center border border-outline-variant overflow-hidden">
                <span className="text-9xl">{service.imageEmoji || "🏠"}</span>
              </div>

              {/* Description */}
              <div className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-on-surface font-display flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Service Description</span>
                </h3>
                <p className="text-sm text-on-surface/75 leading-relaxed break-words whitespace-pre-line">
                  {service.fullDesc}
                </p>
              </div>

              {/* About Provider */}
              <div className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-on-surface font-display">About the Provider</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0">
                    <span>{service.providerName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-on-surface">{service.providerName}</h4>
                    <div className="flex items-center gap-1 text-xs text-on-surface/50">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{service.providerEmail}</span>
                    </div>
                    {service.providerBio && (
                      <p className="text-xs text-on-surface/70 mt-2 italic leading-relaxed">
                        "{service.providerBio}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Component: Reviews List & Eligibility form */}
              <ServiceDetailsClient serviceId={service.id} providerId={service.providerId} />
            </div>

            {/* Right Column: Booking Card */}
            <div>
              <div className="sticky top-24">
                <BookingCard serviceId={service.id} price={service.price} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
