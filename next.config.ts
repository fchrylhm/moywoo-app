import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Diletakkan langsung di top-level (bukan di dalam experimental)
  allowedDevOrigins: [
    "localhost:3000",
    "172.29.239.3:3000",
    "172.29.239.3", // Ditambahkan tanpa port sebagai fallback pertahanan sesuai log terminalmu
  ],
};

export default nextConfig;