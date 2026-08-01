import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { cities } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    // City pages sit just under the homepage: they are the pages built to rank for
    // local intent, and each one carries content the others do not.
    ...cities.map((city) => ({
      url: `${siteUrl}/framing/${city.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/company-profile`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
