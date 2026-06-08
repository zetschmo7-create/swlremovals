import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { AREAS } from "@/lib/areas";
import { getAllLocationPages, locationPath } from "@/data/locationPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/about",
    "/services",
    "/services/house-removals",
    "/services/office-removals",
    "/services/packing",
    "/services/storage",
    "/areas",
    "/areas-covered",
    "/contact",
    "/quote",
    "/privacy",
    "/terms",
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const areaEntries = AREAS.map((area) => ({
    url: `${SITE_URL}/areas/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const locationEntries = getAllLocationPages().map((location) => ({
    url: `${SITE_URL}${locationPath(location.slug)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...locationEntries, ...areaEntries];
}
