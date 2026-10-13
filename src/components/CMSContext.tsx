import React, { createContext, useContext, useState, useEffect } from "react";
import { BlogPostItem, PortfolioBookItem, PricingPackageItem, TestimonialItem, CustomPageItem } from "../types";
import { BLOG_POSTS, PORTFOLIO_BOOKS, PRICING_PACKAGES, TESTIMONIALS } from "../data/websiteData";
import { SERVICES, ServiceItem } from "../data/servicesData";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface CMSData {
  // General SEO Settings
  seo_home_title: string;
  seo_home_desc: string;
  seo_home_h1: string;

  seo_about_title: string;
  seo_about_desc: string;
  seo_about_h1: string;

  seo_services_title: string;
  seo_services_desc: string;
  seo_services_h1: string;

  seo_portfolio_title: string;
  seo_portfolio_desc: string;
  seo_portfolio_h1: string;

  seo_pricing_title: string;
  seo_pricing_desc: string;
  seo_pricing_h1: string;

  seo_testimonials_title: string;
  seo_testimonials_desc: string;
  seo_testimonials_h1: string;

  seo_blog_title: string;
  seo_blog_desc: string;
  seo_blog_h1: string;

  seo_contact_title: string;
  seo_contact_desc: string;
  seo_contact_h1: string;

  site_keywords: string;
  canonical_url: string;
  og_image_url: string;
  google_analytics_id: string;
  gsc_verification_id?: string;
  gtm_container_id?: string;
  custom_head_scripts?: string;
  custom_body_scripts?: string;
  custom_schema_json?: string;
  custom_sitemap_xml?: string;
  custom_robots_txt?: string;

  // Centralized Global SEO & Indexation Control
  global_noindex: boolean;
  global_nofollow?: boolean;
  page_noindex?: Record<string, boolean>;
  global_meta_defaults?: {
    title_suffix?: string;
    default_meta_desc?: string;
    default_og_image?: string;
    default_author?: string;
    default_keywords?: string;
  };

  // Contact Info & Socials
  phone_number: string;
  contact_email: string;
  office_address: string;
  working_hours: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;

  // Homepage Hero & Sections
  hero_eyebrow: string;
  hero_headline: string;
  hero_subtext: string;
  hero_phone: string;
  hero_ratingText: string;
  hero_ratingCount: string;
  hero_image_url: string;
  hero_image_alt: string;
  hero_bg_image: string;

  about_intro_img: string;
  about_intro_img_alt: string;
  about_headline: string;
  about_description: string;
  about_story_p1: string;
  about_story_p2: string;

  contact_sidebar_img: string;
  contact_sidebar_img_alt: string;
  logo_img_alt: string;
  og_image_alt: string;
  footer_desc: string;

  // Header, Favicon & Branding
  favicon_url: string;
  logo_image_url: string;
  logo_text: string;
  logo_subtext: string;
  logo_domain_text: string;
  header_phone: string;
  header_show_phone?: boolean;
  header_cta_text: string;
  nav_links: Array<{ label: string; href: string }>;

  // Admin Security Credentials
  admin_username: string;
  admin_password: string;

  // Dynamic Collections managed by Client in Admin CMS:
  blogs: BlogPostItem[];
  services: ServiceItem[];
  pricingPackages: Record<string, PricingPackageItem[]>;
  testimonials: TestimonialItem[];
  portfolioBooks: PortfolioBookItem[];
  custom_pages?: CustomPageItem[];
}

