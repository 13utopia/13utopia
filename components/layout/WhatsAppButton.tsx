'use client';

import React, { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

export default function WhatsAppButton() {
  const [isCa, setIsCa] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname.toLowerCase().endsWith('.ca')) {
      setIsCa(true);
    }
  }, []);

  const phone = isCa ? '14376039004' : '919924131397';

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${phone}&text=Hi%2013%20UTOPiA,%20I%20would%20like%20to%20know%20more%20about%20your%20services.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#25D366] text-white p-3 sm:p-3.5 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="w-6 h-6 text-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold uppercase tracking-wider text-white">
        Quick Chat
      </span>
    </a>
  );
}
