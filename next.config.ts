import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./src/lib/security-headers";

const legacyAreaRedirects = [
  { source: "/kingston-removals", destination: "/kingston-upon-thames-removals", permanent: true },
  { source: "/surrey-removals", destination: "/areas/surrey", permanent: true },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  redirects: async () => legacyAreaRedirects,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [...SECURITY_HEADERS],
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
