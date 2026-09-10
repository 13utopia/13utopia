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

/** Old WP blog post slugs still linked from /blog and indexed in GSC — park on /blog until posts are migrated. */
const LEGACY_BLOG_SLUGS = [
  'digital-marketing-experts-in-ahmedabad-transforming-businesses-with-strategy',
  'e-commerce-website-development-ahmedabad-building-smarter-online-stores',
  'how-cgi-videos-transform-brand-storytelling-in-the-digital-era',
  'https-13utopia-com-email-marketing-ahmedabad-growth',
  'innovative-brand-design-shaping-the-future-of-modern-branding',
  'interactive-web-design-creating-engaging-digital-experiences-for-modern-users',
  'local-seo-services-driving-visibility-for-local-businesses',
  'ppc-services-in-ahmedabad-driving-results-with-targeted-advertising',
  'seo-services-in-ahmedabad-proven-strategy-predictable-results',
  'social-media-experts-in-gujarat-building-brands-with-digital-influence',
  'the-future-of-advertising-why-brands-are-turning-to-cgi',
  'the-role-of-email-marketing-in-building-lasting-customer-relationships',
  'top-5-essential-tools-for-digital-marketing-success-in-2025',
  'why-online-reputation-management-is-essential-for-modern-businesses',
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
    const longCache = [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ];
    const monthCache = [
      {
        key: 'Cache-Control',
        value: 'public, max-age=2592000, stale-while-revalidate=86400',
      },
    ];
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      { source: '/css/:path*', headers: longCache },
      { source: '/js/:path*', headers: longCache },
      { source: '/cdn/:path*', headers: longCache },
      { source: '/fonts/:path*', headers: longCache },
      { source: '/img/:path*', headers: monthCache },
      { source: '/wp-content/uploads/:path*', headers: monthCache },
    ];
  },
  async redirects() {
    const blogRedirects = LEGACY_BLOG_SLUGS.flatMap((slug) => [
      { source: `/${slug}`, destination: '/blog', permanent: true },
      { source: `/${slug}/`, destination: '/blog', permanent: true },
    ]);
    return [
      ...blogRedirects,
      { source: '/xmlrpc.php', destination: '/', permanent: true },
      { source: '/feed', destination: '/blog', permanent: true },
      { source: '/feed/', destination: '/blog', permanent: true },
      { source: '/comments/feed', destination: '/blog', permanent: true },
      { source: '/comments/feed/', destination: '/blog', permanent: true },
    ];
  },
  async rewrites() {
    // Scrape CSS/HTML still points at deleted plugin paths
    return [
      {
        source: '/wp-content/plugins/click-to-chat-for-whatsapp/:path*',
        destination: '/img/whatsapp-logo.svg',
      },
      {
        source: '/wp-content/plugins/elementor/assets/lib/eicons/fonts/:file*',
        destination: '/fonts/eicons/:file*',
      },
      {
        source: '/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/:file*',
        destination: '/fonts/font-awesome/:file*',
      },
      {
        source: '/wp-content/plugins/arolax-essential/assets/images/btn-image.webp',
        destination: '/img/arolax/btn-image.webp',
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
