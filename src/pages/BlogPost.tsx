import React, { useState, useMemo, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ArticleRenderer, slugifyHeading } from "../components/ArticleRenderer";
import { BLOG_POSTS } from "../data/websiteData";
import { BlogPostItem } from "../types";
import { QuoteModal } from "../components/QuoteModal";
import {
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  ArrowRight,
  BookOpen,
  Sparkles,
  Phone,
  ShieldCheck,
  ChevronRight,
  Bookmark,
  Award,
  Layers,
  ArrowLeft
} from "lucide-react";

export const BlogPost: React.FC = () => {
  const [match, params] = useRoute<{ slug: string }>("/blog/:slug");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const slug = params?.slug;

  const post: BlogPostItem | undefined = useMemo(() => {
    if (!slug) return undefined;
    return BLOG_POSTS.find((p) => p.slug === slug);
  }, [slug]);

  // Extract H2 headings for Table of Contents
  const headings = useMemo(() => {
    if (!post) return [];
    return post.content
      .split("\n")
      .filter((line) => line.trim().startsWith("## "))
      .map((line) => {
        const text = line.trim().replace(/^##\s+/, "");
        return {
          text,
          id: slugifyHeading(text),
        };
      });
  }, [post]);

  // Related posts (same category or next posts, excluding current)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const sameCat = BLOG_POSTS.filter(
      (p) => p.slug !== post.slug && p.category === post.category
    );
    if (sameCat.length >= 2) return sameCat.slice(0, 3);
    const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);
    return others.slice(0, 3);
  }, [post]);

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!post) {
    return (
      <Layout
        title="Guide Not Found – Beyond Book Publishing"
        description="The requested publishing guide could not be located. Explore our 10 comprehensive author resource guides."
      >
        <div className="bg-cream min-h-[60vh] py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center space-y-6">
            <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Guide Not Found" }]} />
            <div className="w-16 h-16 rounded-full bg-gold/20 text-navy flex items-center justify-center mx-auto mt-8">
              <BookOpen className="w-8 h-8 text-navy" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-navy">
              Publishing Guide Not Found
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              We couldn&apos;t find the specific article you were looking for. Please browse our complete catalog of 10 expert publishing roadmaps.
            </p>
            <div className="pt-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-navy text-white hover:bg-gold hover:text-navy px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse All Publishing Guides
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Schema.org Article Structured Data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.img,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "Beyond Book Publishing",
      url: "https://beyondbookpublishing.com",
      logo: {
        "@type": "ImageObject",
        url: "https://beyondbookpublishing.com/favicon.ico",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://beyondbookpublishing.com/blog/${post.slug}`,
    },
  };

  return (
    <Layout
      title={`${post.title} – Beyond Book Publishing`}
      description={post.excerpt}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <QuoteModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Schedule Free Manuscript Consultation"
        subtitle="Speak directly with a Senior Publishing Director at Beyond Book Publishing. 100% royalty ownership guaranteed."
        source={`blog-${post.slug}`}
      />

      {/* Breadcrumb Strip */}
      <div className="bg-cream/80 border-b border-gray-150 py-3">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.category, href: `/blog` },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      {/* Article Header & Hero */}
      <header className="bg-white py-12 md:py-16 border-b border-gray-100" id="article-header">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="space-y-5">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold text-gray-500">
              <span className="bg-gold text-navy font-bold uppercase tracking-wider text-[11px] px-3 py-1 rounded-md shadow-xs">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                {post.date}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                {post.readTime}
              </span>
            </div>

            {/* Main Article Title H1 */}
            <h1 className="text-3xl md:text-5xl font-serif font-black text-navy leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt Lead */}
            <p className="text-gray-600 text-base md:text-xl font-normal leading-relaxed border-l-2 border-gold pl-4 italic">
              {post.excerpt}
            </p>

            {/* Author Credit Strip & Share Button */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-150">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-navy text-gold flex items-center justify-center font-bold font-serif text-lg shadow-xs">
                  {post.author.slice(0, 1)}
                </div>
                <div>
                  <div className="font-bold text-navy text-sm md:text-base">
                    {post.author}
                  </div>
                  <div className="text-xs text-gray-500">
                    {post.authorRole} • Beyond Book Publishing
                  </div>
                </div>
              </div>

              {/* Share & actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 text-xs font-bold bg-cream hover:bg-gold/20 text-navy px-4 py-2 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                  title="Copy link to clipboard"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-navy" />
                      <span>Share Guide</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="pt-6">
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 aspect-[16/9] max-h-[520px] bg-navy relative">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right text-[11px] text-gray-400 mt-2">
                Published exclusively for authors by Beyond Book Publishing (BeyondBookpublishing.com)
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout with 2 Columns */}
      <section className="py-12 md:py-16 bg-[#faf9f6]" id="article-main-body">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Primary Article Content Column (8 cols) */}
            <main className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-12 shadow-xs border border-gray-150">
              {/* Full Article Renderer with Normal Body Weights and Clickable Internal Links */}
              <ArticleRenderer content={post.content} />

              {/* Article Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-150 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                    Topics:
                  </span>
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs bg-gray-100 text-navy font-semibold px-3 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Bio Box */}
              <div className="mt-10 bg-amber-50/60 border border-gold/40 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-16 h-16 rounded-full bg-navy text-gold font-serif font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  {post.author.slice(0, 1)}
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-serif font-bold text-navy text-lg">
                      Written by {post.author}
                    </h3>
                    <span className="text-xs text-gold font-bold bg-navy px-2.5 py-0.5 rounded-sm">
                      {post.authorRole}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-normal text-gray-700 leading-relaxed">
                    Member of the Beyond Book Publishing Senior Advisory Guild. Our mission is ensuring independent and non-fiction authors navigate editorial standards, professional cover design, and worldwide distribution without surrendering a single percentage of their intellectual property or royalties.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="text-xs font-bold text-navy hover:text-gold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Book a consultation with {post.author}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Consultation CTA Banner */}
              <div className="mt-10 bg-navy text-white rounded-xl p-6 md:p-8 relative overflow-hidden space-y-4">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <BookOpen className="w-64 h-64 text-gold transform translate-x-12 translate-y-12" />
                </div>
                <div className="relative z-10 space-y-2">
                  <span className="text-gold text-xs font-bold uppercase tracking-widest">
                    Next Step For Authors
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Ready to Transform Your Manuscript into a Bestseller?
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                    Beyond Book Publishing pairs you with master ghostwriters, veteran editors, and global print distributors. Retain 100% of your rights and royalties.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="bg-gold hover:bg-yellow-400 text-navy font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      Get Free Publishing Consultation
                    </button>
                    <Link
                      href="/pricing"
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg border border-white/20 transition-colors"
                    >
                      View All Packages
                    </Link>
                  </div>
                </div>
              </div>
            </main>

            {/* Sidebar Column (4 cols) */}
            <aside className="lg:col-span-4 space-y-8" id="article-sidebar">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-xs sticky top-24">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                    <Bookmark className="w-4 h-4 text-gold" />
                    <h3 className="font-serif font-bold text-navy text-base">
                      Table of Contents
                    </h3>
                  </div>
                  <nav className="space-y-2.5">
                    {headings.map((h, hIdx) => (
                      <a
                        key={hIdx}
                        href={`#${h.id}`}
                        className="block text-xs md:text-sm text-gray-600 hover:text-navy hover:font-semibold transition-colors pl-2.5 border-l-2 border-transparent hover:border-gold py-0.5 leading-snug"
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>

                  {/* Quick Services Links inside Sidebar */}
                  <div className="mt-8 pt-6 border-t border-gray-150 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy">
                      <Layers className="w-3.5 h-3.5 text-gold" />
                      <span>Our Publishing Services</span>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold">
                      <li>
                        <Link
                          href="/services/ghostwriting"
                          className="flex items-center justify-between text-gray-600 hover:text-gold p-2 rounded-lg hover:bg-cream transition-colors"
                        >
                          <span>Ghostwriting Services</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gold" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services/editing"
                          className="flex items-center justify-between text-gray-600 hover:text-gold p-2 rounded-lg hover:bg-cream transition-colors"
                        >
                          <span>Book Editing &amp; Proofreading</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gold" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services/cover-design"
                          className="flex items-center justify-between text-gray-600 hover:text-gold p-2 rounded-lg hover:bg-cream transition-colors"
                        >
                          <span>Custom Book Cover Design</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gold" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services/book-publishing"
                          className="flex items-center justify-between text-gray-600 hover:text-gold p-2 rounded-lg hover:bg-cream transition-colors"
                        >
                          <span>Global Book Publishing</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gold" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services/book-marketing"
                          className="flex items-center justify-between text-gray-600 hover:text-gold p-2 rounded-lg hover:bg-cream transition-colors"
                        >
                          <span>Book Marketing &amp; PR</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gold" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/services/audiobook"
                          className="flex items-center justify-between text-gray-600 hover:text-gold p-2 rounded-lg hover:bg-cream transition-colors"
                        >
                          <span>Audiobook Production</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gold" />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Free Phone Consultation Banner */}
                  <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-gold/30 text-center space-y-2">
                    <Phone className="w-5 h-5 text-gold mx-auto" />
                    <div className="font-bold text-navy text-xs">
                      Questions about your manuscript?
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Speak directly with an author concierge.
                    </div>
                    <a
                      href="tel:+18005550199"
                      className="block text-sm font-black text-navy hover:text-gold transition-colors"
                    >
                      (800) 555-0199
                    </a>
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Related Articles Carousel / Grid */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-gold font-bold uppercase tracking-widest text-xs">
                    Continue Learning
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-navy mt-1">
                    Related Publishing Guides
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-gold transition-colors"
                >
                  <span>View All 10 Guides</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relPost, relIdx) => (
                  <article
                    key={relIdx}
                    className="bg-white rounded-xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                  >
                    <Link href={`/blog/${relPost.slug}`} className="block">
                      <div className="aspect-video relative overflow-hidden bg-navy">
                        <img
                          src={relPost.img}
                          alt={relPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-gold text-navy text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                          {relPost.category}
                        </span>
                      </div>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold" />
                          <span>{relPost.readTime}</span>
                        </div>
                        <h4 className="font-serif font-bold text-navy text-base group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                          <Link href={`/blog/${relPost.slug}`}>
                            {relPost.title}
                          </Link>
                        </h4>
                        <p className="text-gray-600 text-xs font-normal line-clamp-2 leading-relaxed">
                          {relPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500">
                          {relPost.author}
                        </span>
                        <Link
                          href={`/blog/${relPost.slug}`}
                          className="text-xs font-bold text-navy hover:text-gold inline-flex items-center gap-1"
                        >
                          Read Guide
                          <ChevronRight className="w-3 h-3 text-gold" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};
