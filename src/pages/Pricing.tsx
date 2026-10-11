import React, { useState, useMemo } from "react";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { QuoteModal } from "../components/QuoteModal";
import { PRICING_PACKAGES, PRICING_CATEGORIES } from "../data/websiteData";
import { Calculator, Star, Check, Sparkles, ChevronRight } from "lucide-react";

export const Pricing: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Combo");

  // Calculator custom parameters
  const [wordCount, setWordCount] = useState(30000);
  const [includeGhostwriting, setIncludeGhostwriting] = useState(false);
  const [includeEditing, setIncludeEditing] = useState(true);
  const [includeFormatting, setIncludeFormatting] = useState(true);
  const [includePublishing, setIncludePublishing] = useState(false);
  const [includeMarketing, setIncludeMarketing] = useState(false);

  // Lead parameter integration state
  const [calcSubmitted, setCalcSubmitted] = useState(false);
  const [calcName, setCalcName] = useState("");
  const [calcPhone, setCalcPhone] = useState("");

  // Rate sheets:
  const rates = {
    ghostwriting: 0.08, // per word
    editing: 0.025, // per word
    formatting: 0.01, // per word
    publishingSetup: 599, // flat rate
    marketingBundle: 799, // flat rate
  };

  const calculatedQuote = useMemo(() => {
    let price = 0;
    if (includeGhostwriting) price += wordCount * rates.ghostwriting;
    if (includeEditing) price += wordCount * rates.editing;
    if (includeFormatting) price += wordCount * rates.formatting;
    if (includePublishing) price = price + rates.publishingSetup;
    if (includeMarketing) price = price + rates.marketingBundle;

    // Estimated turnaround timeline
    let weeks = 4;
    if (wordCount > 60000) weeks = 20;
    else if (wordCount > 30000) weeks = 12;
    else if (wordCount > 15000) weeks = 8;

    if (includeGhostwriting) weeks += 6;

    return {
      price: Math.max(299, Math.round(price)),
      weeks,
    };
  }, [wordCount, includeGhostwriting, includeEditing, includeFormatting, includePublishing, includeMarketing]);

  const handleCalcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: calcName,
          phone: calcPhone,
          message: `Interactive Estimate: Word count ${wordCount}, Ghostwriting: ${includeGhostwriting}, Editing: ${includeEditing}, Formatting: ${includeFormatting}, Publishing: ${includePublishing}, Marketing: ${includeMarketing}. Total Est: $${calculatedQuote.price}, Duration: ${calculatedQuote.weeks} weeks.`,
          source: "pricing-calculator",
        }),
      });
    } catch (err) {
      console.error(err);
    }
    setCalcSubmitted(true);
  };

  return (
    <Layout
      title={cms.seo_pricing_title || "Modular Packages & Interactive Project Estimator"}
      description={cms.seo_pricing_desc || "View our transparent pricing tiers for writing, developmental editing, and global formatting distribution. Try our Interactive Calculator to estimate flat package fees."}
    >
      {/* Search Header Banner */}
      <section className="bg-navy text-white py-16 text-center relative overflow-hidden" id="pricing-banner">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-4">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            America's Most Transparent Rates
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black leading-tight">
            Transparent Pricing & Combo Packages
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Choose a standardized tier package below or build a dynamic flat-fee service list with our interactive estimator tool.
          </p>
        </div>
      </section>

      {/* Pricing packages view tabs */}
      <section className="py-16 bg-white" id="packages-table">
        <div className="container mx-auto px-4 md:px-6">
          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {PRICING_CATEGORIES.map((catKey) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                  selectedCategory === catKey
                    ? "bg-gold text-navy border-gold shadow-md"
                    : "bg-gray-50 text-gray-650 border-gray-200 hover:border-gold hover:text-gold"
                }`}
              >
                {catKey} Packages
              </button>
            ))}
          </div>

          {/* Render target list packages category */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
            {PRICING_PACKAGES[selectedCategory]?.map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-7 border relative flex flex-col justify-between transition-all duration-300 ${
                  pkg.badge
                    ? "border-gold bg-cream/30 shadow-xl scale-103 z-10"
                    : "border-gray-150 bg-white hover:border-gold/50 shadow-md hover:shadow-lg"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] uppercase font-black px-3.5 py-1 rounded-full border border-yellow-500 shadow">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-serif font-black text-xl text-navy mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mt-3 mb-6">
                    <span className="text-3xl md:text-4xl font-serif font-extrabold text-navy">{pkg.price}</span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      / {pkg.period}
                    </span>
                  </div>

                  {/* Features checks list */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feat, fidx) => (
                      <div key={fidx} className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-gray-600 leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className={`w-full py-3.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                    pkg.badge
                      ? "bg-gold text-navy hover:bg-yellow-400"
                      : "bg-navy text-white hover:bg-gold hover:text-navy"
                  }`}
                >
                  {pkg.cta || "Enquire Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Interactive Word Metric estimator section */}
      <section className="py-20 bg-cream" id="pricing-estimator">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mx-auto text-gold mb-3">
              <Calculator className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
              Interactive Project Fee Estimator
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              We charge transparent fees based strictly on your book count parameters. Try our slider calculator to estimate.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
            {/* Input params (8 columns) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-md space-y-6">
              <h3 className="font-serif font-bold text-navy text-xl">Define Book parameters</h3>

              {/* Word count slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Estimated Book Word Count
                  </label>
                  <span className="text-lg font-serif font-bold text-navy">
                    {wordCount.toLocaleString()} words
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full accent-gold bg-gray-100 h-2 rounded-lg cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>5K (Children's, Short Guides)</span>
                  <span>50K (Memoirs)</span>
                  <span>100K (Thrillers, Fantasy)</span>
                </div>
              </div>

              {/* Service Select toggles */}
              <div className="space-y-3.5 pt-4 border-t border-gray-50">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Requested Production Elements
                </label>

                {/* Ghostwriting */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold/5 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={includeGhostwriting}
                    onChange={(e) => setIncludeGhostwriting(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-gold accent-gold focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-xs md:text-sm font-bold text-navy block">Professional Ghostwriting</span>
                    <span className="text-[10px] text-gray-450 leading-relaxed block mt-0.5">
                      Expert U.S. writers draft chapters weekly based on outlines (${rates.ghostwriting}/word)
                    </span>
                  </div>
                </label>

                {/* Editorial */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold/5 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={includeEditing}
                    onChange={(e) => setIncludeEditing(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-gold accent-gold focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-xs md:text-sm font-bold text-navy block">Developmental Editorial review</span>
                    <span className="text-[10px] text-gray-450 leading-relaxed block mt-0.5">
                      Optimize structural pacing and fix character holes (${rates.editing}/word)
                    </span>
                  </div>
                </label>

                {/* Formatting */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold/5 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={includeFormatting}
                    onChange={(e) => setIncludeFormatting(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-gold accent-gold focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-xs md:text-sm font-bold text-navy block">Interior typesetting & formats</span>
                    <span className="text-[10px] text-gray-450 leading-relaxed block mt-0.5">
                      Prepare print PDFs and clickable ePub files (${rates.formatting}/word)
                    </span>
                  </div>
                </label>

                {/* ISBN & Publishing */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold/5 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={includePublishing}
                    onChange={(e) => setIncludePublishing(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-gold accent-gold focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-xs md:text-sm font-bold text-navy block">ISBN, Copyright & Retail Setup</span>
                    <span className="text-[10px] text-gray-450 leading-relaxed block mt-0.5">
                      Register barcodes, catalog codes and publish on Amazon/IngramSpark (${rates.publishingSetup} flat)
                    </span>
                  </div>
                </label>

                {/* Strategic marketing */}
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gold/5 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={includeMarketing}
                    onChange={(e) => setIncludeMarketing(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-gold accent-gold focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-xs md:text-sm font-bold text-navy block">Pre-Launch PR Marketing Pack</span>
                    <span className="text-[10px] text-gray-450 leading-relaxed block mt-0.5">
                      Graphics calendars, metadata, author bio optimization, launch plans (${rates.marketingBundle} flat)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Calculations Result output (5 columns) */}
            <div className="lg:col-span-5 bg-navy text-white rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl relative sticky top-6">
              <div className="absolute top-4 right-4 text-gold">
                <Sparkles className="w-5 h-5" />
              </div>

              <span className="text-gold font-bold text-[10px] uppercase tracking-widest block mb-4">
                Estimated Output Flat Fee
              </span>

              <div className="space-y-1 mb-6">
                <p className="text-gray-300 text-xs">Dynamic Calculated Quote</p>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-4xl md:text-5xl font-serif font-black text-gold">
                    ${calculatedQuote.price.toLocaleString()}
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">USD</span>
                </div>
              </div>

              {/* Dynamic summary tracks */}
              <div className="border-t border-white/10 pt-4 pb-6 space-y-3.5">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Estimated Pacing Timeline:</span>
                  <span className="font-extrabold text-white">~ {calculatedQuote.weeks} Weeks</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Assigned Coordinator:</span>
                  <span className="font-extrabold text-white">Senior Editor</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Royalty Rights Retained:</span>
                  <span className="font-extrabold text-gold">100% (Yours)</span>
                </div>
              </div>

              {/* Calculator Lead Form box */}
              <div className="border-t border-white/10 pt-6">
                {calcSubmitted ? (
                  <div className="text-center py-4 bg-white/5 rounded-xl border border-gold/30">
                    <p className="text-gold font-bold text-sm">Estimate Saved Successfully!</p>
                    <p className="text-gray-450 text-[10px] leading-relaxed mt-1.5 px-3">
                      An author counselor will retrieve this outline sheet and call your phone line back shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCalcSubmit} className="space-y-3">
                    <p className="text-xs text-gray-350 leading-relaxed font-semibold">
                      Lock in this flat rate and request complete breakdown files:
                    </p>
                    <input
                      required
                      type="text"
                      placeholder="Your Name *"
                      value={calcName}
                      onChange={(e) => setCalcName(e.target.value)}
                      className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 h-11 rounded-lg px-3.5 text-xs focus:outline-none focus:border-gold"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Line *"
                      value={calcPhone}
                      onChange={(e) => setCalcPhone(e.target.value)}
                      className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 h-11 rounded-lg px-3.5 text-xs focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gold hover:bg-yellow-400 text-navy font-black py-3.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer shadow hover:shadow-lg transition"
                    >
                      Save and Request Estimate Breakdowns
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={`pricing-packages-${selectedCategory}`}
      />
    </Layout>
  );
};
