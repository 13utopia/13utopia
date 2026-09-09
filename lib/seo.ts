import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://13utopia.com';
export const SITE_NAME = '13 UTOPiA';
export const SITE_LEGAL = '13 Utopia';

export const NAP = {
  phoneDisplay: '+91 99241 31397',
  phoneE164: '+919924131397',
  email: 'info@13utopia.com',
  addresses: [
    {
      streetAddress:
        '1123, Iconic Shyamal, Shyamal Cross Roads, 132 Feet Ring Rd, Nehru Nagar, Shyamal',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      postalCode: '380015',
      addressCountry: 'IN',
    },
    {
      streetAddress: '405- Ashram Avenue, Paldi Cross Road, Paldi',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      postalCode: '380007',
      addressCountry: 'IN',
    },
  ],
} as const;

export const SOCIAL = {
  facebook: 'https://www.facebook.com/13UTOPIA/',
  instagram: 'https://www.instagram.com/13_utopia/',
  linkedin: 'https://www.linkedin.com/company/13utopia/',
  behance: 'https://www.behance.net/',
} as const;

export const OG_IMAGE = '/wp-content/uploads/2025/09/13-UTOPIA.webp';
export const LOGO_URL = `${SITE_URL}/wp-content/uploads/2025/09/13-UTOPIA.webp`;

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  /** Short factual answer for AEO / AI citation snippets */
  answer?: string;
  ogImage?: string;
  type?: 'website' | 'article';
};

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    path: '/',
    title: 'Digital Marketing, SEO & Web Development Agency in Ahmedabad',
    description:
      '13 UTOPiA is an Ahmedabad digital marketing agency delivering SEO, paid ads, web development, CGI video, ORM, and email marketing that grow measurable revenue.',
    answer:
      '13 UTOPiA is a digital marketing and web development agency in Ahmedabad, India, offering SEO, performance marketing, custom websites, CGI advertising videos, online reputation management, and email campaigns.',
  },
  '/about-us': {
    path: '/about-us',
    title: 'About 13 UTOPiA — Digital Marketing Agency in Ahmedabad',
    description:
      'Meet 13 UTOPiA: an Ahmedabad-based team of strategists, designers, and engineers building SEO, ads, websites, and CGI that elevate brands across India.',
    answer:
      '13 UTOPiA is a full-service digital agency based in Ahmedabad, Gujarat, with multi-year experience delivering SEO, digital marketing, web development, and creative production for businesses across India.',
  },
  '/search-engine-optimization': {
    path: '/search-engine-optimization',
    title: 'SEO Company in Ahmedabad — Rank Higher with Proven SEO',
    description:
      'Technical SEO, content strategy, and link authority from 13 UTOPiA — an SEO company in Ahmedabad helping brands win high-intent Google traffic and conversions.',
    answer:
      '13 UTOPiA provides search engine optimization in Ahmedabad covering keyword research, on-page SEO, technical audits, content, and authority building to improve organic rankings and qualified traffic.',
  },
  '/digital-marketing': {
    path: '/digital-marketing',
    title: 'Digital Marketing Agency in Ahmedabad — Ads That Convert',
    description:
      'Full-funnel digital marketing in Ahmedabad: Google Ads, Meta ads, analytics, and creative testing from 13 UTOPiA to scale leads and sales efficiently.',
    answer:
      '13 UTOPiA runs digital marketing campaigns in Ahmedabad including paid search, social ads, funnel creative, and conversion tracking so brands acquire customers with measurable ROI.',
  },
  '/web-development': {
    path: '/web-development',
    title: 'Web Development Company in Ahmedabad — Fast Conversion Sites',
    description:
      'Custom, fast, SEO-ready websites and web apps from 13 UTOPiA in Ahmedabad — built for performance, accessibility, and conversion.',
    answer:
      '13 UTOPiA designs and develops high-performance websites in Ahmedabad with responsive UX, SEO architecture, and conversion-focused page structure for businesses that need to grow online.',
  },
  '/cgi-videos': {
    path: '/cgi-videos',
    title: 'CGI Video Production — 3D Advertising Creatives That Stop Scroll',
    description:
      'Cinematic CGI and 3D advertising videos from 13 UTOPiA — product visuals, brand films, and social creatives engineered for attention and recall.',
    answer:
      '13 UTOPiA produces CGI advertising videos and 3D brand creatives for campaigns that need premium visual depth across social, web, and paid media.',
  },
  '/online-reputation-management': {
    path: '/online-reputation-management',
    title: 'Online Reputation Management (ORM) Services in Ahmedabad',
    description:
      'Protect and improve your brand’s search reputation with 13 UTOPiA ORM — monitoring, review strategy, content defense, and crisis response.',
    answer:
      '13 UTOPiA offers online reputation management in Ahmedabad to monitor brand mentions, strengthen positive SERP presence, and respond to negative feedback with structured PR and content tactics.',
  },
  '/email-marketing': {
    path: '/email-marketing',
    title: 'Email Marketing Agency — Automations That Convert',
    description:
      'Lifecycle email marketing from 13 UTOPiA: segmentation, automation, creative, and analytics that turn subscribers into repeat customers.',
    answer:
      '13 UTOPiA builds email marketing programs with audience segmentation, automated journeys, campaign creative, and performance reporting to improve engagement and revenue.',
  },
  '/portfolio': {
    path: '/portfolio',
    title: 'Portfolio — Digital Marketing & Creative Work by 13 UTOPiA',
    description:
      'Explore selected SEO, marketing, web, and CGI projects delivered by 13 UTOPiA for brands that needed growth and standout creative.',
    answer:
      'The 13 UTOPiA portfolio showcases digital marketing, SEO, website, and CGI projects produced for clients seeking stronger online performance and brand presence.',
  },
  '/blog': {
    path: '/blog',
    title: 'Blog — SEO, Marketing & Growth Insights from 13 UTOPiA',
    description:
      'Practical articles on SEO, digital marketing, web performance, and brand growth from the 13 UTOPiA team in Ahmedabad.',
    answer:
      'The 13 UTOPiA blog publishes actionable guidance on SEO, digital marketing, reputation, and web strategy for business owners and marketers.',
  },
  '/contact-us': {
    path: '/contact-us',
    title: 'Contact 13 UTOPiA — Start Your Growth Project',
    description:
      'Talk to 13 UTOPiA in Ahmedabad about SEO, ads, websites, CGI, or ORM. Call +91 99241 31397 or email info@13utopia.com.',
    answer:
      'Contact 13 UTOPiA at +91 99241 31397 or info@13utopia.com, or visit offices in Shyamal and Paldi, Ahmedabad, to discuss digital marketing and web projects.',
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'How 13 UTOPiA collects, uses, and protects personal information on 13utopia.com.',
  },
  '/terms-and-condition': {
    path: '/terms-and-condition',
    title: 'Terms and Conditions',
    description: 'Terms governing use of 13utopia.com and services provided by 13 UTOPiA.',
  },
  '/refund-and-return': {
    path: '/refund-and-return',
    title: 'Refund and Return Policy',
    description: 'Refund and return terms for services purchased from 13 UTOPiA.',
  },
};

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildPageMetadata(path: string): Metadata {
  const page = PAGE_SEO[path] || PAGE_SEO['/'];
  const url = absoluteUrl(page.path);
  const image = page.ogImage || OG_IMAGE;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: page.type === 'article' ? 'article' : 'website',
      locale: 'en_IN',
      url,
      siteName: SITE_NAME,
      title: `${page.title} | ${SITE_NAME}`,
      description: page.description,
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ${SITE_NAME}`,
      description: page.description,
      images: [image],
    },
  };
}
