import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: let other devices on the LAN (e.g. http://192.168.1.192:3000) load dev assets/HMR,
  // otherwise the page renders but never hydrates (no client interactivity).
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
