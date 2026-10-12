import React, { useState } from "react";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { QuoteModal } from "../components/QuoteModal";
import { PRICING_PACKAGES, PRICING_CATEGORIES } from "../data/websiteData";
import { Star, Check, Sparkles, ChevronRight, FileText, ShieldCheck, Clock, Award, Phone } from "lucide-react";

export const Pricing: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Combo");
  const [quoteSource, setQuoteSource] = useState("pricing-page");

  // Custom Quote quick request form
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteService, setQuoteService] = useState("All-in-One Publishing");
  const [quoteDetails, setQuoteDetails] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quoteName,
          email: quoteEmail,
          phone: quotePhone,
          service: quoteService,
          message: `Custom Quote Request: Service: ${quoteService}. Details: ${quoteDetails || "Author requested direct quote breakdown"}`,
          source: "pricing-quote-form",
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setQuoteSubmitted(true);
    }
  };

  const handleOpenQuoteModal = (sourceLabel: string) => {
    setQuoteSource(sourceLabel);
    setModalOpen(true);
  };

  return (
    <Layout
      title={cms.seo_pricing_title || "Transparent Publishing Investment & Packages"}
      description={cms.seo_pricing_desc || "Compare our budget-friendly writing, editing, marketing, and elite combo packages with absolute clarity at Beyond Book Publishing. Get a free quote today."}
    >
      {/* Breadcrumb Strip */}
      <div className="bg-cream/80 border-b border-gray-150 py-3">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Pricing & Packages" }]} />
        </div>
      </div>

      {/* Header Banner */}
      <section className="bg-navy text-white py-16 text-center relative overflow-hidden" id="pricing-banner">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-4">
          <span className="text-gold uppercase tracking-widest text-xs font-bold bg-gold/10 px-3 py-1 rounded-full border border-gold/20 inline-block">
            Transparent Pricing Plans
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight">
            {cms.seo_pricing_h1 || "Transparent Publishing Investment"}
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            {cms.seo_pricing_desc || "Review our transparent publishing, ghostwriting, and editing plans with 100% royalty ownership. Request a free custom quote anytime."}
          </p>

          <div className="pt-2">
            <button
              onClick={() => handleOpenQuoteModal("pricing-hero-cta")}
              className="bg-gold hover:bg-yellow-400 text-navy font-black px-8 py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-16 bg-cream/50" id="pricing-tiers">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {PRICING_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-navy text-gold shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {((cms.pricingPackages && (cms.pricingPackages as any)[selectedCategory]) || PRICING_PACKAGES[selectedCategory] || []).map((pkg: any, idx: number) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                  pkg.badge
                    ? "border-gold shadow-xl scale-[1.02] bg-gradient-to-b from-amber-50/20 to-white"
                    : "border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div>
                  <div className="border-b border-gray-100 pb-5 mb-5">
                    <h3 className="text-xl font-serif font-black text-navy mb-1.5">{pkg.name || pkg.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed min-h-[36px]">{pkg.tagline || `${selectedCategory} plan designed for professional authors.`}</p>
                  </div>

                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg text-navy font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span>Custom Quote Plan</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 font-medium">Personalized quote based on manuscript volume &amp; scope</p>
                  </div>

                  {/* Features checks list */}
                  <div className="space-y-3 mb-8">
                    {(pkg.features || []).map((feat: string, fidx: number) => (
                      <div key={fidx} className="flex gap-2.5 items-start">
                        <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-gray-600 leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenQuoteModal(`package-${pkg.name || pkg.title}`)}
                  className={`w-full py-3.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                    pkg.badge
                      ? "bg-gold text-navy hover:bg-yellow-400 shadow"
                      : "bg-navy text-white hover:bg-gold hover:text-navy"
                  }`}
                >
                  {pkg.cta || "Get a Quote"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Replaced Price Calculator with Custom Quote Section */}
      <section className="py-20 bg-cream" id="pricing-custom-quote">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mx-auto text-gold mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
              Need a Custom Publishing Package?
            </h2>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              Every book project is distinct. Tell us about your manuscript, target genre, and distribution goals for a personalized project estimate.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Left Col: Benefits & Guarantees */}
            <div className="lg:col-span-5 bg-navy text-white p-6 md:p-8 rounded-2xl shadow-md flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-gold text-xs font-bold uppercase tracking-widest">
                    The Beyond Book Advantage
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-white mt-1">
                    What's Included in Every Quote
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">100% Royalty Ownership</h4>
                      <p className="text-xs text-gray-300 mt-0.5">
                        You keep every penny of sales revenue, copyright, and publishing rights.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Zero Hidden Surcharges</h4>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Flat transparent proposal with all rounds of revisions and proofs included.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Guaranteed Pacing & Timeline</h4>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Dedicated senior editorial director and weekly milestone progression reviews.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => handleOpenQuoteModal("custom-quote-direct-btn")}
                  className="w-full bg-gold hover:bg-yellow-400 text-navy font-black py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Get a Quote Now</span>
                </button>
              </div>
            </div>

            {/* Right Col: Instant Quote Request Form */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-md">
              <h3 className="font-serif font-bold text-navy text-xl mb-1">
                Request Your Free Project Quote
              </h3>
              <p className="text-gray-500 text-xs mb-6">
                Fill in your details below and a Senior Publishing Strategist will deliver a detailed scope breakdown within 24 hours.
              </p>

              {quoteSubmitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-green-900 text-lg">
                    Quote Request Received!
                  </h4>
                  <p className="text-xs text-green-800 leading-relaxed max-w-md mx-auto">
                    Thank you, <strong>{quoteName}</strong>. Our publishing director is reviewing your requirements and will reach out via phone/email shortly with your customized quote proposal.
                  </p>
                  <button
                    onClick={() => {
                      setQuoteSubmitted(false);
                      setQuoteName("");
                      setQuoteEmail("");
                      setQuotePhone("");
                      setQuoteDetails("");
                    }}
                    className="text-xs text-navy font-bold hover:underline cursor-pointer pt-2"
                  >
                    Submit another quote request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomQuoteSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. John Doe"
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-navy outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="e.g. (555) 000-1234"
                        value={quotePhone}
                        onChange={(e) => setQuotePhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-navy outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="e.g. author@example.com"
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-navy outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Primary Service Desired
                      </label>
                      <select
                        value={quoteService}
                        onChange={(e) => setQuoteService(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-navy outline-none focus:border-gold"
                      >
                        <option value="All-in-One Publishing">All-in-One Publishing Combo</option>
                        <option value="Ghostwriting">Ghostwriting / Manuscript Creation</option>
                        <option value="Book Editing">Book Editing & Proofreading</option>
                        <option value="Cover Design & Formatting">Cover Design & Formatting</option>
                        <option value="Book Marketing & PR">Book Marketing & PR</option>
                        <option value="Audiobook Production">Audiobook Production</option>
                        <option value="Children's Book Publishing">Children's Book Publishing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Project Details / Manuscript Word Count
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share estimated word count, book genre, current stage (concept, rough draft, finished manuscript), or any specific goals..."
                      value={quoteDetails}
                      onChange={(e) => setQuoteDetails(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-yellow-400 text-navy font-black py-3.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer shadow transition flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Submitting Request..." : "Get a Quote"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={quoteSource}
      />
    </Layout>
  );
};
