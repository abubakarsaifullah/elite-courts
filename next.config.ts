import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elitecourts.com.pk",
      },
    ],
  },
};

export default nextConfig;
