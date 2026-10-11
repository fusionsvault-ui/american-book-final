import React, { useState, useEffect } from "react";
import { X, Send, Check } from "lucide-react";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  source?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  open,
  onClose,
  title = "Get A Free Quote",
  subtitle = "Fill in your details and our team will contact you within 24 hours.",
  source = "cta-popup",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Service Interest: ${formData.service || "N/A"}\n\nMessage:\n${formData.message}`,
          source: source,
        }),
      });
    } catch (err) {
      console.error("Error submitting lead:", err);
    }
    setSuccess(true);
    setSubmitting(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" id="quote-modal-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        id="quote-modal-backdrop"
      />

      {/* Box */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="quote-modal-content"
      >
        <div className="bg-gold px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-navy text-lg">{title}</h3>
            <p className="text-navy/70 text-xs mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-navy/60 hover:text-navy transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="font-serif font-bold text-navy text-lg mb-2">
                Thank You!
              </h4>
              <p className="text-gray-500 text-sm">
                Our team has received your request and will contact you within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-navy text-white font-bold px-6 py-2.5 rounded-md text-sm hover:bg-navy/90 transition-colors w-full cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Interested Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition bg-white"
                >
                  <option value="">Select a service...</option>
                  <option value="Ghostwriting">Ghostwriting</option>
                  <option value="Book Writing">Book Writing</option>
                  <option value="Memoir Writing">Memoir Writing</option>
                  <option value="Biography Writing">Biography Writing</option>
                  <option value="Children's Book Writing">Children's Book Writing</option>
                  <option value="Proofreading">Proofreading</option>
                  <option value="Copy Editing">Copy Editing</option>
                  <option value="Developmental Editing">Developmental Editing</option>
                  <option value="Book Formatting">Book Formatting</option>
                  <option value="Self Publishing">Self Publishing</option>
                  <option value="eBook Publishing">eBook Publishing</option>
                  <option value="ISBN & Copyright">ISBN & Copyright</option>
                  <option value="Print on Demand">Print-on-Demand</option>
                  <option value="Author Website">Author Website</option>
                  <option value="Book Cover Design">Book Cover Design</option>
                  <option value="Social Media Marketing">Social Media Marketing</option>
                  <option value="Book Trailer">Book Trailer</option>
                  <option value="Audiobook Production">Audiobook Production</option>
                  <option value="Combo Package">Combo Package</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Tell Us About Your Book
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your genre, word count, draft stage, etc..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-navy text-white font-bold py-3 px-4 rounded-lg hover:bg-navy/90 transition-colors shadow-md text-sm mt-4 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
