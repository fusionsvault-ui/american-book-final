import React, { useEffect } from "react";
import { HeaderNav } from "./HeaderNav";
import { Footer } from "./Footer";
import { FloatingCTA } from "./FloatingCTA";
const ChatAssistant = React.lazy(() => import("./ChatAssistant").then(m => ({ default: m.ChatAssistant })));
import { WavingFlag } from "./WavingFlag";
import { ScrollToTop } from "./ScrollToTop";
import { useCMS } from "./CMSContext";
import { Star } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  schemaMarkup?: string;
  noindex?: boolean;
  ogImage?: string;
  canonicalUrl?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Beyond Book Publishing | Professional Ghostwriting, Editing & Book Publishing",
  description,
  schemaMarkup,
  noindex,
  ogImage,
  canonicalUrl,
}) => {
  const { data: cms } = useCMS();

  // Dynamic favicon update
  useEffect(() => {
    if (cms?.favicon_url) {
      let iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (iconLink) {
        iconLink.href = cms.favicon_url;
      } else {
        iconLink = document.createElement("link");
        iconLink.rel = "icon";
        iconLink.href = cms.favicon_url;
        document.head.appendChild(iconLink);
      }
    }
  }, [cms?.favicon_url]);

  // Google Search Console (GSC) verification tag injection
  useEffect(() => {
    if (cms?.gsc_verification_id) {
      const gscCode = cms.gsc_verification_id.trim();
      if (gscCode) {
        let gscMeta = document.querySelector('meta[name="google-site-verification"]');
        if (!gscMeta) {
          gscMeta = document.createElement("meta");
          gscMeta.setAttribute("name", "google-site-verification");
          document.head.appendChild(gscMeta);
        }
        gscMeta.setAttribute("content", gscCode);
      }
    }
  }, [cms?.gsc_verification_id]);

  // Google Analytics (GA4) & GTM injection
  useEffect(() => {
    // GA4 Script
    if (cms?.google_analytics_id) {
      const gaId = cms.google_analytics_id.trim();
      if (gaId && !document.getElementById("ga-tag-script")) {
        const gaScript = document.createElement("script");
        gaScript.id = "ga-tag-script";
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        const inlineGa = document.createElement("script");
        inlineGa.id = "ga-inline-script";
        inlineGa.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`;
        document.head.appendChild(inlineGa);
      }
    }

    // GTM Script
    if (cms?.gtm_container_id) {
      const gtmId = cms.gtm_container_id.trim();
      if (gtmId && !document.getElementById("gtm-tag-script")) {
        const gtmScript = document.createElement("script");
        gtmScript.id = "gtm-tag-script";
        gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
        document.head.appendChild(gtmScript);
      }
    }
  }, [cms?.google_analytics_id, cms?.gtm_container_id]);

  // Schema.org Structured Data JSON-LD injection
  useEffect(() => {
    const rawSchema = schemaMarkup || cms?.custom_schema_json;
    if (rawSchema && rawSchema.trim()) {
      let schemaTag = document.getElementById("structured-data-schema") as HTMLScriptElement | null;
      if (!schemaTag) {
        schemaTag = document.createElement("script");
        schemaTag.id = "structured-data-schema";
        schemaTag.type = "application/ld+json";
        document.head.appendChild(schemaTag);
      }
      try {
        // Validate JSON structure before setting
        JSON.parse(rawSchema);
        schemaTag.textContent = rawSchema;
      } catch (e) {
        schemaTag.textContent = rawSchema;
      }
    }
  }, [schemaMarkup, cms?.custom_schema_json]);

  // Propagate Centralized SEO: site-wide or page-specific noindex, titles, descriptions, and canonicals
  useEffect(() => {
    // 1. Resolve No-Index status
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    const pathSlug = pathname.replace(/^\//, "").toLowerCase();
    const isGlobalNoIndex = cms?.global_noindex !== false; // Default true (site-wide noindex active)
    const isPageNoIndex = Boolean(
      cms?.page_noindex && (
        cms.page_noindex[pathname] === true ||
        cms.page_noindex[pathSlug] === true ||
        (pathSlug === "" && cms.page_noindex["/"] === true)
      )
    );
    const shouldNoIndex = isGlobalNoIndex || noindex === true || isPageNoIndex;

    // Apply or update <meta name="robots"> tag
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    if (shouldNoIndex) {
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else {
      robotsMeta.setAttribute(
        "content",
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      );
    }

    // 2. Propagate Title with default suffix
    const suffix = cms?.global_meta_defaults?.title_suffix || " | Beyond Book Publishing";
    const fullTitle = title.includes("Beyond Book")
      ? title
      : `${title}${suffix}`;
    document.title = fullTitle;

    // Update OpenGraph and Twitter titles
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", fullTitle);

    // 3. Propagate Description
    const effectiveDesc =
      description ||
      cms?.global_meta_defaults?.default_meta_desc ||
      cms?.seo_home_desc ||
      "Beyond Book Publishing provides premier book publishing, ghostwriting, editorial, design, and marketing services. Retain 100% royalties.";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", effectiveDesc);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = effectiveDesc;
      document.head.appendChild(newMeta);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", effectiveDesc);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", effectiveDesc);

    // 4. Propagate Canonical URL
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://beyondbookpublishing.com";
    const currentCanonicalHref = canonicalUrl || `${currentOrigin}${pathname}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalTag) {
      canonicalTag.setAttribute("href", currentCanonicalHref);
    } else {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      canonicalTag.href = currentCanonicalHref;
      document.head.appendChild(canonicalTag);
    }

    // 5. Propagate OG / Twitter Image
    const effectiveOgImg = ogImage || cms?.global_meta_defaults?.default_og_image || cms?.og_image_url;
    if (effectiveOgImg) {
      const ogImgTag = document.querySelector('meta[property="og:image"]');
      if (ogImgTag) ogImgTag.setAttribute("content", effectiveOgImg);
      const twImgTag = document.querySelector('meta[name="twitter:image"]');
      if (twImgTag) twImgTag.setAttribute("content", effectiveOgImg);
    }
  }, [title, description, noindex, ogImage, canonicalUrl, cms?.global_noindex, cms?.page_noindex, cms?.global_meta_defaults]);

  // Global capture listener to ensure ANY link click resets scroll position to the top
  useEffect(() => {
    const handleGlobalLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && (href.startsWith("/") || href === "#" || href.startsWith("#"))) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }
    };

    document.addEventListener("click", handleGlobalLinkClick, true);
    return () => {
      document.removeEventListener("click", handleGlobalLinkClick, true);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-navy flex flex-col font-sans" id="layout-root">
      <ScrollToTop />
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
      <React.Suspense fallback={null}>
        <ChatAssistant />
      </React.Suspense>
    </div>
  );
};
