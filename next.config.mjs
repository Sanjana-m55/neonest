/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image configuration
  images: {
    unoptimized: true,
  },

  // Experimental features
  experimental: {
    // Add any experimental features here if needed
  },

  // Headers for CORS handling in development
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
          ],
        },
      ];
    }
    return [];
  },

  // For network access from different IPs during development
  async rewrites() {
    return [];
  },

  // Override server configuration for development
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return {
        beforeFiles: [],
        afterFiles: [],
        fallback: [],
      };
    },
  }),

  // Alternative approach for dev server
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;