/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
    unoptimized: process.env.DOCKER === '1',
  },
  async rewrites() {
    // Server-side rewrite uses internal Docker service name
    // Client-side fetch still uses /api (proxied by nginx)
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:4000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
