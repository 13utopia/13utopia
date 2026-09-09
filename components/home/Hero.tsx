'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-[#C8F31D]/[0.04] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-[1340px] mx-auto px-6 sm:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <Reveal className="lg:col-span-4 text-left space-y-1">
            <h1 className="font-roboto text-[clamp(2.75rem,7vw,7.1vw)] font-semibold uppercase tracking-tight text-white leading-[0.92]">
              Dynamic
              <br />
              Solutions
              <br />
              <span className="text-[clamp(1.75rem,6vw,6vw)]">FOR</span>
            </h1>
          </Reveal>

          <Reveal className="lg:col-span-4 flex justify-center relative" delay={0.1}>
            <div className="relative w-[300px] sm:w-[380px] md:w-[420px] h-[440px] sm:h-[520px] md:h-[560px]">
              <Image
                src="/wp-content/uploads/2024/09/Zeus-With-Search-Engine-Optimization-1.webp"
                alt="13 UTOPiA Zeus - Digital Marketing Gods"
                fill
                priority
                sizes="(max-width: 768px) 300px, 420px"
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-4 text-left lg:text-right space-y-8" delay={0.15}>
            <h2 className="font-roboto text-[clamp(2.75rem,7.1vw,7.1vw)] font-semibold uppercase tracking-tight text-white leading-[0.92]">
              Digital
              <br />
              Success
            </h2>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 lg:items-end">
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
