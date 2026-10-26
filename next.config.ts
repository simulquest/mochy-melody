import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["100.117.97.41", "100.70.127.13"],
  /* config options here */
  reactStrictMode: false,
};

export default nextConfig;
