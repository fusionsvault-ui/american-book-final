import React, { useState, useMemo } from "react";
import { Layout } from "../components/Layout";
import { BLOG_POSTS } from "../data/websiteData";
import { BookOpen, Calendar, Clock, User, ChevronRight } from "lucide-react";

export const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const list = new Set<string>();
    BLOG_POSTS.forEach((p) => list.add(p.category));
    return ["All", ...Array.from(list)];
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <Layout
      title="Publishing Guides & Writing Advice Blog"
      description="Read free expert guidelines compiled by NYT bestselling ghostwriters. Learn the pros & cons of Amazon KDP self-publishing, book cover layout formatting, and Amazon ads sales strategies."
    >
      {/* Intro Header */}
      <section className="bg-navy text-white py-16 text-center relative overflow-hidden" id="blog-banner">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-4">
          <span className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm">
            Self-Publishing University
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black leading-tight">
            Author Resource Guides & Publishing Advice
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Gain access to trade secrets, formatting checklists, and book advertising roadmaps written daily by active publishing consultants.
          </p>
        </div>
      </section>

      {/* Main Blog Catalog Feed */}
      <section className="py-16 bg-cream" id="blog-feed-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          {/* Categories Tab selectors */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((catKey) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-4.5 py-2 rounded-full text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                  selectedCategory === catKey
                    ? "bg-gold text-navy border-gold shadow-sm"
                    : "bg-white text-gray-650 border-gray-200 hover:border-gold hover:text-gold"
                }`}
              >
                {catKey}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <article
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl border border-gray-100 flex flex-col justify-between transition-all duration-300"
                id={`blog-card-${idx}`}
              >
                {/* Header Image */}
                <div className="relative aspect-video overflow-hidden bg-navy flex items-center justify-center">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-104 transition-transform duration-350"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gold text-navy text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Authors meta */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 text-[10px] md:text-xs font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-navy text-lg md:text-xl line-clamp-2 hover:text-gold transition-colors leading-snug pt-1">
                      {post.title}
                    </h3>

                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer writer info */}
                  <div className="pt-4 mt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 text-gold font-bold text-xs uppercase">
                        {post.author.slice(0, 1)}
                      </div>
                      <span className="text-xs font-bold text-navy">{post.author}</span>
                    </div>

                    <button
                      onClick={() => alert("Detailed reading guide articles are unlocked during active author contracts. Explore packaging grids to get started!")}
                      className="inline-flex items-center gap-1.5 text-navy hover:text-gold font-bold text-xs transition"
                    >
                      Read Now
                      <ChevronRight className="w-3.5 h-3.5 text-gold" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Static Promotion bottom */}
      <section className="bg-navy py-12 text-center text-white border-t border-white/5" id="blog-grid-cta">
        <div className="container mx-auto px-4 max-w-xl">
          <BookOpen className="w-8 h-8 text-gold mx-auto mb-3" />
          <h3 className="text-xl font-serif font-black mb-2">Want our Author Checklist workbook PDF?</h3>
          <p className="text-gray-300 text-xs leading-relaxed mb-6">
            Sign up to our monthly newsletter list and gain a free companion checklist covering printing specifications, ISBN codes, and self-publishing formats.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 text-white placeholder-gray-400 text-xs rounded-lg px-3.5 h-11 border border-white/10 focus:outline-none focus:border-gold"
            />
            <button
              onClick={() => alert("Successfully joined the book authors waitlist!")}
              className="bg-gold text-navy font-bold hover:bg-yellow-400 text-xs px-5 rounded-lg border-2 border-gold cursor-pointer transition"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};
