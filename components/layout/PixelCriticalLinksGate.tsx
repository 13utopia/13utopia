'use client';

import { usePathname } from 'next/navigation';
import PixelCriticalLinks from '@/components/layout/PixelCriticalLinks';
import { isPixelRoute } from '@/lib/routeMode';

/** Only ship Elementor critical/deferred CSS on pixel scrape routes — never on native rebuild pages. */
export default function PixelCriticalLinksGate() {
  const pathname = usePathname();
  if (!isPixelRoute(pathname)) return null;
  return <PixelCriticalLinks />;
}
