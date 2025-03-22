import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // Remove any experimental features that cause type errors
  experimental: {
    // Only include experimental features available in your Next.js version
  },
  // Disable React strict mode if it's causing issues
  reactStrictMode: false,
  // Disable build output file tracing to speed up builds
  outputFileTracing: false
};

export default nextConfig;
