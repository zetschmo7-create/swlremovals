import { JsonLd } from "./JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  PHONE_INTERNATIONAL,
  EMAIL,
  TRUST_STATS,
  AREA_SERVED,
} from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  businessPostalAddressSchema,
} from "@/lib/schema";

export function LocalBusinessSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["MovingCompany", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}${IMAGES.og}`,
    logo: `${SITE_URL}${IMAGES.logo}`,
    telephone: PHONE_INTERNATIONAL,
    email: EMAIL,
    address: businessPostalAddressSchema(),
    areaServed: [...AREA_SERVED],
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-GB",
  };

  return <JsonLd data={[organizationSchema, websiteSchema]} />;
}
