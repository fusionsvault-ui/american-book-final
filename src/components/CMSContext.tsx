import React, { createContext, useContext, useState, useEffect } from "react";

export interface CMSData {
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

  seo_contact_title: string;
  seo_contact_desc: string;
  seo_contact_h1: string;

  hero_eyebrow: string;
  hero_headline: string;
  hero_subtext: string;
  hero_phone: string;
  hero_ratingText: string;
  hero_ratingCount: string;
  hero_image_url: string;
  hero_image_alt: string;

  about_intro_img: string;
  about_intro_img_alt: string;
  contact_sidebar_img: string;
  contact_sidebar_img_alt: string;
  logo_img_alt: string;
  footer_desc: string;
}

export const fallbackCMSData: CMSData = {
  seo_home_title: "America's Best Publishing Partner",
  seo_home_desc: "American Book Founders is your premier publishing partner. Capturing your voice across every American genre. Keep 100% of your royalties and copyright.",
  seo_home_h1: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  seo_about_title: "Our Story & All-American Team",
  seo_about_desc: "Discover the lineage and core team behind American Book Founders, dedicated to premium book writing, editing, and marketing.",
  seo_about_h1: "Behind Our Dedicated Craftsmen & Women",
  seo_services_title: "Professional Book Services",
  seo_services_desc: "Comprehensive publishing suite. Writing, proofreading, copy editing, cover design, marketing, and audiobook production.",
  seo_services_h1: "Our Comprehensive Publishing Suite",
  seo_portfolio_title: "Curated Publishing Portfolio",
  seo_portfolio_desc: "Explore our award-winning library of ghostwritten, designed, and published books across multiple genres.",
  seo_portfolio_h1: "Curated Publishing Portfolio",
  seo_pricing_title: "Transparent Publishing Investment",
  seo_pricing_desc: "Compare our budget-friendly writing, editing, marketing, and elite combo packages with absolute clarity.",
  seo_pricing_h1: "Transparent Publishing Investment",
  seo_testimonials_title: "Author Reviews & Testimonials",
  seo_testimonials_desc: "Read verified testimonials and satisfaction reviews from published authors. See how American Book Founders ghostwriting helped them find success.",
  seo_testimonials_h1: "Reviews From Our Published Authors",
  seo_contact_title: "Request Free Consulting",
  seo_contact_desc: "Get in touch with American Book Founders today for a custom proposal and formatting timelines.",
  seo_contact_h1: "Begin Your Bestseller Journey",
  hero_eyebrow: "Become A Self-Published Author:",
  hero_headline: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  hero_subtext: "American Book Founders team of experts will work very hard on your book, help you get it published, and make you a \"stunning author.\" Join hands with the authentic and powerful team of creative book writers!",
  hero_phone: "+1 (800) 555-0199",
  hero_ratingText: "Rated 9.1 out of 10",
  hero_ratingCount: "3,428",
  hero_image_url: "https://americanbookfounders.com/assets/images/leave-a-lasting.webp",
  hero_image_alt: "American Writing Desk with Fountain Pen",
  about_intro_img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
  about_intro_img_alt: "Stack of hardcover classical lit books",
  contact_sidebar_img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
  contact_sidebar_img_alt: "Writer notes and planner beside cup of hot coffee",
  logo_img_alt: "American Book Founders Premium Logo",
  footer_desc: "America's premier book design, editing, and ghostwriting collective. Crafted by senior USA-based authors and industry-leading professionals."
};

interface CMSContextType {
  data: CMSData;
  loading: boolean;
  saveData: (newData: CMSData) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CMSData>(fallbackCMSData);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const json = await res.json();
        setData({ ...fallbackCMSData, ...json });
      }
    } catch (err) {
      console.warn("Could not load dynamic CMS values, utilizing static fallbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: CMSData) => {
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        setData(newData);
        return true;
      }
    } catch (err) {
      console.error("Failed to save content edits:", err);
    }
    return false;
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <CMSContext.Provider value={{ data, loading, saveData, refresh }}>
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
