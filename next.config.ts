import type { NextConfig } from "next";

const legacyAreaRedirects = [
  { source: "/kingston-removals", destination: "/kingston-upon-thames-removals", permanent: true },
  { source: "/surrey-removals", destination: "/areas/surrey", permanent: true },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  redirects: async () => legacyAreaRedirects,
};

export default nextConfig;
