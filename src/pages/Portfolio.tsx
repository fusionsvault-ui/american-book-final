import React, { useState, useMemo } from "react";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { QuoteModal } from "../components/QuoteModal";
import { PORTFOLIO_BOOKS, PORTFOLIO_FILTERS } from "../data/websiteData";
import { Star, Eye } from "lucide-react";

export const Portfolio: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredBooks = useMemo(() => {
    if (selectedFilter === "All") return PORTFOLIO_BOOKS;
    return PORTFOLIO_BOOKS.filter(
      (b) => b.genre.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [selectedFilter]);

  return (
    <Layout
      title={cms.seo_portfolio_title || "Our Published Books Showcase Gallery"}
      description={cms.seo_portfolio_desc || "Browse dozens of beautiful novels, memoirs, business guides, children books, and thrillers designed and published by American Book Founders."}
    >
      {/* Intro Header */}
      <section className="bg-navy text-white py-16 text-center relative overflow-hidden" id="portfolio-banner">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-4">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            Our Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black leading-tight">
            Independent Publications Masterworks
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Every file, jacket art, and editorial outline in our gallery represents a collaborative achievement between experts and authors.
          </p>
        </div>
      </section>

      {/* Gallery Showcase with Filter chips */}
      <section className="py-16 bg-cream" id="portfolio-gallery-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          {/* Filters view */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {PORTFOLIO_FILTERS.map((fName) => (
              <button
                key={fName}
                onClick={() => setSelectedFilter(fName)}
                className={`px-4.5 py-2 rounded-full text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                  selectedFilter === fName
                    ? "bg-gold text-navy border-gold shadow"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-gold"
                }`}
              >
                {fName}
              </button>
            ))}
          </div>

          {/* Book jackets cards layout */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
              {filteredBooks.map((book, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                  id={`portfolio-book-card-${idx}`}
                >
                  {/* Visual wrapper */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={book.img}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-350"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("unsplash")) {
                          target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";
                        }
                      }}
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                      <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                        <Eye className="w-5 h-5 text-navy" />
                      </div>
                      <span className="text-white text-xs font-bold mt-2 truncate max-w-full text-center">
                        Published {book.year}
                      </span>
                    </div>
                  </div>

                  {/* Info Block */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
                        {book.genre}
                      </span>
                      <h4 className="font-serif font-black text-navy text-sm md:text-base leading-tight mt-1 truncate">
                        {book.title}
                      </h4>
                      <p className="text-gray-405 text-xs mt-0.5 italic truncate">By {book.author}</p>
                    </div>

                    <div className="pt-2.5 mt-2.5 border-t border-gray-50 flex items-center justify-between">
                      <span className="bg-cream text-[10px] text-navy font-bold px-2 py-0.5 rounded">
                        ★ {book.rating}
                      </span>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="text-[10px] text-navy font-black hover:text-gold transition-colors block uppercase"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow border border-gray-100 max-w-md mx-auto">
              <p className="text-gray-400">No showcase covers currently categorized here.</p>
              <button
                onClick={() => setSelectedFilter("All")}
                className="mt-4 bg-navy text-white text-xs font-bold px-4 py-2 rounded cursor-pointer hover:bg-gold hover:text-navy transition-colors"
              >
                Reset Gallery
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Teaser block */}
      <section className="bg-navy py-16 text-center text-white relative overflow-hidden" id="portfolio-grid-cta">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-serif font-black mb-3">
            Want to See Your Cover Image Here next?
          </h2>
          <p className="text-gray-300 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Collaborate directly with Emmy-grade creators, professional artists, and developmental indexers to construct award-satisfying styles.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gold hover:bg-yellow-400 text-navy font-bold px-8 py-3.5 rounded-md text-sm cursor-pointer hover:scale-103 transition-transform"
          >
            Launch Free Consultation Proposal
          </button>
        </div>
      </section>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="portfolio-gallery-page"
      />
    </Layout>
  );
};
