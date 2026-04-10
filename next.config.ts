import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Acceptable values: '1000', '500kb', '3mb', etc.
    },
  },
};

export default nextConfig;
