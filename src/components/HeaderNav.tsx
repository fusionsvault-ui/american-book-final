import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, X, Phone, BookOpen } from "lucide-react";
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on page transitions
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Dynamic Navigation Links from CMS, strictly guaranteeing Home is first, then About Us, then others
  const effectiveNavLinks = useMemo(() => {
    let rawLinks = NAV_LINKS;
    if (cms?.nav_links && cms.nav_links.length > 0) {
      rawLinks = cms.nav_links.map((link) => {
        const defaultMatch = NAV_LINKS.find(
          (nl) => nl.label.trim().toLowerCase() === link.label.trim().toLowerCase()
        );
        return {
          label: link.label,
          href: link.href,
          dropdown: defaultMatch?.dropdown,
        };
      });
    }

    // Explicitly guarantee Home is first, then About Us
    const homeItem = rawLinks.find((l) => l.label.toLowerCase() === "home") || { label: "Home", href: "/" };
    const aboutItem = rawLinks.find((l) => l.label.toLowerCase().includes("about")) || { label: "About Us", href: "/about" };
    const otherItems = rawLinks.filter(
      (l) => l.label.toLowerCase() !== "home" && !l.label.toLowerCase().includes("about")
    );

    return [homeItem, aboutItem, ...otherItems];
  }, [cms?.nav_links]);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 w-full bg-white shadow-md"
        id="global-header-navigation"
      >
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          {/* Logo Brand Tag */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 mr-4 xl:mr-8">
            {cms.logo_image_url ? (
              <img
                src={cms.logo_image_url}
                alt={cms.logo_img_alt || "Beyond Book Publishing"}
                className="h-11 max-w-[220px] object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center overflow-hidden shadow-sm group-hover:bg-gold transition-colors">
                  <BookOpen className="w-5 h-5 text-gold group-hover:text-navy transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-black text-xl leading-tight text-navy tracking-tight group-hover:text-gold transition-colors">
                    {cms.logo_text || "Beyond Book"}
                  </span>
                  <span className="font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] text-gold uppercase leading-none">
                    {cms.logo_subtext || "Publishing"}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Links (Click-to-open, NO hover) */}
          <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 mx-2">
            {effectiveNavLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
              >
                {link.dropdown ? (
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                    aria-expanded={activeDropdown === link.label}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-md transition-all cursor-pointer select-none ${
                      activeDropdown === link.label
                        ? "text-gold bg-amber-50/80 font-bold"
                        : "text-gray-700 hover:text-gold hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === link.label ? "rotate-180 text-gold" : "text-gray-500"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href || "/"}
                    className="flex items-center px-3.5 py-2 text-sm font-semibold text-gray-700 hover:text-gold hover:bg-gray-50 rounded-md transition-all"
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
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {cms.header_show_phone === true && Boolean(cms.header_phone?.trim()) && (
              <a
                href={`tel:${cms.header_phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold transition-colors"
                id="header-phone-link"
              >
                <Phone className="w-4 h-4 text-gold" />
                {cms.header_phone}
              </a>
            )}
            <button
              onClick={() => setModalOpen(true)}
              className="bg-gold hover:bg-yellow-400 text-navy font-bold text-sm px-5 py-2.5 rounded-md shadow-[0_2px_10px_0_rgba(245,197,24,0.3)] hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
            >
              {cms.header_cta_text || "Contact With Our Expert"}
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
              {effectiveNavLinks.map((link) => (
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
                {cms.header_show_phone === true && Boolean(cms.header_phone?.trim()) && (
                  <a
                    href={`tel:${cms.header_phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-2 w-full border-2 border-navy text-navy font-bold text-sm py-3 rounded-md hover:bg-navy/5 transition-colors"
                    id="mobile-header-phone-link"
                  >
                    <Phone className="w-4 h-4 text-gold" />
                    {cms.header_phone}
                  </a>
                )}
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
