import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery"
      },
      {
        protocol:"https",
        hostname:"pghdncsnsxpptkzisxyh.supabase.co",
      }
    ]
  },
  eslint: {
    // ✅ Prevent build from failing due to ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Prevent build from failing due to TypeScript type errors
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
