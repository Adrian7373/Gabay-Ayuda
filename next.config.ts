import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Acceptable values: '1000', '500kb', '3mb', etc.
    },
  },
};

export default nextConfig;
