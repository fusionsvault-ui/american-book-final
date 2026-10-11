import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "../components/Layout";
import { ShieldCheck, FileText, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export const Policy: React.FC = () => {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");

  useEffect(() => {
    if (location.includes("terms")) {
      setActiveTab("terms");
    } else {
      setActiveTab("privacy");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <Layout
      title={activeTab === "privacy" ? "Privacy Policy" : "Terms of Service & Author Rights Guarantee"}
      description="Read Beyond Book Publishing's official Privacy Policy and Terms of Service. Discover our ironclad 100% royalty guarantee, copyright protection, and NDA security."
    >
      {/* Header Banner */}
      <section className="bg-navy text-white py-16 relative overflow-hidden" id="policy-hero">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl text-center space-y-4">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            Legal, Copyright &amp; Author Protection
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight">
            {activeTab === "privacy" ? "Privacy Policy" : "Terms of Service & Author Guarantees"}
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Beyond Book Publishing (BeyondBookpublishing.com) is built on an unwavering commitment to author confidentiality, 100% copyright retention, and transparent operations.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex bg-white/10 p-1 rounded-xl border border-white/20 mt-4">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-gold text-navy shadow-md"
                  : "text-white hover:text-gold"
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "terms"
                  ? "bg-gold text-navy shadow-md"
                  : "text-white hover:text-gold"
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="py-16 bg-cream text-gray-800" id="policy-content">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 space-y-8 leading-relaxed">
            {/* Quick Guarantees Badge Box */}
            <div className="bg-amber-50/70 border border-gold/30 rounded-xl p-6">
              <h3 className="font-serif font-bold text-navy text-lg mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                The Beyond Book Publishing Author Bill of Rights:
              </h3>
              <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Authors Retain 100% of All Royalties &amp; Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Copyright &amp; Intellectual Property Ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Mandatory Ironclad Non-Disclosure Agreements (NDA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Zero Ongoing Hidden Maintenance or Distribution Cuts</span>
                </div>
              </div>
            </div>

            {activeTab === "privacy" ? (
              <div className="space-y-6 text-sm md:text-base text-gray-700">
                <h2 className="text-2xl font-serif font-bold text-navy">1. Information We Collect</h2>
                <p>
                  At Beyond Book Publishing (accessible via <strong>BeyondBookpublishing.com</strong>), your manuscript files, outline documents, creative assets, and personal information are treated with the utmost confidentiality. When you request a consultation, upload an excerpt, or purchase a service, we may collect:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Your full name, email address, and direct phone number.</li>
                  <li>Manuscript drafts, genre specifications, and writing goals.</li>
                  <li>Billing contact details processed securely via PCI-compliant payment gateways.</li>
                </ul>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">2. Absolute Non-Disclosure &amp; Confidentiality</h2>
                <p>
                  Every member of our ghostwriting guild, editorial board, and design studio is bound by strict Non-Disclosure Agreements (NDAs). Your creative manuscripts and proprietary ideas will never be sold, leased, publicly showcased, or shared with third parties without your explicit prior written consent.
                </p>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">3. Data Security &amp; Encryption</h2>
                <p>
                  We utilize enterprise 256-bit SSL encryption across all digital communication, file uploads, and CRM systems. All client manuscript drafts are archived in private, restricted cloud repositories.
                </p>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">4. Cookies &amp; Tracking Technologies</h2>
                <p>
                  BeyondBookpublishing.com utilizes essential session cookies and standard web analytics solely to optimize website speed, monitor uptime, and refine user experience. We never sell cookie identifiers to third-party ad brokers.
                </p>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">5. Contact Our Privacy Officer</h2>
                <p>
                  If you have questions regarding our privacy protections or wish to request data deletion, contact us at:
                  <br />
                  <strong className="text-navy">Email:</strong> info@beyondbookpublishing.com
                  <br />
                  <strong className="text-navy">Phone:</strong> +1 (800) 555-0199
                </p>
              </div>
            ) : (
              <div className="space-y-6 text-sm md:text-base text-gray-700">
                <h2 className="text-2xl font-serif font-bold text-navy">1. Agreement to Terms</h2>
                <p>
                  By engaging Beyond Book Publishing (BeyondBookpublishing.com) for book writing, ghostwriting, editorial polishing, cover design, audiobook production, or self-publishing distribution, you enter into a binding agreement governed by these terms and your custom service proposal.
                </p>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">2. 100% Author Ownership &amp; Royalties</h2>
                <p>
                  Unlike traditional publishing houses or exploitative vanity presses, <strong>Beyond Book Publishing never takes a percentage of your future book sales or digital royalties</strong>. All royalties generated across Amazon KDP, IngramSpark, Barnes &amp; Noble, Apple Books, and other global outlets belong 100% to you.
                </p>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">3. Milestone Approval Process</h2>
                <p>
                  Our workflow relies on transparent checkpoints:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li><strong>Outline &amp; Blueprint:</strong> We draft your chapter structure for your approval before writing begins.</li>
                  <li><strong>Voice Audition:</strong> The initial 1,500 to 3,000 words are presented to ensure tone and pacing align with your vision.</li>
                  <li><strong>Batch Chapter Delivery:</strong> Content is submitted in regular milestones, allowing ongoing feedback and revisions.</li>
                  <li><strong>Final Files:</strong> Print-ready PDFs, validated ePubs, and editable source files are delivered upon project completion.</li>
                </ul>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">4. Revision Policy</h2>
                <p>
                  We are committed to delivering manuscripts that meet the highest literary standards. Revision rounds are included as defined in your package. Standard editorial revisions are addressed within 5 to 7 business days following client feedback.
                </p>

                <h2 className="text-2xl font-serif font-bold text-navy pt-4">5. Governing Law</h2>
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of the State of New York, United States.
                </p>
              </div>
            )}

            {/* Bottom Contact CTA */}
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                Last updated: February 2026 • Beyond Book Publishing
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-lg transition-all"
              >
                <span>Have Legal or Contract Questions?</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
