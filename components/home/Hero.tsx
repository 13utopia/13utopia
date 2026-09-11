'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

/**
 * Home hero — layout matched to live Elementor (mobile stacked + desktop 3-col).
 * Live mobile: centered Dynamic/Solutions/For + full-bleed Zeus bottom.
 * Live desktop: Dynamic Solutions | Zeus | Digital Success + CTAs.
 */
export default function Hero() {
  return (
    <section className="relative min-h-[100svh] bg-black overflow-hidden pt-20 lg:pt-28 pb-0">
      {/* —— Mobile / tablet (matches live first viewport) —— */}
      <div className="lg:hidden relative min-h-[100svh]">
        <div className="absolute inset-x-0 top-24 z-10 px-5 text-center pointer-events-none">
          <h1 className="font-roboto font-semibold uppercase tracking-tight text-white leading-[0.9]">
            <span className="block text-[clamp(3rem,15vw,5.75rem)]">Dynamic</span>
            <span className="block text-[clamp(3rem,15vw,5.75rem)]">Solutions</span>
            <span className="mt-1 block w-full text-[clamp(1.85rem,10vw,3.5rem)] text-right pr-[6%]">
              For
            </span>
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[62svh] z-0">
          {/* Plain img: reliable sizing for full-bleed hero (next/image fill was under-rendering in QA) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wp-content/uploads/2024/09/Zeus-With-Search-Engine-Optimization-1.webp"
            alt="13 UTOPiA Zeus — Dynamic Solutions"
            className="absolute inset-0 h-full w-full object-contain object-bottom"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* —— Desktop —— */}
      <div className="hidden lg:block max-w-[1400px] mx-auto px-10 pb-16">
        <div className="grid grid-cols-12 gap-6 items-center min-h-[calc(100svh-8rem)]">
          <div className="col-span-4 text-left space-y-1 self-center">
            <h1 className="font-roboto text-[clamp(3rem,6.5vw,7rem)] font-semibold uppercase tracking-tight text-white leading-[0.9]">
              Dynamic
              <br />
              Solutions
              <br />
              <span className="text-[clamp(2rem,4.5vw,4.5rem)]">For</span>
            </h1>
          </div>

          <div className="col-span-4 flex justify-center relative self-end">
            <div className="relative w-full max-w-[460px] h-[min(70vh,620px)]">
              <Image
                src="/wp-content/uploads/2024/09/Zeus-With-Search-Engine-Optimization-1.webp"
                alt="13 UTOPiA Zeus — Dynamic Solutions"
                fill
                priority
                sizes="460px"
                className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>

          <div className="col-span-4 text-right space-y-8 self-center">
            <h2 className="font-roboto text-[clamp(3rem,6.5vw,7rem)] font-semibold uppercase tracking-tight text-white leading-[0.9]">
              Digital
              <br />
              Success
            </h2>

            <div className="flex flex-col gap-3.5 items-end">
              <Link
                href="/search-engine-optimization"
                className="inline-flex items-center justify-center gap-2 border border-white/70 hover:border-[#C8F31D] hover:bg-[#C8F31D] hover:text-black text-white px-7 py-3 rounded-[10px] text-xs sm:text-sm font-medium tracking-wide transition-all duration-300"
              >
                Explore Our SEO & Marketing Services
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 border border-white/70 hover:border-[#C8F31D] hover:bg-[#C8F31D] hover:text-black text-white px-7 py-3 rounded-[10px] text-xs sm:text-sm font-medium tracking-wide transition-all duration-300"
              >
                Get a Free Consultation
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