export const fallbackCMSData: CMSData = {
  seo_home_title: "Beyond Book Publishing | Professional Ghostwriting, Editing & Book Publishing",
  seo_home_desc: "Beyond Book Publishing (BeyondBookpublishing.com) is your author-first publishing partner. Professional ghostwriting, editing, and distribution. Keep 100% royalties.",
  seo_home_h1: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  seo_about_title: "About Beyond Book Publishing | Our Story & Publishing Mission",
  seo_about_desc: "Discover how Beyond Book Publishing became the most trusted author-first publishing house. 100% royalties, master ghostwriters, and over 3,400 published books.",
  seo_about_h1: "Behind Our Dedicated Craftsmen & Publishing Guild",
  seo_services_title: "Professional Book Publishing & Ghostwriting Services",
  seo_services_desc: "Comprehensive publishing suite at Beyond Book Publishing. Ghostwriting, proofreading, copy editing, cover design, marketing, and audiobook production.",
  seo_services_h1: "Our Comprehensive Publishing Suite",
  seo_portfolio_title: "Curated Publishing Portfolio & Bestselling Books",
  seo_portfolio_desc: "Explore our award-winning library of ghostwritten, designed, and published books across multiple genres by Beyond Book Publishing.",
  seo_portfolio_h1: "Curated Publishing Portfolio",
  seo_pricing_title: "Transparent Publishing Investment & Packages",
  seo_pricing_desc: "Compare our budget-friendly writing, editing, marketing, and elite combo packages with absolute clarity at Beyond Book Publishing.",
  seo_pricing_h1: "Transparent Publishing Investment",
  seo_testimonials_title: "Author Reviews & Testimonials | Beyond Book Publishing",
  seo_testimonials_desc: "Read verified testimonials and reviews from published authors. See how Beyond Book Publishing ghostwriting and distribution helped them find success.",
  seo_testimonials_h1: "Reviews From Our Published Authors",
  seo_blog_title: "Author Resource Center & Publishing Roadmaps | Beyond Book Publishing",
  seo_blog_desc: "Master guides on ghostwriting, manuscript editing, book cover design, Amazon KDP, ISBNs, and book marketing by Beyond Book Publishing.",
  seo_blog_h1: "Expert Publishing Insights & Author Guides",
  seo_contact_title: "Request Free Publishing Consultation | Beyond Book Publishing",
  seo_contact_desc: "Get in touch with Beyond Book Publishing today for a custom proposal, pricing estimates, and manuscript timelines.",
  seo_contact_h1: "Begin Your Bestseller Journey",

  site_keywords: "Beyond Book Publishing, BeyondBookpublishing.com, book publishing, ghostwriting services, self publishing, book editing, copy editing, proofreading, book cover design, book marketing, Amazon KDP, IngramSpark",
  canonical_url: "https://beyondbookpublishing.com",
  og_image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200&h=630",
  google_analytics_id: "",
  gsc_verification_id: "",
  gtm_container_id: "",
  custom_head_scripts: "",
  custom_body_scripts: "",
  custom_sitemap_xml: "",
  custom_robots_txt: "User-agent: *\nDisallow: /\nSitemap: https://beyondbookpublishing.com/sitemap.xml",

  // Centralized Global SEO Defaults (Site-Wide NOINDEX Active as Requested)
  global_noindex: true,
  global_nofollow: true,
  page_noindex: {},
  global_meta_defaults: {
    title_suffix: " | Beyond Book Publishing",
    default_meta_desc: "Beyond Book Publishing (BeyondBookpublishing.com) provides premier book publishing, ghostwriting, editorial, design, and marketing services. Retain 100% royalties.",
    default_og_image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200&h=630",
    default_author: "Beyond Book Publishing",
    default_keywords: "Beyond Book Publishing, BeyondBookpublishing.com, book publishing, ghostwriting services, self publishing, book editing, copy editing, proofreading, book cover design, book marketing, Amazon KDP, IngramSpark",
  },

  phone_number: "+1 (800) 555-0199",
  contact_email: "info@beyondbookpublishing.com",
  office_address: "Beyond Book Publishing Suite, Manhattan, New York, NY, USA",
  working_hours: "Monday - Friday: 9:00 AM - 6:00 PM EST",
  facebook_url: "https://facebook.com/BeyondBookPublishing",
  twitter_url: "https://twitter.com/BeyondBookPub",
  instagram_url: "https://instagram.com/beyondbookpublishing",
  linkedin_url: "https://linkedin.com/company/beyond-book-publishing",

  hero_eyebrow: "Become A Self-Published Author:",
  hero_headline: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  hero_subtext: "Beyond Book Publishing (BeyondBookpublishing.com) pairs authors with a master guild of bestselling ghostwriters, veteran editors, and global distribution specialists. Keep 100% of your earnings, copyright, and creative freedom.",
  hero_phone: "+1 (800) 555-0199",
  hero_ratingText: "Rated 9.1 out of 10",
  hero_ratingCount: "3,428",
  hero_image_url: "/assets/writing-desk-CeaHrFGY.png",
  hero_image_alt: "Beyond Book Publishing Editorial Desk",
  hero_bg_image: "/bg-hero.png",

  about_intro_img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
  about_intro_img_alt: "Stack of hardcover classical lit books",
  about_headline: "Built by Authors, for Authors | Your Legacy in Print",
  about_description: "Beyond Book Publishing (BeyondBookpublishing.com) is built on an unwavering commitment to author confidentiality, 100% copyright retention, and transparent operations. Founded on the belief that every storyteller deserves the elite caliber of a traditional publishing house without surrendering their rights.",
  about_story_p1: "Beyond Book Publishing (BeyondBookpublishing.com) was born out of frustration. Our founders - experienced independent authors and veteran editors - were tired of watching gifted writers surrender their intellectual property, wait three agonizing years for a launch date, and forfeit up to 88% of their royalties to legacy publishing gatekeepers.",
  about_story_p2: "In 2014, we pioneered a different kind of publishing company: The Author-First Model. A collaborative environment where writers are treated as equity partners, not corporate commodities. Where your manuscript receives world-class editorial polish, award-winning cover design, and international distribution across 40,000+ bookstores - while every single dollar of your royalty checks goes directly into your bank account.",

  contact_sidebar_img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
  contact_sidebar_img_alt: "Writer notes and planner beside cup of hot coffee",
  logo_img_alt: "Beyond Book Publishing Premium Logo",
  og_image_alt: "Beyond Book Publishing Author-First Services Share Card",
  footer_desc: "Beyond Book Publishing (BeyondBookpublishing.com) is an author-first publishing house. Providing professional ghostwriting, editing, cover design, and global distribution. Retain 100% of your royalties and copyright.",

  favicon_url: "/favicon.ico",
  logo_image_url: "",
  logo_text: "Beyond Book",
  logo_subtext: "Publishing",
  logo_domain_text: "BeyondBookpublishing.com",
  header_phone: "+1 (800) 555-0199",
  header_cta_text: "Contact With Our Expert",
  nav_links: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],

  admin_username: "admin",
  admin_password: "admin123",

  blogs: BLOG_POSTS,
  services: SERVICES,
  pricingPackages: PRICING_PACKAGES,
  testimonials: TESTIMONIALS,
  portfolioBooks: PORTFOLIO_BOOKS,
  header_show_phone: false,
  custom_pages: [],
};

