'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const services = [
  {
    num: '01.',
    title: 'SEARCH ENGINE OPTIMIZATION',
    desc: 'SEO OR Search Engine Optimization is the process of enhancing a website position in Google rankings.',
    img: '/wp-content/uploads/2024/09/1.webp',
    href: '/search-engine-optimization',
  },
  {
    num: '02.',
    title: 'DIGITAL MARKETING',
    desc: "Marketing includes a variety of different campaigns, which aim to enhance a brand's visibility, and in turn, sales.",
    img: '/wp-content/uploads/2024/09/2.webp',
    href: '/digital-marketing',
  },
  {
    num: '03',
    title: 'WEB DEVELOPMENT',
    desc: "The ability to design and run a website competently determines a company's overall success in this internet driven age.",
    img: '/wp-content/uploads/2024/09/4.webp',
    href: '/web-development',
  },
  {
    num: '04',
    title: 'CGI VIDEOS',
    desc: 'Bring your ideas to life with captivating and realistic CGI video production.',
    img: '/wp-content/uploads/2024/09/6.webp',
    href: '/cgi-videos',
  },
  {
    num: '05',
    title: 'ORM',
    desc: "Online reputation management (ORM) protects and enhances your brand's image in the digital landscape.",
    img: '/wp-content/uploads/2024/09/5-1.png',
    href: '/online-reputation-management',
  },
  {
    num: '06',
    title: 'EMAIL MARKETING',
    desc: 'By evaluating statistics, performance and interaction rates of emails, marketing campaigns can be improved.',
    img: '/wp-content/uploads/2024/09/GODDESS.webp',
    href: '/email-marketing',
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-black border-t border-white/10 relative">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-roboto text-[clamp(2.5rem,6vw,108px)] font-semibold uppercase tracking-tight text-white leading-none">
            Impactful Services
          </h2>
        </Reveal>

        <div className="divide-y divide-white/15 max-w-5xl mx-auto border-y border-white/15">
          {services.map((srv, i) => (
            <Reveal key={srv.num} delay={i * 0.04}>
              <Link
                href={srv.href}
                className="group flex flex-col md:flex-row items-center justify-between gap-6 py-8 px-4 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-8 w-full md:w-1/2">
                  <span className="font-roboto text-4xl sm:text-5xl font-semibold text-white/90 shrink-0 min-w-[50px]">
                    {srv.num}
                  </span>

                  <div className="relative w-16 h-16 shrink-0">
                    <Image src={srv.img} alt={srv.title} fill sizes="64px" className="object-contain" />
                  </div>

                  <div>
                    <h3 className="font-roboto text-2xl sm:text-3xl font-semibold uppercase text-white tracking-wide group-hover:text-[#C8F31D] transition-colors">
                      {srv.title}
                    </h3>
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex items-center justify-between gap-4">
                  <p className="text-white/65 text-xs sm:text-sm leading-relaxed max-w-md font-light">
                    {srv.desc}
                  </p>
                  <ArrowUpRight className="w-4 h-4 text-white/50 shrink-0 transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#C8F31D] transition-all" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
