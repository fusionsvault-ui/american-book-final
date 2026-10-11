import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { Layout } from "../components/Layout";
import { QuoteModal } from "../components/QuoteModal";
import { BookCarousel } from "../components/BookCarousel";
import { SERVICES, ServiceItem } from "../data/servicesData";
import { motion } from "motion/react";
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2 
} from "lucide-react";

// Portfolio Gallery Slider with Full/Multi Genre Book interactive covers
import { PORTFOLIO_BOOKS, PORTFOLIO_FILTERS } from "../data/websiteData";

interface GallerySliderProps {
  images: string[];
  serviceTitle: string;
}

const GallerySlider: React.FC<GallerySliderProps> = ({ images, serviceTitle }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    if (selectedFilter === "All") return PORTFOLIO_BOOKS;
    return PORTFOLIO_BOOKS.filter(
      (b) => b.genre.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [selectedFilter]);

  return (
    <>
      <section className="py-20 bg-cream/50 border-t border-b border-gray-150" id="service-gallery-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-gold font-bold uppercase tracking-widest text-sm">Portfolio</span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-navy mt-2">Books We've Created</h2>
            <p className="text-gray-500 text-sm md:text-base mt-2 max-w-lg mx-auto">
              A dynamic showcase of projects delivered. Select different genres to view the unique book covers.
            </p>
          </div>

          {/* Filters view */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {PORTFOLIO_FILTERS.map((fName) => (
              <button
                key={fName}
                onClick={() => setSelectedFilter(fName)}
                className={`px-4.5 py-1.5 rounded-full text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                  selectedFilter === fName
                    ? "bg-gold text-navy border-gold shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-gold"
                }`}
              >
                {fName}
              </button>
            ))}
          </div>

          {/* Book Jackets Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-7">
              {filteredBooks.map((book, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                  id={`service-detail-book-${idx}`}
                >
                  {/* Photo area */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={book.img}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-350"
                      loading="lazy"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-navy/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                      <button
                        onClick={() => setZoomImg(book.img)}
                        className="w-9 h-9 rounded-full bg-gold flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
                        title="Zoom cover image"
                      >
                        <Maximize2 className="w-5.5 h-5.5 text-navy" />
                      </button>
                      <span className="text-white text-[10px] font-bold mt-2 bg-white/10 px-2 py-0.5 rounded">
                        Published {book.year}
                      </span>
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <span className="text-[9px] text-gold font-bold uppercase tracking-wider block">
                        {book.genre}
                      </span>
                      <h4 className="font-serif font-bold text-navy text-xs md:text-sm leading-tight mt-1 truncate">
                        {book.title}
                      </h4>
                      <p className="text-gray-400 text-[11px] mt-0.5 italic truncate">By {book.author}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] text-navy font-bold">
                        ★ {book.rating}
                      </span>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="text-[9px] text-navy font-black hover:text-gold transition-colors block uppercase tracking-wider cursor-pointer"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-100 max-w-sm mx-auto animate-fade-in">
              <p className="text-gray-400 text-sm">No curated book covers in this category currently.</p>
              <button
                onClick={() => setSelectedFilter("All")}
                className="mt-3 bg-navy text-white text-xs font-bold px-3.5 py-1.5 rounded cursor-pointer hover:bg-gold hover:text-navy transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomImg(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/75 hover:text-white transition-colors cursor-pointer animate-pulse"
            onClick={() => setZoomImg(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-2xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomImg}
              alt="Expanded Cover"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>
        </div>
      )}

      {/* Modal Dialogue */}
      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="service-page-portfolio-direct"
        title="Enquire About This Genre Book"
        subtitle="Connect with our premier ghostwriting team, editors, and production wizards. Let's realize your bestseller!"
      />
    </>
  );
};