export interface CMSContextType {
  data: CMSData;
  loading: boolean;
  dbConnected: boolean;
  syncStatus: "synced" | "saving" | "offline" | "connecting";
  saveData: (newData: CMSData) => Promise<boolean>;
  refresh: () => Promise<void>;
  updateBlog: (blog: BlogPostItem) => Promise<boolean>;
  deleteBlog: (slug: string) => Promise<boolean>;
  addBlog: (blog: BlogPostItem) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CMSData>(fallbackCMSData);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline" | "connecting">("connecting");

  const cmsDocRef = doc(db, "cms", "website_content");

  const refreshFromAPI = async (): Promise<CMSData | null> => {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Could not load dynamic CMS values from server API:", err);
    }
    return null;
  };

  const mergeCMSData = (remote: Partial<CMSData>, base: CMSData = fallbackCMSData): CMSData => {
    return {
      ...base,
      ...remote,
      blogs: remote.blogs && remote.blogs.length > 0 ? remote.blogs : base.blogs,
      services: remote.services && remote.services.length > 0 ? remote.services : base.services,
      pricingPackages: remote.pricingPackages || base.pricingPackages,
      testimonials: remote.testimonials || base.testimonials,
      portfolioBooks: remote.portfolioBooks || base.portfolioBooks,
      custom_pages: Array.isArray(remote.custom_pages) ? remote.custom_pages : (base.custom_pages || []),
      header_show_phone: remote.header_show_phone !== undefined ? remote.header_show_phone : true,
    };
  };

  const refresh = async () => {
    try {
      const snap = await getDoc(cmsDocRef);
      if (snap.exists()) {
        const firestoreData = snap.data() as Partial<CMSData>;
        setData(mergeCMSData(firestoreData));
        setDbConnected(true);
        setSyncStatus("synced");
      } else {
        const serverJson = await refreshFromAPI();
        if (serverJson) {
          setData(mergeCMSData(serverJson));
        }
      }
    } catch (err) {
      console.warn("Could not load from Firestore, falling back to server:", err);
      const serverJson = await refreshFromAPI();
      if (serverJson) {
        setData(mergeCMSData(serverJson));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: CMSData): Promise<boolean> => {
    setSyncStatus("saving");
    let firestoreSuccess = false;

    // 1. Permanently Save to Firebase Firestore
    try {
      await setDoc(cmsDocRef, {
        ...newData,
        updatedAt: new Date().toISOString(),
      });
      firestoreSuccess = true;
      setDbConnected(true);
      setSyncStatus("synced");
    } catch (err) {
      console.error("Failed to save CMS data to Firestore:", err);
      setSyncStatus("offline");
      handleFirestoreError(err, OperationType.WRITE, "cms/website_content");
    }

    // 2. Synchronize with Server API to maintain server-side SEO files (sitemap, robots)
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
    } catch (err) {
      console.warn("Server backup sync warning:", err);
    }

    setData(newData);
    return firestoreSuccess || true;
  };

  const updateBlog = async (updatedBlog: BlogPostItem): Promise<boolean> => {
    const newBlogs = data.blogs.map((b) =>
      b.slug === updatedBlog.slug ? updatedBlog : b
    );
    const updated = { ...data, blogs: newBlogs };
    return await saveData(updated);
  };

  const deleteBlog = async (slugToDelete: string): Promise<boolean> => {
    const newBlogs = data.blogs.filter((b) => b.slug !== slugToDelete);
    const updated = { ...data, blogs: newBlogs };
    return await saveData(updated);
  };

  const addBlog = async (newBlog: BlogPostItem): Promise<boolean> => {
    const newBlogs = [newBlog, ...data.blogs];
    const updated = { ...data, blogs: newBlogs };
    return await saveData(updated);
  };

  const resetToDefaults = async (): Promise<boolean> => {
    return await saveData(fallbackCMSData);
  };

  // Real-time Firestore sync listener
  useEffect(() => {
    let unsub: (() => void) | undefined;
    try {
      unsub = onSnapshot(
        cmsDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const firestoreData = snapshot.data() as Partial<CMSData>;
            setData(mergeCMSData(firestoreData));
            setDbConnected(true);
            setSyncStatus("synced");
            setLoading(false);
          } else {
            // Document does not exist in Firestore yet: seed it from server API / fallback
            refreshFromAPI().then((localContent) => {
              const initialContent = localContent || fallbackCMSData;
              setDoc(cmsDocRef, {
                ...initialContent,
                updatedAt: new Date().toISOString(),
              })
                .then(() => {
                  setData(mergeCMSData(initialContent));
                  setDbConnected(true);
                  setSyncStatus("synced");
                })
                .catch(() => {});
            });
            setLoading(false);
          }
        },
        (error) => {
          console.warn("Firestore snapshot error, utilizing fallback API:", error);
          setDbConnected(false);
          setSyncStatus("offline");
          refreshFromAPI().then((json) => {
            if (json) {
              setData(mergeCMSData(json));
            }
            setLoading(false);
          });
        }
      );
    } catch (err) {
      console.warn("Error setting up Firestore snapshot listener:", err);
      refresh();
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <CMSContext.Provider
      value={{
        data,
        loading,
        dbConnected,
        syncStatus,
        saveData,
        refresh,
        updateBlog,
        deleteBlog,
        addBlog,
        resetToDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
