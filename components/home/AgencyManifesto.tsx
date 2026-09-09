'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function AgencyManifesto() {
  return (
    <section className="py-24 bg-black text-center relative overflow-hidden">
      <Reveal className="max-w-4xl mx-auto px-6 space-y-7 relative z-10">
        <h2 className="font-roboto text-[clamp(2.5rem,6vw,115px)] font-semibold uppercase tracking-tight text-white leading-[0.95]">
          Meet the Digital Marketing Gods
        </h2>

        <p className="text-white/75 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
          Here at 13 Utopia, we make the power of Greek gods come to life. We specialize in brand
          elevation, SEO, web development, and digital marketing. Our team makes sure to seat your
          business on the throne of success.
        </p>

        <div className="flex justify-center py-4">
          <div className="relative w-[280px] sm:w-[320px] h-[360px] sm:h-[400px]">
            <Image
              src="/wp-content/uploads/2024/09/Ai-Gerado-Poseidon-Escultura-Imagens-gratis-no-Pixabay.jpeg"
              alt="Digital Marketing Gods Poseidon"
              fill
              sizes="320px"
              className="object-contain rounded-xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        <div>
          <Link
            href="/about-us"
            className="inline-flex items-center gap-2 border border-white/70 hover:border-[#C8F31D] hover:bg-[#C8F31D] hover:text-black text-white px-8 py-3.5 rounded-[10px] text-xs font-semibold uppercase tracking-wider transition-all duration-300"
          >
            Learn More About Our Services
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
