import { JsonLd } from "./JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  PHONE_INTERNATIONAL,
  EMAIL,
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
    priceRange: "£££",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
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
