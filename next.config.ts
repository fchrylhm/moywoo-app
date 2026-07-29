import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "localhost:3000",
    "172.29.239.3:3000",
    "172.29.239.3", // Ditambahkan tanpa port sebagai fallback pertahanan sesuai log terminalmu
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Mengatasi error payload upload > 1MB
    },
  },
};

export default nextConfig;