'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '@/components/ui/SocialIcons';
import NewsletterForm from '@/components/layout/NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-12 text-white">
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Logo & Socials & Legal */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-teko text-4xl font-bold tracking-wider text-white">
                13 <span className="text-[#C8F31D]">UTOPiA</span>
              </span>
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/13UTOPIA/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/13_utopia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/13utopia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=918469999013"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="space-y-1.5 text-xs text-white/50 pt-2">
              <div>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link href="/terms-and-condition" className="hover:text-white transition-colors">
                  Terms and Condition
                </Link>
              </div>
              <div>
                <Link href="/refund-and-return" className="hover:text-white transition-colors">
                  Refund and Return
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-teko text-2xl uppercase tracking-wider text-white">
              Newsletter
            </h4>
            <p className="text-white/60 text-xs leading-relaxed font-light">
              Digital moves that matter — join the journey.
            </p>
            <NewsletterForm />
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className="font-teko text-2xl uppercase tracking-wider text-white">
              SERVICES
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <Link href="/search-engine-optimization" className="hover:text-white transition-colors">
                  SEO
                </Link>
              </li>
              <li>
                <Link href="/digital-marketing" className="hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/web-development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/cgi-videos" className="hover:text-white transition-colors">
                  CGI Videos
                </Link>
              </li>
              <li>
                <Link href="/online-reputation-management" className="hover:text-white transition-colors">
                  ORM
                </Link>
              </li>
              <li>
                <Link href="/email-marketing" className="hover:text-white transition-colors">
                  Email Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h4 className="font-teko text-2xl uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs text-white/60 leading-relaxed font-light">
              <p>
                1123, Iconic Shyamal, Shyamal Cross Roads, 132 Feet Ring Rd, Swinagar Society, Nehru Nagar, Shyamal, Ahmedabad, Gujarat 380015
              </p>
              <p>
                405- Ashram Avenue, Paldi Cross Road, Paldi, Ahmedabad – 380007
              </p>
              <p className="pt-1">
                <a href="tel:+919924131397" className="hover:text-white transition-colors">
                  +91 9924131397
                </a>
              </p>
              <p>
                <a href="mailto:info@13utopia.com" className="hover:text-white transition-colors">
                  info@13utopia.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-xs text-white/40 font-light">
          © {new Date().getFullYear()} 13UTOPiA. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
