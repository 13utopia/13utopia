import {
  LOGO_URL,
  NAP,
  PAGE_SEO,
  SITE_NAME,
  SITE_URL,
  SOCIAL,
  absoluteUrl,
} from '@/lib/seo';
import { servicesList } from '@/lib/constants';

function postalAddresses() {
  return NAP.addresses.map((a) => ({
    '@type': 'PostalAddress',
    ...a,
  }));
}

export function organizationGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ['13 Utopia', '13UTOPIA'],
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
          width: 1200,
          height: 630,
        },
        image: LOGO_URL,
        email: NAP.email,
        telephone: NAP.phoneE164,
        foundingLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ahmedabad',
            addressRegion: 'Gujarat',
            addressCountry: 'IN',
          },
        },
        sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.linkedin].filter(Boolean),
        knowsAbout: [
          'Search engine optimization',
          'Digital marketing',
          'Web development',
          'CGI video production',
          'Online reputation management',
          'Email marketing',
        ],
        areaServed: [
          { '@type': 'City', name: 'Ahmedabad' },
          { '@type': 'State', name: 'Gujarat' },
          { '@type': 'Country', name: 'India' },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        image: LOGO_URL,
        url: SITE_URL,
        telephone: NAP.phoneE164,
        email: NAP.email,
        priceRange: '$$',
        address: postalAddresses(),
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 23.0225,
          longitude: 72.5714,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '10:00',
            closes: '19:00',
          },
        ],
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: PAGE_SEO['/'].description,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-IN',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/blog?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#services`,
        name: '13 UTOPiA services',
        itemListElement: servicesList.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: s.name,
            description: s.desc,
            url: absoluteUrl(s.href),
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'City', name: 'Ahmedabad' },
          },
        })),
      },
    ],
  };
}

export function servicePageGraph(path: string) {
  const page = PAGE_SEO[path];
  if (!page) return null;
  const service = servicesList.find((s) => s.href === path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${absoluteUrl(path)}#service`,
        name: service?.name || page.title,
        description: page.description,
        url: absoluteUrl(path),
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: [
          { '@type': 'City', name: 'Ahmedabad' },
          { '@type': 'Country', name: 'India' },
        ],
        brand: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: service?.name || page.title,
            item: absoluteUrl(path),
          },
        ],
      },
      ...(page.answer
        ? [
            {
              '@type': 'WebPage',
              '@id': `${absoluteUrl(path)}#webpage`,
              url: absoluteUrl(path),
              name: page.title,
              description: page.description,
              isPartOf: { '@id': `${SITE_URL}/#website` },
              about: { '@id': `${absoluteUrl(path)}#service` },
              mainEntity: {
                '@type': 'Thing',
                name: service?.name || page.title,
                description: page.answer,
              },
            },
          ]
        : []),
    ],
  };
}

export function breadcrumbGraph(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
