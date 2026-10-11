import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";

export const FloatingCTA: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          source: "floating-cta",
        }),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  if (!visible) return null;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          id="floating-cta-overlay"
        />
      )}

      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3" id="floating-cta-panel">
        {open && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[320px] overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="bg-gold px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-navy text-base leading-tight">
                  Get A Free Quote
                </h3>
                <p className="text-navy/70 text-xs mt-0.5">
                  We reply within 24 hours
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-navy/60 hover:text-navy transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-navy" />
                  </div>
                  <p className="font-serif font-bold text-navy text-base mb-1">
                    Message Sent!
                  </p>
                  <p className="text-gray-500 text-sm">
                    Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition"
                  />
                  <textarea
                    rows={2}
                    placeholder="Tell us about your book..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-navy hover:bg-navy/90 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Get Free Quote
                  </button>
                </form>
              )}

              {/* Call Link */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <a
                  href="tel:+18005550199"
                  className="font-semibold hover:text-gold transition-colors"
                >
                  +1 (800) 555-0199
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Get a free quote"
          className={`flex items-center gap-2 font-bold text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            open
              ? "bg-navy text-white px-5 py-3 rounded-full"
              : "bg-gold text-navy px-5 py-3.5 rounded-full"
          }`}
          style={{ boxShadow: "0 8px 30px rgba(245, 197, 24, 0.45)" }}
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {open ? "Close" : "Get A Free Quote"}
          </span>
        </button>
      </div>
    </>
  );
};
