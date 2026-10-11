import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { BLOG_POSTS } from "../data/websiteData";
import {
  Calendar,
  Clock,
  ChevronRight,
  Search,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText
} from "lucide-react";

export const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

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

  const featuredPost = filteredPosts[0] || BLOG_POSTS[0];
  const gridPosts = filteredPosts.slice(1);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <Layout
      title="Author Resource Guides & Publishing Insights Blog – Beyond Book Publishing"
      description="Explore 10 comprehensive, expert publishing guides from Beyond Book Publishing (BeyondBookpublishing.com). Learn ghostwriting, cover design, editing, and royalty maximization."
    >
      {/* Breadcrumbs Navigation */}
      <div className="bg-cream/80 border-b border-gray-150 py-3">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Blog" }]} />
        </div>
      </div>

      {/* Hero Header Section */}
      <section
        className="bg-navy text-white py-16 md:py-20 text-center relative overflow-hidden"
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
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
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
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 h-12 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:border-gold transition-colors font-normal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Blog Catalog Section */}
      <section className="py-16 bg-[#faf9f6]" id="blog-feed-wrapper">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
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

          {/* If there are results, showcase Featured Post */}
          {featuredPost && !searchQuery && selectedCategory === "All" && (
            <div className="mb-14 bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-md transition-shadow group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative aspect-video lg:aspect-auto overflow-hidden bg-navy min-h-[300px]">
                  <img
                    src={featuredPost.img}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gold text-navy text-xs font-black uppercase px-3 py-1 rounded shadow-xs">
                      Featured Guide • {featuredPost.category}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        {featuredPost.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-serif font-black text-navy group-hover:text-gold transition-colors leading-tight">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 text-sm md:text-base font-normal leading-relaxed line-clamp-4">
                      {featuredPost.excerpt}
                    </p>

                    {featuredPost.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {featuredPost.tags.slice(0, 4).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-navy">
                        {featuredPost.author}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {featuredPost.authorRole}
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 bg-navy hover:bg-gold text-white hover:text-navy font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-xs"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts Grid (All other articles or all filtered) */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-gray-200">
              <p className="text-gray-600 text-base font-normal">
                No guides found matching &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(searchQuery || selectedCategory !== "All" ? filteredPosts : gridPosts).map((post, idx) => (
                <article
                  key={post.slug || idx}
                  className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-150 flex flex-col justify-between transition-all duration-300 group"
                  id={`blog-card-${idx}`}
                >
                  {/* Header Image with direct link */}
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-video overflow-hidden bg-navy">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes("photo-1455390582262")) {
                            target.src =
                              "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600";
                          }
                        }}
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-gold text-navy text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </Link>

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

                      <h2 className="font-serif font-bold text-navy text-lg md:text-xl line-clamp-2 group-hover:text-gold transition-colors leading-snug pt-1">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 text-xs md:text-sm font-normal leading-relaxed line-clamp-3">
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

                    {/* Footer writer info & direct link */}
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

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-navy hover:text-gold font-bold text-xs transition cursor-pointer"
                      >
                        <span>Read Full Guide</span>
                        <ChevronRight className="w-4 h-4 text-gold" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Internal Linking & Services Cross-Banner */}
          <div className="mt-16 bg-navy text-white rounded-2xl p-8 md:p-12 border border-navy/40 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-3">
                <span className="text-gold text-xs font-bold uppercase tracking-widest">
                  Author Services Ecosystem
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-black">
                  Need Professional Help Implementing These Strategies?
                </h3>
                <p className="text-gray-300 text-sm md:text-base font-normal max-w-xl leading-relaxed">
                  Beyond Book Publishing provides end-to-end publishing solutions. From ghostwriting and editorial polishing to custom jacket design and worldwide distribution.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                  <Link href="/services/ghostwriting" className="text-gold hover:underline">
                    Ghostwriting Services →
                  </Link>
                  <Link href="/services/editing" className="text-gold hover:underline">
                    Book Editing &amp; Proofreading →
                  </Link>
                  <Link href="/services/cover-design" className="text-gold hover:underline">
                    Cover Design →
                  </Link>
                  <Link href="/services/book-publishing" className="text-gold hover:underline">
                    Global Publishing →
                  </Link>
                  <Link href="/pricing" className="text-gold hover:underline">
                    Transparent Pricing →
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 text-left md:text-right">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-400 text-navy font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <span>Book Free Strategy Call</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="mt-12 bg-white rounded-2xl p-8 md:p-10 border border-gray-150 shadow-xs max-w-3xl mx-auto text-center space-y-4">
            <FileText className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif font-bold text-navy text-2xl">
              Get Weekly Author Strategies Delivered To Your Inbox
            </h3>
            <p className="text-gray-600 text-sm font-normal max-w-lg mx-auto">
              Join 12,000+ indie and non-fiction authors receiving our private publishing roadmaps, KDP updates, and royalty-maximizing case studies.
            </p>
            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-2.5 rounded-lg text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Thank you! You are now subscribed to Beyond Book University updates.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your author email..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-gold font-normal"
                />
                <button
                  type="submit"
                  className="bg-navy hover:bg-gold text-white hover:text-navy font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Subscribe Free
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};
