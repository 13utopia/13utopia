import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ServiceJsonLd from '@/components/seo/ServiceJsonLd';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata('/search-engine-optimization');

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ServiceJsonLd path="/search-engine-optimization" />
      {children}
    </>
  );
}
