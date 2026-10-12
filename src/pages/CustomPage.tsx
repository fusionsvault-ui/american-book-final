import React, { useState } from "react";
import { useRoute } from "wouter";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { NotFound } from "./NotFound";
import { QuoteModal } from "../components/QuoteModal";
import { Sparkles, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const CustomPage: React.FC = () => {
  const [match, params] = useRoute<{ slug: string }>("/:slug");
  const slug = match && params ? params.slug : undefined;
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);

  if (!slug) return <NotFound />;

  // Normalize slug matching
  const cleanSlug = slug.toLowerCase().replace(/^\/+|\/+$/g, "");
  const page = (cms.custom_pages || []).find((p) => {
    const pSlug = (p.slug || "").toLowerCase().replace(/^\/+|\/+$/g, "");
    return pSlug === cleanSlug;
  });

  if (!page) {
    return <NotFound />;
  }

  // Format schema if provided, else fallback to WebPage
  const pageSchema = page.schemaMarkup || JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title,
    "description": page.metaDesc || page.excerpt || page.heroHeadline,
    "url": `https://beyondbookpublishing.com/${cleanSlug}`,
    "publisher": {
      "@type": "Organization",
      "name": "Beyond Book Publishing",
      "url": "https://beyondbookpublishing.com"
    }
  });

  return (
    <Layout
      title={page.metaTitle || `${page.title} | Beyond Book Publishing`}
      description={page.metaDesc || page.excerpt || `${page.title} - Beyond Book Publishing.`}
      schemaMarkup={pageSchema}
    >
      {/* Hero Banner */}
      <section className="bg-navy py-16 md:py-24 text-white relative overflow-hidden" id="custom-page-hero">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Publishing Resource</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight">
              {page.heroHeadline || page.title}
            </h1>
            {page.heroSubheadline && (
              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
                {page.heroSubheadline}
              </p>
            )}
            {page.updatedAt && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-2">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>Last updated: {new Date(page.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: page.title },
        ]}
      />

      {/* Main Content Article Body */}
      <main className="py-16 md:py-20 bg-cream">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-gray-100 space-y-8">
            {page.excerpt && (
              <div className="p-4 md:p-6 bg-amber-50/60 border-l-4 border-gold rounded-r-xl text-gray-800 text-sm md:text-base leading-relaxed italic">
                {page.excerpt}
              </div>
            )}

            {/* Custom Content Body (Supports paragraphs or HTML formatted content) */}
            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed text-sm md:text-base space-y-5">
              {page.content.includes("<") && page.content.includes(">") ? (
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              ) : (
                page.content.split("\n\n").map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              )}
            </div>

            {/* Guaranteed Quality Callout */}
            <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-navy">100% Author Ownership</h4>
                  <p className="text-xs text-gray-500 mt-0.5">You retain full copyright, master files, and 100% of your book royalties.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-navy">Dedicated Project Guild</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Direct communication with master editors and senior publishing consultants.</p>
                </div>
              </div>
            </div>

            {/* Bottom CTA Block */}
            <div className="bg-navy rounded-xl p-8 text-white text-center space-y-4 mt-8">
              <h3 className="text-xl md:text-2xl font-serif font-black text-white">
                Ready to Discuss Your Manuscript?
              </h3>
              <p className="text-xs md:text-sm text-gray-300 max-w-lg mx-auto">
                Connect with our senior consultants for a tailored breakdown and free manuscript consultation.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-400 text-navy font-bold text-sm px-6 py-3.5 rounded-lg shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Request Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={`custom-page-${page.slug}`}
      />
    </Layout>
  );
};
