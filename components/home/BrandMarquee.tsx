'use client';

import Image from 'next/image';

const clientLogos = [
  { src: '/wp-content/uploads/2026/05/Mayur-Dairy-Logo-240x300.png', alt: 'Mayur Dairy' },
  { src: '/wp-content/uploads/2026/05/Fujitec-Expresss-Logo-1-1024x677.png', alt: 'Fujitec Express' },
  { src: '/wp-content/uploads/2026/05/ZuuZuu-2-300x188.png', alt: 'ZuuZuu' },
  { src: '/wp-content/uploads/2026/05/chintamani-post-17-1080x780.png', alt: 'Chintamani' },
];

export default function BrandMarquee() {
  const loop = [...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <section className="py-7 bg-[#1B1B1B] border-y border-white/10 overflow-hidden relative">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10 flex items-center justify-between gap-10">
        <div className="shrink-0 font-roboto text-[clamp(0.9rem,1.6vw,1.6vw)] font-semibold uppercase tracking-widest text-[#C6C6C6] border-r border-white/10 pr-8">
          OUR CLIENTS
        </div>

        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee flex items-center gap-16 py-1">
            {loop.map((logo, index) => (
              <div key={`${logo.alt}-${index}`} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={130}
                  height={45}
                  className="max-h-11 w-auto object-contain brightness-90 hover:brightness-100 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
