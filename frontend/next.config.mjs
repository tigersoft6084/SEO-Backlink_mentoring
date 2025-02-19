/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:2024/api/:path*', // Payload CMS backend URL
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply the header to all routes
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin', // Allow interaction between windows of the same origin
          },
        ],
      },
    ];
  },
};

export default nextConfig;
