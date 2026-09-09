/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Hide the floating Next.js "N" dev indicator
  devIndicators: false,
  // Next 16: empty turbopack block silences webpack/turbopack mismatch
  turbopack: {},
  // Keep file tracing away from migration dumps and Airlift CSS caches
  outputFileTracingExcludes: {
    '*': [
      './13utopiaaaaaaaa/**/*',
      './.planning/**/*',
      './docs/**/*',
      './scripts/**/*',
      './public/wp-content/uploads/al_opt_content/**/*',
    ],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '13utopia.com',
      },
      {
        protocol: 'https',
        hostname: '*.wp.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    // Scrape HTML still points CTC / WPForms assets at deleted plugin paths
    return [
      {
        source: '/wp-content/plugins/click-to-chat-for-whatsapp/:path*',
        destination: '/img/whatsapp-logo.svg',
      },
      {
        source: '/favicon.ico',
        destination: '/favicon.png',
      },
    ];
  },
  // Used when running `next dev --webpack`
  webpack: (config) => {
    config.watchOptions = {
      ...(config.watchOptions || {}),
      ignored: ['**/node_modules/**', '**/13utopiaaaaaaaa/**', '**/.git/**', '**/.next/**'],
    };
    return config;
  },
};

export default nextConfig;
