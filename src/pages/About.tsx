import React, { useState } from "react";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { QuoteModal } from "../components/QuoteModal";
import { TEAM_MEMBERS, WHY_CHOOSE_US_STATS } from "../data/websiteData";
import { Award, Star } from "lucide-react";

export const About: React.FC = () => {
  const { data: cms } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);

  const awards = [
    { year: "2023", award: "Best Indie Publishing Service", org: "Publishers Weekly" },
    { year: "2022", award: "Top Ghostwriting Company", org: "Clutch.co" },
    { year: "2021", award: "Author Satisfaction Award", org: "Self-Publishing Review" },
    { year: "2020", award: "Excellence in Book Design", org: "Independent Book Awards" },
  ];

  return (
    <Layout
      title={cms.seo_about_title || "Our Story & Elite Book Team"}
      description={cms.seo_about_desc || "Learn about American Book Founders — our story, our elite ghostwriting consultants, and our mission to help every writer publish with confidence."}
    >
      {/* Intro Hero banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden" id="about-hero">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            About American Book Founders
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mt-3 leading-tight">
            America's Most Trusted Book Publishing Partner
          </h1>
          <p className="text-gray-300 text-base md:text-lg mt-6 leading-relaxed">
            Founded on the belief that every author deserves a professional publishing experience — without giving up their rights, royalties, or creative freedom.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white" id="about-story">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight">
                Built by Authors, for Authors
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  American Book Founders was born from frustration. Our founders — experienced independent authors themselves — were tired of watching talented writers surrender their intellectual rights, their hard-earned royalties, and their creative vision to publishing gatekeepers who didn't share their passion.
                </p>
                <p>
                  In 2014, we set out to build a different kind of publishing company. One where authors are treated as partners, not products. Where every single dollar of book royalty belongs to the writer who earned it. Where the quality of your finished book matches your dream.
                </p>
                <p>
                  Today, we've helped over 3,400 authors publish with confidence — from first-time novelists to seasoned executive leaders — across every genre imaginable.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600&h=400"
                alt="American Book Founders story — authors at work"
                className="rounded-2xl shadow-2xl w-full object-cover h-80 border border-gray-100"
              />
              <div className="absolute -bottom-5 -left-5 bg-gold text-navy rounded-xl px-6 py-4 shadow-xl">
                <p className="text-3xl font-serif font-bold">10+</p>
                <p className="text-xs font-bold uppercase tracking-widest">Years in Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-cream" id="about-why-us">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">
              What Sets Us Apart
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-7 shadow-md text-center border-b-4 border-gold hover:-translate-y-1 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-5 h-5 text-gold fill-gold" />
                </div>
                <h3 className="font-serif font-bold text-navy text-lg mb-2">{stat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Team members */}
      <section className="py-20 bg-white" id="about-team">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">
              The Experts Behind Your Book
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="bg-cream rounded-xl overflow-hidden shadow group border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.img}
                    alt={`${member.name} — ${member.role}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-navy text-lg">{member.name}</h3>
                  <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & recognition */}
      <section className="py-16 bg-navy text-white" id="about-awards">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            Recognition
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-10">
            Awards & Satisfaction Recognition
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {awards.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 rounded-xl p-6 border border-gold/20 flex flex-col justify-between"
              >
                <Award className="w-8 h-8 text-gold mx-auto mb-3" />
                <div>
                  <p className="text-gold font-bold text-sm">{item.year}</p>
                  <p className="font-serif font-bold text-sm md:text-base mt-2">{item.award}</p>
                </div>
                <p className="text-gray-400 text-xs mt-2 italic">{item.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA banner */}
      <section className="py-16 bg-gold text-navy text-center" id="about-cta">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Start Your Publishing Journey?
          </h2>
          <p className="text-navy/70 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Join 3,400+ authors who chose American Book Founders to make their dream a tangible success.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-block bg-navy hover:bg-navy/90 text-white font-bold px-10 py-4 rounded-md transition-colors text-sm cursor-pointer shadow-lg"
          >
            Get A Free Consultation
          </button>
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
