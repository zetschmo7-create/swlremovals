import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";
import { IMAGES } from "./images";

type PageSEO = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
};

export function createMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = IMAGES.hero,
}: PageSEO): Metadata {
  const fullTitle =
    title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "South West London Removals",
      "Wimbledon removals",
      "removals Wimbledon",
      "house removals South West London",
      "removal company Wimbledon",
      "Surrey removals",
      "office removals Wimbledon",
      "premium removals",
      ...keywords,
    ],
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export const defaultMetadata = createMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [
    "Wimbledon removals",
    "Richmond removals",
    "Kingston removals",
    "Clapham removals",
    "Fulham removals",
    "Epsom removals",
  ],
});
