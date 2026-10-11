import React, { useState, useMemo, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Layout } from "../components/Layout";
import { BLOG_POSTS } from "../data/websiteData";
import { BlogPostItem } from "../types";
import { QuoteModal } from "../components/QuoteModal";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ChevronRight,
  Search,
  X,
  Share2,
  Tag,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";

export const Blog: React.FC = () => {
  const [match, params] = useRoute<{ slug: string }>("/blog/:slug");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<BlogPostItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Deep linking to slug if accessed directly via URL
  useEffect(() => {
    if (match && params && params.slug) {
      const found = BLOG_POSTS.find((p) => p.slug === params.slug);
      if (found) {
        setActiveArticle(found);
      }
    }
  }, [match, params]);

  const categories = useMemo(() => {
    const list = new Set<string>();
    BLOG_POSTS.forEach((p) => list.add(p.category));
    return ["All", ...Array.from(list)];
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = (slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <Layout
      title={
        activeArticle
          ? `${activeArticle.title} – Beyond Book Publishing`
          : "Author Resource Guides & Publishing Advice Blog"
      }
      description={
        activeArticle
          ? activeArticle.excerpt
          : "Explore 10 comprehensive, expert publishing guides from Beyond Book Publishing (BeyondBookpublishing.com). Learn ghostwriting, cover design, editing, and royalty maximization."
      }
    >
      {/* Hero Header Section */}
      <section
        className="bg-navy text-white py-20 text-center relative overflow-hidden"
        id="blog-banner"
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f5c518_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold border border-gold/30 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Beyond Book University
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight">
            Author Resource Guides &amp; Publishing Insights
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Trade secrets, editorial checklists, and royalty optimization roadmaps written by veteran publishing consultants at Beyond Book Publishing.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides by keyword, topic, or genre..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 h-12 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Blog Catalog Section */}
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
                    ? "bg-gold text-navy border-gold shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gold hover:text-gold"
                }`}
              >
                {catKey}
              </button>
            ))}
          </div>

          {/* Posts Grid (10 Unique Posts) */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-gray-200">
              <p className="text-gray-650 text-base font-medium">
                No guides found matching &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <article
                  key={post.slug || idx}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col justify-between transition-all duration-300 group"
                  id={`blog-card-${idx}`}
                >
                  {/* Header Image */}
                  <div
                    className="relative aspect-video overflow-hidden bg-navy cursor-pointer"
                    onClick={() => setActiveArticle(post)}
                  >
                    <img
                      src={post.img}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("photo-1455390582262")) {
                          target.src =
                            "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600";
                        }
                      }}
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gold text-navy text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Authors metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2
                        onClick={() => setActiveArticle(post)}
                        className="font-serif font-bold text-navy text-lg md:text-xl line-clamp-2 group-hover:text-gold transition-colors leading-snug pt-1 cursor-pointer"
                      >
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {post.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer writer info */}
                    <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-xs uppercase">
                          {post.author.slice(0, 1)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-navy leading-tight">
                            {post.author}
                          </span>
                          <span className="text-[10px] text-gray-400 leading-tight">
                            {post.authorRole}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveArticle(post)}
                        className="inline-flex items-center gap-1 text-navy hover:text-gold font-bold text-xs transition cursor-pointer"
                      >
                        Read Article
                        <ChevronRight className="w-4 h-4 text-gold" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Full Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveArticle(null)}
          id="article-reader-modal"
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image banner */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-navy">
              <img
                src={activeArticle.img}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-navy/80 hover:bg-gold text-white hover:text-navy rounded-full flex items-center justify-center transition-colors shadow-lg cursor-pointer z-10"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-gold text-navy text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                  {activeArticle.category}
                </span>
                <h2 className="text-xl md:text-3xl font-serif font-bold leading-tight drop-shadow">
                  {activeArticle.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                  <span>By {activeArticle.author} ({activeArticle.authorRole})</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>
            </div>

            {/* Article Content Body */}
            <div className="p-6 md:p-10 space-y-6">
              {/* Share & actions strip */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500">
                  Published by Beyond Book Publishing (BeyondBookpublishing.com)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeArticle.slug)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-gold bg-gray-50 hover:bg-gold/10 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copiedLink ? "Link Copied!" : "Share Link"}
                  </button>
                </div>
              </div>

              {/* Rendered Markdown-style body content */}
              <div className="prose prose-sm md:prose-base max-w-none text-gray-750 leading-relaxed space-y-5">
                {activeArticle.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("## ")) {
                    return (
                      <h3
                        key={pIdx}
                        className="text-xl md:text-2xl font-serif font-black text-navy pt-3 border-t border-gray-100"
                      >
                        {para.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (para.startsWith("### ")) {
                    return (
                      <h4
                        key={pIdx}
                        className="text-lg font-serif font-bold text-navy pt-2"
                      >
                        {para.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (para.startsWith("- ")) {
                    const bullets = para.split("\n- ").map((b) => b.replace(/^- /, ""));
                    return (
                      <ul key={pIdx} className="space-y-1.5 pl-5 list-disc text-gray-700">
                        {bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.startsWith("1. ") || para.startsWith("2. ")) {
                    const steps = para.split(/\n\d+\.\s/).map((s) => s.replace(/^\d+\.\s/, ""));
                    return (
                      <ol key={pIdx} className="space-y-2 pl-5 list-decimal text-gray-700">
                        {steps.map((s, sIdx) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Author bio card inside reader */}
              <div className="bg-amber-50/60 border border-gold/30 rounded-xl p-6 mt-8 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-navy text-gold flex items-center justify-center font-serif font-bold text-xl flex-shrink-0">
                  {activeArticle.author.slice(0, 1)}
                </div>
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-serif font-bold text-navy text-base">
                    About {activeArticle.author}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Senior contributor at Beyond Book Publishing. Guiding authors through manuscript development, formatting standards, and 100% royalty-retained publishing distribution.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    setModalOpen(true);
                  }}
                  className="bg-gold hover:bg-yellow-400 text-navy font-bold text-xs px-4 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition shadow-sm"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Checklist Promotion Section */}
      <section
        className="bg-navy py-14 text-center text-white border-t border-white/10"
        id="blog-grid-cta"
      >
        <div className="container mx-auto px-4 max-w-xl space-y-4">
          <BookOpen className="w-10 h-10 text-gold mx-auto" />
          <h3 className="text-2xl font-serif font-black">
            Want Our Comprehensive Author Publishing Checklist?
          </h3>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
            Get instant access to our proprietary PDF roadmap covering ISBN registration, trim sizes, KDP keyword selection, and royalty calculations.
          </p>

          {newsletterSubscribed ? (
            <div className="bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 rounded-xl p-4 max-w-md mx-auto text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Thank you! Your Author Checklist PDF has been dispatched.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 text-white placeholder-gray-400 text-xs md:text-sm rounded-lg px-4 h-12 border border-white/20 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="bg-gold text-navy font-bold hover:bg-yellow-400 text-xs md:text-sm px-6 rounded-lg border-2 border-gold cursor-pointer transition"
              >
                Send Checklist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Quote Dialog */}
      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="blog-reader"
        title="Consult With Our Publishing Experts"
        subtitle="Discuss your manuscript or publishing roadmap with a senior literary advisor at Beyond Book Publishing."
      />
    </Layout>
  );
};
