import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
      ignoreDuringBuilds: true
    },
    typescript: {
      ignoreBuildErrors: true
    },
    lint: {
      ignoreDuringBuilds: true
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb'
      }
    }
};
export default nextConfig;