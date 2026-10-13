import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "motion/react";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { QuoteModal } from "../components/QuoteModal";
import { BookCarousel } from "../components/BookCarousel";
import { GenreSection } from "../components/GenreSection";
import { SERVICES } from "../data/servicesData";
import { TESTIMONIALS, BLOG_POSTS } from "../data/websiteData";

import { 
  Phone, 
  FileText, 
  Star, 
  Search, 
  Feather, 
  CheckSquare, 
  Rocket, 
  Compass, 
  BookOpen, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Award,
  Clock
} from "lucide-react";

// Stat model
interface StatItem {
  number: string;
  label: string;
}

// Hero Form state
interface HeroFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const Home: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("home-cta");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Hero Form Fields State
  const [form, setForm] = useState<HeroFormState>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
 
  // Hero static custom configs 
  const heroData = {
    eyebrow: cms.hero_eyebrow || "Become A Self-Published Author:",
    headline: cms.hero_headline || "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
    subText: cms.hero_subtext || 'Beyond Book Publishing (BeyondBookpublishing.com) pairs authors with a master guild of bestselling ghostwriters, veteran editors, and global distribution specialists. Keep 100% of your earnings, copyright, and creative freedom.',
    bullets: [
      "Not able to write a great manuscript?",
      "Are you frustrated with waiting for approvals?",
      "As a publisher, do you know what to do next?"
    ],
    phone: cms.hero_phone || "+1 (800) 555-0199",
    ratingText: cms.hero_ratingText || "Rated 9.1 out of 10",
    ratingCount: cms.hero_ratingCount || "3,428"
  };

  // Stats Highlights Section Data
  const statsList: StatItem[] = [
    { number: "500+", label: "Books Published" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "Expert Writers" },
    { number: "10+", label: "Years Experience" }
  ];

  // Restored Services grid (bD equivalent)
  // Fetching the actual top curated services from SERVICES catalog to guarantee clickable, real detail links!
  const premiumServices = SERVICES.slice(0, 6);

  // Restored Our Process Section Steps 
  const processSteps = [
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Research & Discovery",
      desc: "We dive deep into your concept, target audience, and market trends."
    },
    {
      icon: <Feather className="w-8 h-8" />,
      title: "Writing & Drafting",
      desc: "Our writers craft your manuscript chapter by chapter with regular feedback."
    },
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: "Review & Revision",
      desc: "Comprehensive editing to ensure your voice is captured perfectly."
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Publication & Launch",
      desc: "Formatting, cover design, and publishing across major platforms."
    }
  ];

  // Made in America checks list
  const voiceChecks = [
    { icon: <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />, label: "Master Guild Writers" },
    { icon: <Award className="w-4 h-4 text-gold flex-shrink-0" />, label: "Unlimited revisions" },
    { icon: <BookOpen className="w-4 h-4 text-gold flex-shrink-0" />, label: "Full creative control" },
    { icon: <Phone className="w-4 h-4 text-gold flex-shrink-0" />, label: "1-on-1 consultations" }
  ];

  // Handle Free Consultation Modal Openers
  const openConsultation = (source: string) => {
    setModalSource(source);
    setModalOpen(true);
  };

  // Handle Form Submission
  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "main-hero-form"
        })
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error("Failed to submit lead", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={cms.seo_home_title || "Beyond Book Publishing - Professional Ghostwriting, Editing & Book Publishing"}
      description={cms.seo_home_desc || "Upgrade to premium book production with Beyond Book Publishing (BeyondBookpublishing.com). Capturing your voice across every genre. Keep 100% of your royalties and copyright."}
    >
      {/* Dynamic Consultation Quote Modal overlay */}
      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={modalSource}
        title="Get A Free Consultation"
        subtitle="Connect with our expert team of professional ghostwriters and publishers. We reply within 24 hours!"
      />

      {/* ================= HERO SECTION (dk.js restored) ================= */}
      <section 
        className="relative text-white overflow-hidden bg-navy"
        style={{
          backgroundImage: "url('/bg-hero.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center top"
        }}
        id="home-hero-frame"
      >
        <div className="absolute inset-0 bg-navy/88 z-0" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-5 sm:py-6 md:py-7 lg:py-8">
          <div className="grid lg:grid-cols-[1fr_390px] gap-6 xl:gap-10 items-center">
            
            {/* Left Box Details */}
            <div className="space-y-3 pt-0.5">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider"
              >
                {heroData.eyebrow}
              </motion.p>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-[1.95rem] font-serif font-black leading-[1.22] text-white tracking-tight"
              >
                {heroData.headline}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl"
              >
                {heroData.subText}
              </motion.p>
              
              {/* Bullets lists */}
              <ul className="space-y-1.5 pt-0.5">
                {heroData.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-200 text-xs sm:text-sm" id={`hero-bullet-${idx}`}>
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0 shadow-md" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              
              {/* Call and Quote CTAs */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                {cms.header_show_phone === true && (cms.header_phone?.trim() || heroData.phone) ? (
                  <a 
                    href={`tel:${(cms.header_phone || heroData.phone).replace(/\s/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 bg-navy border-2 border-gold text-white font-bold text-xs sm:text-sm px-5 h-10 rounded-md hover:bg-gold hover:text-navy transition-colors shadow-lg active:scale-98 duration-100 cursor-pointer"
                    id="hero-call-action"
                  >
                    <Phone className="w-4 h-4 text-gold" />
                    <span>{cms.header_phone || heroData.phone}</span>
                  </a>
                ) : (
                  <button 
                    onClick={() => openConsultation("hero-consultation")}
                    className="inline-flex items-center justify-center gap-2 bg-navy border-2 border-gold text-white font-bold text-xs sm:text-sm px-5 h-10 rounded-md hover:bg-gold hover:text-navy transition-colors shadow-lg active:scale-98 duration-100 cursor-pointer"
                    id="hero-call-action"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Schedule Free Strategy Call</span>
                  </button>
                )}
                <Link 
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-yellow-400 text-navy font-bold text-xs sm:text-sm px-5 h-10 rounded-md transition-colors shadow-lg active:scale-98 duration-100 cursor-pointer"
                  id="hero-pricing-action"
                >
                  <FileText className="w-4 h-4" />
                  <span>Get a Free Quote</span>
                </Link>
              </div>
              
              {/* Reviews & Stars rating bar */}
              <div className="flex items-center flex-wrap gap-2 pt-1 text-xs sm:text-sm">
                <span className="text-gray-400 font-medium">{heroData.ratingText}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-gray-400 font-medium">
                  based on <strong className="text-white">{heroData.ratingCount}</strong> satisfied customers.
                </span>
              </div>
            </div>

            {/* Right Side Instant Lead Capture Form */}
            <div className="relative z-10 w-full" id="instant-lead-capture">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                
                {/* Gold header tag banner */}
                <div className="bg-gold px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-navy font-serif font-black text-lg md:text-xl leading-tight">
                      Connect With Our Expert
                    </h2>
                    <p className="text-navy/85 text-xs font-semibold mt-0.5">
                      Get a free consultation within 24 hours
                    </p>
                  </div>
                  <div className="p-2 bg-navy/10 rounded-full">
                    <Sparkles className="w-5 h-5 text-navy" />
                  </div>
                </div>

                {/* Form Content / Success state */}
                <div className="px-7 py-6">
                  {formSubmitted ? (
                    <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 fill-gold text-gold animate-bounce" />
                      </div>
                      <h3 className="text-navy font-serif font-black text-xl mb-2">Thank You!</h3>
                      <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                        Our expert publishing and ghostwriting strategists will review your details and contact you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleHeroFormSubmit} className="space-y-3">
                      <input 
                        type="text" 
                        required
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full h-11 border border-gray-200 rounded-md px-3.5 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                      />
                      <input 
                        type="email" 
                        required
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full h-11 border border-gray-200 rounded-md px-3.5 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full h-11 border border-gray-200 rounded-md px-3.5 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                      />
                      <textarea 
                        rows={2}
                        placeholder="Tell us about your book project (genre, word count, ideas)..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-gray-200 rounded-md px-3.5 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-medium resize-none"
                      />
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-navy hover:bg-navy/90 text-white font-extrabold h-11 sm:h-12 rounded-md text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 mt-1 shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Request Free Consultation"}
                      </button>
                      <p className="text-center text-[10px] text-gray-400 pt-0.5 leading-snug">
                        100% Confidential • NDA Protected • Free Strategy Session
                      </p>
                    </form>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= DYNAMICS STATS BAR SECTION (yO.js restored) ================= */}
      <section className="bg-navy border-y border-white/10 py-12" id="home-stats-highlights">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y-0 divide-x-0 md:divide-x divide-white/10">
            {statsList.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="text-center px-4"
              >
                <h3 className="text-4xl md:text-5xl font-serif font-black text-gold mb-1">
                  {stat.number}
                </h3>
                <p className="text-white/90 font-bold tracking-widest uppercase text-xs">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PREMIUM SERVICES GRID Restoring (wD.js restored) ================= */}
      <section 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: "url('/bg-process.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        id="home-premium-book-production"
      >
        <div className="absolute inset-0 bg-[#f7f4ef]/94 z-0" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-gold text-sm font-bold uppercase tracking-widest mb-3"
            >
              Our Services
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-black text-navy leading-tight"
            >
              Upgrade to Premium Book Production
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-500 text-sm md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed"
            >
              Everything you need to take your manuscript from idea to bestseller - under one roof.
            </motion.p>
          </div>

          {/* Catalog grid blocks (bD equivalent) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumServices.map((service, idx) => (
              <motion.div 
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                id={`premium-service-card-${service.slug}`}
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-navy">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      loading="lazy"
                      decoding="async"
                      width={380}
                      height={192}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                    <div className="absolute top-0 left-0 w-0 h-1 bg-gold group-hover:w-full transition-all duration-500" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold font-serif text-navy group-hover:text-gold transition-colors leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm mt-2 leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-gold tracking-widest bg-cream px-2 py-0.5 rounded-sm">
                    {service.category}
                  </span>
                  <Link 
                    href={`/services/${service.slug}`}
                    className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services"
              className="inline-flex items-center gap-2 bg-navy text-white hover:bg-navy/90 font-extrabold px-8 py-3.5 rounded-md shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              Browse All Services <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= DEEP BRAND PROCESSRestoring (cO.js restored) ================= */}
      <section 
        className="relative py-24 text-white overflow-hidden bg-navy"
        style={{
          backgroundImage: "url('/bg-process.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        id="home-brand-process-section"
      >
        <div className="absolute inset-0 bg-navy/85 z-0" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight"
            >
              Our Process
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/10 relative overflow-hidden group"
                id={`process-card-${idx}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="w-16 h-16 rounded-full bg-gold text-navy flex items-center justify-center mb-6 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif text-white leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm font-medium leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EVERY VOICE HAS A GENRE (oO.js restored via GenreSection) ================= */}
      <GenreSection />

      {/* ================= PORTFOLIO MULTI FLOW SLIDERS ================= */}
      <BookCarousel />

      {/* ================= MEET OUR PUBLISHED AUTHORS (pO.js restored) ================= */}
      <section className="py-24 bg-white text-navy" id="meet-published-authors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-gold text-sm font-bold uppercase tracking-widest mb-3"
            >
              Published Authors
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-black leading-tight text-navy"
            >
              Meet Our Published Authors
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mt-3"
            >
              Talented writers from across America who trusted us to bring their stories to the world.
            </motion.p>
          </div>

          {/* Verified Authors circular list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-4">
            {[
              { name: "James Carter", genre: "Thriller Author", img: "/author-1.webp" },
              { name: "Amara Williams", genre: "Romance Novelist", img: "/author-2.webp" },
              { name: "David Chen", genre: "Sci-Fi Writer", img: "/author-3.webp" },
              { name: "Linda Foster", genre: "Memoir Author", img: "/author-4.webp" },
              { name: "Carlos Rivera", genre: "Business Writer", img: "/author-5.webp" },
              { name: "Yuki Tanaka", genre: "Literary Fiction", img: "/author-6.webp" }
            ].map((author, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => openConsultation("published-author-consult")}
                id={`author-profile-${idx}`}
              >
                <div className="relative mb-3">
                  <img 
                    src={author.img} 
                    alt={author.name} 
                    loading="lazy"
                    decoding="async"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-gold transition-colors duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-gold/0 group-hover:ring-gold/60 transition-all duration-300" />
                </div>
                <h4 className="font-bold font-serif text-sm text-navy group-hover:text-gold transition-colors">
                  {author.name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Author, {author.genre}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXPERTS MARKETING CONSULTANTS BOARDS (pO.js rest) ================= */}
      <section className="py-24 bg-navy text-white relative overflow-hidden" id="marketing-expertsboard">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-gold text-sm font-bold uppercase tracking-widest mb-3 animate-pulse"
            >
              Goal-Oriented Book Strategy
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-black leading-tight text-white mb-4"
            >
              Connect With Our Reputable Book Marketing Experts For A Goal-Oriented Strategy That Complements Your Writing
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white text-navy rounded-xl p-8 shadow-2xl relative flex flex-col justify-between"
                id={`expert-quote-card-${idx}`}
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-5 h-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-gray-600 font-medium mb-8 leading-relaxed italic relative z-10 text-sm md:text-base">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto border-t border-gray-150 pt-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    loading="lazy"
                    decoding="async"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold font-serif text-base text-navy">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-bold">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT US / MADE IN AMERICA SECTION ================= */}
      <section 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: "url('/bg-concerned.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        id="home-about-us-section"
      >
        <div className="absolute inset-0 bg-[#f7f4ef]/95 z-0" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Box: Story & Guarantees */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block text-gold text-xs font-bold uppercase tracking-widest bg-navy px-3.5 py-1.5 rounded-sm shadow-sm">
                  About Beyond Book Publishing
                </span>
                <span className="inline-block text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 border border-gold/40 px-3.5 py-1.5 rounded-sm">
                  ★ 100% Author-First
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-black text-navy leading-tight">
                Built by Authors, for Authors - America’s Premier Author-First Publishing Partner
              </h2>

              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                Beyond Book Publishing (BeyondBookpublishing.com) was built on a simple conviction: <strong>every author deserves the caliber of a top-tier Manhattan publishing house without surrendering their rights, royalties, or creative freedom.</strong>
              </p>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Whether you have an unwritten concept, a partial manuscript, or a complete book ready for world-class publishing, our elite guild of bestselling ghostwriters, veteran editors, and marketing strategists brings your vision to life.
              </p>
              
              {/* Core Pillars */}
              <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
                {[
                  { title: "100% Royalty Ownership", desc: "You keep all earnings & retain 100% copyright", icon: "💎" },
                  { title: "Master Author Guild", desc: "Vetted NYT & indie bestselling writers, zero AI", icon: "✍️" },
                  { title: "Bespoke Voice Matching", desc: "Every sentence tailored to your distinct tone", icon: "🎙️" },
                  { title: "Worldwide Distribution", desc: "Amazon, Barnes & Noble, Apple & 40k+ libraries", icon: "🌍" },
                ].map((pillar, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-200/80 flex items-start gap-3">
                    <span className="text-xl select-none mt-0.5">{pillar.icon}</span>
                    <div>
                      <p className="text-navy font-bold text-xs md:text-sm">{pillar.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-snug">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => openConsultation("home-about-desk")}
                  className="bg-gold hover:bg-yellow-400 text-navy font-extrabold px-8 h-13 rounded-md shadow-lg inline-flex items-center justify-center cursor-pointer active:scale-98 transition-all hover:scale-102 text-sm"
                >
                  Get A Free Consultation
                </button>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold px-6 h-13 rounded-md transition-all text-sm cursor-pointer"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right Side Visual with American Flag ornament */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* CSS American flag stripes */}
              <div className="absolute -top-4 -left-4 w-full h-3 flex gap-0.5 rounded overflow-hidden z-10 shadow-sm">
                {Array.from({ length: 13 }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1" 
                    style={{ background: idx % 2 === 0 ? "#B22234" : "#ffffff" }} 
                  />
                ))}
              </div>
              
              {/* Canton field */}
              <div className="absolute -top-4 -left-4 w-9 h-6 bg-[#3C3B6E] z-10 rounded-sm flex flex-wrap gap-0.5 items-center justify-center p-0.5 shadow-md">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <span key={idx} className="text-[4px] leading-none text-white font-bold select-none">★</span>
                ))}
              </div>

              {/* Writing Desk Image */}
              <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white mt-4 bg-navy">
                <img 
                  src={cms.hero_image_url || "/assets/writing-desk-CeaHrFGY.webp"} 
                  alt={cms.hero_image_alt || "Beyond Book Publishing Editorial Desk"} 
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={450}
                  className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("unsplash")) {
                      target.src = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800";
                    }
                  }}
                />
              </div>

              {/* Layer accents */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gold/90 rounded-xl -z-10 shadow-sm" />
              <div className="absolute -top-4 -right-8 w-32 h-32 border-4 border-navy rounded-xl -z-10" />

              {/* Counter Float Card Overlay 1 */}
              <div className="absolute bottom-6 -right-4 bg-navy text-white px-5 py-3 rounded-xl shadow-2xl border border-white/10">
                <div className="text-2xl font-serif font-black text-gold">3,400+</div>
                <div className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Books Published</div>
              </div>

              {/* Trust Float Card Overlay 2 */}
              <div className="absolute -top-3 right-6 bg-white text-navy px-4 py-2.5 rounded-lg shadow-xl border border-gray-100 flex items-center gap-2">
                <div className="flex text-gold text-xs">★★★★★</div>
                <span className="text-xs font-bold text-navy">98% Satisfaction</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= BLOG RESOURCE GUIDES & LATEST INSIGHTS ================= */}
      <section className="py-20 bg-cream/70 border-t border-b border-gray-150" id="home-blog-section">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-gold font-bold uppercase tracking-widest text-xs">
                Author Education &amp; Strategic Insights
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-navy leading-tight">
                Latest Publishing Guides
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
                Expert roadmaps covering ghostwriting standards, cover design conversion, and dual-channel global distribution.
              </p>
            </div>
            <div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-navy hover:bg-gold text-white hover:text-navy font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg transition-colors shadow-xs"
              >
                <span>Browse All 10 Guides</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(cms.blogs && cms.blogs.length > 0 ? cms.blogs : BLOG_POSTS).slice(0, 3).map((post, pIdx) => (
              <article
                key={pIdx}
                className="bg-white rounded-xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-video relative overflow-hidden bg-navy">
                    <img
                      src={post.img}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-gold text-navy text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-serif font-bold text-navy text-lg group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 text-xs md:text-sm font-normal line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                      {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-navy hover:text-gold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Read Guide</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gold" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM DESPERATE HERO CALL CTA (lO.js restored) ================= */}
      <section 
        className="relative py-20 overflow-hidden text-center bg-gold"
        style={{
          backgroundImage: "url('/bg-cta.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        id="home-need-a-way-out-cta"
      >
        <div className="absolute inset-0 bg-gold/92 z-0" />
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-black text-navy leading-tight">
              Need A Way Out?
            </h2>
            <p className="text-lg md:text-2xl text-navy/85 font-semibold max-w-xl mx-auto leading-relaxed">
              Let our expert team of writers and editors help you navigate the complex world of publishing. Your masterpiece awaits.
            </p>
            <button 
              onClick={() => openConsultation("need-a-way-out")}
              className="bg-navy hover:bg-navy/90 text-white font-extrabold px-10 h-16 text-lg rounded-md mt-4 shadow-xl inline-flex items-center justify-center cursor-pointer active:scale-98 transition-all hover:scale-102"
            >
              Get A Free Consultation
            </button>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
};
