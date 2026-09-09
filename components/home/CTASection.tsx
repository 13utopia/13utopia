'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function CTASection() {
  return (
    <section className="py-20 bg-black border-t border-white/10">
      <Reveal className="max-w-[1100px] mx-auto px-6 sm:px-10">
        <div className="bg-[#0c0c0c] border border-white/15 rounded-2xl p-12 sm:p-16 text-center space-y-6">
          <h2 className="font-roboto text-[clamp(1.75rem,4vw,56px)] font-semibold uppercase tracking-tight text-white leading-[1.1]">
            Flexible Plans for Every Business
            <br />
            <span className="text-white/90">Choose Growth, Choose Success</span>
          </h2>
          <div>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-[#C8F31D] text-black font-semibold uppercase tracking-wider text-xs px-8 py-3.5 rounded-[10px] hover:bg-white transition-all shadow-md"
            >
              CONTACT US
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
