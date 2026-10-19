import { JsonLd } from "./JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { WEBSITE_ID } from "@/lib/schema";

const BUSINESS_ID = `${SITE_URL}/#business`;

const movingCompanySchema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": BUSINESS_ID,
  name: "South West London Removals",
  url: `${SITE_URL}/`,
  telephone: "+442080805865",
  email: "info@swlremovals.co.uk",
  image: `${SITE_URL}/images/South%20West%20London%20Removals.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "30 Durham Rd",
    addressLocality: "Raynes Park, London",
    postalCode: "SW20 0TW",
    addressCountry: "GB",
  },
  areaServed: [
    "Wimbledon",
    "South West London",
    "Surrey",
    "Richmond",
    "Kingston upon Thames",
    "Clapham",
    "Fulham",
    "Wandsworth",
    "Epsom",
    "Guildford",
    "Woking",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": BUSINESS_ID },
  inLanguage: "en-GB",
};

export function LocalBusinessSchema() {
  return <JsonLd data={[movingCompanySchema, websiteSchema]} />;
}
