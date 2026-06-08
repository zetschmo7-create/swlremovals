import { JsonLd } from "./JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  PHONE,
  EMAIL,
  TRUST_STATS,
} from "@/lib/constants";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Wimbledon",
      addressRegion: "London",
      addressCountry: "GB",
    },
    areaServed: [
      "Wimbledon",
      "Richmond",
      "Kingston upon Thames",
      "Clapham",
      "Fulham",
      "Wandsworth",
      "Epsom",
      "Surrey",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: TRUST_STATS.googleRating,
      reviewCount: TRUST_STATS.reviewCount,
    },
    priceRange: "£££",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "16:00",
      },
    ],
  };

  return <JsonLd data={schema} />;
}
