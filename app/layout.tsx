import type { Metadata } from 'next';
import { Roboto, Teko, Titan_One, Kanit } from 'next/font/google';
import './globals.css';
import './veil-motion.css';
import JsonLd from '@/components/seo/JsonLd';
import SiteShell from '@/components/layout/SiteShell';
import PixelCriticalLinks from '@/components/layout/PixelCriticalLinks';
import { OG_IMAGE, PAGE_SEO, SITE_NAME, SITE_URL } from '@/lib/seo';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

const teko = Teko({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-teko',
  display: 'swap',
});

const titan = Titan_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-titan',
  display: 'swap',
});

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-kanit',
  display: 'swap',
});

const home = PAGE_SEO['/'];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${home.title} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: home.description,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Digital marketing',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${home.title} | ${SITE_NAME}`,
    description: home.description,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${home.title} | ${SITE_NAME}`,
    description: home.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      {
        url: '/wp-content/uploads/2025/11/cropped-13-1-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/wp-content/uploads/2025/11/cropped-13-1-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/wp-content/uploads/2025/11/cropped-13-1.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/favicon.png',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/wp-content/uploads/2025/11/cropped-13-1-180x180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
  },
  other: {
    'geo.region': 'IN-GJ',
    'geo.placename': 'Ahmedabad',
    'geo.position': '23.0225;72.5714',
    ICBM: '23.0225, 72.5714',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${roboto.variable} ${teko.variable} ${titan.variable} ${kanit.variable} pixel-exact`}
    >
      <head>
        <PixelCriticalLinks />
        <link
          rel="preload"
          as="image"
          href="/wp-content/uploads/2024/06/13-utopia-logo-012-768x305.png"
          fetchPriority="high"
        />
      </head>
      <body
        className="antialiased bg-black text-white min-h-screen flex flex-col justify-between font-roboto"
        suppressHydrationWarning
      >
        <JsonLd />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
