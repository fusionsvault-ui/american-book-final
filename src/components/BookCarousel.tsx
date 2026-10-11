import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselBookItem {
  img: string;
  title: string;
  author: string;
  genre: string;
  rating: string;
}

const FIRST_ROW_BOOKS: CarouselBookItem[] = [
  { img: "/assets/hero-1-BCRMWL0r.png", title: "The Silent Witness", author: "Eleanor Vance", genre: "Thriller", rating: "4.9" },
  { img: "/assets/hero-2-CMx4LXdS.png", title: "Golden Hour", author: "Amelia Rose", genre: "Romance", rating: "4.8" },
  { img: "/assets/hero-3-DOROJ8Qu.png", title: "The Dragon's Blade", author: "Lara Vance", genre: "Fantasy", rating: "4.9" },
  { img: "/assets/beasts-DBDRH50F.png", title: "The Sundered Dawn", author: "Ava Reid", genre: "Horror", rating: "4.7" },
  { img: "/assets/scifi-u55kilzw.png", title: "Rising Sun", author: "Kaizen Moore", genre: "Sci-Fi", rating: "4.8" },
  { img: "/assets/literary-BrcDpQdZ.png", title: "The Final Act", author: "Elara Stone", genre: "Literary", rating: "4.9" },
  { img: "/genre-thriller-1.png", title: "Shadow Protocol", author: "J.R. Black", genre: "Thriller", rating: "4.8" },
  { img: "/genre-horror-1.png", title: "Nightfall Manor", author: "D. Thorne", genre: "Horror", rating: "4.7" },
  { img: "/genre-fantasy-1.png", title: "Crown of Embers", author: "M.K. Davis", genre: "Fantasy", rating: "4.9" }
];

const SECOND_ROW_BOOKS: CarouselBookItem[] = [
  { img: "/genre-romance-1.png", title: "Midnight in Manhattan", author: "Clara Bell", genre: "Romance", rating: "4.8" },
  { img: "/genre-western-1.png", title: "Dust & Thunder", author: "Tom Rider", genre: "Western", rating: "4.7" },
  { img: "/genre-truecrime-1.png", title: "The Evidence Board", author: "Sara Hill", genre: "True Crime", rating: "4.8" },
  { img: "/genre-memoir-1.png", title: "Sunrise Over America", author: "L. Foster", genre: "Memoir", rating: "4.9" },
  { img: "/genre-scifi-1.png", title: "Beyond the Rings", author: "A. Turing", genre: "Sci-Fi", rating: "4.8" },
  { img: "/genre-fantasy-2.png", title: "Storm Caller", author: "Y. Tanaka", genre: "Fantasy", rating: "4.7" },
  { img: "/genre-horror-2.png", title: "The Last Grave", author: "C. Rivera", genre: "Horror", rating: "4.8" },
  { img: "/assets/hero-1-BCRMWL0r.png", title: "Dead Reckoning", author: "P. Stone", genre: "Thriller", rating: "4.9" },
  { img: "/assets/hero-3-DOROJ8Qu.png", title: "Ember & Ash", author: "W. James", genre: "Fantasy", rating: "4.8" }
];

interface SliderProps {
  books: CarouselBookItem[];
  reverse?: boolean;
}

const EmblaSliderRow: React.FC<SliderProps> = ({ books, reverse = false }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      if (reverse) {
        emblaApi.scrollPrev();
      } else {
        emblaApi.scrollNext();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi, reverse]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative group px-1 md:px-4" id={`embla-track-${reverse ? 'reverse' : 'forward'}`}>
      {/* Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy/90 border border-white/10 text-white flex items-center justify-center shadow-2xl hover:bg-gold hover:text-navy transition-all duration-200 opacity-60 group-hover:opacity-100 cursor-pointer"
        aria-label="Scroll left"
        id={`scroll-prev-btn-${reverse ? 'reverse' : 'forward'}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy/90 border border-white/10 text-white flex items-center justify-center shadow-2xl hover:bg-gold hover:text-navy transition-all duration-200 opacity-60 group-hover:opacity-100 cursor-pointer"
        aria-label="Scroll right"
        id={`scroll-next-btn-${reverse ? 'reverse' : 'forward'}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Fade Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cream/90 to-transparent z-10 pointer-events-none md:block hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-cream/90 to-transparent z-10 pointer-events-none md:block hidden" />

      {/* Embla Viewport */}
      <div className="overflow-hidden mx-6 md:mx-12" ref={emblaRef}>
        <div className="flex py-4">
          {books.map((book, index) => (
            <div
              key={`${book.title}-${index}`}
              className="flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] xl:flex-[0_0_18%] min-w-0 px-3 flex-shrink-0"
              id={`book-slide-${index}`}
            >
              <div className="group/card bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                {/* Book Cover Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-navy">
                  <img
                    src={book.img}
                    alt={`${book.title} cover`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Genre Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-navy/80 backdrop-blur-xs text-gold border border-gold/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm tracking-wide">
                      {book.genre}
                    </span>
                  </div>
                  {/* Rating Tag */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-xs px-2 py-1 rounded-full border border-white/10">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="font-bold">{book.rating}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 text-center">
                  <h3 className="font-serif font-bold text-gray-900 text-sm md:text-base line-clamp-1 leading-tight mb-1 group-hover/card:text-gold transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm italic">
                    By {book.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BookCarousel: React.FC = () => {
  return (
    <section className="py-24 bg-cream overflow-hidden border-t border-b border-gray-100" id="book-carousel-section">
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <span className="inline-block text-gold text-sm font-bold uppercase tracking-widest mb-3">
          Our Portfolio Showcase
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-black text-navy tracking-tight leading-tight">
          Discover The Many Manuscripts From Thriving Publishing Authors
        </h2>
        <p className="text-gray-500 text-sm md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          Hundreds of books published across every genre — each one a real story, a real author, a real American dream fulfilled.
        </p>
      </div>

      <div className="space-y-6 max-w-[100vw]">
        {/* Forward Slider */}
        <EmblaSliderRow books={FIRST_ROW_BOOKS} reverse={false} />

        {/* Reverse Slider */}
        <EmblaSliderRow books={SECOND_ROW_BOOKS} reverse={true} />
      </div>
    </section>
  );
};
