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
};

export default nextConfig;

