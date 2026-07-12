import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.CLIENT_PRODUCTION_URL || process.env.NEXT_PUBLIC_CLIENT_URL || process.env.CLIENT_URL || "http://localhost:3000";

  const staticRoutes = ["", "/explore", "/about", "/contact", "/blog", "/faq"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticRoutes];
}
