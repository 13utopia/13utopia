import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ServiceJsonLd from '@/components/seo/ServiceJsonLd';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata('/digital-marketing');

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ServiceJsonLd path="/digital-marketing" />
      {children}
    </>
  );
}
