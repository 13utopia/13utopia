import type { MetadataRoute } from 'next';
import { PAGE_SEO, SITE_URL } from '@/lib/seo';

const priorities: Record<string, number> = {
  '/': 1,
  '/search-engine-optimization': 0.9,
  '/digital-marketing': 0.9,
  '/web-development': 0.85,
  '/cgi-videos': 0.8,
  '/online-reputation-management': 0.8,
  '/email-marketing': 0.8,
  '/about-us': 0.75,
  '/portfolio': 0.7,
  '/blog': 0.7,
  '/contact-us': 0.85,
  '/privacy-policy': 0.3,
  '/terms-and-condition': 0.3,
  '/refund-and-return': 0.3,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return Object.values(PAGE_SEO).map((page) => {
    const isHome = page.path === '/';
    const isLegal =
      page.path.includes('policy') ||
      page.path.includes('terms') ||
      page.path.includes('refund');

    return {
      url: isHome ? SITE_URL : `${SITE_URL}${page.path}`,
      lastModified,
      changeFrequency: isHome ? 'weekly' : isLegal ? 'yearly' : 'monthly',
      priority: priorities[page.path] ?? 0.6,
    };
  });
}
