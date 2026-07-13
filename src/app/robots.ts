import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL as string;

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
