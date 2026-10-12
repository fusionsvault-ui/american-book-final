import React, { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useCMS, CMSData, fallbackCMSData } from "../components/CMSContext";
import { BlogPostItem, TestimonialItem, PortfolioBookItem, PricingPackageItem, CustomPageItem } from "../types";
import { ServiceItem, SERVICES } from "../data/servicesData";
import { BLOG_POSTS } from "../data/websiteData";
import { ArticleRenderer, slugifyHeading } from "../components/ArticleRenderer";
import { 
  LayoutDashboard, 
  FileText, 
  Wrench, 
  Tag, 
  Search, 
  Globe, 
  Image as ImageIcon, 
  Phone, 
  Users, 
  Database, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Check, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Upload, 
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown, 
  Clock, 
  Calendar, 
  Sparkles, 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link2, 
  X, 
  ChevronRight,
  BookOpen,
  ArrowRight,
  Star,
  Layers,
  Settings,
  MessageSquare,
  Share2,
  Smartphone,
  Monitor,
  Copy,
  Info,
  Lock,
  LogOut,
  Send,
  Radio,
  Sliders,
  HelpCircle,
  FileCheck,
  FilePlus,
  MapPin,
  User,
  Laptop
} from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  timestamp: string;
}

interface ChatSessionItem {
  sessionId: string;
  visitorName: string;
  messages: Array<{ from: "agent" | "user"; text: string; timestamp?: string }>;
  lastMessage: string;
  lastTimestamp: string;
  isOnline: boolean;
  email?: string;
  phone?: string;
  ip?: string;
  country?: string;
  countryCode?: string;
  flag?: string;
  city?: string;
  region?: string;
  browser?: string;
  device?: string;
  currentPage?: string;
  agentConnected?: boolean;
  notes?: string;
}

type AdminTab = 
  | "dashboard" 
  | "posts" 
  | "pages"
  | "services" 
  | "header_branding"
  | "live_chat"
  | "pricing" 
  | "testimonials"
  | "portfolio"
  | "media" 
  | "seo" 
  | "contact" 
  | "leads" 
  | "tools";

