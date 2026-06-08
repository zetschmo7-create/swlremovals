import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";
import { IMAGES } from "./images";

type PageSEO = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export function createMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = IMAGES.og,
  ogImageAlt,
  noIndex = false,
}: PageSEO): Metadata {
  const fullTitle =
    title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const imageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);
  const imageAlt = ogImageAlt ?? `${title} — ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
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
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export const defaultMetadata = createMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
  ogImage: IMAGES.og,
  ogImageAlt: "South West London Removals — premium home moves across Wimbledon and Surrey",
  keywords: [
    "Wimbledon removals",
    "South West London removals",
    "house removals Wimbledon",
    "office removals London",
    "packing and storage removals",
  ],
});
