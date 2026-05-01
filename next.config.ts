import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 82, 85, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elitecourts.com.pk",
      },
    ],
  },
};

export default nextConfig;
