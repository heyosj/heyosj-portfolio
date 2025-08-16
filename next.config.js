/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true };

// next.config.js
module.exports = {
  async redirects() {
    return [
      { source: '/', destination: '/dispatch', permanent: true }, // 308
    ];
  },
};


/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/blog/:path*', destination: '/dispatch/:path*', permanent: true },
    ];
  },
};
module.exports = nextConfig;
