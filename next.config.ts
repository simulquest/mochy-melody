import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["100.117.97.41", "100.70.127.13"],
  /* Thème du site : config.json doit suivre le bundle serveur (Vercel). */
  outputFileTracingIncludes: {
    "/**": ["./config.json", "./src/sound/*.mp3"],
  },
  async rewrites() {
    return [{ source: "/", destination: "/landing/index.html" }];
  },
  /* config options here */
  reactStrictMode: false,
};

export default nextConfig;
