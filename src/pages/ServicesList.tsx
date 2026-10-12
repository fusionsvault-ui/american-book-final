import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { QuoteModal } from "../components/QuoteModal";
import { SERVICES } from "../data/servicesData";
import { Search, ChevronRight, CheckCircle2, Star } from "lucide-react";
import { BookCarousel } from "../components/BookCarousel";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const ServicesList: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const allServices = cms.services && cms.services.length > 0 ? cms.services : SERVICES;

  const categories = useMemo(() => {
    const list = new Set<string>();
    allServices.forEach((s) => list.add(s.category));
    return ["All", ...Array.from(list)];
  }, [allServices]);

  const filteredServices = useMemo(() => {
    return allServices.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || s.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory, allServices]);

  return (
    <Layout
      title={cms.seo_services_title || "Professional Ghostwriting & Book Editing Services"}
      description={cms.seo_services_desc || "Explore our ultimate book production catalog. We offer U.S.-based ghostwriting, developmental editing, book marketing, custom cover designs & POD publishing."}
    >
      {/* Breadcrumb Strip */}
      <div className="bg-cream/80 border-b border-gray-150 py-3">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Services" }]} />
        </div>
      </div>

      {/* Search Header Banner */}
      <section className="bg-navy text-white py-16 text-center relative overflow-hidden" id="services-list-header">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-6">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            Expert Book Production Catalog
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            Comprehensive Book Publishing & Writing Services
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            From your initial rough draft notes down to active Amazon bookshelf distribution, find the tailored support your manuscript deserves.
          </p>

          {/* Interactive Search Tool */}
          <div className="relative max-w-md mx-auto pt-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search services (e.g. ghostwriting, editing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-navy placeholder:text-gray-400 h-12 rounded-lg pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm border border-transparent shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <section className="py-16 bg-cream" id="services-grid-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category Chips Filters */}
          <div className="flex flex-wrap gap-2.5 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gold text-navy border-gold shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Cards Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div
                  key={service.slug}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between"
                  id={`service-card-${service.slug}`}
                >
                  {/* Photo area */}
                  <div className="relative h-48 bg-navy flex items-center justify-center overflow-hidden">
                    {/* Generative / high quality photographic representations */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent z-10" />
                    <img
                      src={service.img.startsWith("/") ? `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600&h=400` : service.img}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-85 hover:scale-103 transition-transform duration-350"
                    />
                    <div className="absolute bottom-4 left-5 z-20">
                      <span className="bg-gold text-navy text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Body textual list */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-black text-xl text-navy mb-1.5 truncate">
                        {service.title}
                      </h3>
                      <p className="text-gold font-bold text-xs mb-4 uppercase tracking-wider">
                        {service.tagline}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Top Benefits Bullet list */}
                      <div className="space-y-2 mb-6">
                        {service.benefits.slice(0, 3).map((b, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                            <span className="leading-tight font-medium">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Button trigger mapping */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-navy hover:text-gold font-bold text-sm transition-colors"
                      >
                        Detailed Blueprint
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="bg-gold hover:bg-yellow-400 text-navy font-bold px-4 py-2 rounded-md text-xs transition-colors cursor-pointer"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow">
              <p className="text-gray-400 text-base">No services found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 bg-navy text-white text-xs font-bold px-5 py-2.5 rounded-lg cursor-pointer hover:bg-gold hover:text-navy transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Book Carousel Slider Track */}
      <BookCarousel />

      {/* Bottom Promotion */}
      <section className="py-20 bg-navy text-white text-center relative overflow-hidden" id="services-cta">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-black mb-4">
            Need a Customized Publishing Package?
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Combine multiple packages into a singular, high-value bulk discount. Speak directly to an author coordinator!
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gold hover:bg-yellow-400 text-navy font-extrabold px-8 py-3.5 rounded-md text-sm cursor-pointer hover:scale-102 transition-transform duration-150"
          >
            Schedule Free Strategy Session
          </button>
        </div>
      </section>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="services-index-page"
      />
    </Layout>
  );
};
