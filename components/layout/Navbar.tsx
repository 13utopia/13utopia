'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { servicesList } from '@/lib/constants';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
    document.body.classList.remove('utopia-menu-open');
  }, [pathname]);

  const toggleMobileMenu = () => {
    const nextState = !isMobileOpen;
    setIsMobileOpen(nextState);
    if (nextState) {
      document.body.classList.add('utopia-menu-open');
    } else {
      document.body.classList.remove('utopia-menu-open');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-md border-b border-white/10 py-4 shadow-xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1340px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 z-50">
            <span className="font-teko text-3xl sm:text-4xl font-bold tracking-wider text-white">
              13 <span className="text-[#C8F31D]">UTOPiA</span>
            </span>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm uppercase font-medium tracking-wider transition-colors ${
                pathname === '/' ? 'text-[#C8F31D] font-semibold' : 'text-white/70 hover:text-[#C8F31D]'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about-us"
              className={`text-sm uppercase font-medium tracking-wider transition-colors ${
                pathname === '/about-us' ? 'text-[#C8F31D] font-semibold' : 'text-white/70 hover:text-[#C8F31D]'
              }`}
            >
              About Us
            </Link>

            {/* Services Mega Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 text-sm uppercase font-medium tracking-wider transition-colors py-2 ${
                  pathname.startsWith('/digital-marketing') ||
                  pathname.startsWith('/search-engine-optimization') ||
                  pathname.startsWith('/web-development') ||
                  pathname.startsWith('/email-marketing') ||
                  pathname.startsWith('/cgi-videos') ||
                  pathname.startsWith('/online-reputation-management')
                    ? 'text-[#C8F31D] font-semibold'
                    : 'text-white/70 hover:text-[#C8F31D]'
                }`}
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 text-white/70 transition-transform duration-300 ${
                    dropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 w-80 bg-[#0e0e0e] border border-white/15 rounded-xl p-3 shadow-2xl transition-all duration-300 ${
                  dropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible translate-y-2'
                }`}
              >
                <div className="space-y-1">
                  {servicesList.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="group/item flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white/90 group-hover/item:text-[#C8F31D] transition-colors">
                          {service.name}
                        </div>
                        <div className="text-xs text-white/50 group-hover/item:text-white/80">
                          {service.desc}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/portfolio"
              className={`text-sm uppercase font-medium tracking-wider transition-colors ${
                pathname === '/portfolio' ? 'text-[#C8F31D] font-semibold' : 'text-white/70 hover:text-[#C8F31D]'
              }`}
            >
              Portfolio
            </Link>

            <Link
              href="/blog"
              className={`text-sm uppercase font-medium tracking-wider transition-colors ${
                pathname === '/blog' ? 'text-[#C8F31D] font-semibold' : 'text-white/70 hover:text-[#C8F31D]'
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Right Action Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact-us"
              className="hidden sm:inline-flex items-center gap-2 border border-white/70 hover:border-[#C8F31D] hover:bg-[#C8F31D] hover:text-black text-white px-6 py-2.5 rounded-[10px] text-xs font-semibold uppercase tracking-wider transition-all duration-300"
            >
              Let&apos;s Talk
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white hover:text-white/80 transition-colors z-50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => {
          setIsMobileOpen(false);
          document.body.classList.remove('utopia-menu-open');
        }}
        services={servicesList}
      />
    </>
  );
}
