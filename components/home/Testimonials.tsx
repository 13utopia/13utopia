'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';

const testimonials = [
  {
    quote:
      '13 Utopia took our business to the next level with a well-designed and fully optimized website. Their understanding of our industry and technical expertise helped us stand out online. We’ve seen a notable increase in both organic traffic and sales since the site went live.',
    name: 'Rahul Sharma',
    role: 'Marketing Director at Elite Sports Gear',
  },
  {
    quote:
      'Working with 13 Utopia has been an absolute game-changer for our business. The team took the time to understand our vision and developed a website that perfectly matches our brand identity. The functionality and design are both seamless, and we’ve seen a significant increase in user engagement since the launch.',
    name: 'Dhaval Agarwal',
    role: 'Director at Kumar Cotton Textiles',
  },
  {
    quote:
      '13 Utopia’s web development team exceeded our expectations. They were attentive to every detail, from design aesthetics to user experience. Our new website is not only visually appealing but also runs smoothly on all platforms. It’s been an incredible boost for our online presence.',
    name: 'Haresh Shah',
    role: 'Operations Head at Trendy Fashion Hub',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[index];

  return (
    <section className="py-24 bg-black border-t border-white/10 relative">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5 space-y-4">
            <h2 className="font-roboto text-[clamp(2.25rem,4.5vw,72px)] font-semibold uppercase tracking-tight text-white leading-none">
              What Our Clients Say
            </h2>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed font-light">
              Our clients have seen the divine impact of our work. Hear their stories of digital
              success.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7 space-y-6 pt-2" delay={0.1}>
            <Image
              src="/wp-content/uploads/2024/07/rating.png"
              alt="5 star rating"
              width={104}
              height={51}
              className="h-8 w-auto"
            />
            <p className="text-white/85 text-base sm:text-lg leading-relaxed font-light min-h-[7.5rem]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <div className="font-roboto text-xl font-semibold uppercase text-white">{t.name}</div>
              <div className="text-xs text-white/50">{t.role}</div>
            </div>
            <div className="flex gap-2 pt-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === index ? 'bg-[#C8F31D]' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
