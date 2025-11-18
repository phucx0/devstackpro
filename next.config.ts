import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "easytrade.site",
        pathname: "/api/v2/**",
      },
    ],
  },

};

export default nextConfig;
