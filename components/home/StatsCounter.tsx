'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';

const stats = [
  { value: 5, suffix: '+', label: 'YEARS OF', sub: 'EXPERIENCES' },
  { value: 200, suffix: '+', label: 'HAPPY', sub: 'CUSTOMERS' },
  { value: 750, suffix: '+', label: 'PROJECT', sub: 'COMPLETED' },
  { value: 108, suffix: '', label: 'TEAM', sub: 'MEMBER' },
];

function AnimatedStat({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 2000;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          setN(Math.round(value * p));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-roboto text-5xl sm:text-6xl font-semibold text-white leading-none mb-1">
      {String(n).padStart(value >= 100 ? 3 : 2, '0')}
      {suffix}
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-24 bg-black border-t border-white/10 relative">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-5 flex justify-center">
            <div className="relative w-[320px] sm:w-[380px] h-[440px] sm:h-[500px]">
              <Image
                src="/wp-content/uploads/2024/09/atlas_god.webp"
                alt="Who We Are - Atlas"
                fill
                sizes="380px"
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7 space-y-7" delay={0.1}>
            <h2 className="font-roboto text-[clamp(2.5rem,5vw,105px)] font-semibold uppercase tracking-tight text-white leading-none">
              Who we are
            </h2>

            <p className="text-white/90 text-sm font-medium leading-relaxed">
              Have a brilliant idea boost the Growth development Agency your branding!
            </p>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light">
              Utopia&apos;s Digital Marketing and 13utopia is a creative advertising agency that develops
              and executes powerful campaigns from concepts. We amalgamate innovation, strategy and
              storytelling inspired from Greek mythology to help brands outperform their competition
              as nothing more can tell their brand&apos;s unique story which resonates with the target
              audience. Our services cover everything from SEO to branding with an aim to leave a deep
              footprint in the digital space.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="p-3 text-left">
                  <AnimatedStat value={stat.value} suffix={stat.suffix} />
                  <div className="text-[11px] uppercase font-bold text-white/80 tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-[10px] uppercase text-white/50 tracking-wider">{stat.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
