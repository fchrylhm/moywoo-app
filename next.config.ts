import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hcnhewypgsekvpvyrwlx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  allowedDevOrigins: [
    "localhost:3000",
    "172.29.239.3:3000",
    "172.29.239.3", // Fallback pertahanan terminal
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Payload upload > 1MB
    },
  },
};

export default nextConfig;