export const AdminDashboard: React.FC = () => {
  const { data: cms, saveData, refresh, resetToDefaults } = useCMS();

  // ================= AUTHENTICATION STATE =================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("admin_authenticated") === "true" ||
      localStorage.getItem("admin_authenticated") === "true";
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [formData, setFormData] = useState<CMSData>(cms);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  // Navigation Menu Builder State (under header_branding tab)
  const [newMenuLabel, setNewMenuLabel] = useState("");
  const [newMenuHref, setNewMenuHref] = useState("");

  // Post Editor State
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postSearch, setPostSearch] = useState("");
  const [postCategoryFilter, setPostCategoryFilter] = useState("All");
  const [previewPostMode, setPreviewPostMode] = useState(false);

  // Detailed Service Editor State (Full 15 Service Pages)
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceSearch, setServiceSearch] = useState("");

  // Custom Pages State (Add new dynamic pages, edit, duplicate & publish)
  const [editingCustomPage, setEditingCustomPage] = useState<CustomPageItem | null>(null);
  const [isCreatingCustomPage, setIsCreatingCustomPage] = useState(false);
  const [customPageSearch, setCustomPageSearch] = useState("");

  // Pages Sub-tab State (Covers Custom Pages & all core pages on the website)
  const [pagesSubTab, setPagesSubTab] = useState<
    | "custom"
    | "home" 
    | "about" 
    | "services"
    | "portfolio"
    | "pricing"
    | "testimonials"
    | "blog"
    | "contact" 
    | "policies"
    | "footer"
  >("custom");

  // Testimonials Editor State
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);

  // Portfolio Editor State
  const [editingBook, setEditingBook] = useState<PortfolioBookItem | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  // Media Tester State
  const [mediaTestUrl, setMediaTestUrl] = useState("");
  const [mediaCopyFeedback, setMediaCopyFeedback] = useState("");

  // SEO Preview & SERP device State (supports core pages and service:slug)
  const [seoActivePage, setSeoActivePage] = useState<string>("home");
  const [serpDevice, setSerpDevice] = useState<"desktop" | "mobile">("desktop");
  const [sitemapUploadFeedback, setSitemapUploadFeedback] = useState("");
  const [schemaValidationStatus, setSchemaValidationStatus] = useState<"valid" | "invalid" | "idle">("idle");
  const [seoSearchFilter, setSeoSearchFilter] = useState("");

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Live Chat Management State
  const [chatSessions, setChatSessions] = useState<ChatSessionItem[]>([]);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string>("");
  const [liveVisitorCount, setLiveVisitorCount] = useState(1);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Sync formData with cms changes
  useEffect(() => {
    setFormData(cms);
  }, [cms]);

  // Fetch leads when leads or dashboard tab is active
  useEffect(() => {
    if (isAuthenticated && (activeTab === "leads" || activeTab === "dashboard")) {
      fetchLeads();
    }
  }, [activeTab, isAuthenticated]);

  // Live Chat Polling when live_chat or dashboard tab is active
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchChatSessions();
    const interval = setInterval(fetchChatSessions, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  const fetchChatSessions = async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      if (res.ok) {
        const data = await res.json();
        setLiveVisitorCount(data.activeCount || 1);
        setChatSessions(data.sessions || []);
        if (!activeChatSessionId && data.sessions && data.sessions.length > 0) {
          setActiveChatSessionId(data.sessions[0].sessionId);
        }
      }
    } catch (e) {
      // Ignored
    }
  };

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // ================= AUTHENTICATION HANDLERS =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (rememberMe) {
          localStorage.setItem("admin_authenticated", "true");
        }
        sessionStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
        setLoginError("");
        return;
      }

      // Local fallback verification
      const validUser = formData.admin_username || "admin";
      const validPass = formData.admin_password || "admin123";
      const cleanUser = loginUsername.trim().toLowerCase();
      if (
        (cleanUser === validUser.toLowerCase() || cleanUser === "fusionsvault@gmail.com") &&
        loginPassword === validPass
      ) {
        if (rememberMe) {
          localStorage.setItem("admin_authenticated", "true");
        }
        sessionStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError(data?.error || "Invalid username or password. Please verify your credentials.");
      }
    } catch (err) {
      const validUser = formData.admin_username || "admin";
      const validPass = formData.admin_password || "admin123";
      const cleanUser = loginUsername.trim().toLowerCase();
      if (
        (cleanUser === validUser.toLowerCase() || cleanUser === "fusionsvault@gmail.com") &&
        loginPassword === validPass
      ) {
        if (rememberMe) {
          localStorage.setItem("admin_authenticated", "true");
        }
        sessionStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError("Invalid username or password. Please verify your credentials.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
  };

  // ================= SAVE DATA HANDLER =================
  const handleSaveAll = async (overrideData?: CMSData) => {
    setSaveStatus("saving");
    const payload = overrideData || formData;
    try {
      const success = await saveData(payload);
      if (success) {
        setSaveStatus("success");
        setSaveMessage("All changes saved successfully! Live website updated.");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setSaveMessage("Failed to save changes. Please try again.");
      }
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage("Network error while saving.");
    }
  };

  // Generic Field Updater
  const updateField = (key: keyof CMSData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ================= LIVE CHAT ADMIN REPLY =================
  const handleSendAdminReply = async () => {
    if (!adminReplyText.trim() || !activeChatSessionId) return;
    setIsSendingReply(true);
    try {
      const res = await fetch("/api/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeChatSessionId,
          text: adminReplyText.trim(),
        }),
      });
      if (res.ok) {
        setAdminReplyText("");
        await fetchChatSessions();
      }
    } catch (err) {
      alert("Failed to send reply to visitor.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // ================= CUSTOM PAGES MANAGEMENT =================
  const handleOpenNewCustomPage = () => {
    const newPage: CustomPageItem = {
      id: `page_${Date.now()}`,
      title: "",
      slug: "",
      status: "published",
      heroHeadline: "",
      heroSubheadline: "",
      content: "Welcome to this page. Edit this content with your project details, announcements, or author program guidelines.\n\n### Program Overview\nDetail the key benefits, application deadlines, and submission requirements here.\n\n- Full copyright and author ownership\n- Dedicated publishing consultants\n- Worldwide distribution on Amazon, IngramSpark & Barnes & Noble",
      excerpt: "Official page by Beyond Book Publishing.",
      metaTitle: "",
      metaDesc: "",
      focusKeywords: "",
      schemaMarkup: "",
      showInHeaderNav: false,
      showInFooter: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingCustomPage(newPage);
    setIsCreatingCustomPage(true);
    setPagesSubTab("custom");
    setActiveTab("pages");
  };

  const handleSaveCustomPage = async () => {
    if (!editingCustomPage) return;
    if (!editingCustomPage.title.trim()) {
      alert("Page Title is required.");
      return;
    }
    const cleanSlug = editingCustomPage.slug.trim() 
      ? editingCustomPage.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") 
      : slugifyHeading(editingCustomPage.title);

    const finalPage: CustomPageItem = {
      ...editingCustomPage,
      slug: cleanSlug,
      updatedAt: new Date().toISOString(),
    };

    const currentPages = [...(formData.custom_pages || [])];
    let updatedPages: CustomPageItem[];

    if (isCreatingCustomPage) {
      const existing = currentPages.find((p) => p.slug === cleanSlug);
      if (existing) {
        finalPage.slug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
      }
      updatedPages = [finalPage, ...currentPages];
    } else {
      updatedPages = currentPages.map((p) =>
        p.id === finalPage.id || p.slug === finalPage.slug ? finalPage : p
      );
    }

    // Optionally update Header Nav Menu if checkbox was toggled
    let updatedNavLinks = [...(formData.nav_links || [])];
    if (finalPage.showInHeaderNav) {
      const existsInNav = updatedNavLinks.some(l => l.href === `/${finalPage.slug}` || l.href === `/page/${finalPage.slug}`);
      if (!existsInNav) {
        updatedNavLinks.push({ label: finalPage.title, href: `/${finalPage.slug}` });
      }
    }

    const updatedFormData: CMSData = {
      ...formData,
      custom_pages: updatedPages,
      nav_links: updatedNavLinks,
    };

    setFormData(updatedFormData);
    await handleSaveAll(updatedFormData);
    setEditingCustomPage(null);
    setIsCreatingCustomPage(false);
  };

  const handleDeleteCustomPage = async (pageId: string) => {
    if (!window.confirm("Are you sure you want to delete this custom page? This action cannot be undone.")) {
      return;
    }
    const currentPages = [...(formData.custom_pages || [])];
    const pageToDelete = currentPages.find(p => p.id === pageId);
    const updatedPages = currentPages.filter((p) => p.id !== pageId);
    
    // Also remove from header nav if it was there
    let updatedNavLinks = [...(formData.nav_links || [])];
    if (pageToDelete) {
      updatedNavLinks = updatedNavLinks.filter(l => l.href !== `/${pageToDelete.slug}` && l.href !== `/page/${pageToDelete.slug}`);
    }

    const updatedFormData: CMSData = {
      ...formData,
      custom_pages: updatedPages,
      nav_links: updatedNavLinks,
    };

    setFormData(updatedFormData);
    await handleSaveAll(updatedFormData);
    if (editingCustomPage?.id === pageId) {
      setEditingCustomPage(null);
      setIsCreatingCustomPage(false);
    }
  };

  const handleDuplicateCustomPage = async (page: CustomPageItem) => {
    const copy: CustomPageItem = {
      ...page,
      id: `page_${Date.now()}`,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      updatedAt: new Date().toISOString(),
    };
    const currentPages = [...(formData.custom_pages || [])];
    const updatedPages = [copy, ...currentPages];
    const updatedFormData: CMSData = {
      ...formData,
      custom_pages: updatedPages,
    };
    setFormData(updatedFormData);
    await handleSaveAll(updatedFormData);
  };

  // ================= BLOG POSTS MANAGEMENT =================
  const handleOpenNewPost = () => {
    const newPost: BlogPostItem = {
      id: `blog-${Date.now()}`,
      slug: `new-publishing-guide-${Math.floor(Math.random() * 1000)}`,
      title: "New Publishing Guide Title",
      category: "Self-Publishing",
      excerpt: "A concise, engaging summary of this publishing guide for search engines and readers.",
      content: `## Introduction to the Topic\n\nWrite your opening paragraph here in clean, regular text. Make sure to share actionable insights and industry best practices for authors.\n\n### Key Strategies for Authors\nHere are the critical points every writer should know:\n- First essential recommendation\n- Second actionable takeaway\n- Third publishing best practice\n\n> **Pro Author Tip:** Keep 100% of your royalties and copyright when working with [Beyond Book Publishing](/about).\n\n## Conclusion & Next Steps\n\nWrap up your guide with inspiring thoughts for authors. Explore our [Publishing Packages](/pricing) or [Schedule a Free Consultation](/contact).`,
      author: "Beyond Book Editorial Team",
      authorRole: "Senior Publishing Strategist",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "8 min read",
      img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800&h=500",
      tags: ["Publishing", "Writing", "Royalties"],
    };
    setEditingPost(newPost);
    setIsCreatingPost(true);
    setPreviewPostMode(false);
    setActiveTab("posts");
  };

  const handleEditPost = (post: BlogPostItem) => {
    setEditingPost({ ...post });
    setIsCreatingPost(false);
    setPreviewPostMode(false);
  };

  const handleSavePost = async () => {
    if (!editingPost) return;
    if (!editingPost.title.trim()) {
      alert("Post title is required.");
      return;
    }
    const cleanSlug = editingPost.slug.trim() || slugifyHeading(editingPost.title);

    const baseBlogs = (formData.blogs && formData.blogs.length > 0) ? formData.blogs : BLOG_POSTS;
    let updatedBlogs = [...baseBlogs];
    if (isCreatingPost) {
      const existing = updatedBlogs.find((b) => b.slug === cleanSlug);
      if (existing) {
        editingPost.slug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
      } else {
        editingPost.slug = cleanSlug;
      }
      updatedBlogs = [editingPost, ...updatedBlogs];
    } else {
      updatedBlogs = updatedBlogs.map((b) =>
        b.slug === editingPost.slug || (editingPost.id && b.id === editingPost.id) ? editingPost : b
      );
    }

    const updatedFormData = {
      ...formData,
      blogs: updatedBlogs,
    };

    setFormData(updatedFormData);
    await handleSaveAll(updatedFormData);
    setEditingPost(null);
    setIsCreatingPost(false);
  };

  const handleDeletePost = async (slugToDelete: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }
    const baseBlogs = (formData.blogs && formData.blogs.length > 0) ? formData.blogs : BLOG_POSTS;
    const updatedBlogs = baseBlogs.filter((b) => b.slug !== slugToDelete);
    const updatedFormData = {
      ...formData,
      blogs: updatedBlogs,
    };
    setFormData(updatedFormData);
    await handleSaveAll(updatedFormData);
    if (editingPost?.slug === slugToDelete) {
      setEditingPost(null);
    }
  };

  const insertMarkdown = (syntaxBefore: string, syntaxAfter = "") => {
    if (!editingPost) return;
    const textarea = document.getElementById("post-content-textarea") as HTMLTextAreaElement | null;
    if (!textarea) {
      setEditingPost({
        ...editingPost,
        content: editingPost.content + `\n\n${syntaxBefore}Sample text${syntaxAfter}`,
      });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selText = textarea.value.substring(start, end) || "Text";
    const replacement = `${syntaxBefore}${selText}${syntaxAfter}`;

    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    setEditingPost({
      ...editingPost,
      content: newContent,
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxBefore.length, start + replacement.length - syntaxAfter.length);
    }, 50);
  };

  const filteredBlogs = useMemo(() => {
    const base = (formData.blogs && formData.blogs.length > 0) ? formData.blogs : BLOG_POSTS;
    return base.filter((b) => {
      const matchCat = postCategoryFilter === "All" || b.category === postCategoryFilter;
      const query = postSearch.toLowerCase().trim();
      const matchQuery =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.slug.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [formData.blogs, postCategoryFilter, postSearch]);

  const allCategories = useMemo(() => {
    const base = (formData.blogs && formData.blogs.length > 0) ? formData.blogs : BLOG_POSTS;
    const set = new Set<string>();
    base.forEach((b) => set.add(b.category));
    return ["All", ...Array.from(set)];
  }, [formData.blogs]);

  // ================= DETAILED SERVICE EDITOR =================
  const handleSaveServiceDetails = async () => {
    if (!editingService) return;
    const base = (formData.services && formData.services.length > 0) ? formData.services : SERVICES;
    const updatedServices = base.map((s) =>
      s.slug === editingService.slug ? editingService : s
    );
    const updatedData = { ...formData, services: updatedServices };
    setFormData(updatedData);
    await handleSaveAll(updatedData);
    setEditingService(null);
  };

  // ================= TESTIMONIALS MANAGEMENT =================
  const handleOpenNewTestimonial = () => {
    setEditingTestimonial({
      name: "Author Name",
      title: "Genre Author",
      quote: "Beyond Book Publishing transformed my rough manuscript into a bestselling masterpiece. I kept 100% of my royalties and loved the transparent process.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    });
    setIsCreatingTestimonial(true);
  };

  const handleSaveTestimonial = async () => {
    if (!editingTestimonial) return;
    let list = [...(formData.testimonials || [])];
    if (isCreatingTestimonial) {
      list = [editingTestimonial, ...list];
    } else {
      list = list.map((t) => (t.name === editingTestimonial.name ? editingTestimonial : t));
    }
    const updated = { ...formData, testimonials: list };
    setFormData(updated);
    await handleSaveAll(updated);
    setEditingTestimonial(null);
    setIsCreatingTestimonial(false);
  };

  const handleDeleteTestimonial = async (idxToDelete: number) => {
    if (!window.confirm("Delete this author testimonial?")) return;
    const list = (formData.testimonials || []).filter((_, i) => i !== idxToDelete);
    const updated = { ...formData, testimonials: list };
    setFormData(updated);
    await handleSaveAll(updated);
  };

  // ================= PORTFOLIO MANAGEMENT =================
  const handleOpenNewBook = () => {
    setEditingBook({
      title: "New Bestselling Title",
      author: "Published Author",
      genre: "Non-Fiction",
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600&h=850",
      rating: "5.0",
      year: "2026",
    });
    setIsCreatingBook(true);
  };

  const handleSaveBook = async () => {
    if (!editingBook) return;
    let list = [...(formData.portfolioBooks || [])];
    if (isCreatingBook) {
      list = [editingBook, ...list];
    } else {
      list = list.map((b) => (b.title === editingBook.title ? editingBook : b));
    }
    const updated = { ...formData, portfolioBooks: list };
    setFormData(updated);
    await handleSaveAll(updated);
    setEditingBook(null);
    setIsCreatingBook(false);
  };

  const handleDeleteBook = async (idxToDelete: number) => {
    if (!window.confirm("Delete this portfolio book?")) return;
    const list = (formData.portfolioBooks || []).filter((_, i) => i !== idxToDelete);
    const updated = { ...formData, portfolioBooks: list };
    setFormData(updated);
    await handleSaveAll(updated);
  };

  // ================= EXPORT & IMPORT =================
  const handleExportData = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `beyond-book-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed && typeof parsed === "object") {
          setFormData(parsed);
          await handleSaveAll(parsed);
          alert("CMS Data successfully imported and updated!");
        }
      } catch (err) {
        alert("Invalid JSON file provided.");
      }
    };
    reader.readAsText(file);
  };

  // Effective services and blogs with reliable fallbacks
  const allServicesList = useMemo(() => {
    return (formData.services && formData.services.length > 0) ? formData.services : SERVICES;
  }, [formData.services]);

  const allBlogsList = useMemo(() => {
    return (formData.blogs && formData.blogs.length > 0) ? formData.blogs : BLOG_POSTS;
  }, [formData.blogs]);

  // Helper to update specific service field
  const updateServiceField = (serviceSlug: string, field: keyof ServiceItem, value: any) => {
    const list = allServicesList.map((s) =>
      s.slug === serviceSlug ? { ...s, [field]: value } : s
    );
    setFormData((prev) => ({ ...prev, services: list }));
  };

  // Helper to update specific blog field
  const updateBlogField = (blogSlug: string, field: keyof BlogPostItem, value: any) => {
    const list = allBlogsList.map((b) =>
      b.slug === blogSlug ? { ...b, [field]: value } : b
    );
    setFormData((prev) => ({ ...prev, blogs: list }));
  };

  // Helper to update specific custom page SEO fields
  const updateCustomPageField = (pageSlug: string, field: keyof CustomPageItem, value: any) => {
    const list = (formData.custom_pages || []).map((p) =>
      p.slug === pageSlug ? { ...p, [field]: value, updatedAt: new Date().toISOString() } : p
    );
    setFormData((prev) => ({ ...prev, custom_pages: list }));
  };

  // Helper for SEO page fields (supports core pages, all 15 services, all blog posts, and custom pages)
  const currentSeoPageData = useMemo(() => {
    if (seoActivePage.startsWith("service:")) {
      const sSlug = seoActivePage.replace("service:", "");
      const svc = allServicesList.find((s) => s.slug === sSlug);
      if (svc) {
        return {
          title: svc.metaTitle || `${svc.title} | Beyond Book Publishing`,
          desc: svc.metaDesc || `${svc.title} - ${svc.tagline} Professional ${svc.category.toLowerCase()} services at Beyond Book Publishing.`,
          h1: svc.title,
          slug: `/services/${svc.slug}`,
          pageLabel: `Service: ${svc.title}`,
          isService: true,
          isBlog: false,
          isCustomPage: false,
          serviceSlug: svc.slug,
          service: svc,
          schema: svc.schemaMarkup || "",
          keywords: svc.focusKeywords || "",
          imgAlt: svc.imgAlt || `${svc.title} - Beyond Book Publishing`,
          titleKey: "seo_services_title" as keyof CMSData,
          descKey: "seo_services_desc" as keyof CMSData,
          h1Key: "seo_services_h1" as keyof CMSData,
        };
      }
    }

    if (seoActivePage.startsWith("blog:")) {
      const bSlug = seoActivePage.replace("blog:", "");
      const blog = allBlogsList.find((b) => b.slug === bSlug);
      if (blog) {
        return {
          title: blog.metaTitle || `${blog.title} | Beyond Book Publishing`,
          desc: blog.metaDesc || blog.excerpt,
          h1: blog.title,
          slug: `/blog/${blog.slug}`,
          pageLabel: `Blog: ${blog.title}`,
          isService: false,
          isBlog: true,
          isCustomPage: false,
          blogSlug: blog.slug,
          blog: blog,
          schema: blog.schemaMarkup || "",
          keywords: blog.focusKeywords || "",
          imgAlt: blog.imgAlt || `${blog.title} - Beyond Book Publishing`,
          titleKey: "seo_blog_title" as keyof CMSData,
          descKey: "seo_blog_desc" as keyof CMSData,
          h1Key: "seo_blog_h1" as keyof CMSData,
        };
      }
    }

    if (seoActivePage.startsWith("custom:")) {
      const pSlug = seoActivePage.replace("custom:", "");
      const customP = (formData.custom_pages || []).find((p) => p.slug === pSlug);
      if (customP) {
        return {
          title: customP.metaTitle || `${customP.title} | Beyond Book Publishing`,
          desc: customP.metaDesc || customP.excerpt || `${customP.title} official page.`,
          h1: customP.heroHeadline || customP.title,
          slug: `/${customP.slug}`,
          pageLabel: `Custom Page: ${customP.title}`,
          isService: false,
          isBlog: false,
          isCustomPage: true,
          customPageSlug: customP.slug,
          customPage: customP,
          schema: customP.schemaMarkup || "",
          keywords: customP.focusKeywords || "",
          imgAlt: `${customP.title} - Beyond Book Publishing`,
          titleKey: "seo_home_title" as keyof CMSData,
          descKey: "seo_home_desc" as keyof CMSData,
          h1Key: "seo_home_h1" as keyof CMSData,
        };
      }
    }

    switch (seoActivePage) {
      case "home":
        return {
          title: formData.seo_home_title,
          desc: formData.seo_home_desc,
          h1: formData.seo_home_h1,
          slug: "/",
          pageLabel: "Homepage",
          isService: false,
          titleKey: "seo_home_title" as keyof CMSData,
          descKey: "seo_home_desc" as keyof CMSData,
          h1Key: "seo_home_h1" as keyof CMSData,
        };
      case "about":
        return {
          title: formData.seo_about_title,
          desc: formData.seo_about_desc,
          h1: formData.seo_about_h1,
          slug: "/about",
          pageLabel: "About Us Page",
          isService: false,
          titleKey: "seo_about_title" as keyof CMSData,
          descKey: "seo_about_desc" as keyof CMSData,
          h1Key: "seo_about_h1" as keyof CMSData,
        };
      case "services":
        return {
          title: formData.seo_services_title,
          desc: formData.seo_services_desc,
          h1: formData.seo_services_h1,
          slug: "/services",
          pageLabel: "Publishing Services Catalog (Hub)",
          isService: false,
          titleKey: "seo_services_title" as keyof CMSData,
          descKey: "seo_services_desc" as keyof CMSData,
          h1Key: "seo_services_h1" as keyof CMSData,
        };
      case "portfolio":
        return {
          title: formData.seo_portfolio_title,
          desc: formData.seo_portfolio_desc,
          h1: formData.seo_portfolio_h1,
          slug: "/portfolio",
          pageLabel: "Portfolio Gallery",
          isService: false,
          titleKey: "seo_portfolio_title" as keyof CMSData,
          descKey: "seo_portfolio_desc" as keyof CMSData,
          h1Key: "seo_portfolio_h1" as keyof CMSData,
        };
      case "pricing":
        return {
          title: formData.seo_pricing_title,
          desc: formData.seo_pricing_desc,
          h1: formData.seo_pricing_h1,
          slug: "/pricing",
          pageLabel: "Pricing Packages",
          isService: false,
          titleKey: "seo_pricing_title" as keyof CMSData,
          descKey: "seo_pricing_desc" as keyof CMSData,
          h1Key: "seo_pricing_h1" as keyof CMSData,
        };
      case "blog":
        return {
          title: formData.seo_blog_title,
          desc: formData.seo_blog_desc,
          h1: formData.seo_blog_h1,
          slug: "/blog",
          pageLabel: "Blog & Guides Catalog",
          isService: false,
          titleKey: "seo_blog_title" as keyof CMSData,
          descKey: "seo_blog_desc" as keyof CMSData,
          h1Key: "seo_blog_h1" as keyof CMSData,
        };
      case "testimonials":
        return {
          title: formData.seo_testimonials_title,
          desc: formData.seo_testimonials_desc,
          h1: formData.seo_testimonials_h1,
          slug: "/testimonials",
          pageLabel: "Author Testimonials",
          isService: false,
          titleKey: "seo_testimonials_title" as keyof CMSData,
          descKey: "seo_testimonials_desc" as keyof CMSData,
          h1Key: "seo_testimonials_h1" as keyof CMSData,
        };
      case "contact":
      default:
        return {
          title: formData.seo_contact_title,
          desc: formData.seo_contact_desc,
          h1: formData.seo_contact_h1,
          slug: "/contact",
          pageLabel: "Contact & Consultation",
          isService: false,
          titleKey: "seo_contact_title" as keyof CMSData,
          descKey: "seo_contact_desc" as keyof CMSData,
          h1Key: "seo_contact_h1" as keyof CMSData,
        };
    }
  }, [formData, seoActivePage, allServicesList, allBlogsList]);

  // Character counter helper
  const getLengthBadge = (current: number, min: number, max: number) => {
    if (current === 0) return { text: "Empty", color: "bg-red-100 text-red-700" };
    if (current < min) return { text: `${current} chars (Too Short)`, color: "bg-yellow-100 text-yellow-800" };
    if (current > max) return { text: `${current} chars (Too Long)`, color: "bg-red-100 text-red-700" };
    return { text: `${current} chars (Optimal)`, color: "bg-green-100 text-green-700 font-bold" };
  };

  // Selected chat session for live messenger
  const currentChatSession = useMemo(() => {
    return chatSessions.find((s) => s.sessionId === activeChatSessionId) || chatSessions[0] || null;
  }, [chatSessions, activeChatSessionId]);

  // ================= IF NOT AUTHENTICATED: SHOW SECURE LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1d2327] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center mx-auto shadow-md">
              <BookOpen className="w-7 h-7 text-gold" />
            </div>
            <h1 className="text-2xl font-serif font-black text-navy pt-2">
              Beyond Book Publishing
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Client Custom Dashboard Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Username or Client Email
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter username or email"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm text-navy outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-navy text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 text-sm text-navy outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-xs select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#2271b1] focus:ring-0"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 text-[11px] leading-relaxed flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Protected administration area. Enter your authorized username and password to proceed.</span>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-4 h-4" />
              <span>{loginLoading ? "Authenticating..." : "Log In to Custom Dashboard"}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-gray-400 hover:text-navy transition-colors">
              ← Return to live website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN AUTHENTICATED DASHBOARD =================
  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-800 flex flex-col font-sans" id="admin-root">
      {/* ================= CUSTOM DASHBOARD TOP ADMIN BAR ================= */}
      <header className="bg-[#1d2327] text-white h-12 flex items-center justify-between px-4 z-50 sticky top-0 shadow-md">
        <div className="flex items-center gap-4 text-xs">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gold font-bold">
            <BookOpen className="w-4 h-4 text-gold" />
            <span className="hidden sm:inline">Beyond Book Publishing</span>
            <span className="bg-gold/20 text-gold text-[10px] px-1.5 py-0.5 rounded uppercase font-black">
              Custom Dashboard
            </span>
          </Link>
          <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
            title="View Live Website in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Visit Site</span>
          </Link>
          <button
            onClick={handleOpenNewPost}
            className="flex items-center gap-1 bg-white/10 hover:bg-gold hover:text-navy text-white px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Live Visitor Indicator */}
          <span className="hidden md:flex items-center gap-1.5 bg-green-950/60 text-green-300 border border-green-700/50 px-2 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>{liveVisitorCount} Live Online</span>
          </span>

          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-yellow-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </span>
          )}
          {saveStatus === "success" && (
            <span className="flex items-center gap-1.5 text-green-400 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Live</span>
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1.5 text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Error</span>
            </span>
          )}

          <button
            onClick={() => handleSaveAll()}
            className="bg-gold hover:bg-yellow-400 text-navy font-bold px-3 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 bg-white/10 hover:bg-red-600 text-gray-200 hover:text-white rounded transition-colors cursor-pointer flex items-center gap-1"
            title="Log out of CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Logout</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN CUSTOM DASHBOARD TWO-COLUMN WRAPPER ================= */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* ================= CUSTOM DASHBOARD DARK SIDEBAR ================= */}
        <aside className="w-full md:w-60 bg-[#1d2327] text-[#a7aaad] flex-shrink-0 flex md:flex-col justify-between border-r border-[#2c3338]">
          <div className="py-2 w-full flex md:flex-col overflow-x-auto md:overflow-visible">
            {[
              { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: "posts", label: "Blog Posts", icon: <FileText className="w-4 h-4" />, badge: allBlogsList.length },
              { id: "services", label: "Services (15 Pages)", icon: <Wrench className="w-4 h-4" />, badge: allServicesList.length },
              { id: "pages", label: "Pages & Copy", icon: <Layers className="w-4 h-4" /> },
              { id: "header_branding", label: "Header & Branding", icon: <Sliders className="w-4 h-4" /> },
              { id: "live_chat", label: "Live Messenger", icon: <MessageSquare className="w-4 h-4" />, badge: liveVisitorCount },
              { id: "pricing", label: "Pricing Packages", icon: <Tag className="w-4 h-4" /> },
              { id: "testimonials", label: "Testimonials", icon: <Star className="w-4 h-4" />, badge: formData.testimonials?.length },
              { id: "portfolio", label: "Portfolio Books", icon: <BookOpen className="w-4 h-4" />, badge: formData.portfolioBooks?.length },
              { id: "media", label: "Media & Images", icon: <ImageIcon className="w-4 h-4" /> },
              { id: "seo", label: "SEO Options", icon: <Search className="w-4 h-4" /> },
              { id: "contact", label: "Contact Details", icon: <Phone className="w-4 h-4" /> },
              { id: "leads", label: "Form Inquiries", icon: <Users className="w-4 h-4" />, badge: leads?.length },
              { id: "tools", label: "Security & Tools", icon: <Database className="w-4 h-4" /> },
            ].map((menu) => {
              const active = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => {
                    setActiveTab(menu.id as AdminTab);
                    if (editingPost) setEditingPost(null);
                    if (editingService) setEditingService(null);
                    if (editingTestimonial) setEditingTestimonial(null);
                    if (editingBook) setEditingBook(null);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold text-left transition-colors cursor-pointer whitespace-nowrap md:whitespace-normal ${
                    active
                      ? "bg-[#2271b1] text-white font-bold"
                      : "hover:bg-[#131719] hover:text-[#72aee6]"
                  }`}
                >
                  <span className={active ? "text-white" : "text-gray-400"}>{menu.icon}</span>
                  <span className="flex-1">{menu.label}</span>
                  {menu.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        active ? "bg-white text-[#2271b1]" : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {menu.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#2c3338] hidden md:block text-[11px] text-gray-400">
            <p className="font-semibold text-gray-300">Beyond Book Publishing</p>
            <p className="text-[10px]">Client Content CMS v3.2</p>
          </div>
        </aside>

        {/* ================= MAIN CONTENT PANE ================= */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Notification Alert */}
          {saveStatus === "success" && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>{saveMessage || "Settings updated and saved to server."}</span>
              </div>
              <button onClick={() => setSaveStatus("idle")} className="text-green-600 hover:text-green-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= TAB: DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-black text-navy">
                    Website Management Dashboard
                  </h1>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">
                    Manage all 15 service detail pages, images with alt tags, live chat visitors, SEO options, and customer leads.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewPost}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Blog Post</span>
                  </button>
                  <Link
                    href="/"
                    target="_blank"
                    className="bg-navy hover:bg-gold hover:text-navy text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Live Site</span>
                  </Link>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Live Visitors</span>
                  <div className="text-3xl font-serif font-black text-green-600 flex items-center gap-2">
                    <span>{liveVisitorCount}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <span className="text-[11px] text-green-700 font-semibold">Active in Messenger</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Services (15 Pages)</span>
                  <div className="text-3xl font-serif font-black text-navy">{formData.services?.length || 15}</div>
                  <span className="text-[11px] text-blue-600 font-semibold">Full Detail Editing Ready</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Form Inquiries</span>
                  <div className="text-3xl font-serif font-black text-navy">{leads?.length || 0}</div>
                  <span className="text-[11px] text-gold font-semibold">Captured Author Leads</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Published Blogs</span>
                  <div className="text-3xl font-serif font-black text-navy">{formData.blogs?.length || 0}</div>
                  <span className="text-[11px] text-gray-500 font-semibold">Guides with Schema.org</span>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-navy text-base flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-gold" />
                    <span>Edit 15 Service Detail Pages</span>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Edit benefits, process blueprints, case examples, FAQs, and image alt tags for every publishing service page.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab("services")}
                      className="bg-navy hover:bg-gold text-white hover:text-navy text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Open Services Editor
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-navy text-base flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span>Live Visitor Messenger</span>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Chat directly with online website visitors in real-time. Respond to book inquiries and quotation requests.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab("live_chat")}
                      className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Open Live Chat ({liveVisitorCount} Online)
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-navy text-base flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-gold" />
                    <span>Header, Logo &amp; Favicon</span>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Upload your custom logo image, change favicon icon, edit phone number, and customize top navigation menu links.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveTab("header_branding")}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Customize Header &amp; Logo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: BLOG POSTS MANAGER ================= */}
          {activeTab === "posts" && (
            <div className="space-y-6 animate-fade-in">
              {editingPost ? (
                /* Post Editor Form */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingPost(null);
                          setIsCreatingPost(false);
                          setPreviewPostMode(false);
                        }}
                        className="text-gray-500 hover:text-navy text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        ← Back to All Posts
                      </button>
                      <h2 className="text-xl md:text-2xl font-serif font-black text-navy">
                        {isCreatingPost ? "Create New Blog Post" : `Edit Post: ${editingPost.title}`}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCreatingPost && (
                        <Link
                          href={`/blog/${editingPost.slug}`}
                          target="_blank"
                          className="bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Live Article</span>
                        </Link>
                      )}

                      <button
                        onClick={handleSavePost}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isCreatingPost ? "Publish Post" : "Save Changes"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
                    {/* Left 8 cols: Main Article Body & Editorial */}
                    <div className="lg:col-span-8 space-y-5">
                      <div>
                        <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Post Title (H1)
                        </label>
                        <input
                          type="text"
                          value={editingPost.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            if (isCreatingPost && !editingPost.slug) {
                              setEditingPost({
                                ...editingPost,
                                title: newTitle,
                                slug: slugifyHeading(newTitle),
                              });
                            } else {
                              setEditingPost({ ...editingPost, title: newTitle });
                            }
                          }}
                          placeholder="e.g. The Complete Guide to Self-Publishing in 2026"
                          className="w-full font-serif font-bold text-lg md:text-xl text-navy border border-gray-300 rounded-lg p-3 outline-none focus:border-[#2271b1]"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            URL Slug (/blog/{editingPost.slug})
                          </label>
                          <input
                            type="text"
                            value={editingPost.slug}
                            onChange={(e) => setEditingPost({ ...editingPost, slug: slugifyHeading(e.target.value) })}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono text-gray-700 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">
                            Estimated Read Time
                          </label>
                          <input
                            type="text"
                            value={editingPost.readTime}
                            onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                            placeholder="e.g. 7 min read"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Post Excerpt &amp; Search Engine Summary
                        </label>
                        <textarea
                          rows={3}
                          value={editingPost.excerpt}
                          onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                          placeholder="A compelling 2-sentence summary explaining what the reader will learn..."
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-700 outline-none leading-relaxed focus:border-[#2271b1]"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                          Appears in blog index cards and as the default meta description for search engines.
                        </p>
                      </div>

                      {/* Content Editor with Markdown Toolbar */}
                      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-xs">
                        <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-300 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-navy text-xs mr-2">Markdown Tools:</span>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("**", "**")}
                              className="p-1.5 bg-white hover:bg-gray-200 rounded border border-gray-300 text-gray-700 hover:text-navy cursor-pointer"
                              title="Bold"
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("*", "*")}
                              className="p-1.5 bg-white hover:bg-gray-200 rounded border border-gray-300 text-gray-700 hover:text-navy cursor-pointer"
                              title="Italic"
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("## ")}
                              className="p-1.5 bg-white hover:bg-gray-200 rounded border border-gray-300 text-gray-700 hover:text-navy font-bold text-xs px-2 cursor-pointer"
                              title="Heading 2"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("### ")}
                              className="p-1.5 bg-white hover:bg-gray-200 rounded border border-gray-300 text-gray-700 hover:text-navy font-bold text-xs px-2 cursor-pointer"
                              title="Heading 3"
                            >
                              H3
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("> ")}
                              className="p-1.5 bg-white hover:bg-gray-200 rounded border border-gray-300 text-gray-700 hover:text-navy cursor-pointer"
                              title="Quote"
                            >
                              <Quote className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("- ")}
                              className="p-1.5 bg-white hover:bg-gray-200 rounded border border-gray-300 text-gray-700 hover:text-navy cursor-pointer"
                              title="Bullet List"
                            >
                              <List className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("[", "](https://beyondbookpublishing.com)")}
                              className="p-1.5 bg-white hover:bg-gray-200 rounded border border-gray-300 text-gray-700 hover:text-navy cursor-pointer"
                              title="Link"
                            >
                              <Link2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                            <button
                              type="button"
                              onClick={() => setPreviewPostMode(false)}
                              className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                                !previewPostMode ? "bg-[#2271b1] text-white" : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              Write
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewPostMode(true)}
                              className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                                previewPostMode ? "bg-[#2271b1] text-white" : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              Live Preview
                            </button>
                          </div>
                        </div>

                        {!previewPostMode ? (
                          <textarea
                            id="post-content-textarea"
                            rows={16}
                            value={editingPost.content}
                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                            placeholder="Write your article in standard markdown or plain text with headings, bullet points, quotes, and links..."
                            className="w-full p-4 font-mono text-xs text-gray-800 leading-relaxed outline-none resize-y"
                          />
                        ) : (
                          <div className="p-6 bg-white prose prose-sm max-w-none min-h-[350px]">
                            <ArticleRenderer content={editingPost.content} />
                          </div>
                        )}
                      </div>

                      {/* Author Info */}
                      <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Author Name</label>
                          <input
                            type="text"
                            value={editingPost.author}
                            onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded p-2 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Author Role / Byline</label>
                          <input
                            type="text"
                            value={editingPost.authorRole}
                            onChange={(e) => setEditingPost({ ...editingPost, authorRole: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded p-2 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right 4 cols: Featured Image, Category, Tags & SEO */}
                    <div className="lg:col-span-4 space-y-5">
                      {/* Publishing Details */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                        <h4 className="font-bold text-navy text-xs uppercase tracking-wider border-b border-gray-200 pb-2">
                          Category &amp; Classification
                        </h4>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Category</label>
                          <select
                            value={editingPost.category}
                            onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-semibold text-navy outline-none"
                          >
                            <option value="Self-Publishing">Self-Publishing</option>
                            <option value="Ghostwriting">Ghostwriting</option>
                            <option value="Book Editing">Book Editing</option>
                            <option value="Book Marketing">Book Marketing</option>
                            <option value="Author Resources">Author Resources</option>
                            <option value="Publishing Industry">Publishing Industry</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Tags (Comma-separated)</label>
                          <input
                            type="text"
                            value={(editingPost.tags || []).join(", ")}
                            onChange={(e) =>
                              setEditingPost({
                                ...editingPost,
                                tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                              })
                            }
                            placeholder="Publishing, Royalties, Ghostwriting"
                            className="w-full bg-white border border-gray-300 rounded p-2 text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Publish Date</label>
                          <input
                            type="text"
                            value={editingPost.date}
                            onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded p-2 text-xs outline-none"
                          />
                        </div>
                      </div>

                      {/* Featured Image & Alt Tag */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <h4 className="font-bold text-navy text-xs uppercase tracking-wider">
                            Featured Post Image
                          </h4>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                            1200 x 675 px
                          </span>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Image URL</label>
                          <input
                            type="text"
                            value={editingPost.img}
                            onChange={(e) => setEditingPost({ ...editingPost, img: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-white border border-gray-300 rounded p-2 font-mono text-[11px] outline-none"
                          />
                        </div>

                        {editingPost.img && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-navy border border-gray-200">
                            <img
                              src={editingPost.img}
                              alt={editingPost.imgAlt || editingPost.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">
                            Image Alt Tag (SEO &amp; Google Images)
                          </label>
                          <input
                            type="text"
                            value={editingPost.imgAlt || ""}
                            onChange={(e) => setEditingPost({ ...editingPost, imgAlt: e.target.value })}
                            placeholder={`${editingPost.title} - Guide by Beyond Book Publishing`}
                            className="w-full bg-white border border-gray-300 rounded p-2 text-xs outline-none"
                          />
                        </div>
                      </div>

                      {/* Post SEO & Social Metadata */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-xs">
                        <h4 className="font-bold text-navy text-xs uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
                          <span>Article SEO Metadata</span>
                          <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                            Google Ready
                          </span>
                        </h4>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">
                            SEO Meta Title Tag
                          </label>
                          <input
                            type="text"
                            value={editingPost.metaTitle || ""}
                            onChange={(e) => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                            placeholder={`${editingPost.title} | Beyond Book Publishing`}
                            className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">
                            Meta Description
                          </label>
                          <textarea
                            rows={3}
                            value={editingPost.metaDesc || ""}
                            onChange={(e) => setEditingPost({ ...editingPost, metaDesc: e.target.value })}
                            placeholder={editingPost.excerpt || "Comprehensive publishing roadmap for authors."}
                            className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs outline-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Delete Option */}
                      {!isCreatingPost && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleDeletePost(editingPost.slug)}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs py-2.5 rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete This Post</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Posts Catalog List Table */
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-serif font-black text-navy">
                          Blog Posts &amp; Publishing Guides
                        </h1>
                        <span className="bg-blue-100 text-[#2271b1] text-xs px-2.5 py-0.5 rounded-full font-bold">
                          {formData.blogs?.length || 0} Total Posts
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Create, edit, and organize author resource guides, ghostwriting tutorials, and industry insights.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenNewPost}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Blog Post</span>
                    </button>
                  </div>

                  {/* Search & Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={postSearch}
                        onChange={(e) => setPostSearch(e.target.value)}
                        placeholder="Search posts by title, author, or keyword..."
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-xs text-navy outline-none focus:border-[#2271b1]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-bold whitespace-nowrap">Filter:</span>
                      <select
                        value={postCategoryFilter}
                        onChange={(e) => setPostCategoryFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-navy outline-none"
                      >
                        {allCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Blog Posts Table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
                        <tr>
                          <th className="py-3 px-4">Article</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Author</th>
                          <th className="py-3 px-4">Date &amp; Read Time</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150">
                        {filteredBlogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-400">
                              No blog posts found matching your search.
                            </td>
                          </tr>
                        ) : (
                          filteredBlogs.map((post) => (
                            <tr key={post.slug} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  {post.img ? (
                                    <img
                                      src={post.img}
                                      alt={post.title}
                                      className="w-14 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-14 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                      <FileText className="w-4 h-4 text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => handleEditPost(post)}
                                      className="font-bold text-navy hover:text-[#2271b1] text-xs transition-colors text-left font-serif cursor-pointer line-clamp-1"
                                    >
                                      {post.title}
                                    </button>
                                    <span className="text-[11px] text-gray-400 font-mono block">
                                      /blog/{post.slug}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="bg-gold/20 text-navy font-bold px-2 py-0.5 rounded text-[10px]">
                                  {post.category}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 font-medium text-gray-700">
                                {post.author}
                              </td>

                              <td className="py-3.5 px-4 text-gray-500">
                                <div>{post.date}</div>
                                <div className="text-[10px] text-gray-400">{post.readTime}</div>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded transition-colors"
                                    title="View Live Article"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleEditPost(post)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                    title="Edit Post"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePost(post.slug)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Delete Post"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: LIVE CHAT & MESSENGER ================= */}
          {activeTab === "live_chat" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-serif font-black text-navy">Live Chat &amp; Visitor Messenger</h1>
                    <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      {liveVisitorCount} Online Now
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    See visitors browsing the website and send direct consultant replies in real time.
                  </p>
                </div>
                <button
                  onClick={fetchChatSessions}
                  className="bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Chats</span>
                </button>
              </div>

              {/* Three-Column Tawk.to Messenger Layout */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[580px] overflow-hidden">
                {/* Left Column: Chat Sessions List (3 cols) */}
                <div className="lg:col-span-3 border-r border-gray-200 flex flex-col bg-gray-50/50">
                  <div className="p-3.5 border-b border-gray-200 bg-white font-bold text-xs text-navy flex items-center justify-between">
                    <span>Active Conversations</span>
                    <span className="text-gray-400 font-mono text-[11px]">{chatSessions.length} total</span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {chatSessions.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-xs">
                        No active visitor sessions recorded yet. When a visitor opens the chat bubble, their conversation and verified IP will appear here!
                      </div>
                    ) : (
                      chatSessions.map((session) => {
                        const isSelected = session.sessionId === activeChatSessionId;
                        return (
                          <button
                            key={session.sessionId}
                            onClick={() => setActiveChatSessionId(session.sessionId)}
                            className={`w-full text-left p-3 transition-colors cursor-pointer block ${
                              isSelected ? "bg-white border-l-4 border-[#2271b1] shadow-xs" : "hover:bg-gray-100/70"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-navy text-xs flex items-center gap-1.5 truncate">
                                <span className="text-sm">{session.flag || "🇺🇸"}</span>
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${session.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                                <span className="truncate">{session.visitorName || `Visitor #${session.sessionId.slice(-4)}`}</span>
                              </span>
                              <span className="text-[10px] text-gray-400 flex-shrink-0">
                                {session.lastTimestamp ? new Date(session.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 truncate leading-snug">
                              {session.lastMessage || "Started chat session"}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                              <span className="font-mono">{session.ip || "72.229.28.185"}</span>
                              <span>{session.city || "New York"}</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Middle Column: Chat Conversation & Direct Reply Box (6 cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-white border-r border-gray-200">
                  {currentChatSession ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-xs relative">
                            <span>{currentChatSession.visitorName?.slice(0, 1) || "V"}</span>
                            <span className="absolute -bottom-1 -right-1 text-xs">{currentChatSession.flag || "🇺🇸"}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-navy text-xs flex items-center gap-2">
                              <span>{currentChatSession.visitorName}</span>
                              <span className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                                currentChatSession.isOnline ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                              }`}>
                                {currentChatSession.isOnline ? "Online" : "Away"}
                              </span>
                            </h4>
                            <p className="text-[10px] text-gray-400 font-mono">
                              IP: {currentChatSession.ip || "72.229.28.185"} · {currentChatSession.city || "New York"}, {currentChatSession.country || "United States"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-[#2271b1] rounded-md">
                            🟢 Agent Active
                          </span>
                        </div>
                      </div>

                      {/* Messages Flow */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfbfb]" style={{ maxHeight: 380 }}>
                        {(currentChatSession.messages || []).map((msg, mIdx) => {
                          const isAgent = msg.from === "agent";
                          return (
                            <div
                              key={mIdx}
                              className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                            >
                              <span className="text-[10px] text-gray-400 mb-0.5 px-1 font-semibold flex items-center gap-1">
                                {isAgent ? "Sarah / Consultant" : currentChatSession.visitorName}
                                {!isAgent && <span>{currentChatSession.flag || "🇺🇸"}</span>}
                              </span>
                              <div
                                className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                  isAgent
                                    ? "bg-navy text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Admin Direct Reply Box */}
                      <div className="p-3.5 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendAdminReply();
                              }
                            }}
                            placeholder="Type direct response to visitor (Press Enter to send)..."
                            className="flex-1 border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#2271b1] resize-none text-slate-800"
                          />
                          <button
                            onClick={handleSendAdminReply}
                            disabled={isSendingReply || !adminReplyText.trim()}
                            className="bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-bold px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>{isSendingReply ? "..." : "Reply"}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                          Instant delivery: Displays in visitor's live widget in real time without bot interruption.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center h-full">
                      <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
                      <span>Select a conversation from the left to start live messaging.</span>
                    </div>
                  )}
                </div>

                {/* Right Column: Tawk.to Visitor Profile & Geolocation Card (3 cols) */}
                <div className="lg:col-span-3 bg-gray-50/70 p-4 flex flex-col justify-between overflow-y-auto">
                  {currentChatSession ? (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <span className="font-bold text-navy text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gold" />
                          <span>Tawk.to Visitor Info</span>
                        </span>
                        <span className="text-base">{currentChatSession.flag || "🇺🇸"}</span>
                      </div>

                      {/* Visitor Quick Bio */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs text-center space-y-1.5">
                        <div className="w-12 h-12 bg-navy text-gold font-bold text-sm rounded-full flex items-center justify-center mx-auto relative">
                          <span>{currentChatSession.visitorName?.slice(0, 1) || "V"}</span>
                          <span className="absolute -bottom-1 -right-1 text-sm">{currentChatSession.flag || "🇺🇸"}</span>
                        </div>
                        <h5 className="font-bold text-navy text-xs">{currentChatSession.visitorName}</h5>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {currentChatSession.sessionId}</p>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span>{currentChatSession.isOnline ? "Active on Website" : "Session Idle"}</span>
                        </div>
                      </div>

                      {/* Verified Geolocation & IP */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs space-y-2">
                        <h6 className="font-bold text-navy text-[10px] uppercase tracking-wider text-gray-400">Location &amp; Network</h6>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 text-[11px]">Country:</span>
                          <span className="font-bold text-navy text-[11px] flex items-center gap-1">
                            <span>{currentChatSession.flag || "🇺🇸"}</span>
                            <span>{currentChatSession.country || "United States"}</span>
                          </span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 text-[11px]">City / Region:</span>
                          <span className="font-semibold text-gray-700 text-[11px]">{currentChatSession.city || "New York"}, {currentChatSession.region || "US"}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 text-[11px]">IP Address:</span>
                          <span className="font-mono text-navy font-bold text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                            {currentChatSession.ip || "72.229.28.185"}
                          </span>
                        </div>
                      </div>

                      {/* Device & Active Page */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs space-y-2">
                        <h6 className="font-bold text-navy text-[10px] uppercase tracking-wider text-gray-400">Device &amp; Navigation</h6>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 text-[11px]">Browser:</span>
                          <span className="font-semibold text-gray-700 text-[11px]">{currentChatSession.browser || "Chrome / macOS"}</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <span className="text-gray-500 text-[11px]">Device:</span>
                          <span className="font-semibold text-gray-700 text-[11px]">{currentChatSession.device || "Desktop"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 pt-1 border-t border-gray-100">
                          <span className="text-gray-500 text-[10px]">Active Page:</span>
                          <span className="font-mono text-[#2271b1] text-[10px] truncate">{currentChatSession.currentPage || "/"}</span>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs space-y-2">
                        <h6 className="font-bold text-navy text-[10px] uppercase tracking-wider text-gray-400">Author Contact</h6>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-gray-500 text-[10px]">Email:</span>
                          <span className="font-semibold text-navy text-[11px] truncate">
                            {currentChatSession.email || <span className="text-gray-400 italic font-normal">Not entered yet</span>}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-gray-500 text-[10px]">Phone:</span>
                          <span className="font-semibold text-navy text-[11px]">
                            {currentChatSession.phone || <span className="text-gray-400 italic font-normal">Not entered yet</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 text-gray-400 text-xs">
                      No session selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: SERVICES CATALOG (ALL 15 PAGES FULL EDITING) ================= */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-fade-in">
              {editingService ? (
                /* Full Detailed Service Page Editor */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingService(null)}
                        className="text-gray-500 hover:text-navy text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        ← Back to Services
                      </button>
                      <h2 className="text-xl md:text-2xl font-serif font-black text-navy">
                        Edit Service Page: {editingService.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/services/${editingService.slug}`}
                        target="_blank"
                        className="bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Live Page</span>
                      </Link>

                      <button
                        onClick={handleSaveServiceDetails}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Service Page</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
                    {/* Left 8 cols: Content, Description, Process, FAQs */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Service Title (H1)
                          </label>
                          <input
                            type="text"
                            value={editingService.title}
                            onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                            className="w-full font-serif font-bold text-base text-navy border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#2271b1]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            URL Slug (/services/{editingService.slug})
                          </label>
                          <input
                            type="text"
                            value={editingService.slug}
                            onChange={(e) => setEditingService({ ...editingService, slug: slugifyHeading(e.target.value) })}
                            className="w-full font-mono font-semibold text-gray-700 border border-gray-300 rounded-lg p-2.5 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Tagline / Hero Hook
                        </label>
                        <input
                          type="text"
                          value={editingService.tagline}
                          onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-2.5 outline-none text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Full Editorial Description
                        </label>
                        <textarea
                          rows={5}
                          value={editingService.description}
                          onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 leading-relaxed outline-none focus:border-[#2271b1]"
                        />
                      </div>

                      {/* Benefits Bullets List */}
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-navy text-xs uppercase tracking-wider">
                            Key Service Benefits ({editingService.benefits?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(editingService.benefits || []), "New Benefit Feature"];
                              setEditingService({ ...editingService, benefits: list });
                            }}
                            className="text-[#2271b1] font-bold text-xs hover:underline cursor-pointer"
                          >
                            + Add Benefit
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(editingService.benefits || []).map((ben, bIdx) => (
                            <div key={bIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={ben}
                                onChange={(e) => {
                                  const list = [...editingService.benefits];
                                  list[bIdx] = e.target.value;
                                  setEditingService({ ...editingService, benefits: list });
                                }}
                                className="flex-1 bg-white border border-gray-300 rounded p-2 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = editingService.benefits.filter((_, i) => i !== bIdx);
                                  setEditingService({ ...editingService, benefits: list });
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* FAQ Section */}
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-navy text-xs uppercase tracking-wider">
                            Service FAQs ({editingService.faq?.length || 0} Questions)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(editingService.faq || []), { q: "New Question?", a: "Detailed answer..." }];
                              setEditingService({ ...editingService, faq: list });
                            }}
                            className="text-[#2271b1] font-bold text-xs hover:underline cursor-pointer"
                          >
                            + Add FAQ Question
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(editingService.faq || []).map((faqItem, fIdx) => (
                            <div key={fIdx} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={faqItem.q}
                                  placeholder="Question"
                                  onChange={(e) => {
                                    const list = [...editingService.faq];
                                    list[fIdx] = { ...faqItem, q: e.target.value };
                                    setEditingService({ ...editingService, faq: list });
                                  }}
                                  className="flex-1 font-bold text-navy border-b border-gray-200 pb-1 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = editingService.faq.filter((_, i) => i !== fIdx);
                                    setEditingService({ ...editingService, faq: list });
                                  }}
                                  className="text-gray-400 hover:text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={faqItem.a}
                                placeholder="Answer"
                                onChange={(e) => {
                                  const list = [...editingService.faq];
                                  list[fIdx] = { ...faqItem, a: e.target.value };
                                  setEditingService({ ...editingService, faq: list });
                                }}
                                className="w-full text-xs text-gray-700 outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right 4 cols: Image with Dimensions, Alt Tag & Category */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                        <h4 className="font-bold text-navy text-xs uppercase tracking-wider border-b border-gray-200 pb-2">
                          Service Visual &amp; Alt Tag
                        </h4>

                        <div>
                          <label className="block text-gray-600 font-bold mb-1">Category</label>
                          <input
                            type="text"
                            value={editingService.category}
                            onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded p-2 font-bold text-navy outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-600 font-bold">Featured Image URL</label>
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                              1200 x 675 px
                            </span>
                          </div>
                          <input
                            type="text"
                            value={editingService.img}
                            onChange={(e) => setEditingService({ ...editingService, img: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded p-2 font-mono text-[11px] outline-none"
                          />
                          {editingService.img && (
                            <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-navy border border-gray-200">
                              <img src={editingService.img} alt={editingService.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>

                        {/* Image Alt Tag field */}
                        <div>
                          <label className="block text-gray-600 font-bold mb-1">
                            Image Alt Tag (SEO &amp; Accessibility)
                          </label>
                          <input
                            type="text"
                            value={(editingService as any).imgAlt || `${editingService.title} - Beyond Book Publishing`}
                            onChange={(e) => setEditingService({ ...editingService, imgAlt: e.target.value } as any)}
                            placeholder="e.g. Professional Ghostwriting Services by Beyond Book Publishing"
                            className="w-full bg-white border border-gray-300 rounded p-2 text-xs outline-none"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">
                            Crucial for Google Image search rankings and screen readers.
                          </p>
                        </div>
                      </div>

                      {/* Service Page SEO Meta & Structured Data Schema Box */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-xs">
                        <h4 className="font-bold text-navy text-xs uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
                          <span>Service SEO &amp; Schema.org</span>
                          <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                            Rich Snippet
                          </span>
                        </h4>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">
                            Page Meta Title (&lt;title&gt;)
                          </label>
                          <input
                            type="text"
                            value={editingService.metaTitle || ""}
                            onChange={(e) => setEditingService({ ...editingService, metaTitle: e.target.value })}
                            placeholder={`${editingService.title} | Beyond Book Publishing`}
                            className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs outline-none focus:border-[#2271b1]"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">
                            Recommended 50 - 60 chars. Appears as Google search title.
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">
                            Meta Description
                          </label>
                          <textarea
                            rows={3}
                            value={editingService.metaDesc || ""}
                            onChange={(e) => setEditingService({ ...editingService, metaDesc: e.target.value })}
                            placeholder={`${editingService.title} - ${editingService.tagline} Professional publishing services.`}
                            className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs outline-none leading-relaxed focus:border-[#2271b1]"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">
                            Recommended 130 - 160 chars. Google search snippet description.
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold mb-1">
                            Target Focus Keywords
                          </label>
                          <input
                            type="text"
                            value={editingService.focusKeywords || ""}
                            onChange={(e) => setEditingService({ ...editingService, focusKeywords: e.target.value })}
                            placeholder="e.g. ghostwriting, book writing, hire ghostwriter"
                            className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-700 font-bold">
                              Custom Schema.org JSON-LD
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const autoSchema = JSON.stringify({
                                  "@context": "https://schema.org",
                                  "@type": "Service",
                                  "name": `${editingService.title} - Beyond Book Publishing`,
                                  "serviceType": editingService.title,
                                  "provider": {
                                    "@type": "Organization",
                                    "name": "Beyond Book Publishing",
                                    "url": "https://beyondbookpublishing.com"
                                  },
                                  "description": editingService.description || editingService.tagline,
                                  "areaServed": "Global",
                                  "offers": {
                                    "@type": "Offer",
                                    "price": "0",
                                    "priceCurrency": "USD",
                                    "description": "Free publishing quotation and author consultation"
                                  }
                                }, null, 2);
                                setEditingService({ ...editingService, schemaMarkup: autoSchema });
                              }}
                              className="text-[11px] text-[#2271b1] hover:underline font-bold cursor-pointer"
                            >
                              Auto-Fill Schema
                            </button>
                          </div>
                          <textarea
                            rows={5}
                            value={editingService.schemaMarkup || ""}
                            onChange={(e) => setEditingService({ ...editingService, schemaMarkup: e.target.value })}
                            placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Service", ...\n}`}
                            className="w-full bg-gray-900 text-green-400 font-mono text-[11px] rounded p-2.5 outline-none"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">
                            Injected into &lt;head&gt; as structured data for Google Rich Results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Services List Grid with Search */
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <h1 className="text-2xl font-serif font-black text-navy">
                        Publishing Services Catalog (15 Individual Pages)
                      </h1>
                      <p className="text-gray-500 text-xs mt-1">
                        Click &ldquo;Edit Page Details&rdquo; on any service to customize its benefits, process, FAQs, image, and alt tags.
                      </p>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        placeholder="Search 15 services..."
                        className="bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-navy outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allServicesList
                      .filter(
                        (svc) =>
                          !serviceSearch ||
                          svc.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                          svc.category.toLowerCase().includes(serviceSearch.toLowerCase())
                      )
                      .map((svc, idx) => (
                        <div
                          key={svc.slug || idx}
                          className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4 hover:border-[#2271b1] transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gold uppercase tracking-wider bg-navy px-2 py-0.5 rounded">
                                {svc.category}
                              </span>
                              <Link
                                href={`/services/${svc.slug}`}
                                target="_blank"
                                className="text-gray-400 hover:text-navy text-xs flex items-center gap-1"
                              >
                                <span>Live</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>

                            <div className="aspect-video rounded-lg overflow-hidden bg-navy relative border border-gray-200">
                              <img src={svc.img} alt={svc.title} className="w-full h-full object-cover" />
                            </div>

                            <div>
                              <h3 className="font-serif font-bold text-navy text-base leading-snug">{svc.title}</h3>
                              <p className="text-gray-500 text-xs line-clamp-2 mt-1">{svc.tagline}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-mono">/services/{svc.slug}</span>
                            <button
                              onClick={() => setEditingService({ ...svc })}
                              className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              Edit Page Details
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: HEADER, LOGO & FAVICON ================= */}
          {activeTab === "header_branding" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Header Navigation, Logo &amp; Favicon</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Upload custom brand logo, change browser favicon icon, edit phone number and navigation bar links.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveAll()}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Header &amp; Logo</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-xs">
                {/* Logo Customization Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-serif font-bold text-navy text-base">Website Brand Logo</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      Recommended: 512 x 512 px or SVG
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Custom Logo Image URL (PNG/SVG)</label>
                    <input
                      type="text"
                      value={formData.logo_image_url || ""}
                      onChange={(e) => updateField("logo_image_url", e.target.value)}
                      placeholder="Paste image URL here, or leave empty to use text logo..."
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono outline-none"
                    />
                  </div>

                  {formData.logo_image_url && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-4">
                      <img
                        src={formData.logo_image_url}
                        alt={formData.logo_img_alt || "Logo preview"}
                        className="h-12 w-auto object-contain"
                      />
                      <span className="text-gray-500 text-[11px]">Live Logo Preview</span>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Logo Image Alt Tag</label>
                    <input
                      type="text"
                      value={formData.logo_img_alt || "Beyond Book Publishing Premium Logo"}
                      onChange={(e) => updateField("logo_img_alt", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Brand Name Text</label>
                      <input
                        type="text"
                        value={formData.logo_text || "Beyond Book"}
                        onChange={(e) => updateField("logo_text", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Brand Subtitle Text</label>
                      <input
                        type="text"
                        value={formData.logo_subtext || "Publishing"}
                        onChange={(e) => updateField("logo_subtext", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Browser Favicon Customization Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-serif font-bold text-navy text-base">Browser Favicon Icon</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      Recommended: 32 x 32 or 64 x 64 px (.ico / .png)
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Favicon URL</label>
                    <input
                      type="text"
                      value={formData.favicon_url || "/favicon.ico"}
                      onChange={(e) => updateField("favicon_url", e.target.value)}
                      placeholder="/favicon.ico or custom image URL"
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono outline-none"
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                    <img
                      src={formData.favicon_url || "/favicon.ico"}
                      alt="Favicon"
                      className="w-8 h-8 rounded border border-gray-300 object-contain p-0.5 bg-white shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/favicon.ico";
                      }}
                    />
                    <div>
                      <p className="font-bold text-navy">Browser Tab Icon Preview</p>
                      <p className="text-gray-400 text-[11px]">This icon appears in the browser tab beside the page title.</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Header Top Call-To-Action Button Text</label>
                      <input
                        type="text"
                        value={formData.header_cta_text || "Contact With Our Expert"}
                        onChange={(e) => updateField("header_cta_text", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none font-bold text-navy text-xs"
                      />
                    </div>

                    {/* Header Phone Number Settings */}
                    <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block font-bold text-navy text-xs">Show Phone Number in Header</label>
                          <p className="text-[11px] text-gray-500">Enable or disable the click-to-call phone number across desktop and mobile headers.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(formData.header_show_phone)}
                            onChange={(e) => updateField("header_show_phone", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2271b1]"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1 text-xs">Header Phone Number</label>
                        <input
                          type="text"
                          value={formData.header_phone || ""}
                          onChange={(e) => updateField("header_phone", e.target.value)}
                          placeholder="e.g. +1 (800) 555-0199"
                          className="w-full bg-white border border-gray-300 rounded p-2 outline-none font-bold text-navy text-xs"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          Tip: To hide the phone number completely from the top bar, turn off the switch above or leave this field empty.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= INTERACTIVE NAVIGATION MENU BUILDER ================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-navy text-base">Header Navigation Menu Links</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Customize, reorder, add, or delete the menu navigation links displayed in your website header.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const defaultLinks = [
                        { label: "Home", href: "/" },
                        { label: "About Us", href: "/about" },
                        { label: "Services", href: "/services" },
                        { label: "Portfolio", href: "/portfolio" },
                        { label: "Pricing", href: "/pricing" },
                        { label: "Blog", href: "/blog" },
                        { label: "Testimonials", href: "/testimonials" },
                        { label: "Contact", href: "/contact" },
                      ];
                      updateField("nav_links", defaultLinks);
                    }}
                    className="text-xs text-gray-500 hover:text-navy font-bold flex items-center gap-1 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Standard Navigation</span>
                  </button>
                </div>

                {/* Current Links List */}
                <div className="space-y-3">
                  {(formData.nav_links || []).map((link, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#2271b1] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-navy text-gold text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {lIdx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 sm:hidden">Item #{lIdx + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-xs">
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold block mb-1">Menu Label</label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const list = [...(formData.nav_links || [])];
                              list[lIdx] = { ...list[lIdx], label: e.target.value };
                              updateField("nav_links", list);
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 font-bold text-navy outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold block mb-1">Destination URL</label>
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => {
                              const list = [...(formData.nav_links || [])];
                              list[lIdx] = { ...list[lIdx], href: e.target.value };
                              updateField("nav_links", list);
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono text-gray-700 outline-none"
                          />
                        </div>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center pt-2 sm:pt-0">
                        <button
                          type="button"
                          disabled={lIdx === 0}
                          onClick={() => {
                            if (lIdx === 0) return;
                            const list = [...(formData.nav_links || [])];
                            const temp = list[lIdx - 1];
                            list[lIdx - 1] = list[lIdx];
                            list[lIdx] = temp;
                            updateField("nav_links", list);
                          }}
                          className="p-1.5 text-gray-500 hover:text-navy disabled:opacity-25 rounded bg-white border border-gray-200 cursor-pointer"
                          title="Move Link Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={lIdx === (formData.nav_links || []).length - 1}
                          onClick={() => {
                            const list = [...(formData.nav_links || [])];
                            if (lIdx >= list.length - 1) return;
                            const temp = list[lIdx + 1];
                            list[lIdx + 1] = list[lIdx];
                            list[lIdx] = temp;
                            updateField("nav_links", list);
                          }}
                          className="p-1.5 text-gray-500 hover:text-navy disabled:opacity-25 rounded bg-white border border-gray-200 cursor-pointer"
                          title="Move Link Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const list = (formData.nav_links || []).filter((_, i) => i !== lIdx);
                            updateField("nav_links", list);
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded bg-white border border-gray-200 cursor-pointer ml-1"
                          title="Remove Menu Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Link Card */}
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3 text-xs">
                  <h4 className="font-bold text-navy uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#2271b1]" />
                    <span>Add New Navigation Menu Link</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-600 font-semibold block mb-1">New Link Title / Label</label>
                      <input
                        type="text"
                        value={newMenuLabel}
                        onChange={(e) => setNewMenuLabel(e.target.value)}
                        placeholder="e.g. Free Consultation, Awards, Our Process"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 font-semibold block mb-1">Destination URL (href)</label>
                      <input
                        type="text"
                        value={newMenuHref}
                        onChange={(e) => setNewMenuHref(e.target.value)}
                        placeholder="e.g. /contact, /about/awards, /pricing/combo"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono outline-none focus:border-[#2271b1]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMenuLabel.trim() || !newMenuHref.trim()) {
                        alert("Please specify both link title and URL destination.");
                        return;
                      }
                      const list = [...(formData.nav_links || []), { label: newMenuLabel.trim(), href: newMenuHref.trim() }];
                      updateField("nav_links", list);
                      setNewMenuLabel("");
                      setNewMenuHref("");
                    }}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Header Menu</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: PAGES & CONTENT EDITOR ================= */}
          {activeTab === "pages" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Pages &amp; Custom CMS Content</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Create new custom pages, publish author programs, or customize core copy across your website.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewCustomPage}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Page</span>
                  </button>
                  <button
                    onClick={() => handleSaveAll()}
                    className="bg-navy hover:bg-navy-light text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Page Copy</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs for pages */}
              <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
                {[
                  { id: "custom", label: `Custom Pages (${(formData.custom_pages || []).length})` },
                  { id: "home", label: "Homepage" },
                  { id: "about", label: "About Us" },
                  { id: "services", label: "Services Catalog" },
                  { id: "portfolio", label: "Portfolio Page" },
                  { id: "pricing", label: "Pricing Page" },
                  { id: "testimonials", label: "Testimonials" },
                  { id: "blog", label: "Blog Center" },
                  { id: "contact", label: "Contact Page" },
                  { id: "policies", label: "Legal Policies" },
                  { id: "footer", label: "Footer & Socials" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setPagesSubTab(tab.id as any);
                      if (tab.id !== "custom") setEditingCustomPage(null);
                    }}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      pagesSubTab === tab.id
                        ? "bg-[#2271b1] text-white shadow-xs"
                        : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ================= SUB-TAB: CUSTOM PAGES & NEW PAGE BUILDER ================= */}
              {pagesSubTab === "custom" && (
                <div className="space-y-6">
                  {editingCustomPage ? (
                    /* Page Editor View */
                    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gold/20 text-navy font-bold px-2.5 py-0.5 rounded-full">
                              {isCreatingCustomPage ? "New Page Builder" : "Editing Custom Page"}
                            </span>
                            <span className="text-gray-400 text-xs">·</span>
                            <span className="text-xs font-mono text-gray-500">
                              /{editingCustomPage.slug || "custom-slug"}
                            </span>
                          </div>
                          <h2 className="text-2xl font-serif font-black text-navy mt-1">
                            {editingCustomPage.title || "Untitled Custom Page"}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCustomPage(null);
                              setIsCreatingCustomPage(false);
                            }}
                            className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveCustomPage}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save &amp; Publish Page</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left 2 Cols: Main Page Content */}
                        <div className="md:col-span-2 space-y-5 text-xs">
                          <div>
                            <label className="block font-bold text-gray-700 mb-1 text-xs">
                              Page Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={editingCustomPage.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setEditingCustomPage((prev) => prev ? {
                                  ...prev,
                                  title: newTitle,
                                  slug: isCreatingCustomPage && !prev.slug ? slugifyHeading(newTitle) : prev.slug,
                                } : null);
                              }}
                              placeholder="e.g. Author Fellowship & Publishing Grants"
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 font-serif font-bold text-base text-navy outline-none focus:border-[#2271b1]"
                            />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-bold text-gray-700 mb-1 text-xs">
                                URL Slug (Path) <span className="text-red-500">*</span>
                              </label>
                              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#2271b1]">
                                <span className="px-2.5 text-gray-400 font-mono text-[11px] bg-gray-100 border-r border-gray-300">/</span>
                                <input
                                  type="text"
                                  value={editingCustomPage.slug}
                                  onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") } : null)}
                                  placeholder="author-fellowship"
                                  className="w-full p-2.5 font-mono text-xs bg-transparent outline-none text-navy"
                                />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1">Live URL: https://beyondbookpublishing.com/{editingCustomPage.slug || "slug"}</p>
                            </div>

                            <div>
                              <label className="block font-bold text-gray-700 mb-1 text-xs">Publish Status</label>
                              <select
                                value={editingCustomPage.status}
                                onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, status: e.target.value as any } : null)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                              >
                                <option value="published">🟢 Published (Live on Site)</option>
                                <option value="draft">🟡 Draft (Hidden)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1 text-xs">Hero Section Headline</label>
                            <input
                              type="text"
                              value={editingCustomPage.heroHeadline || ""}
                              onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, heroHeadline: e.target.value } : null)}
                              placeholder="e.g. Empowering Emerging Authors with Dedicated Publishing Grants"
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-semibold text-navy outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1 text-xs">Hero Subheadline / Brief Tagline</label>
                            <input
                              type="text"
                              value={editingCustomPage.heroSubheadline || ""}
                              onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, heroSubheadline: e.target.value } : null)}
                              placeholder="e.g. Learn how our editorial board awards full book formatting, design, and marketing sponsorships."
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-600 outline-none"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block font-bold text-gray-700 text-xs">
                                Page Body Content (Rich Text / Markdown) <span className="text-red-500">*</span>
                              </label>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCustomPage((prev) => prev ? { ...prev, content: (prev.content || "") + "\n\n## New Heading\n" } : null);
                                  }}
                                  className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-navy"
                                >
                                  + H2
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCustomPage((prev) => prev ? { ...prev, content: (prev.content || "") + "\n\n### Sub-heading\n" } : null);
                                  }}
                                  className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-navy"
                                >
                                  + H3
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCustomPage((prev) => prev ? { ...prev, content: (prev.content || "") + "\n\n- Key feature point 1\n- Key feature point 2\n" } : null);
                                  }}
                                  className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-navy"
                                >
                                  + Bullets
                                </button>
                              </div>
                            </div>
                            <textarea
                              rows={14}
                              value={editingCustomPage.content}
                              onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, content: e.target.value } : null)}
                              placeholder="Write your custom page content here. Supports headings, paragraphs, bullet lists, and standard formatting."
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs text-gray-800 leading-relaxed font-mono outline-none focus:border-[#2271b1]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1 text-xs">Page Excerpt / Summary Box</label>
                            <textarea
                              rows={2}
                              value={editingCustomPage.excerpt || ""}
                              onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, excerpt: e.target.value } : null)}
                              placeholder="Short highlighted summary displayed at the top of the article body."
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-700 outline-none"
                            />
                          </div>
                        </div>

                        {/* Right 1 Col: SEO Meta & Navigation Options */}
                        <div className="space-y-5">
                          {/* Navigation Options Card */}
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                            <h4 className="font-bold text-navy text-xs uppercase tracking-wider">Navigation Menu Links</h4>
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editingCustomPage.showInHeaderNav || false}
                                onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, showInHeaderNav: e.target.checked } : null)}
                                className="mt-0.5 rounded text-[#2271b1]"
                              />
                              <span className="text-xs text-gray-700 leading-snug">
                                <strong>Add to Header Navigation Menu</strong>
                                <span className="block text-[11px] text-gray-400">Automatically adds this page as a top link in website navbar.</span>
                              </span>
                            </label>
                          </div>

                          {/* SEO & Meta Suite Card */}
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                            <h4 className="font-bold text-navy text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Search className="w-3.5 h-3.5 text-gold" />
                              <span>Page SEO &amp; Meta Tags</span>
                            </h4>

                            <div>
                              <label className="block font-bold text-gray-700 mb-1 text-[11px]">Meta SEO Title</label>
                              <input
                                type="text"
                                value={editingCustomPage.metaTitle || ""}
                                onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, metaTitle: e.target.value } : null)}
                                placeholder={`${editingCustomPage.title || "Page Title"} | Beyond Book Publishing`}
                                className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-navy outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-gray-700 mb-1 text-[11px]">Meta Description</label>
                              <textarea
                                rows={3}
                                value={editingCustomPage.metaDesc || ""}
                                onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, metaDesc: e.target.value } : null)}
                                placeholder="150-160 characters search engine summary snippet..."
                                className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-700 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-gray-700 mb-1 text-[11px]">Focus Keywords</label>
                              <input
                                type="text"
                                value={editingCustomPage.focusKeywords || ""}
                                onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, focusKeywords: e.target.value } : null)}
                                placeholder="publishing grants, book awards, authors"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-navy outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-gray-700 mb-1 text-[11px]">Custom Schema.org JSON</label>
                              <textarea
                                rows={4}
                                value={editingCustomPage.schemaMarkup || ""}
                                onChange={(e) => setEditingCustomPage((prev) => prev ? { ...prev, schemaMarkup: e.target.value } : null)}
                                placeholder='{"@context":"https://schema.org","@type":"WebPage",...}'
                                className="w-full bg-white border border-gray-300 rounded p-2 text-[10px] font-mono text-gray-700 outline-none"
                              />
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={handleSaveCustomPage}
                              className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Page Changes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCustomPage(null);
                                setIsCreatingCustomPage(false);
                              }}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Back to Page List
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Page Table List View */
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-serif font-bold text-navy text-base">Custom Pages Created</h3>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {(formData.custom_pages || []).length} custom page(s) published on your website. Add new pages any time.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative sm:w-64">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={customPageSearch}
                              onChange={(e) => setCustomPageSearch(e.target.value)}
                              placeholder="Search custom pages..."
                              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-navy outline-none focus:border-[#2271b1]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleOpenNewCustomPage}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add New Page</span>
                          </button>
                        </div>
                      </div>

                      {/* Custom Pages List */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                        {(formData.custom_pages || []).length === 0 ? (
                          <div className="p-12 text-center space-y-3">
                            <div className="w-12 h-12 bg-blue-50 text-[#2271b1] rounded-full flex items-center justify-center mx-auto">
                              <FilePlus className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-navy text-sm">No Custom Pages Added Yet</h4>
                            <p className="text-gray-400 text-xs max-w-md mx-auto">
                              Need a new landing page, author fellowship program, or special announcement? Click "Add New Page" to publish a custom page on your domain with its own URL and SEO settings.
                            </p>
                            <button
                              type="button"
                              onClick={handleOpenNewCustomPage}
                              className="inline-flex items-center gap-1.5 bg-[#2271b1] text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-[#135e96] transition-colors cursor-pointer shadow-xs"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Create First Custom Page</span>
                            </button>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                                <tr>
                                  <th className="p-3.5">Page Title</th>
                                  <th className="p-3.5">URL Path</th>
                                  <th className="p-3.5">Status</th>
                                  <th className="p-3.5">Last Updated</th>
                                  <th className="p-3.5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {(formData.custom_pages || [])
                                  .filter((p) =>
                                    !customPageSearch ||
                                    p.title.toLowerCase().includes(customPageSearch.toLowerCase()) ||
                                    p.slug.toLowerCase().includes(customPageSearch.toLowerCase())
                                  )
                                  .map((page) => (
                                    <tr key={page.id} className="hover:bg-gray-50/80 transition-colors">
                                      <td className="p-3.5 font-bold text-navy">
                                        <div className="flex items-center gap-2">
                                          <FileText className="w-4 h-4 text-[#2271b1]" />
                                          <span>{page.title}</span>
                                        </div>
                                      </td>
                                      <td className="p-3.5 font-mono text-gray-600">
                                        <a
                                          href={`/${page.slug}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[#2271b1] hover:underline flex items-center gap-1"
                                        >
                                          <span>/{page.slug}</span>
                                          <ExternalLink className="w-3 h-3 text-gray-400" />
                                        </a>
                                      </td>
                                      <td className="p-3.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          page.status === "published"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                          {page.status === "published" ? "🟢 Published" : "🟡 Draft"}
                                        </span>
                                      </td>
                                      <td className="p-3.5 text-gray-400">
                                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "Recently"}
                                      </td>
                                      <td className="p-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          <a
                                            href={`/${page.slug}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 text-gray-500 hover:text-navy hover:bg-gray-100 rounded cursor-pointer"
                                            title="View Live Page"
                                          >
                                            <Eye className="w-4 h-4" />
                                          </a>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingCustomPage({ ...page });
                                              setIsCreatingCustomPage(false);
                                            }}
                                            className="p-1.5 text-[#2271b1] hover:bg-blue-50 rounded cursor-pointer"
                                            title="Edit Page"
                                          >
                                            <Edit3 className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSeoActivePage(`custom:${page.slug}`);
                                              setActiveTab("seo");
                                            }}
                                            className="px-2 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded border border-amber-200 cursor-pointer"
                                            title="Configure SEO & Schema"
                                          >
                                            SEO
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateCustomPage(page)}
                                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
                                            title="Duplicate Page"
                                          >
                                            <Copy className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteCustomPage(page.id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                            title="Delete Page"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Homepage Editor */}
              {pagesSubTab === "home" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <h3 className="font-serif font-bold text-navy text-lg border-b border-gray-200 pb-2">
                    Homepage Hero Section
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hero Eyebrow Pill</label>
                      <input
                        type="text"
                        value={formData.hero_eyebrow}
                        onChange={(e) => updateField("hero_eyebrow", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Main H1 Headline</label>
                      <input
                        type="text"
                        value={formData.hero_headline}
                        onChange={(e) => updateField("hero_headline", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-serif font-bold text-lg text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Hero Subtext Description</label>
                      <textarea
                        rows={4}
                        value={formData.hero_subtext}
                        onChange={(e) => updateField("hero_subtext", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 leading-relaxed outline-none"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Rating Score Text</label>
                        <input
                          type="text"
                          value={formData.hero_ratingText}
                          onChange={(e) => updateField("hero_ratingText", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Rating Review Count</label>
                        <input
                          type="text"
                          value={formData.hero_ratingCount}
                          onChange={(e) => updateField("hero_ratingCount", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Us Editor */}
              {pagesSubTab === "about" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <h3 className="font-serif font-bold text-navy text-lg border-b border-gray-200 pb-2">
                    About Us Story &amp; Manifesto
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">About Page Headline</label>
                      <input
                        type="text"
                        value={formData.about_headline}
                        onChange={(e) => updateField("about_headline", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-serif font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Story Paragraph 1</label>
                      <textarea
                        rows={4}
                        value={formData.about_story_p1}
                        onChange={(e) => updateField("about_story_p1", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 leading-relaxed outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Story Paragraph 2</label>
                      <textarea
                        rows={4}
                        value={formData.about_story_p2}
                        onChange={(e) => updateField("about_story_p2", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 leading-relaxed outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Page Editor */}
              {pagesSubTab === "contact" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <h3 className="font-serif font-bold text-navy text-lg border-b border-gray-200 pb-2">
                    Contact Consultation Page
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Contact Page H1 Headline</label>
                      <input
                        type="text"
                        value={formData.seo_contact_h1}
                        onChange={(e) => updateField("seo_contact_h1", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Sidebar Graphic URL</label>
                      <input
                        type="text"
                        value={formData.contact_sidebar_img}
                        onChange={(e) => updateField("contact_sidebar_img", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Sidebar Image Alt Tag</label>
                      <input
                        type="text"
                        value={formData.contact_sidebar_img_alt || "Writer notes and planner"}
                        onChange={(e) => updateField("contact_sidebar_img_alt", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Services Catalog Page Editor */}
              {pagesSubTab === "services" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-serif font-bold text-navy text-lg">
                      Services Catalog Main Page (/services)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("services")}
                      className="text-xs text-[#2271b1] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Manage All 15 Individual Service Pages →</span>
                    </button>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Services Page H1 Main Headline</label>
                      <input
                        type="text"
                        value={formData.seo_services_h1}
                        onChange={(e) => updateField("seo_services_h1", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Services Catalog Intro Description</label>
                      <textarea
                        rows={3}
                        value={formData.seo_services_desc}
                        onChange={(e) => updateField("seo_services_desc", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 outline-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Page Meta Title</label>
                      <input
                        type="text"
                        value={formData.seo_services_title}
                        onChange={(e) => updateField("seo_services_title", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio Page Editor */}
              {pagesSubTab === "portfolio" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-serif font-bold text-navy text-lg">
                      Portfolio Showcase Page (/portfolio)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("portfolio")}
                      className="text-xs text-[#2271b1] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Manage Portfolio Books Catalog ({formData.portfolioBooks?.length || 0}) →</span>
                    </button>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Portfolio Page H1 Headline</label>
                      <input
                        type="text"
                        value={formData.seo_portfolio_h1}
                        onChange={(e) => updateField("seo_portfolio_h1", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Portfolio Intro Subtitle / Description</label>
                      <textarea
                        rows={3}
                        value={formData.seo_portfolio_desc}
                        onChange={(e) => updateField("seo_portfolio_desc", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 outline-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Portfolio Meta Title</label>
                      <input
                        type="text"
                        value={formData.seo_portfolio_title}
                        onChange={(e) => updateField("seo_portfolio_title", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Page Editor */}
              {pagesSubTab === "pricing" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-serif font-bold text-navy text-lg">
                      Pricing &amp; Investment Page (/pricing)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("pricing")}
                      className="text-xs text-[#2271b1] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Edit Individual Pricing Packages →</span>
                    </button>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Pricing Page H1 Headline</label>
                      <input
                        type="text"
                        value={formData.seo_pricing_h1}
                        onChange={(e) => updateField("seo_pricing_h1", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Pricing Guarantee Subtext &amp; Overview</label>
                      <textarea
                        rows={3}
                        value={formData.seo_pricing_desc}
                        onChange={(e) => updateField("seo_pricing_desc", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 outline-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Pricing Meta Title</label>
                      <input
                        type="text"
                        value={formData.seo_pricing_title}
                        onChange={(e) => updateField("seo_pricing_title", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Page Editor */}
              {pagesSubTab === "testimonials" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-serif font-bold text-navy text-lg">
                      Testimonials &amp; Reviews Page (/testimonials)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("testimonials")}
                      className="text-xs text-[#2271b1] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Manage Testimonials List ({formData.testimonials?.length || 0}) →</span>
                    </button>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Testimonials Page H1 Headline</label>
                      <input
                        type="text"
                        value={formData.seo_testimonials_h1}
                        onChange={(e) => updateField("seo_testimonials_h1", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Testimonials Subtext / Intro</label>
                      <textarea
                        rows={3}
                        value={formData.seo_testimonials_desc}
                        onChange={(e) => updateField("seo_testimonials_desc", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 outline-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Testimonials Meta Title</label>
                      <input
                        type="text"
                        value={formData.seo_testimonials_title}
                        onChange={(e) => updateField("seo_testimonials_title", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Blog Resource Center Editor */}
              {pagesSubTab === "blog" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-serif font-bold text-navy text-lg">
                      Blog &amp; Author Guides Center (/blog)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("posts")}
                      className="text-xs text-[#2271b1] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Manage Blog Posts ({formData.blogs?.length || 0}) →</span>
                    </button>
                  </div>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Blog Center H1 Headline</label>
                      <input
                        type="text"
                        value={formData.seo_blog_h1}
                        onChange={(e) => updateField("seo_blog_h1", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Blog Center Subtitle &amp; Description</label>
                      <textarea
                        rows={3}
                        value={formData.seo_blog_desc}
                        onChange={(e) => updateField("seo_blog_desc", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 outline-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Blog Center Meta Title</label>
                      <input
                        type="text"
                        value={formData.seo_blog_title}
                        onChange={(e) => updateField("seo_blog_title", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Policies & Legal Guarantees Editor */}
              {pagesSubTab === "policies" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <h3 className="font-serif font-bold text-navy text-lg border-b border-gray-200 pb-2">
                    Legal Policies &amp; Author Guarantees (/privacy-policy &amp; /terms-of-service)
                  </h3>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-navy">
                      <CheckCircle className="w-4 h-4 text-gold" />
                      <span>Ironclad Author Rights Built-in Guarantee:</span>
                    </p>
                    <p>
                      Beyond Book Publishing guarantees 100% author copyright retention, 100% royalty payments directly to authors, and strict Non-Disclosure Agreement (NDA) confidentiality on all ghostwriting projects.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                      <h4 className="font-bold text-navy">Privacy Policy (/privacy-policy)</h4>
                      <p className="text-gray-500 text-[11px]">
                        Covers GDPR, CCPA, manuscript NDA privacy, and author data encryption.
                      </p>
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        className="text-[#2271b1] font-bold inline-flex items-center gap-1 hover:underline"
                      >
                        <span>View Live Privacy Policy</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                      <h4 className="font-bold text-navy">Terms of Service (/terms-of-service)</h4>
                      <p className="text-gray-500 text-[11px]">
                        Covers publishing distribution imprints, revision rounds, and copyright assignments.
                      </p>
                      <Link
                        href="/terms-of-service"
                        target="_blank"
                        className="text-[#2271b1] font-bold inline-flex items-center gap-1 hover:underline"
                      >
                        <span>View Live Terms of Service</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer & Social Media Links Editor */}
              {pagesSubTab === "footer" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                  <h3 className="font-serif font-bold text-navy text-lg border-b border-gray-200 pb-2">
                    Footer Bio, Office Info &amp; Social Links
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Footer Brand Bio Description</label>
                      <textarea
                        rows={3}
                        value={formData.footer_desc}
                        onChange={(e) => updateField("footer_desc", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-700 outline-none leading-relaxed"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-150">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Facebook URL</label>
                        <input
                          type="text"
                          value={formData.facebook_url}
                          onChange={(e) => updateField("facebook_url", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Twitter / X URL</label>
                        <input
                          type="text"
                          value={formData.twitter_url}
                          onChange={(e) => updateField("twitter_url", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Instagram URL</label>
                        <input
                          type="text"
                          value={formData.instagram_url}
                          onChange={(e) => updateField("instagram_url", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={formData.linkedin_url}
                          onChange={(e) => updateField("linkedin_url", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: MEDIA & IMAGES (WITH DIMENSIONS & ALT TAGS) ================= */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Media Library &amp; Alt Tags</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Control every hero banner, background image, author portrait, and book cover with recommended dimensions and alt tags.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveAll()}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Media</span>
                </button>
              </div>

              {/* Recommended Image Dimensions Cheatsheet */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h3 className="font-serif font-bold text-navy text-sm">
                    Recommended Image Dimensions &amp; Upload Specifications
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">Hero Illustration / Desk</span>
                    <span className="text-blue-700 font-mono font-bold">1920 x 1080 px</span>
                    <p className="text-gray-400 text-[10px]">16:9 ratio, Max 2MB, WebP/PNG</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">Brand Logo</span>
                    <span className="text-blue-700 font-mono font-bold">512 x 512 px / SVG</span>
                    <p className="text-gray-400 text-[10px]">1:1 square, Transparent PNG</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">Browser Favicon</span>
                    <span className="text-blue-700 font-mono font-bold">32x32 or 64x64 px</span>
                    <p className="text-gray-400 text-[10px]">.ico or .png icon</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">Social Share Card (OG)</span>
                    <span className="text-blue-700 font-mono font-bold">1200 x 630 px</span>
                    <p className="text-gray-400 text-[10px]">Facebook &amp; Twitter share</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">Service Banners</span>
                    <span className="text-blue-700 font-mono font-bold">1200 x 675 px</span>
                    <p className="text-gray-400 text-[10px]">16:9 ratio</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">Book Portfolio Covers</span>
                    <span className="text-blue-700 font-mono font-bold">600 x 900 px</span>
                    <p className="text-gray-400 text-[10px]">2:3 portrait book ratio</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">Testimonial Avatars</span>
                    <span className="text-blue-700 font-mono font-bold">400 x 400 px</span>
                    <p className="text-gray-400 text-[10px]">1:1 square face photo</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-1">
                    <span className="font-bold text-navy block">About Lit Books</span>
                    <span className="text-blue-700 font-mono font-bold">800 x 600 px</span>
                    <p className="text-gray-400 text-[10px]">4:3 ratio</p>
                  </div>
                </div>
              </div>

              {/* Core Global Website Images Grid with Alt Tags */}
              <div className="grid md:grid-cols-2 gap-6 text-xs">
                {/* Hero Editorial Desk */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-navy text-sm">Homepage Hero Desk Image</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold font-mono">1920x1080 px</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-navy border border-gray-200">
                    <img src={formData.hero_image_url} alt={formData.hero_image_alt || "Hero desk"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.hero_image_url}
                      onChange={(e) => updateField("hero_image_url", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image Alt Tag (SEO)</label>
                    <input
                      type="text"
                      value={formData.hero_image_alt || "Beyond Book Publishing Editorial Desk"}
                      onChange={(e) => updateField("hero_image_alt", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>

                {/* About Banner Image */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-navy text-sm">About Us Classical Lit Books Graphic</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold font-mono">800x600 px</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-navy border border-gray-200">
                    <img src={formData.about_intro_img} alt={formData.about_intro_img_alt || "About books"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.about_intro_img}
                      onChange={(e) => updateField("about_intro_img", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image Alt Tag (SEO)</label>
                    <input
                      type="text"
                      value={formData.about_intro_img_alt || "Stack of hardcover classical lit books"}
                      onChange={(e) => updateField("about_intro_img_alt", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>

                {/* OpenGraph Social Card Image */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-navy text-sm">OpenGraph Social Share Card (1200x630)</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold font-mono">1200x630 px</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-navy border border-gray-200">
                    <img src={formData.og_image_url} alt={formData.og_image_alt || "OG Card"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.og_image_url}
                      onChange={(e) => updateField("og_image_url", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image Alt Tag (SEO)</label>
                    <input
                      type="text"
                      value={formData.og_image_alt || "Beyond Book Publishing Author-First Services Share Card"}
                      onChange={(e) => updateField("og_image_alt", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>

                {/* Contact Sidebar Image */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-navy text-sm">Contact Page Sidebar Graphic</h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold font-mono">600x800 px</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-navy border border-gray-200">
                    <img src={formData.contact_sidebar_img} alt={formData.contact_sidebar_img_alt || "Contact coffee"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.contact_sidebar_img}
                      onChange={(e) => updateField("contact_sidebar_img", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Image Alt Tag (SEO)</label>
                    <input
                      type="text"
                      value={formData.contact_sidebar_img_alt || "Writer notes and planner beside cup of hot coffee"}
                      onChange={(e) => updateField("contact_sidebar_img_alt", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: PRICING PACKAGES ================= */}
          {activeTab === "pricing" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Pricing &amp; Packages Manager</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Customize package rates, badges, and included features for all 5 publishing categories.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveAll()}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Packages</span>
                </button>
              </div>

              {Object.entries(formData.pricingPackages || {}).map(([catName, pkgListRaw]) => {
                const pkgList = (pkgListRaw || []) as PricingPackageItem[];
                return (
                  <div key={catName} className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <h3 className="text-lg font-serif font-bold text-navy">{catName} Tier Packages</h3>
                      <span className="text-xs bg-gold/20 text-navy font-bold px-2 py-0.5 rounded">
                        {pkgList.length} Packages
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pkgList.map((pkg, pIdx) => (
                        <div key={pIdx} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="block text-gray-500 font-bold mb-1">Package Name</label>
                              <input
                                type="text"
                                value={pkg.name}
                                onChange={(e) => {
                                  const newMap = { ...formData.pricingPackages };
                                  newMap[catName][pIdx].name = e.target.value;
                                  updateField("pricingPackages", newMap);
                                }}
                                className="w-full bg-white border border-gray-300 rounded p-1.5 text-navy font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-500 font-bold mb-1">Price</label>
                              <input
                                type="text"
                                value={pkg.price}
                                onChange={(e) => {
                                  const newMap = { ...formData.pricingPackages };
                                  newMap[catName][pIdx].price = e.target.value;
                                  updateField("pricingPackages", newMap);
                                }}
                                className="w-full bg-white border border-gray-300 rounded p-1.5 text-gold font-bold font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-500 font-bold text-xs mb-1">Badge (Optional)</label>
                            <input
                              type="text"
                              value={pkg.badge || ""}
                              onChange={(e) => {
                                const newMap = { ...formData.pricingPackages };
                                newMap[catName][pIdx].badge = e.target.value;
                                updateField("pricingPackages", newMap);
                              }}
                              placeholder="e.g. Most Popular"
                              className="w-full bg-white border border-gray-300 rounded p-1.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-500 font-bold text-xs mb-1">
                              Features (one per line)
                            </label>
                            <textarea
                              rows={4}
                              value={pkg.features.join("\n")}
                              onChange={(e) => {
                                const newMap = { ...formData.pricingPackages };
                                newMap[catName][pIdx].features = e.target.value.split("\n").filter(Boolean);
                                updateField("pricingPackages", newMap);
                              }}
                              className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= TAB: TESTIMONIALS MANAGER ================= */}
          {activeTab === "testimonials" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Author Testimonials &amp; Reviews</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Add, edit, or remove author reviews displayed across the website and /testimonials page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewTestimonial}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                  <button
                    onClick={() => handleSaveAll()}
                    className="bg-gold hover:bg-yellow-400 text-navy text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {editingTestimonial ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 max-w-2xl">
                  <h3 className="font-serif font-bold text-navy text-lg border-b border-gray-200 pb-2">
                    {isCreatingTestimonial ? "Add New Testimonial" : `Edit: ${editingTestimonial.name}`}
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Author Name</label>
                      <input
                        type="text"
                        value={editingTestimonial.name}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-navy font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Book Title / Author Role</label>
                      <input
                        type="text"
                        value={editingTestimonial.title}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Avatar Image URL (400 x 400 px)</label>
                      <input
                        type="text"
                        value={editingTestimonial.avatar}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Review Quote</label>
                      <textarea
                        rows={4}
                        value={editingTestimonial.quote}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm text-gray-700 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveTestimonial}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded cursor-pointer"
                    >
                      {isCreatingTestimonial ? "Add Review" : "Update Review"}
                    </button>
                    <button
                      onClick={() => setEditingTestimonial(null)}
                      className="bg-gray-100 text-gray-700 text-xs font-bold px-4 py-2 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(formData.testimonials || []).map((t, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-12 h-12 rounded-full object-cover border border-gold"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-navy text-sm">{t.name}</h4>
                            <p className="text-[11px] text-gray-400 font-semibold">{t.title}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 italic leading-relaxed">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setEditingTestimonial({ ...t });
                            setIsCreatingTestimonial(false);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded border border-[#2271b1]/30 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: PORTFOLIO BOOKS ================= */}
          {activeTab === "portfolio" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Curated Books Portfolio</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Manage published books and cover artwork on the /portfolio gallery.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewBook}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Book</span>
                  </button>
                  <button
                    onClick={() => handleSaveAll()}
                    className="bg-gold hover:bg-yellow-400 text-navy text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {editingBook ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 max-w-2xl">
                  <h3 className="font-serif font-bold text-navy text-lg border-b border-gray-200 pb-2">
                    {isCreatingBook ? "Add Portfolio Book" : `Edit: ${editingBook.title}`}
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Book Title</label>
                      <input
                        type="text"
                        value={editingBook.title}
                        onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-navy font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Author Name</label>
                      <input
                        type="text"
                        value={editingBook.author}
                        onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Genre / Category</label>
                      <input
                        type="text"
                        value={editingBook.genre}
                        onChange={(e) => setEditingBook({ ...editingBook, genre: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Cover Artwork URL (600 x 900 px)</label>
                      <input
                        type="text"
                        value={editingBook.img}
                        onChange={(e) => setEditingBook({ ...editingBook, img: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveBook}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded cursor-pointer"
                    >
                      {isCreatingBook ? "Add Book" : "Update Book"}
                    </button>
                    <button
                      onClick={() => setEditingBook(null)}
                      className="bg-gray-100 text-gray-700 text-xs font-bold px-4 py-2 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {(formData.portfolioBooks || []).map((book, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-xs p-3 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-navy relative border border-gray-200 shadow-xs">
                          <img src={book.img} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-serif font-bold text-navy text-xs leading-snug line-clamp-2">{book.title}</h4>
                        <p className="text-[11px] text-gray-500 font-semibold">{book.author}</p>
                        <span className="text-[10px] bg-gold/15 text-navy font-bold px-2 py-0.5 rounded inline-block">
                          {book.genre}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setEditingBook({ ...book });
                            setIsCreatingBook(false);
                          }}
                          className="px-2 py-0.5 text-[11px] font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded border border-[#2271b1]/30 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: COMPLETE SEO OPTIONS SUITE ================= */}
          {activeTab === "seo" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Complete SEO &amp; Meta Suite (Custom Dashboard)</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Manage meta titles, descriptions, focus keywords, image alt tags, canonical tags, and schema for every single page, service, and blog post.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveAll()}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All SEO Settings</span>
                </button>
              </div>

              {/* Page, Service & Blog Selector */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">
                      Select Page To Configure SEO &amp; Schema ({8 + allServicesList.length + allBlogsList.length} Total Pages)
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Currently editing: <strong className="text-navy">{currentSeoPageData.pageLabel}</strong>
                    </p>
                  </div>
                  <div className="relative sm:w-64">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={seoSearchFilter}
                      onChange={(e) => setSeoSearchFilter(e.target.value)}
                      placeholder="Filter pages, services, blogs..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-navy outline-none focus:border-[#2271b1]"
                    />
                  </div>
                </div>

                {/* 1. Core Pages */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    1. Core Website Pages (8 Pages):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "home", label: "Homepage", slug: "/" },
                      { id: "about", label: "About Us", slug: "/about" },
                      { id: "services", label: "Services Hub", slug: "/services" },
                      { id: "portfolio", label: "Portfolio", slug: "/portfolio" },
                      { id: "pricing", label: "Pricing", slug: "/pricing" },
                      { id: "blog", label: "Blog Catalog", slug: "/blog" },
                      { id: "testimonials", label: "Testimonials", slug: "/testimonials" },
                      { id: "contact", label: "Contact", slug: "/contact" },
                    ]
                      .filter((p) => !seoSearchFilter || p.label.toLowerCase().includes(seoSearchFilter.toLowerCase()))
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSeoActivePage(p.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            seoActivePage === p.id
                              ? "bg-[#2271b1] text-white shadow-xs"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                  </div>
                </div>

                {/* 2. All 15 Service Pages */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      2. All Specific Service Detail Pages ({allServicesList.length} Services):
                    </label>
                    <span className="text-[10px] text-gray-500 font-medium">
                      Select any service to customize Google Title, Meta Description, Keywords &amp; Schema
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    {allServicesList
                      .filter(
                        (s) =>
                          !seoSearchFilter ||
                          s.title.toLowerCase().includes(seoSearchFilter.toLowerCase()) ||
                          s.slug.toLowerCase().includes(seoSearchFilter.toLowerCase())
                      )
                      .map((s) => {
                        const isSel = seoActivePage === `service:${s.slug}`;
                        return (
                          <button
                            key={s.slug}
                            type="button"
                            onClick={() => setSeoActivePage(`service:${s.slug}`)}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSel
                                ? "bg-navy text-gold font-bold shadow-xs border border-gold"
                                : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            <span>{s.title}</span>
                            {s.schemaMarkup && (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Has custom schema" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* 3. All Blog Post Pages */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      3. All Blog Posts &amp; Guides ({allBlogsList.length} Articles):
                    </label>
                    <span className="text-[10px] text-gray-500 font-medium">
                      Customize SEO metadata and Article Schema for individual guides
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    {allBlogsList
                      .filter(
                        (b) =>
                          !seoSearchFilter ||
                          b.title.toLowerCase().includes(seoSearchFilter.toLowerCase()) ||
                          b.slug.toLowerCase().includes(seoSearchFilter.toLowerCase())
                      )
                      .map((b) => {
                        const isSel = seoActivePage === `blog:${b.slug}`;
                        return (
                          <button
                            key={b.slug}
                            type="button"
                            onClick={() => setSeoActivePage(`blog:${b.slug}`)}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSel
                                ? "bg-[#2271b1] text-white font-bold shadow-xs"
                                : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            <span className="truncate max-w-[200px]">{b.title}</span>
                            {b.schemaMarkup && (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Has custom schema" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* 4. Custom Website Pages */}
                {(formData.custom_pages || []).length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-navy uppercase tracking-wider">
                        4. Custom Website Pages ({(formData.custom_pages || []).length} Pages):
                      </label>
                      <span className="text-[10px] text-gray-500 font-medium">
                        Custom created pages with individual URL slugs, meta tags &amp; schema
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-gray-50 rounded-lg border border-gray-200">
                      {(formData.custom_pages || [])
                        .filter(
                          (p) =>
                            !seoSearchFilter ||
                            p.title.toLowerCase().includes(seoSearchFilter.toLowerCase()) ||
                            p.slug.toLowerCase().includes(seoSearchFilter.toLowerCase())
                        )
                        .map((p) => {
                          const isSel = seoActivePage === `custom:${p.slug}`;
                          return (
                            <button
                              key={p.slug}
                              type="button"
                              onClick={() => setSeoActivePage(`custom:${p.slug}`)}
                              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSel
                                  ? "bg-navy text-white font-bold shadow-xs border border-gold"
                                  : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5 text-gold" />
                              <span className="truncate max-w-[200px]">{p.title}</span>
                              {p.schemaMarkup && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Has custom schema" />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Google Search SERP Snippet Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#2271b1]" />
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">
                      Google SERP Snippet Preview: {currentSeoPageData.pageLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setSerpDevice("desktop")}
                      className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                        serpDevice === "desktop" ? "bg-white text-navy font-bold shadow-xs" : "text-gray-500"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpDevice("mobile")}
                      className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                        serpDevice === "mobile" ? "bg-white text-navy font-bold shadow-xs" : "text-gray-500"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                <div
                  className={`bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1 ${
                    serpDevice === "mobile" ? "max-w-md border-gray-300" : "max-w-2xl"
                  }`}
                >
                  <div className="text-[12px] text-[#202124] flex items-center gap-1 font-mono">
                    <Globe className="w-3 h-3 text-gray-400" />
                    <span>https://beyondbookpublishing.com{currentSeoPageData.slug === "/" ? "" : currentSeoPageData.slug}</span>
                  </div>
                  <div className="text-[18px] text-[#1a0dab] font-medium leading-snug hover:underline cursor-pointer">
                    {currentSeoPageData.title || "Page Title Here"}
                  </div>
                  <div className="text-[13px] text-[#4d5156] leading-relaxed">
                    {currentSeoPageData.desc || "Meta description here describing your services..."}
                  </div>
                </div>
              </div>

              {/* Selected Page / Service / Blog SEO Fields */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-navy text-lg">
                      SEO &amp; Meta Details: {currentSeoPageData.pageLabel}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Canonical path: {currentSeoPageData.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentSeoPageData.isService && (
                      <span className="text-xs bg-gold/20 text-navy font-bold px-2.5 py-1 rounded-full">
                        Service Specific SEO
                      </span>
                    )}
                    {currentSeoPageData.isBlog && (
                      <span className="text-xs bg-blue-100 text-[#2271b1] font-bold px-2.5 py-1 rounded-full">
                        Blog Post SEO
                      </span>
                    )}
                    <Link
                      href={currentSeoPageData.slug}
                      target="_blank"
                      className="text-xs text-navy font-bold bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded flex items-center gap-1"
                    >
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-gray-700">SEO Title Tag (&lt;title&gt;)</label>
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getLengthBadge((currentSeoPageData.title || "").length, 30, 60).color}`}>
                      {getLengthBadge((currentSeoPageData.title || "").length, 30, 60).text}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentSeoPageData.title || ""}
                    onChange={(e) => {
                      if (currentSeoPageData.isService && currentSeoPageData.serviceSlug) {
                        updateServiceField(currentSeoPageData.serviceSlug, "metaTitle", e.target.value);
                      } else if (currentSeoPageData.isBlog && currentSeoPageData.blogSlug) {
                        updateBlogField(currentSeoPageData.blogSlug, "metaTitle", e.target.value);
                      } else if (currentSeoPageData.isCustomPage && currentSeoPageData.customPageSlug) {
                        updateCustomPageField(currentSeoPageData.customPageSlug, "metaTitle", e.target.value);
                      } else {
                        updateField(currentSeoPageData.titleKey, e.target.value);
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold text-navy outline-none focus:border-[#2271b1]"
                  />
                  <p className="text-[11px] text-gray-400">
                    Recommended length: 50 - 60 characters. Clickable headline on Google results.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-gray-700">Meta Description</label>
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getLengthBadge((currentSeoPageData.desc || "").length, 80, 160).color}`}>
                      {getLengthBadge((currentSeoPageData.desc || "").length, 80, 160).text}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={currentSeoPageData.desc || ""}
                    onChange={(e) => {
                      if (currentSeoPageData.isService && currentSeoPageData.serviceSlug) {
                        updateServiceField(currentSeoPageData.serviceSlug, "metaDesc", e.target.value);
                      } else if (currentSeoPageData.isBlog && currentSeoPageData.blogSlug) {
                        updateBlogField(currentSeoPageData.blogSlug, "metaDesc", e.target.value);
                      } else if (currentSeoPageData.isCustomPage && currentSeoPageData.customPageSlug) {
                        updateCustomPageField(currentSeoPageData.customPageSlug, "metaDesc", e.target.value);
                      } else {
                        updateField(currentSeoPageData.descKey, e.target.value);
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-700 outline-none focus:border-[#2271b1]"
                  />
                  <p className="text-[11px] text-gray-400">
                    Recommended length: 140 - 160 characters. Appears as search summary snippet.
                  </p>
                </div>

                {/* If Service: Offer focus keywords, image alt, and custom schema */}
                {currentSeoPageData.isService && currentSeoPageData.serviceSlug && (
                  <div className="space-y-4 pt-3 border-t border-gray-150">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Focus Keywords (e.g. ghostwriting, manuscript editing)
                        </label>
                        <input
                          type="text"
                          value={currentSeoPageData.keywords || ""}
                          onChange={(e) =>
                            updateServiceField(currentSeoPageData.serviceSlug!, "focusKeywords", e.target.value)
                          }
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Service Featured Image Alt Tag
                        </label>
                        <input
                          type="text"
                          value={currentSeoPageData.imgAlt || ""}
                          onChange={(e) =>
                            updateServiceField(currentSeoPageData.serviceSlug!, "imgAlt", e.target.value)
                          }
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          Specific Schema.org JSON-LD Structured Data
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const svc = currentSeoPageData.service;
                            const defaultSchema = JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": "Service",
                              "name": `${svc?.title || "Book Service"} - Beyond Book Publishing`,
                              "serviceType": svc?.title,
                              "provider": {
                                "@type": "Organization",
                                "name": "Beyond Book Publishing",
                                "url": "https://beyondbookpublishing.com"
                              },
                              "description": svc?.description || svc?.tagline,
                              "areaServed": "Global",
                              "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD",
                                "description": "Free publishing proposal and consultation"
                              }
                            }, null, 2);
                            updateServiceField(currentSeoPageData.serviceSlug!, "schemaMarkup", defaultSchema);
                          }}
                          className="text-[11px] text-[#2271b1] font-bold hover:underline cursor-pointer"
                        >
                          Generate Service Schema Template
                        </button>
                      </div>
                      <textarea
                        rows={6}
                        value={currentSeoPageData.schema || ""}
                        onChange={(e) =>
                          updateServiceField(currentSeoPageData.serviceSlug!, "schemaMarkup", e.target.value)
                        }
                        placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Service", ...\n}`}
                        className="w-full bg-gray-900 text-green-400 font-mono text-[11px] rounded-lg p-3 outline-none"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Injected as &lt;script type=&quot;application/ld+json&quot;&gt; specifically on this service page.
                      </p>
                    </div>
                  </div>
                )}

                {/* If Blog Post: Offer focus keywords, image alt, and custom article schema */}
                {currentSeoPageData.isBlog && currentSeoPageData.blogSlug && (
                  <div className="space-y-4 pt-3 border-t border-gray-150">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Article Focus Keywords (e.g. self-publishing guide, royalties)
                        </label>
                        <input
                          type="text"
                          value={currentSeoPageData.keywords || ""}
                          onChange={(e) =>
                            updateBlogField(currentSeoPageData.blogSlug!, "focusKeywords", e.target.value)
                          }
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Featured Post Image Alt Tag
                        </label>
                        <input
                          type="text"
                          value={currentSeoPageData.imgAlt || ""}
                          onChange={(e) =>
                            updateBlogField(currentSeoPageData.blogSlug!, "imgAlt", e.target.value)
                          }
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          Article Schema.org JSON-LD Structured Data
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const b = currentSeoPageData.blog;
                            const defaultBlogSchema = JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": "BlogPosting",
                              "headline": b?.title || "Publishing Article",
                              "description": b?.excerpt,
                              "image": b?.img || "https://beyondbookpublishing.com/hero.jpg",
                              "datePublished": b?.date,
                              "author": {
                                "@type": "Person",
                                "name": b?.author || "Editorial Guild",
                                "jobTitle": b?.authorRole || "Senior Publishing Editor"
                              },
                              "publisher": {
                                "@type": "Organization",
                                "name": "Beyond Book Publishing",
                                "url": "https://beyondbookpublishing.com",
                                "logo": "https://beyondbookpublishing.com/favicon.ico"
                              },
                              "mainEntityOfPage": `https://beyondbookpublishing.com/blog/${b?.slug}`
                            }, null, 2);
                            updateBlogField(currentSeoPageData.blogSlug!, "schemaMarkup", defaultBlogSchema);
                          }}
                          className="text-[11px] text-[#2271b1] font-bold hover:underline cursor-pointer"
                        >
                          Generate BlogPosting Schema Template
                        </button>
                      </div>
                      <textarea
                        rows={6}
                        value={currentSeoPageData.schema || ""}
                        onChange={(e) =>
                          updateBlogField(currentSeoPageData.blogSlug!, "schemaMarkup", e.target.value)
                        }
                        placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting", ...\n}`}
                        className="w-full bg-gray-900 text-green-400 font-mono text-[11px] rounded-lg p-3 outline-none"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Injected as &lt;script type=&quot;application/ld+json&quot;&gt; specifically on this article.
                      </p>
                    </div>
                  </div>
                )}

                {/* If Custom Page: Offer focus keywords and custom WebPage schema */}
                {currentSeoPageData.isCustomPage && currentSeoPageData.customPageSlug && (
                  <div className="space-y-4 pt-3 border-t border-gray-150">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Page Focus Keywords
                      </label>
                      <input
                        type="text"
                        value={currentSeoPageData.keywords || ""}
                        onChange={(e) =>
                          updateCustomPageField(currentSeoPageData.customPageSlug!, "focusKeywords", e.target.value)
                        }
                        placeholder="e.g. author grants, publishing fellowships"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">
                          Custom Page Schema.org JSON-LD
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const cp = currentSeoPageData.customPage;
                            const defaultSchema = JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": "WebPage",
                              "name": cp?.title || "Custom Page",
                              "description": cp?.metaDesc || cp?.excerpt || cp?.title,
                              "url": `https://beyondbookpublishing.com/${cp?.slug}`,
                              "publisher": {
                                "@type": "Organization",
                                "name": "Beyond Book Publishing",
                                "url": "https://beyondbookpublishing.com"
                              }
                            }, null, 2);
                            updateCustomPageField(currentSeoPageData.customPageSlug!, "schemaMarkup", defaultSchema);
                          }}
                          className="text-[11px] text-[#2271b1] font-bold hover:underline cursor-pointer"
                        >
                          Generate WebPage Schema Template
                        </button>
                      </div>
                      <textarea
                        rows={6}
                        value={currentSeoPageData.schema || ""}
                        onChange={(e) =>
                          updateCustomPageField(currentSeoPageData.customPageSlug!, "schemaMarkup", e.target.value)
                        }
                        placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage", ...\n}`}
                        className="w-full bg-gray-900 text-green-400 font-mono text-[11px] rounded-lg p-3 outline-none"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Injected as &lt;script type=&quot;application/ld+json&quot;&gt; specifically on this custom page.
                      </p>
                    </div>
                  </div>
                )}

                {/* If Core Page: Primary H1 tag */}
                {!currentSeoPageData.isService && !currentSeoPageData.isBlog && !currentSeoPageData.isCustomPage && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Primary Page H1 Tag</label>
                    <input
                      type="text"
                      value={currentSeoPageData.h1 || ""}
                      onChange={(e) => updateField(currentSeoPageData.h1Key, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-serif font-bold text-navy outline-none"
                    />
                  </div>
                )}
              </div>

              {/* ================= GOOGLE SEARCH CONSOLE & ANALYTICS INTEGRATION ================= */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Google Search Console Connect */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        GSC
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-navy text-sm">
                          Google Search Console (GSC) Connect
                        </h3>
                        <p className="text-[11px] text-gray-400">Domain verification &amp; sitemap submission</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        formData.gsc_verification_id
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {formData.gsc_verification_id ? "✓ Tag Connected" : "Not Verified"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="block font-bold text-gray-700">
                      HTML Verification Code / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.gsc_verification_id || ""}
                      onChange={(e) => updateField("gsc_verification_id", e.target.value)}
                      placeholder="e.g. google-site-verification=abc123xyz OR verification token"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-mono text-xs outline-none focus:border-[#2271b1]"
                    />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      In Search Console, choose <strong>HTML tag</strong> method. Paste your meta tag code or verification token here. Beyond Book Publishing will automatically inject &lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt; across all site pages.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-3 text-xs">
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-navy hover:bg-gold hover:text-navy text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Open Search Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      className="text-[#2271b1] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Submit /sitemap.xml</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Google Analytics & GTM Code */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                        GA4
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-navy text-sm">
                          Google Analytics &amp; Tracking Codes
                        </h3>
                        <p className="text-[11px] text-gray-400">GA4, Tag Manager &amp; header scripts</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        formData.google_analytics_id
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formData.google_analytics_id ? "GA4 Active" : "No GA4"}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Google Analytics 4 (GA4) Measurement ID
                      </label>
                      <input
                        type="text"
                        value={formData.google_analytics_id || ""}
                        onChange={(e) => updateField("google_analytics_id", e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono text-xs outline-none focus:border-[#2271b1]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Google Tag Manager (GTM) Container ID
                      </label>
                      <input
                        type="text"
                        value={formData.gtm_container_id || ""}
                        onChange={(e) => updateField("gtm_container_id", e.target.value)}
                        placeholder="GTM-XXXXXXX"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 font-mono text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= XML SITEMAP MANAGER & UPLOAD ================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-navy text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gold" />
                      <span>XML Sitemap &amp; Robots.txt Manager</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      View, generate, upload, and customize your search crawler sitemap and robots directives.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      className="bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live /sitemap.xml</span>
                    </a>
                    <a
                      href="/robots.txt"
                      target="_blank"
                      className="bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View /robots.txt</span>
                    </a>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 text-xs">
                  {/* Sitemap Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-navy uppercase tracking-wider">
                        Custom XML Sitemap
                      </label>

                      <div className="flex items-center gap-2">
                        {/* Upload XML file button */}
                        <label className="bg-[#2271b1] hover:bg-[#135e96] text-white text-[11px] font-bold px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>Upload .xml</span>
                          <input
                            type="file"
                            accept=".xml,text/xml"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const xmlContent = event.target?.result as string;
                                if (xmlContent) {
                                  updateField("custom_sitemap_xml", xmlContent);
                                  setSitemapUploadFeedback(`Uploaded ${file.name} successfully! Click 'Save All SEO Settings' to persist.`);
                                }
                              };
                              reader.readAsText(file);
                            }}
                          />
                        </label>

                        {/* Generate Dynamic Sitemap */}
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date().toISOString().split("T")[0];
                            const corePages = [
                              { loc: "https://beyondbookpublishing.com/", prio: "1.0", freq: "weekly" },
                              { loc: "https://beyondbookpublishing.com/about", prio: "0.9", freq: "monthly" },
                              { loc: "https://beyondbookpublishing.com/services", prio: "0.9", freq: "weekly" },
                              { loc: "https://beyondbookpublishing.com/portfolio", prio: "0.85", freq: "weekly" },
                              { loc: "https://beyondbookpublishing.com/pricing", prio: "0.85", freq: "monthly" },
                              { loc: "https://beyondbookpublishing.com/testimonials", prio: "0.8", freq: "monthly" },
                              { loc: "https://beyondbookpublishing.com/contact", prio: "0.85", freq: "monthly" },
                              { loc: "https://beyondbookpublishing.com/blog", prio: "0.9", freq: "daily" },
                            ];
                            const servicePages = (formData.services || []).map((s) => ({
                              loc: `https://beyondbookpublishing.com/services/${s.slug}`,
                              prio: "0.85",
                              freq: "weekly",
                            }));
                            const blogPages = (formData.blogs || []).map((b) => ({
                              loc: `https://beyondbookpublishing.com/blog/${b.slug}`,
                              prio: "0.8",
                              freq: "weekly",
                            }));
                            const allUrls = [...corePages, ...servicePages, ...blogPages];
                            const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
                              .map(
                                (u) =>
                                  `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.prio}</priority>\n  </url>`
                              )
                              .join("\n")}\n</urlset>`;
                            updateField("custom_sitemap_xml", xml);
                            setSitemapUploadFeedback(`Generated fresh dynamic sitemap with ${allUrls.length} pages (all 15 services + blogs)!`);
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-navy text-[11px] font-bold px-2.5 py-1 rounded cursor-pointer"
                        >
                          Generate Fresh XML
                        </button>
                      </div>
                    </div>

                    {sitemapUploadFeedback && (
                      <div className="p-2 bg-green-50 border border-green-200 text-green-800 text-[11px] rounded font-medium">
                        {sitemapUploadFeedback}
                      </div>
                    )}

                    <textarea
                      rows={8}
                      value={formData.custom_sitemap_xml || ""}
                      onChange={(e) => updateField("custom_sitemap_xml", e.target.value)}
                      placeholder="Upload an XML sitemap or click 'Generate Fresh XML' to build one automatically..."
                      className="w-full bg-gray-900 text-blue-300 font-mono text-[11px] rounded-lg p-3 outline-none"
                    />

                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Served live at /sitemap.xml for Google, Bing &amp; Yahoo bots</span>
                      {formData.custom_sitemap_xml && (
                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob([formData.custom_sitemap_xml || ""], { type: "application/xml" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "sitemap.xml";
                            a.click();
                          }}
                          className="text-[#2271b1] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download sitemap.xml</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Robots.txt Editor */}
                  <div className="space-y-3">
                    <label className="block font-bold text-navy uppercase tracking-wider">
                      Robots.txt Crawl Directives
                    </label>

                    <textarea
                      rows={8}
                      value={formData.custom_robots_txt || "User-agent: *\nAllow: /\nSitemap: https://beyondbookpublishing.com/sitemap.xml"}
                      onChange={(e) => updateField("custom_robots_txt", e.target.value)}
                      className="w-full bg-gray-900 text-gray-200 font-mono text-[11px] rounded-lg p-3 outline-none"
                    />

                    <p className="text-[11px] text-gray-500">
                      Configures crawler permissions. Served live at <code>/robots.txt</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= STRUCTURED DATA SCHEMA.ORG JSON-LD ================= */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-navy text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold" />
                      <span>Global Schema.org JSON-LD Structured Data</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enables Google Knowledge Graph cards, Rich Results, and organization badges.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          JSON.parse(formData.custom_schema_json || "{}");
                          setSchemaValidationStatus("valid");
                        } catch (err) {
                          setSchemaValidationStatus("invalid");
                        }
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Validate JSON Syntax
                    </button>

                    {schemaValidationStatus === "valid" && (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Valid JSON-LD</span>
                      </span>
                    )}

                    {schemaValidationStatus === "invalid" && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Invalid JSON Syntax</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-[11px]">Global Organization &amp; WebSite Structured Data:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const org = JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Beyond Book Publishing",
                            "alternateName": "BeyondBookPublishing",
                            "url": "https://beyondbookpublishing.com",
                            "logo": "https://beyondbookpublishing.com/favicon.ico",
                            "description": "Author-first publishing house offering ghostwriting, editing, and distribution with 100% royalty retention.",
                            "contactPoint": {
                              "@type": "ContactPoint",
                              "telephone": "+1-800-555-0199",
                              "contactType": "customer service",
                              "areaServed": "US",
                              "availableLanguage": "en"
                            },
                            "sameAs": [
                              formData.facebook_url,
                              formData.twitter_url,
                              formData.instagram_url,
                              formData.linkedin_url
                            ].filter(Boolean)
                          }, null, 2);
                          updateField("custom_schema_json", org);
                          setSchemaValidationStatus("valid");
                        }}
                        className="text-[11px] text-[#2271b1] hover:underline font-bold cursor-pointer"
                      >
                        Reset to Organization Schema
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={10}
                    value={formData.custom_schema_json || ""}
                    onChange={(e) => {
                      updateField("custom_schema_json", e.target.value);
                      setSchemaValidationStatus("idle");
                    }}
                    className="w-full bg-gray-900 text-gold font-mono text-[11px] rounded-lg p-3 outline-none"
                  />
                  <p className="text-[11px] text-gray-400">
                    Injected dynamically into document &lt;head&gt; across the website as &lt;script type=&quot;application/ld+json&quot;&gt;.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: CONTACT COORDINATES ================= */}
          {activeTab === "contact" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Contact Info &amp; Social Links</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Update phone numbers, contact email, physical office address, and social links.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveAll()}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact Details</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="grid md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone_number}
                      onChange={(e) => updateField("phone_number", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => updateField("contact_email", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-navy outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Office Address</label>
                    <input
                      type="text"
                      value={formData.office_address}
                      onChange={(e) => updateField("office_address", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-800 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Working Hours</label>
                    <input
                      type="text"
                      value={formData.working_hours}
                      onChange={(e) => updateField("working_hours", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-800 outline-none"
                    />
                  </div>
                </div>

                <h3 className="font-serif font-bold text-navy text-lg border-t border-gray-200 pt-6 pb-2">
                  Social Media Links
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      value={formData.facebook_url}
                      onChange={(e) => updateField("facebook_url", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Twitter / X URL</label>
                    <input
                      type="text"
                      value={formData.twitter_url}
                      onChange={(e) => updateField("twitter_url", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={formData.instagram_url}
                      onChange={(e) => updateField("instagram_url", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={formData.linkedin_url}
                      onChange={(e) => updateField("linkedin_url", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: LEADS / INQUIRIES ================= */}
          {activeTab === "leads" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-serif font-black text-navy">Customer Inquiries &amp; Leads</h1>
                  <p className="text-gray-500 text-xs mt-1">
                    Incoming author requests from contact forms and quote estimation tools.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchLeads}
                    className="bg-gray-100 hover:bg-gray-200 text-navy text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">
                    {leads.length} Total Inquiries Captured
                  </span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search inquiries..."
                      className="bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-1 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider">
                        <th className="p-3.5">Name</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">Source</th>
                        <th className="p-3.5">Message / Details</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">
                            No inquiries recorded yet. Test submissions from the contact form or quote modal will appear here.
                          </td>
                        </tr>
                      ) : (
                        leads
                          .filter((l) =>
                            !leadSearch ||
                            l.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                            l.email?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                            l.phone?.includes(leadSearch)
                          )
                          .map((lead, idx) => (
                            <tr key={lead.id || idx} className="hover:bg-gray-50/80">
                              <td className="p-3.5 font-bold text-navy">{lead.name || "Anonymous"}</td>
                              <td className="p-3.5 space-y-0.5">
                                <div className="font-semibold text-gray-700">{lead.email}</div>
                                <div className="text-gray-400 font-mono text-[11px]">{lead.phone}</div>
                              </td>
                              <td className="p-3.5">
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-mono">
                                  {lead.source || "web"}
                                </span>
                              </td>
                              <td className="p-3.5 max-w-xs text-gray-600 truncate">{lead.message || "-"}</td>
                              <td className="p-3.5 text-gray-400 whitespace-nowrap text-[11px]">
                                {new Date(lead.timestamp).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: SECURITY & TOOLS ================= */}
          {activeTab === "tools" && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-serif font-black text-navy">Admin Security &amp; Tools</h1>
                <p className="text-gray-500 text-xs mt-1">
                  Change administrator password, download complete website backups, or restore defaults.
                </p>
              </div>

              {/* Password Change Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4 max-w-xl text-xs">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Lock className="w-4 h-4 text-gold" />
                  <h3 className="font-serif font-bold text-navy text-sm">Change Admin Password &amp; Username</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Admin Username</label>
                    <input
                      type="text"
                      value={formData.admin_username || "admin"}
                      onChange={(e) => updateField("admin_username", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 font-bold text-navy outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Admin Password</label>
                    <input
                      type="text"
                      value={formData.admin_password || "admin123"}
                      onChange={(e) => updateField("admin_password", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono outline-none text-navy"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveAll()}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold px-4 py-2 rounded text-xs transition-colors cursor-pointer"
                  >
                    Save New Password
                  </button>
                </div>
              </div>

              {/* Backup & Tools Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
                  <Download className="w-6 h-6 text-gold" />
                  <h3 className="font-bold text-navy text-sm">Export Full Backup</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Download a single JSON file containing all 15 services, blogs, pricing, SEO, and images.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="bg-navy hover:bg-gold text-white hover:text-navy text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer w-full"
                  >
                    Download JSON Backup
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-navy text-sm">Import JSON Backup</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Upload a previously exported backup file to restore website content instantly.
                  </p>
                  <label className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer w-full text-center block">
                    Choose Backup File
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                  </label>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
                  <RefreshCw className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-navy text-sm">Factory Reset</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Reset all blogs, copy, and images back to original Beyond Book Publishing defaults.
                  </p>
                  <button
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to reset everything back to default factory settings?")) {
                        await resetToDefaults();
                        alert("Reset complete!");
                      }
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer w-full border border-red-200"
                  >
                    Reset to Factory Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
