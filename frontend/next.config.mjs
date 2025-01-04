/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Enable app directory routing if using the `app` directory
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:2024/api/:path*', // Payload CMS backend URL
      },
    ];
  },
};

export default nextConfig;
