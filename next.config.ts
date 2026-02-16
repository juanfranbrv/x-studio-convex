import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  async redirects() {
    return [
      {
        source: '/admin/legacy-compositions',
        destination: '/admin/compositions',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
