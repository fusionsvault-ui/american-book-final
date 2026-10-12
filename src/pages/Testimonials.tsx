import React, { useState } from "react";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { QuoteModal } from "../components/QuoteModal";
import { TESTIMONIALS, FEATURED_AUTHORS } from "../data/websiteData";
import { Star, Flame, Quote, UserCheck } from "lucide-react";

export const Testimonials: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);

  // Expanded industry reviewer lists
  const additionalReviews = [
    {
      quote: "As a health coach with zero writing experience, I was terrified. The team organized my drafts, refined my ideas, and polished my layout perfectly.",
      name: "Elizabeth Wood",
      title: "Wellness Author",
      genre: "Self-Help / Health",
      stars: 5,
    },
    {
      quote: "Beyond Book Publishing handled my sci-fi epic layout formatting. The final formats build beautifully on Kindle and Paperback prints alike.",
      name: "Toby Vance",
      title: "Sci-Fi Author",
      genre: "Fantasy & Sci-Fi",
      stars: 5,
    },
    {
      quote: "Confidentiality was extremely important to me for my memoir. They signed NDAs immediately and made sure I kept 100% edit rights on everything.",
      name: "Robert Hernandez",
      title: "Corporate CEO",
      genre: "Biography / Memoir",
      stars: 5,
    },
  ];

  return (
    <Layout
      title={cms.seo_testimonials_title || "Verified Author Reviews & Testimonials"}
      description={cms.seo_testimonials_desc || "Read verified testimonials and satisfaction reviews from published authors. See how Beyond Book Publishing (BeyondBookpublishing.com) helped them find success."}
    >
      {/* Breadcrumb Strip */}
      <div className="bg-cream/80 border-b border-gray-150 py-3">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Testimonials" }]} />
        </div>
      </div>

      {/* Intro Header */}
      <section className="bg-navy text-white py-16 text-center relative overflow-hidden" id="testimonials-banner">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-4">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            Success Spotlights
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black leading-tight">
            Reviews From Our Published Authors
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Discover dozens of real author experiences spanning fiction, non-fiction guides, children's titles, and Wall Street memoirs.
          </p>
        </div>
      </section>

      {/* Main detailed reviews spotlights */}
      <section className="py-20 bg-cream" id="testimonials-spotlight-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-gold font-bold uppercase tracking-widest text-xs">Spotlight Reviews</span>
            <h2 className="text-3xl font-serif font-bold text-navy mt-1.5">Primary Author Showcases</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {(cms.testimonials && cms.testimonials.length > 0 ? cms.testimonials : TESTIMONIALS).map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 border border-gray-150 shadow-md relative hover:-translate-y-1 transition-all flex flex-col justify-between"
                id={`testimonial-spotlight-${idx}`}
              >
                <div className="absolute top-5 right-6 text-gold/20">
                  <Quote className="w-10 h-10 fill-gold/10" />
                </div>

                <div className="space-y-4">
                  {/* Reviews Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>

                  <p className="text-gray-550 text-sm italic leading-relaxed pt-2">
                    "{t.quote}"
                  </p>
                </div>

                {/* Profile block */}
                <div className="pt-6 mt-6 border-t border-gray-50 flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-gold"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-navy text-sm leading-snug">{t.name}</h4>
                    <p className="text-gray-450 text-[10px] font-bold uppercase tracking-widest">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roster list authors */}
      <section className="py-20 bg-white" id="featured-roster-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-gold font-bold uppercase tracking-widest text-xs">Featured Roster</span>
            <h2 className="text-3xl font-serif font-bold text-navy mt-1.5">Publishing Alumni Network</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {FEATURED_AUTHORS.map((auth, idx) => (
              <div
                key={idx}
                className="bg-cream/45 rounded-xl p-4 border border-gray-100 text-center hover:scale-103 transition-transform"
              >
                <img
                  src={auth.img}
                  alt={auth.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow mx-auto mb-3"
                />
                <h4 className="font-bold text-navy text-xs md:text-sm truncate">{auth.name}</h4>
                <p className="text-gold font-bold text-[10px] uppercase tracking-wider truncate mt-0.5">
                  {auth.genre}
                </p>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-gray-450 uppercase mt-2.5">
                  <UserCheck className="w-3 h-3 text-gold" />
                  Verified Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Secondary Feed */}
      <section className="py-20 bg-cream border-t border-gray-150" id="secondary-reviews-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-gold font-bold uppercase tracking-widest text-xs text-center">Verified Reviews Feed</span>
            <h2 className="text-3xl font-serif font-bold text-navy mt-1.5">More Success Stories</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {additionalReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-gray-550 text-xs md:text-sm leading-relaxed italic">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-navy text-xs md:text-sm">{rev.name}</h4>
                    <p className="text-gray-450 text-[10px] font-medium">{rev.title}</p>
                  </div>
                  <span className="bg-navy/10 text-[9px] text-navy font-bold px-2 py-0.5 rounded-full uppercase">
                    {rev.genre}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials promo banner */}
      <section className="bg-navy text-white text-center py-20 relative overflow-hidden" id="testimonials-cta">
        <div className="container mx-auto px-4">
          <Flame className="w-8 h-8 text-gold mx-auto mb-3 animate-pulse" />
          <h2 className="text-3xl font-serif font-black mb-3">Begin Your Bestseller Story Today</h2>
          <p className="text-gray-300 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Lock down senior ghostwriting coordinators, formatting timelines, and ISBN codes directly under our care.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gold hover:bg-yellow-400 text-navy font-black py-3.5 px-8 rounded-lg text-xs md:text-sm cursor-pointer hover:scale-102 transition"
          >
            Request Free Consulting Call
          </button>
        </div>
      </section>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="testimonials-reviews-page"
      />
    </Layout>
  );
};
