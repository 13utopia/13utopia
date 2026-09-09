import type { MetadataRoute } from 'next';
import { OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: '13UTOPiA',
    description:
      'Digital marketing, SEO, web development, CGI, ORM, and email marketing agency in Ahmedabad.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    lang: 'en-IN',
    icons: [
      {
        src: OG_IMAGE,
        sizes: '1200x630',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
    categories: ['business', 'marketing'],
    id: SITE_URL,
  };
}
