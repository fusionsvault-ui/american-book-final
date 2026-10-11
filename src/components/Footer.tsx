import React from "react";
import { Link } from "wouter";
import { useCMS } from "./CMSContext";
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";

export const Footer: React.FC = () => {
  const { data: cms } = useCMS();
  return (
    <footer className="bg-navy pt-20 pb-10 text-gray-300" id="global-footer">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1 */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden">
                <div className="w-5 h-5 bg-gold rotate-45 transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-tight text-white">
                  American Book
                </span>
                <span className="font-sans text-xs font-semibold tracking-widest text-gold uppercase leading-none">
                  Founders
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {cms.footer_desc || "Premium ghostwriting, editing, and publishing services helping authors share their voice with the world and retain 100% of their royalties."}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-serif">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Ghostwriting", href: "/services/ghost-writing" },
                { label: "Book Editing", href: "/services/copy-editing" },
                { label: "Cover Design", href: "/services/book-cover-design" },
                { label: "Publishing", href: "/services/self-publishing" },
                { label: "Book Marketing", href: "/services/social-media-marketing" },
                { label: "Audiobook Production", href: "/services/audiobook-production" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-serif">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Testimonials", href: "/testimonials" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact Us", href: "/contact" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="hover:text-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-serif">
              Newsletter
            </h4>
            <p className="text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter for writing tips, publishing insights, and exclusive offers.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 h-12 rounded-md px-3.5 focus:outline-none focus:border-gold transition text-sm"
              />
              <button
                type="submit"
                className="w-full bg-gold hover:bg-yellow-400 text-navy font-bold h-12 rounded-md flex items-center justify-center gap-2 cursor-pointer transition-transform duration-200"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 American Book Founders. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
