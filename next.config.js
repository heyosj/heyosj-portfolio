/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/blog/:path*', destination: '/dispatch/:path*', permanent: true },
      { source: '/scripts', destination: '/playbooks', permanent: true },
      { source: '/case-studies', destination: '/labs', permanent: true },
      // If you moved tags under /dispatch:
      // { source: '/tags/:tag', destination: '/dispatch/tags/:tag', permanent: true },
    ];
  },
};
module.exports = nextConfig;
