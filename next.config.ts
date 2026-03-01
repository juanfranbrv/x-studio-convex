import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  logging: {
    incomingRequests: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'adstudio.com',
          },
        ],
        destination: 'https://adstudio.click/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.adstudio.com',
          },
        ],
        destination: 'https://adstudio.click/:path*',
        permanent: true,
      },
      {
        source: '/admin/legacy-compositions',
        destination: '/admin/compositions',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
