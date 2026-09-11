'use client';

import Hero from '@/components/home/Hero';
import AgencyManifesto from '@/components/home/AgencyManifesto';
import BrandMarquee from '@/components/home/BrandMarquee';
import StatsCounter from '@/components/home/StatsCounter';
import ServicesGrid from '@/components/home/ServicesGrid';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

/**
 * Native Home (rebuild-local Wave 1).
 * Live main still serves the Elementor scrape until you explicitly approve a ship.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <AgencyManifesto />
      <StatsCounter />
      <ServicesGrid />
      <Testimonials />
      <CTASection />
    </>
  );
}
