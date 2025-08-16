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
