export interface ServiceItem {
  name: string;
  href: string;
  desc: string;
}

export const servicesList: ServiceItem[] = [
  { name: 'Digital Marketing', href: '/digital-marketing', desc: 'Performance marketing & paid ads' },
  { name: 'Search Engine Optimization', href: '/search-engine-optimization', desc: 'Rank #1 on Google with high intent' },
  { name: 'Web Development', href: '/web-development', desc: 'High-speed, conversion-focused websites' },
  { name: 'Email Marketing', href: '/email-marketing', desc: 'Drip campaigns & revenue automation' },
  { name: 'CGI Videos', href: '/cgi-videos', desc: '3D CGI commercials & VFX production' },
  { name: 'Online Reputation Management', href: '/online-reputation-management', desc: 'PR defense & brand monitoring' },
];

export { NAP, SITE_NAME, SITE_URL, SOCIAL } from '@/lib/seo';
