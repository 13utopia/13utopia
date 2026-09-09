import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import FAQAccordion, { FAQItem } from './FAQAccordion';

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface ServiceTemplateProps {
  badge: string;
  title: string;
  highlightedTitle?: string;
  description: string;
  godImage?: string;
  featuresTitle?: string;
  features: ServiceFeature[];
  processSteps: ServiceProcessStep[];
  faqs: FAQItem[];
}

export default function ServiceTemplate({
  badge,
  title,
  highlightedTitle,
  description,
  godImage,
  featuresTitle = 'OUR STRATEGIC CAPABILITIES',
  features,
  processSteps,
  faqs,
}: ServiceTemplateProps) {
  return (
    <div className="bg-black text-white selection:bg-[#C8F31D] selection:text-black min-h-screen pt-28 pb-20">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-20 right-0 w-[420px] h-[420px] bg-[#C8F31D]/[0.05] blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div
              className={`space-y-6 ${godImage ? 'lg:col-span-7' : 'lg:col-span-12 text-center max-w-4xl mx-auto'}`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C8F31D]/40">
                <span className="text-xs uppercase font-medium tracking-widest text-[#C8F31D]">
                  {badge}
                </span>
              </div>

              <h1 className="font-roboto text-[clamp(2.75rem,6vw,96px)] font-semibold uppercase tracking-tight text-white leading-[0.9]">
                {title}{' '}
                {highlightedTitle && <span className="text-[#C8F31D]">{highlightedTitle}</span>}
              </h1>

              <p className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed font-light">
                {description}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 border border-white/70 hover:border-[#C8F31D] hover:bg-[#C8F31D] hover:text-black text-white px-8 py-3.5 rounded-[10px] text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                >
                  Get Free Consultation
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {godImage && (
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-[300px] sm:w-[360px] h-[380px] sm:h-[460px]">
                  <Image
                    src={godImage}
                    alt={title}
                    fill
                    priority
                    sizes="360px"
                    className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="text-xs uppercase font-bold tracking-widest text-[#C8F31D]/80">
              WHAT WE DELIVER
            </div>
            <h2 className="font-roboto text-[clamp(2rem,4vw,56px)] font-semibold uppercase tracking-tight text-white">
              {featuresTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-[#0c0c0c] border border-white/10 hover:border-[#C8F31D]/40 rounded-2xl p-8 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C8F31D]/10 flex items-center justify-center text-[#C8F31D] mb-6">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-roboto text-xl sm:text-2xl font-semibold uppercase tracking-wide text-white mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/10 bg-black">
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="text-xs uppercase font-bold tracking-widest text-[#C8F31D]/80">
              HOW WE WORK
            </div>
            <h2 className="font-roboto text-[clamp(2rem,4vw,56px)] font-semibold uppercase tracking-tight text-white">
              OUR STEP-BY-STEP PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="bg-[#0c0c0c] border border-white/10 rounded-xl p-6 relative overflow-hidden"
              >
                <div className="font-roboto text-5xl font-semibold text-[#C8F31D]/25 mb-1">
                  {step.step}
                </div>
                <h3 className="font-roboto text-xl font-semibold uppercase tracking-wide text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/60 text-xs leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {faqs && faqs.length > 0 && (
        <section className="py-20 border-t border-white/10 bg-black">
          <div className="max-w-[1340px] mx-auto px-6 sm:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <div className="text-xs uppercase font-bold tracking-widest text-[#C8F31D]/80">
                FREQUENTLY ASKED QUESTIONS
              </div>
              <h2 className="font-roboto text-[clamp(2rem,4vw,56px)] font-semibold uppercase tracking-tight text-white">
                COMMON QUESTIONS & ANSWERS
              </h2>
            </div>

            <FAQAccordion items={faqs} />
          </div>
        </section>
      )}

      <section className="py-16 max-w-[1100px] mx-auto px-6 sm:px-10">
        <div className="bg-[#0c0c0c] border border-white/15 rounded-2xl p-10 sm:p-14 text-center space-y-6">
          <h2 className="font-roboto text-[clamp(2rem,5vw,64px)] font-semibold uppercase tracking-tight text-white">
            READY TO SCALE WITH 13 UTOPiA?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto text-xs sm:text-sm font-light">
            Book a complimentary 30-minute discovery call to discuss your business goals and custom
            roadmap.
          </p>
          <div>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-[#C8F31D] text-black font-semibold uppercase tracking-wider text-xs px-8 py-3.5 rounded-[10px] hover:bg-white transition-all shadow-md"
            >
              Start Your Project
              <ArrowUpRight className="w-3.5 h-3.5 text-black" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
