import React, { useEffect } from "react";
import { HeaderNav } from "./HeaderNav";
import { Footer } from "./Footer";
import { FloatingCTA } from "./FloatingCTA";
import { ChatAssistant } from "./ChatAssistant";
import { WavingFlag } from "./WavingFlag";
import { Star } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Beyond Book Publishing – Professional Ghostwriting, Editing & Book Publishing",
  description,
}) => {
  // Update document title and description meta if they change
  useEffect(() => {
    const fullTitle = title.includes("Beyond Book")
      ? title
      : `${title} | Beyond Book Publishing`;
    document.title = fullTitle;

    // Update OpenGraph and Twitter titles
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", fullTitle);

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      } else {
        const newMeta = document.createElement("meta");
        newMeta.name = "description";
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", description);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute("content", description);
    }
  }, [title, description]);

  return (
    <div className="min-h-screen bg-white text-navy flex flex-col font-sans" id="layout-root">
      {/* Top Review/Trust Banner */}
      <div
        className="bg-[#121212] text-white py-2.5 px-3 w-full flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-medium"
        id="top-trust-banner"
      >
        <WavingFlag size="lg" />
        <div className="hidden sm:flex items-center gap-1">
          {[...Array(5)].map((_, idx) => (
            <Star key={idx} className="w-3 h-3 md:w-3.5 md:h-3.5 fill-gold text-gold" />
          ))}
        </div>
        <span className="text-center leading-tight">
          <span className="hidden sm:inline">Featuring Trust On Top Review Platforms</span>
          <span className="sm:hidden text-[11px]">Trust On Top Review Platforms</span>
        </span>
        <div className="hidden sm:flex items-center gap-1">
          {[...Array(5)].map((_, idx) => (
            <Star key={idx} className="w-3 h-3 md:w-3.5 md:h-3.5 fill-gold text-gold" />
          ))}
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <HeaderNav />

      {/* Main Page Area */}
      <main className="flex-1" id="main-content-flow">
        {children}
      </main>

      {/* Main Page Footer */}
      <Footer />

      {/* Floating Interactive Handlers */}
      <FloatingCTA />
      <ChatAssistant />
    </div>
  );
};