export const ServiceDetails: React.FC = () => {
  const [match, params] = useRoute("/services/:slug");
  const [modalOpen, setModalOpen] = useState(false);

  // Parse target service from catalog
  const service = useMemo(() => {
    if (!match || !params) return null;
    const { slug } = params as { slug: string };
    return SERVICES.find((s) => s.slug === slug) || null;
  }, [match, params]);

  // Derived related services
  const relatedServicesList = useMemo(() => {
    if (!service || !service.relatedServices) return [];
    return service.relatedServices
      .map((slug) => SERVICES.find((s) => s.slug === slug))
      .filter((s): s is ServiceItem => !!s);
  }, [service]);

  if (!service) {
    return (
      <Layout title="Service Not Found">
        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-black text-navy mb-4">Service Not Found</h2>
            <p className="text-gray-500 mb-8">We could not locate the publishing service you requested.</p>
            <Link href="/services" className="bg-navy text-white font-bold px-6 py-2.5 rounded-lg hover:bg-gold hover:text-navy transition-colors">
              Browse All Services
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${service.title} - American Book Founders`}
      description={`${service.title} — ${service.tagline} Professional ${service.category.toLowerCase()} services at American Book Founders.`}
    >
      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Get Started with ${service.title}`}
        subtitle={`Fill in your details and our ${service.title} experts will contact you within 24 hours.`}
        source={`service-${service.slug}`}
      />

      {/* Hero Header Section */}
      <section className="relative bg-navy text-white py-20 overflow-hidden" id="service-hero">
        <div className="absolute inset-0">
          <img
            src={service.img}
            alt={service.title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-bold uppercase tracking-widest text-sm"
          >
            {service.category}
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold mt-3 max-w-3xl leading-tight"
          >
            {service.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gold italic mt-3"
          >
            {service.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 mt-4 max-w-2xl leading-relaxed"
          >
            {service.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-4 rounded-md hover:bg-yellow-400 transition-colors cursor-pointer"
            >
              Get Started Today <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-md hover:bg-white/10 transition-colors"
            >
              Call +1 (800) 555-0199
            </a>
          </motion.div>
        </div>
      </section>

      {/* Benefits Content Overview */}
      <section className="py-20 bg-cream" id="service-key-benefits">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-gold font-bold uppercase tracking-widest text-sm">What You Get</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-2 mb-8">Key Benefits</h2>
              <ul className="space-y-4">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src={service.img}
                alt={`${service.title} — professional book service`}
                loading="lazy"
                decoding="async"
                className="rounded-2xl shadow-2xl w-full object-cover h-80"
              />
              <div className="absolute -bottom-4 -right-4 bg-navy text-white rounded-xl px-6 py-4 shadow-xl border border-white/10">
                <p className="text-2xl font-serif font-bold text-gold">3,400+</p>
                <p className="text-xs font-semibold">Satisfied Authors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Gallery Slider portfolio */}
      <GallerySlider images={service.gallery} serviceTitle={service.title} />

      {/* Why Choose Us / Trust Cards */}
      {service.whyChoose && service.whyChoose.length > 0 && (
        <section className="py-20 bg-white" id="service-why-choose">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-gold font-bold uppercase tracking-widest text-sm">Why Choose Us</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-2">Why Authors Trust Us</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.whyChoose.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-cream rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5 text-navy" />
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed font-semibold">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step by Step Process */}
      <section className="py-20 bg-cream" id="service-works-process">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-gold font-bold uppercase tracking-widest text-sm">How It Works</span>
            <h2 className="text-3xl font-serif font-bold text-navy mt-2">Our Step-by-Step Process</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {service.process.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center hover:translate-y-[-4px] transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gold text-navy font-bold text-xl flex items-center justify-center mx-auto mb-4 border border-navy/5 shadow-md">
                  {idx + 1}
                </div>
                <h3 className="font-serif font-bold text-navy text-base mb-2">{p.step}</h3>
                <p className="text-gray-550 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories / Case Highlights */}
      {service.examples && service.examples.length > 0 && (
        <section className="py-20 bg-white" id="service-success-cases">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-gold font-bold uppercase tracking-widest text-sm">Success Stories</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-2">Real Projects We've Delivered</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.examples.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-cream rounded-xl p-6 border border-gray-200 shadow-xs hover:shadow-md hover:border-gold/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mb-4 border border-white/10 shadow-sm">
                    <BookOpen className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-serif font-bold text-navy text-base mb-2">{item.title}</h3>
                  <p className="text-gray-550 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Numeric Highlights Board */}
      {service.results && service.results.length > 0 && (
        <section className="py-20 bg-navy text-white relative" id="service-metrics-by-the-numbers">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-14">
              <span className="text-gold font-bold uppercase tracking-widest text-sm">Results</span>
              <h2 className="text-3xl font-serif font-bold mt-2">By The Numbers</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.results.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-xs hover:border-gold/30 transition-colors"
                >
                  <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-sm">
                    <Award className="w-5 h-5 text-navy" />
                  </div>
                  <p className="text-gold font-bold text-lg">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Questions */}
      {service.faq && service.faq.length > 0 && (
        <section className="py-20 bg-cream" id="service-faq-panel">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-14">
              <span className="text-gold font-bold uppercase tracking-widest text-sm">FAQ</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-2">Common Questions</h2>
            </div>
            <div className="space-y-4">
              {service.faq.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-navy text-base mb-2">{item.q}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore Related services options */}
      {relatedServicesList.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100" id="service-explore-more">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-gold font-bold uppercase tracking-widest text-sm">Explore More</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-2">Related Services</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServicesList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/services/${item.slug}`}
                    className="group block bg-cream rounded-xl overflow-hidden border border-gray-100 hover:border-gold transition-colors shadow-sm cursor-pointer"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                        {item.category}
                      </span>
                      <h3 className="font-serif font-bold text-navy text-sm mt-1 group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Master Book Loop Carousel slider showcase */}
      <BookCarousel />

      {/* Bottom Conversion Sunrise action CTA section */}
      <section className="py-20 bg-gold text-navy text-center relative overflow-hidden" id="service-cta">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#07082a_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-navy/70 text-base md:text-lg mb-8 max-w-lg mx-auto font-medium">
            Contact us today for a free consultation with our {service.title} experts.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-block bg-navy text-white font-bold px-10 py-4 rounded-md hover:bg-navy/90 hover:scale-[1.02] shadow-2xl transition-all cursor-pointer"
          >
            Get A Free Consultation
          </button>
        </div>
      </section>
    </Layout>
  );
};
