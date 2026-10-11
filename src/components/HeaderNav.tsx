import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, X, Phone } from "lucide-react";
import { useCMS } from "./CMSContext";
import { NAV_LINKS } from "../data/websiteData";
import { QuoteModal } from "./QuoteModal";

// Dropdown block rendering for megamenu
const MegaDropdown: React.FC<{ groups: any[]; onClose: () => void }> = ({
  groups,
  onClose,
}) => {
  const isMultiColumn = groups.length > 1;

  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white shadow-2xl border-t-4 border-gold rounded-b-xl z-50 py-6 px-6 ${
        isMultiColumn ? "w-[780px] grid grid-cols-4 gap-x-6" : "w-56"
      }`}
      id="mega-dropdown"
    >
      {groups.map((group, groupIdx) => (
        <div key={groupIdx}>
          {group.heading && (
            <p className="text-gold text-[11px] font-bold uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">
              {group.heading}
            </p>
          )}
          <ul className="space-y-1">
            {group.items.map((item: any) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block text-sm text-gray-700 hover:text-gold hover:pl-1.5 transition-all py-1 leading-snug"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export const HeaderNav: React.FC = () => {
  const { data: cms } = useCMS();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveSub, setMobileActiveSub] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [location] = useLocation();

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on page transitions
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 w-full bg-white shadow-md"
        id="global-header-navigation"
      >
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          {/* Logo Brand Tag */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 bg-navy rounded flex items-center justify-center overflow-hidden">
              <div className="w-5 h-5 bg-gold rotate-45 transform group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-tight text-navy">
                American Book
              </span>
              <span className="font-sans text-xs font-semibold tracking-widest text-gray-500 uppercase leading-none">
                Founders
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                      activeDropdown === link.label
                        ? "text-gold"
                        : "text-gray-700 hover:text-gold"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === link.label ? "rotate-180 text-gold" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href || "/"}
                    className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 hover:text-gold rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                )}

                {link.dropdown && activeDropdown === link.label && (
                  <MegaDropdown
                    groups={link.dropdown}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Cta Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${(cms.hero_phone || "+1 (800) 555-0199").replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4 text-gold" />
              {cms.hero_phone || "+1 (800) 555-0199"}
            </a>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gold hover:bg-yellow-400 text-navy font-bold text-sm px-5 py-3 rounded-md shadow-[0_4px_14px_0_rgba(245,197,24,0.35)] hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
            >
              Contact With Our Expert
            </button>
          </div>

          {/* Hamburger Mobile Menu Trigger */}
          <button
            className="lg:hidden text-navy p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200" id="mobile-menu-drawer">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileActiveSub(
                            mobileActiveSub === link.label ? null : link.label
                          )
                        }
                        className="w-full flex items-center justify-between px-3 py-3 text-sm font-bold text-navy hover:text-gold hover:bg-gold/5 rounded-lg transition-colors cursor-pointer"
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileActiveSub === link.label ? "rotate-180 text-gold" : ""
                          }`}
                        />
                      </button>
                      {mobileActiveSub === link.label && (
                        <div className="pl-4 pb-2 space-y-3 bg-gray-50/50 rounded-lg p-2 mt-1">
                          {link.dropdown.map((group, groupIdx) => (
                            <div key={groupIdx}>
                              {group.heading && (
                                <p className="text-gold text-[10px] font-bold uppercase tracking-widest mt-3 mb-1 pl-2">
                                  {group.heading}
                                </p>
                              )}
                              {group.items.map((item: any) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block py-1.5 px-4 text-sm text-gray-600 hover:text-gold hover:bg-gold/5 rounded-md transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href || "/"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-3 text-sm font-bold text-navy hover:text-gold hover:bg-gold/5 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Call + Action Buttons on phone menu */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <a
                  href="tel:+18005550199"
                  className="flex items-center justify-center gap-2 w-full border-2 border-navy text-navy font-bold text-sm py-3 rounded-md hover:bg-navy/5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  +1 (800) 555-0199
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setModalOpen(true);
                  }}
                  className="block text-center w-full bg-gold text-navy font-bold text-sm py-3 rounded-md cursor-pointer hover:bg-yellow-400 transition-colors"
                >
                  Contact With Our Expert
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Quote Dialog */}
      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="navbar"
      />
    </>
  );
};
