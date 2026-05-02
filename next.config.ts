import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 82, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elitecourts.com.pk",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
