'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-white/10 rounded-2xl bg-[#0a0a0a] overflow-hidden transition-colors hover:border-[#C8F31D]/40"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
            >
              <span className="font-teko text-2xl font-bold uppercase tracking-wide text-white">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#C8F31D] shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-6 text-sm sm:text-base text-white/70 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
