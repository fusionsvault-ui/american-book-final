import React, { useState } from "react";
import { useCMS } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2, Star } from "lucide-react";

export const Contact: React.FC = () => {
  const { data: cms } = useCMS();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    genre: "Fiction",
    stage: "Brainstorming Idea",
    words: "Under 10,000",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Inquiry details: Genre=${formData.genre}, Stage=${formData.stage}, Words=${formData.words}, Details=${formData.message}`,
          source: "contact-page-form",
        }),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  return (
    <Layout
      title={cms.seo_contact_title || "Contact Our Senior Book Editors Today"}
      description={cms.seo_contact_desc || "Connect directly with American Book Founders consultants. Schedule a free 30-minute phone strategy call to estimate pricing fees & publish your book."}
    >
      {/* Intro Header */}
      <section className="bg-navy text-white py-16 text-center relative overflow-hidden" id="contact-banner">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-4">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            Reach Out Today
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black leading-tight">
            Schedule Your Free Book Consultation
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about royalties, layout formatting, or editorial milestones? Our publishing counselors are here to help.
          </p>
        </div>
      </section>

      {/* Grid containing Coordinates and Interactive Form */}
      <section className="py-20 bg-cream" id="contact-content-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
            
            {/* Left Coordinates Column (5 columns) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-navy text-white rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <h3 className="font-serif font-bold text-xl text-gold relative z-10">Our Main coordinates</h3>
                
                <div className="space-y-6 relative z-10">
                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gold flex-shrink-0 border border-white/10">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Toll-Free Phone</p>
                      <a href="tel:+18005550199" className="font-serif font-bold text-sm md:text-base text-white hover:text-gold transition-colors">
                        +1 (800) 555-0199
                      </a>
                    </div>
                  </div>

                  {/* Mail */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gold flex-shrink-0 border border-white/10">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Consulting Inquiries</p>
                      <a href="mailto:info@americanbookfounders.com" className="font-semibold text-sm md:text-base text-white hover:text-gold transition-colors">
                        info@americanbookfounders.com
                      </a>
                    </div>
                  </div>

                  {/* Times */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gold flex-shrink-0 border border-white/10">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Working Hours</p>
                      <p className="text-sm text-gray-250 font-medium">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p className="text-xs text-gold font-bold italic mt-0.5">Author hotlines remain active on weekends</p>
                    </div>
                  </div>

                  {/* Adresa */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gold flex-shrink-0 border border-white/10">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Headquarters Location</p>
                      <p className="text-sm text-gray-250 font-medium">American Book Founders Central, NY, USA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* USP Checklist Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
                <h4 className="font-serif font-bold text-navy text-base mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold fill-gold" />
                  What Happens Next?
                </h4>
                
                <div className="space-y-4">
                  {[
                    "1. A senior book coordinator receives your target outline and manuscript stage details.",
                    "2. We evaluate potential genre matches across our active roster of ghostwriters.",
                    "3. We schedule a brief phone call to formulate a flat fee discount schedule."
                  ].map((pText, i) => (
                    <p key={i} className="text-xs md:text-sm text-gray-550 leading-relaxed font-semibold">
                      {pText}
                    </p>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Interactive Form Box (7 columns) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xl relative" id="contact-sheet-form">
              {submitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto text-gold">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-black text-2xl text-navy">Consultation Scheduled!</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for submitting your book outline details. A senior ghostwriting or self-publishing expert will phone you back inside 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 bg-navy text-white text-xs font-bold px-6 py-2.5 rounded-lg cursor-pointer hover:bg-gold hover:text-navy transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif font-black text-2xl text-navy leading-tight">
                    Inquire Online Today
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    Required fields are followed by an asterisk (*)
                  </p>

                  <div className="grid md:grid-cols-2 gap-5 pt-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-gold transition text-gray-850 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-gold transition text-gray-850 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-gold transition text-gray-850 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Book Genre
                      </label>
                      <select
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-gold bg-white text-gray-850 transition"
                      >
                        <option value="Fiction">Fiction / Novels / Sci-Fi</option>
                        <option value="Non-Fiction">Non-Fiction / Business / Self-Help</option>
                        <option value="Memoir">Memoir / Legacy Autobiography</option>
                        <option value="Childrens">Children's Picture Book</option>
                        <option value="Other">Other Category</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Current Milestone Draft Stage
                      </label>
                      <select
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-gold bg-white text-gray-850 transition"
                      >
                        <option value="Brainstorming Idea">Brainstorming Concept Idea</option>
                        <option value="Outline Complete">Detailed Chapter Outline Complete</option>
                        <option value="Rough Draft">Rough Draft in Progress</option>
                        <option value="Fully Complete">Completely Drafted Manuscript</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                        Estimated Word Count
                      </label>
                      <select
                        value={formData.words}
                        onChange={(e) => setFormData({ ...formData, words: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-gold bg-white text-gray-850 transition"
                      >
                        <option value="Under 10,000">Under 10,000 words</option>
                        <option value="10,000 - 30,000">10,000 to 30,000 words</option>
                        <option value="30,000 - 60,000">30,000 to 60,000 words</option>
                        <option value="Over 60,000">Over 60,000 words</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Project Details & Goals
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Give a brief summary of what your story book is about, target publication timing, etc."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-gold transition text-gray-850 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-navy hover:bg-gold hover:text-navy cursor-pointer py-4 px-4 text-white hover:text-navy font-extrabold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    Submit Booking Form
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};
