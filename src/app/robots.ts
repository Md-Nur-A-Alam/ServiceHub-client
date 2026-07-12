import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.CLIENT_PRODUCTION_URL || process.env.NEXT_PUBLIC_CLIENT_URL || process.env.CLIENT_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/bookings/",
        "/wishlist/",
        "/settings/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
