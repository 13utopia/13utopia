'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ArrowUpRight, MessageCircle, Phone, Mail } from 'lucide-react';
import { InstagramIcon, LinkedInIcon, FacebookIcon } from '@/components/ui/SocialIcons';

interface ServiceItem {
  name: string;
  href: string;
  desc: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
}

export default function MobileMenu({ isOpen, onClose, services }: MobileMenuProps) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 lg:hidden overflow-y-auto animate-in fade-in duration-200">
      <div className="space-y-6">
        {/* Main Navigation Links */}
        <nav className="flex flex-col space-y-4">
          <Link
            href="/"
            onClick={onClose}
            className={`font-teko text-4xl uppercase tracking-wider transition-colors ${
              pathname === '/' ? 'text-[#C8F31D]' : 'text-white hover:text-[#C8F31D]'
            }`}
          >
            Home
          </Link>

          <Link
            href="/about-us"
            onClick={onClose}
            className={`font-teko text-4xl uppercase tracking-wider transition-colors ${
              pathname === '/about-us' ? 'text-[#C8F31D]' : 'text-white hover:text-[#C8F31D]'
            }`}
          >
            About Us
          </Link>

          {/* Accordion Services Dropdown */}
          <div className="border-y border-white/10 py-3">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="w-full flex items-center justify-between font-teko text-4xl uppercase tracking-wider text-white hover:text-[#C8F31D] transition-colors focus:outline-none"
            >
              <span>Services</span>
              <ChevronDown
                className={`w-6 h-6 text-[#C8F31D] transition-transform duration-300 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {servicesOpen && (
              <div className="mt-4 pl-4 space-y-3 border-l-2 border-[#C8F31D]/40 animate-in slide-in-from-top-2 duration-200">
                {services.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={onClose}
                    className="block py-1 text-base text-white/80 hover:text-[#C8F31D] transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/portfolio"
            onClick={onClose}
            className={`font-teko text-4xl uppercase tracking-wider transition-colors ${
              pathname === '/portfolio' ? 'text-[#C8F31D]' : 'text-white hover:text-[#C8F31D]'
            }`}
          >
            Portfolio
          </Link>

          <Link
            href="/blog"
            onClick={onClose}
            className={`font-teko text-4xl uppercase tracking-wider transition-colors ${
              pathname === '/blog' ? 'text-[#C8F31D]' : 'text-white hover:text-[#C8F31D]'
            }`}
          >
            Blog
          </Link>

          <Link
            href="/contact-us"
            onClick={onClose}
            className={`font-teko text-4xl uppercase tracking-wider transition-colors ${
              pathname === '/contact-us' ? 'text-[#C8F31D]' : 'text-white hover:text-[#C8F31D]'
            }`}
          >
            Contact Us
          </Link>
        </nav>
      </div>

      {/* Footer Details & Socials */}
      <div className="pt-8 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#C8F31D]" />
            <a href="mailto:info@13utopia.com" className="hover:text-white">info@13utopia.com</a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#C8F31D]" />
            <a href="tel:+918469999013" className="hover:text-white">+91 84699 99013</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/13_utopia/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-black hover:bg-[#C8F31D] hover:border-[#C8F31D] transition-all"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/company/13utopia/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-black hover:bg-[#C8F31D] hover:border-[#C8F31D] transition-all"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.facebook.com/13UTOPIA/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-black hover:bg-[#C8F31D] hover:border-[#C8F31D] transition-all"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=918469999013"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-black hover:bg-[#C8F31D] hover:border-[#C8F31D] transition-all"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
