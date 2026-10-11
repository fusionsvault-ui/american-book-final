import React, { useState } from "react";
import { Link } from "wouter";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { QuoteModal } from "../components/QuoteModal";
import { TEAM_MEMBERS, WHY_CHOOSE_US_STATS } from "../data/websiteData";
import { 
  Award, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Feather, 
  TrendingUp, 
  Globe2, 
  Phone, 
  Sparkles,
  ArrowRight,
  Clock,
  HeartHandshake
} from "lucide-react";

export const About: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);

  const awards = [
    { year: "2024", award: "Top Independent Publishing House", org: "American Author Society" },
    { year: "2023", award: "Best Indie Publishing Service", org: "Publishers Weekly" },
    { year: "2022", award: "Top Ghostwriting Company", org: "Clutch.co" },
    { year: "2021", award: "Author Satisfaction Award", org: "Self-Publishing Review" },
    { year: "2020", award: "Excellence in Book Design", org: "Independent Book Awards" },
  ];

  const milestones = [
    {
      year: "2014",
      title: "Founded in New York",
      desc: "Created by published authors tired of seeing talented writers surrender their copyrights and 85% of royalties to legacy gatekeepers."
    },
    {
      year: "2017",
      title: "Ghostwriting Guild Formed",
      desc: "Assembled a nationwide collective of vetted master ghostwriters with credits across NYT, WSJ, and USA Today bestsellers."
    },
    {
      year: "2020",
      title: "Global Distribution Network",
      desc: "Partnered directly with IngramSpark, Amazon KDP, Apple Books, and Barnes & Noble to reach 40,000+ bookstores and libraries globally."
    },
    {
      year: "2023",
      title: "3,000th Author Published",
      desc: "Celebrated milestone of helping 3,000+ business leaders, novelists, memoirists, and poets bring their life stories to readers worldwide."
    },
    {
      year: "2026",
      title: "America's #1 Author-First House",
      desc: "Continuing our mission with zero AI shortcuts, 100% royalty ownership, and world-class bespoke literary craftsmanship."
    }
  ];

  const comparisonRows = [
    {
      feature: "Author Royalties",
      us: "100% Kept by You",
      trad: "8% – 15% Net",
      vanity: "Variable / Hidden fees",
    },
    {
      feature: "Copyright & IP Ownership",
      us: "100% Retained by Author",
      trad: "Publisher owns rights for years",
      vanity: "Often shared or restricted",
    },
    {
      feature: "Publishing Timeline",
      us: "6 – 9 Months",
      trad: "2 – 3 Years average",
      vanity: "Rushed / Template (2-4 wks)",
    },
    {
      feature: "Ghostwriting & Editorial Guild",
      us: "Vetted Bestselling Ghostwriters (Zero AI)",
      trad: "Junior in-house assistants",
      vanity: "Offshore or automated AI",
    },
    {
      feature: "Global Distribution",
      us: "Amazon, B&N, Apple + 40k Libraries",
      trad: "Selected physical stores only",
      vanity: "Amazon print-only",
    },
    {
      feature: "Creative Decision Making",
      us: "Author Has 100% Final Approval",
      trad: "Publisher dictates title & cover",
      vanity: "Rigid cookie-cutter templates",
    }
  ];

  return (
    <Layout
      title={cms.seo_about_title || "About Beyond Book Publishing — Our Story, Team & Publishing Mission"}
      description={cms.seo_about_desc || "Learn how Beyond Book Publishing (BeyondBookpublishing.com) became the most trusted author-first publishing house. 100% royalties, master ghostwriters, and over 3,400 published books."}
    >
      {/* Intro Hero banner */}
      <section className="relative bg-navy text-white py-24 overflow-hidden" id="about-hero">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Subtle glow circle */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">About Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>America's Premier Author-First Publishing Guild</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-black leading-tight text-white">
            Built by Authors, for Authors — <span className="text-gold">Your Legacy</span> in Print
          </h1>

          <p className="text-gray-300 text-base md:text-xl mt-6 leading-relaxed max-w-2xl mx-auto">
            Founded on the unshakeable belief that every storyteller deserves the elite caliber of a traditional Manhattan publishing house — without surrendering their rights, royalties, or creative freedom.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-black text-gold">3,400+</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mt-1">Books Published</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-black text-gold">100%</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mt-1">Royalties Kept</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-black text-gold">10+ Years</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mt-1">Industry Excellence</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-serif font-black text-gold">4.9 / 5</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mt-1">Author Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Manifesto */}
      <section className="py-24 bg-white" id="about-story">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block text-gold text-xs font-bold uppercase tracking-widest bg-navy px-3.5 py-1.5 rounded-sm">
                Our Story & Philosophy
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-black text-navy leading-tight">
                The Publishing Revolution Independent Authors Deserve
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                <p>
                  Beyond Book Publishing (BeyondBookpublishing.com) was born out of frustration. Our founders — experienced independent authors and veteran editors — were tired of watching gifted writers surrender their intellectual property, wait three agonizing years for a launch date, and forfeit up to 88% of their royalties to legacy publishing gatekeepers.
                </p>
                <p>
                  In 2014, we pioneered a different kind of publishing company: <strong>The Author-First Model</strong>. A collaborative environment where writers are treated as equity partners, not corporate commodities. Where your manuscript receives world-class editorial polish, award-winning cover design, and international distribution across 40,000+ bookstores — while every single dollar of your royalty checks goes directly into your bank account.
                </p>
                <p>
                  Today, our collective comprises over 80 vetted master ghostwriters, developmental editors, and literary publicists who have shepherded over 3,400 titles from conceptual sparkle to #1 Amazon Bestseller lists.
                </p>
              </div>

              {/* Guarantees checklist */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {[
                  "100% Royalty Ownership",
                  "Master Ghostwriting Guild",
                  "100% Copyright Retention",
                  "Dedicated Senior Project Manager",
                  "Milestone Approval Process",
                  "Zero AI-Generated Text"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-navy font-bold text-xs md:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-gold hover:bg-yellow-400 text-navy font-extrabold px-8 h-13 rounded-md shadow-lg inline-flex items-center justify-center cursor-pointer active:scale-98 transition-all hover:scale-102 text-sm"
                >
                  Schedule A Free Consultation
                </button>
                <a
                  href={`tel:${(cms.hero_phone || "+1 (800) 555-0199").replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold px-6 h-13 rounded-md transition-all text-sm"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  <span>{cms.hero_phone || "+1 (800) 555-0199"}</span>
                </a>
              </div>
            </div>

            {/* Visual with Trust Badges */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-navy">
                <img
                  src="/assets/writing-desk-CeaHrFGY.png"
                  alt="Beyond Book Publishing editorial desk"
                  className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("unsplash")) {
                      target.src = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800";
                    }
                  }}
                />
              </div>

              {/* Decorative backgrounds */}
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gold rounded-2xl -z-10 shadow-lg" />
              <div className="absolute -top-6 -right-6 w-36 h-36 border-4 border-navy rounded-2xl -z-10" />

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-6 right-6 bg-navy text-white px-6 py-4 rounded-xl shadow-2xl border border-white/10">
                <p className="text-3xl font-serif font-black text-gold">10+ Years</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Of Literary Excellence</p>
              </div>

              {/* Top Trust Seal */}
              <div className="absolute -top-4 left-6 bg-white text-navy px-5 py-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-gold" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-navy">Certified Integrity</p>
                  <p className="text-[11px] text-gray-500 font-medium">100% Royalty Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Milestone Timeline */}
      <section className="py-24 bg-[#f8f6f0] border-y border-gray-200/80" id="about-timeline">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-bold uppercase tracking-widest text-xs">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">
              From Author Collective to National Publishing Powerhouse
            </h2>
            <p className="text-gray-650 text-sm md:text-base mt-3">
              A decade of defending authors' rights, delivering literary triumphs, and breaking publishing industry records.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {milestones.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-gold relative flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <span className="text-2xl font-serif font-black text-gold block mb-2">{item.year}</span>
                  <h3 className="font-serif font-bold text-navy text-base mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-gold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Milestone Achieved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table: Us vs Big 5 vs Vanity Press */}
      <section className="py-24 bg-white" id="about-comparison">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-bold uppercase tracking-widest text-xs">
              The Truth About Publishing
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">
              How Beyond Book Publishing Compares
            </h2>
            <p className="text-gray-650 text-sm md:text-base mt-3">
              See why independent authors choose our author-first model over traditional publishing conglomerates and vanity presses.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <thead>
                <tr className="bg-navy text-white text-left">
                  <th className="py-5 px-6 font-serif font-bold text-base md:text-lg">Publishing Dimension</th>
                  <th className="py-5 px-6 bg-gold text-navy font-serif font-black text-base md:text-lg">
                    ★ Beyond Book Publishing
                  </th>
                  <th className="py-5 px-6 font-serif font-bold text-sm md:text-base text-gray-300">
                    Traditional "Big 5"
                  </th>
                  <th className="py-5 px-6 font-serif font-bold text-sm md:text-base text-gray-300">
                    Vanity / Template Press
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                    <td className="py-4 px-6 font-bold text-navy">{row.feature}</td>
                    <td className="py-4 px-6 bg-amber-50/70 font-extrabold text-navy flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{row.us}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="text-gray-700">{row.trad}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      <span className="text-red-700/80">{row.vanity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Meet Our Executive & Editorial Guild */}
      <section className="py-24 bg-[#f8f6f0] border-t border-gray-200/80" id="about-team">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold font-bold uppercase tracking-widest text-xs">
              Executive Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">
              The Minds Guiding Your Manuscript
            </h2>
            <p className="text-gray-650 text-sm md:text-base mt-3">
              Veterans of Penguin Random House, Simon & Schuster, and The New York Times bestseller list dedicated to your book's success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow-md group border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <div className="relative h-72 overflow-hidden bg-navy">
                    <img
                      src={member.img}
                      alt={`${member.name} — ${member.role}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("unsplash")) {
                          target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
                        }
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-navy/90 text-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      Editorial Board
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif font-bold text-navy text-xl">{member.name}</h3>
                    <p className="text-gold font-bold text-xs uppercase tracking-wider mt-1 mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gold font-bold">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span>Verified Expert</span>
                  </span>
                  <span>10+ Yrs Exp</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & recognition */}
      <section className="py-20 bg-navy text-white" id="about-awards">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="text-gold font-bold uppercase tracking-widest text-xs">
            Industry Recognition
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-12">
            Awards & Satisfaction Accolades
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {awards.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 rounded-xl p-6 border border-gold/20 flex flex-col justify-between hover:border-gold/60 transition-colors"
              >
                <Award className="w-8 h-8 text-gold mx-auto mb-3" />
                <div>
                  <p className="text-gold font-black text-sm">{item.year}</p>
                  <p className="font-serif font-bold text-sm md:text-base mt-2 text-white">{item.award}</p>
                </div>
                <p className="text-gray-400 text-xs mt-3 italic">{item.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 bg-gold text-navy text-center relative overflow-hidden" id="about-cta">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <span className="text-navy font-bold uppercase tracking-widest text-xs">
            Take The Next Step
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black mb-4 mt-2">
            Ready to Bring Your Book to Life?
          </h2>
          <p className="text-navy/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Schedule a complimentary 1-on-1 strategy session with a senior literary consultant at Beyond Book Publishing. Discuss your ideas, review outline samples, and receive a customized publishing roadmap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-navy hover:bg-navy/90 text-white font-extrabold px-10 py-4 rounded-md transition-all text-sm cursor-pointer shadow-xl hover:scale-102 active:scale-98"
            >
              Claim Your Free Publishing Consultation
            </button>
            <a
              href={`tel:${(cms.hero_phone || "+1 (800) 555-0199").replace(/\s/g, "")}`}
              className="bg-white/90 hover:bg-white text-navy font-bold px-8 py-4 rounded-md transition-all text-sm inline-flex items-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4 text-navy" />
              <span>Call Us: {cms.hero_phone || "+1 (800) 555-0199"}</span>
            </a>
          </div>
        </div>
      </section>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="about-us-page"
      />
    </Layout>
  );
};
