import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 90, 100],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "images.devstackpro.cloud",
    //     pathname: "/*",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "easytrade.site",
    //     pathname: "/api/v2/uploads/**",
    //   },
    // ],
    unoptimized: true
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
