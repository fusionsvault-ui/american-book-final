import React, { useState } from "react";
import { motion } from "motion/react";
import { QuoteModal } from "./QuoteModal";

export interface GenreItem {
  name: string;
  tagline: string;
  covers: string[];
  color: string;
  accent: string;
}

const GENRE_DATA: GenreItem[] = [
  {
    name: "Real Estate",
    tagline: "Property, investment & market insights",
    covers: ["/genre-real-estate.jpg", "/genre-memoir.jpg"],
    color: "from-emerald-900/80 to-teal-900/90",
    accent: "#10b981"
  },
  {
    name: "Fantasy",
    tagline: "Epic worlds beyond imagination",
    covers: ["/genre-fantasy.jpg", "/genre-illustration.jpg"],
    color: "from-purple-900/80 to-indigo-900/90",
    accent: "#a855f7"
  },
  {
    name: "Romance",
    tagline: "Stories that touch the heart",
    covers: ["/genre-romance.jpg", "/genre-memoir.jpg"],
    color: "from-pink-800/80 to-rose-900/90",
    accent: "#f43f5e"
  },
  {
    name: "Biblical",
    tagline: "Faith, scripture & spiritual wisdom",
    covers: ["/genre-biblical.jpg", "/genre-memoir.jpg"],
    color: "from-yellow-900/80 to-amber-900/90",
    accent: "#d97706"
  },
  {
    name: "Human Resources",
    tagline: "People, leadership & workplace culture",
    covers: ["/genre-hr.jpg", "/genre-real-estate.jpg"],
    color: "from-blue-900/80 to-sky-900/90",
    accent: "#3b82f6"
  },
  {
    name: "Illustration",
    tagline: "Art-driven stories for every age",
    covers: ["/genre-illustration.jpg", "/genre-fantasy.jpg"],
    color: "from-fuchsia-900/80 to-pink-900/90",
    accent: "#e879f9"
  },
  {
    name: "True Crime",
    tagline: "Real stories. Real drama.",
    covers: ["/genre-truecrime.jpg", "/genre-memoir.jpg"],
    color: "from-zinc-900/80 to-stone-900/90",
    accent: "#84cc16"
  },
  {
    name: "Memoir / Autobiography",
    tagline: "Your life. Your legacy.",
    covers: ["/genre-memoir.jpg", "/genre-romance.jpg"],
    color: "from-yellow-800/80 to-amber-900/90",
    accent: "#eab308"
  }
];

export const GenreSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      className="relative py-24 overflow-hidden bg-navy text-white font-sans"
      style={{
        backgroundImage: "url('/bg-steps.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      id="home-genres-section"
    >
      <div className="absolute inset-0 bg-[#07082a]/94 z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Text */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-gold text-sm font-bold uppercase tracking-widest mb-3 animate-pulse"
          >
            Every Voice Has a Genre
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight"
          >
            We Write Across Every Publishing Genre
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            From faith-driven biblical works to HR leadership guides and illustrated art books, our expert ghostwriters master every niche so your book fits perfectly on any shelf.
          </motion.p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {GENRE_DATA.map((genre, idx) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => setModalOpen(true)}
              className="group relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
              style={{ minHeight: "280px" }}
              id={`genre-card-${genre.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Main Cover background image */}
              <img
                src={genre.covers[0]}
                alt={`${genre.name} background`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("unsplash")) {
                    target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600";
                  }
                }}
              />

              {/* Cover layout overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${genre.color} opacity-85 group-hover:opacity-70 transition-opacity duration-300`} />

              {/* Side book cover mock pop up on hover */}
              <div className="absolute bottom-0 right-0 w-20 h-28 opacity-0 group-hover:opacity-60 transition-all duration-500 transform translate-x-4 group-hover:translate-x-1 rounded-tl-md overflow-hidden shadow-2xl z-20">
                <img
                  src={genre.covers[1]}
                  alt={`${genre.name} cover teaser`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("unsplash")) {
                      target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400";
                    }
                  }}
                />
              </div>

              {/* Text content details */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 z-10 select-none">
                <div
                  className="w-8 h-1 rounded-full mb-3 transition-all duration-300 group-hover:w-12"
                  style={{ background: genre.accent }}
                />
                <h3 className="text-white font-serif font-bold text-2xl leading-tight">
                  {genre.name}
                </h3>
                <p className="text-gray-300 text-xs mt-1 font-medium leading-tight">
                  {genre.tagline}
                </p>
                <span
                  className="mt-3 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: genre.accent }}
                >
                  Start Writing &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center mt-14">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gold hover:bg-yellow-400 text-navy font-bold px-10 h-14 text-base rounded-md shadow-lg transition-transform hover:scale-102 cursor-pointer active:scale-98"
          >
            Explore All Genres
          </button>
        </div>
      </div>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="genre-section-explore"
        title="Get A Free Consultation"
        subtitle="Connect with our expert team of professional ghostwriters and publishers. We reply within 24 hours!"
      />
    </section>
  );
};
