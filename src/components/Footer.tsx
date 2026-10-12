import React, { useState } from "react";
import { Link } from "wouter";
import { useCMS } from "./CMSContext";
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  const { data: cms } = useCMS();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-navy pt-20 pb-10 text-gray-300" id="global-footer">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center overflow-hidden shadow-md group-hover:rotate-6 transition-transform">
                <BookOpen className="w-5 h-5 text-navy" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-tight text-white group-hover:text-gold transition-colors">
                  Beyond Book
                </span>
                <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-gold uppercase leading-none">
                  Publishing
                </span>
                <span className="text-[10px] text-gray-400 font-sans tracking-wide">
                  BeyondBookpublishing.com
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400">
              {cms.footer_desc ||
                "Beyond Book Publishing (BeyondBookpublishing.com) is an author-first publishing house. Providing professional ghostwriting, editing, cover design, and global distribution. Retain 100% of your royalties and copyright."}
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href={cms.facebook_url || "https://facebook.com/BeyondBookPublishing"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="Beyond Book Publishing Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={cms.twitter_url || "https://twitter.com/BeyondBookPub"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="Beyond Book Publishing Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={cms.instagram_url || "https://instagram.com/beyondbookpublishing"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="Beyond Book Publishing Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={cms.linkedin_url || "https://linkedin.com/company/beyond-book-publishing"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"
                aria-label="Beyond Book Publishing LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Publishing Services */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-serif">
              Publishing Services
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Ghostwriting Guild", href: "/services/ghost-writing" },
                { label: "Book Editing & Proofreading", href: "/services/copy-editing" },
                { label: "Custom Book Cover Design", href: "/services/book-cover-design" },
                { label: "Self-Publishing & Distribution", href: "/services/self-publishing" },
                { label: "Book Marketing & AMS Ads", href: "/services/social-media-marketing" },
                { label: "Audiobook Production (ACX)", href: "/services/audiobook-production" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company Links (All verified & functional) */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-serif">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Portfolio & Bestsellers", href: "/portfolio" },
                { label: "Author Testimonials", href: "/testimonials" },
                { label: "Pricing & Packages", href: "/pricing" },
                { label: "Publishing Advice Blog", href: "/blog" },
                { label: "Contact & Consultation", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-serif">
              Author Newsletter
            </h4>
            <p className="text-sm mb-4 leading-relaxed text-gray-400">
              Subscribe to Beyond Book Publishing for weekly writing tips, royalty guides, and exclusive publishing discounts.
            </p>
            {subscribed ? (
              <div className="bg-white/10 border border-gold/40 text-gold rounded-lg p-3 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you for subscribing to Beyond Book Publishing updates!</span>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your author email"
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
            )}
          </div>
        </div>

        {/* Bottom Strip: Working Policy Links & Brand Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-400">
          <p>
            © 2026 Beyond Book Publishing (BeyondBookpublishing.com). All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gold transition-colors">
              Terms of Service &amp; 100% Royalty Guarantee
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
