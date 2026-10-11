import React, { useState, useEffect } from "react";
import { useCMS, CMSData, fallbackCMSData } from "../components/CMSContext";
import { Layout } from "../components/Layout";
import { 
  Settings, 
  Database, 
  MessageSquare, 
  Save, 
  Globe, 
  Trash2, 
  Download, 
  Search,
  CheckCircle,
  FileEdit,
  Clock,
  ArrowRight,
  Sparkles,
  User,
  ExternalLink
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

interface ChatMessage {
  sessionId: string;
  from: string;
  text: string;
  timestamp: string;
}

export const AdminDashboard: React.FC = () => {
  const { data: cms, saveData, refresh } = useCMS();
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "leads" | "chats">("content");
  
  // Local Form state for CMS edits
  const [formData, setFormData] = useState<CMSData>(cms);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  // Leads and Chats logs state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [searchLeadQuery, setSearchLeadQuery] = useState("");
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Load backend content
  useEffect(() => {
    setFormData(cms);
  }, [cms]);

  // Load Leads & Chat Logs from backend
  useEffect(() => {
    if (activeTab === "leads" || activeTab === "chats") {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const [leadsRes, chatsRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/chat-messages")
      ]);
      
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData);
      }
      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setChatLogs(chatsData);
        
        // Auto-select first session if present
        if (chatsData.length > 0) {
          const sessions = Array.from(new Set(chatsData.map((c: ChatMessage) => c.sessionId)));
          if (sessions.length > 0 && !selectedSessionId) {
            setSelectedSessionId(sessions[0] as string);
          }
        }
      }
    } catch (err) {
      console.error("Could not fetch log streams:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleCMSFieldChange = (key: keyof CMSData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    const success = await saveData(formData);
    if (success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
      refresh();
    } else {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
      }
    } catch (err) {
      console.error("Failed deleting lead:", err);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Restore all home configuration fields and SEO tags to site defaults?")) {
      setFormData(fallbackCMSData);
    }
  };

  // Group messages by session
  const chatSessions = React.useMemo(() => {
    const map: Record<string, ChatMessage[]> = {};
    chatLogs.forEach(msg => {
      if (!map[msg.sessionId]) map[msg.sessionId] = [];
      map[msg.sessionId].push(msg);
    });
    return map;
  }, [chatLogs]);

  const filteredLeads = leads.filter(l => {
    const q = searchLeadQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      l.message.toLowerCase().includes(q) ||
      l.source.toLowerCase().includes(q)
    );
  });

  const exportLeadsCSV = () => {
    if (leads.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Message", "Source", "Timestamp"];
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      `"${l.message.replace(/"/g, '""')}"`,
      l.source,
      l.timestamp
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `website_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout title="Control Panel & WordPress CMS Backend" description="Admin Dashboard to customize copy, manage user requests, live SEO, metadata, alt tags, leads CRM, and chat log metrics.">
      <div className="bg-cream/40 min-h-screen py-10" id="admin-dashboard-container">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm" id="admin-top-panel">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Studio Environment</span>
              </div>
              <h1 className="text-3xl font-serif font-black text-navy mt-1 flex items-center gap-2.5">
                <Settings className="w-7 h-7 text-gold" />
                Publisher CMS & Admin Backend
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Customize live pages, review SEO metadata, optimize alt tags, track organic leads, and view virtual assistant interactions.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchLogs}
                className="bg-white hover:bg-gray-150 text-navy font-bold text-xs md:text-sm px-4 py-2 rounded-lg border border-gray-200 transition cursor-pointer flex items-center gap-1.5"
              >
                Sync Data Feed
              </button>
              <a 
                href="/" 
                target="_blank"
                className="bg-navy hover:bg-navy/90 text-white font-bold text-xs md:text-sm px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                Launch Live Site
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Nav Menu Drawer Column */}
            <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col gap-1.5" id="admin-sidebar-nav">
              <div className="px-3 pb-3 border-b border-gray-100 mb-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#bbb]">WordPress Alternative Engine</span>
              </div>
              
              <button
                onClick={() => setActiveTab("content")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "content"
                    ? "bg-navy text-white shadow-md ml-1"
                    : "text-gray-600 hover:bg-cream hover:text-navy"
                }`}
              >
                <FileEdit className="w-4.5 h-4.5 text-gold" />
                Website Content CMS
              </button>

              <button
                onClick={() => setActiveTab("seo")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                  activeTab === "seo"
                    ? "bg-navy text-white shadow-md ml-1"
                    : "text-gray-600 hover:bg-cream hover:text-navy"
                }`}
              >
                <Globe className="w-4.5 h-4.5 text-gold" />
                SEO, Links & Alt Tags
              </button>

              <button
                onClick={() => setActiveTab("leads")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer justify-between ${
                  activeTab === "leads"
                    ? "bg-navy text-white shadow-md ml-1"
                    : "text-gray-600 hover:bg-cream hover:text-navy"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Database className="w-4.5 h-4.5 text-gold" />
                  CRM Leads Inbox
                </span>
                {leads.length > 0 && (
                  <span className="bg-gold text-navy text-[10px] font-black px-2 py-0.5 rounded-full">
                    {leads.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("chats")}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer justify-between ${
                  activeTab === "chats"
                    ? "bg-navy text-white shadow-md ml-1"
                    : "text-gray-600 hover:bg-cream hover:text-navy"
                }`}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-4.5 h-4.5 text-gold" />
                  Chat Assistant Telemetry
                </span>
                {Object.keys(chatSessions).length > 0 && (
                  <span className="bg-navy/10 text-navy text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {Object.keys(chatSessions).length}
                  </span>
                )}
              </button>

              <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col gap-2.5">
                <button
                  onClick={handleResetToDefaults}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 transition py-2 px-3 rounded-lg text-xs font-bold font-mono uppercase tracking-wider cursor-pointer text-center"
                >
                  Factory Reset Fields
                </button>
              </div>
            </div>

            {/* Editing/Display Canvas Column */}
            <div className="lg:col-span-3" id="admin-main-canvas">
              
              {/* Alert Status Banner */}
              {saveStatus === "saving" && (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-xl mb-6 font-medium animate-pulse flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Securing manuscript updates and publishing data...
                </div>
              )}
              {saveStatus === "success" && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-xl mb-6 font-medium flex items-center gap-2 animate-bounce">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Live changes synced! Your content and SEO values are now live.
                </div>
              )}
              {saveStatus === "error" && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 font-medium flex items-center gap-2">
                  Error: Could not save config update to back-end disk file. Check server logs.
                </div>
              )}

              {/* TAB 1: WEBSITE CONTENT */}
              {activeTab === "content" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                  <div className="border-b border-gray-150 pb-5">
                    <h2 className="text-xl font-serif font-black text-navy flex items-center gap-2">
                      <Sparkles className="w-5.5 h-5.5 text-gold" />
                      Hero & Homepage Content Editor
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">
                      Modify live headings, body text, support line counters, and default images.
                    </p>
                  </div>

                  <form onSubmit={handleSaveCMS} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      <div className="space-y-2 col-span-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-navy">
                          Hero Eyebrow Text
                        </label>
                        <input
                          type="text"
                          value={formData.hero_eyebrow || ""}
                          onChange={(e) => handleCMSFieldChange("hero_eyebrow", e.target.value)}
                          className="w-full bg-white border border-gray-250 p-3 rounded-lg text-sm text-navy focus:border-gold outline-none"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-navy">
                          Main Hero Title (H1 Overlay text)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.hero_headline || ""}
                          onChange={(e) => handleCMSFieldChange("hero_headline", e.target.value)}
                          className="w-full bg-white border border-gray-250 p-3 rounded-lg text-sm text-navy focus:border-gold outline-none font-serif font-bold text-lg"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-navy">
                          Hero Sub-Body Paragraph
                        </label>
                        <textarea
                          rows={3}
                          value={formData.hero_subtext || ""}
                          onChange={(e) => handleCMSFieldChange("hero_subtext", e.target.value)}
                          className="w-full bg-white border border-gray-250 p-3 rounded-lg text-sm text-navy focus:border-gold outline-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-navy">
                          Support Hotline Phone
                        </label>
                        <input
                          type="text"
                          value={formData.hero_phone || ""}
                          onChange={(e) => handleCMSFieldChange("hero_phone", e.target.value)}
                          className="w-full bg-white border border-gray-250 p-3 rounded-lg text-sm text-navy focus:border-gold outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-navy font-mono">
                          Rating Average Text
                        </label>
                        <input
                          type="text"
                          value={formData.hero_ratingText || ""}
                          onChange={(e) => handleCMSFieldChange("hero_ratingText", e.target.value)}
                          className="w-full bg-white border border-gray-250 p-3 rounded-lg text-sm text-navy focus:border-gold outline-none"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-navy">
                          Hero Primary Image Cover URL
                        </label>
                        <input
                          type="text"
                          value={formData.hero_image_url || ""}
                          onChange={(e) => handleCMSFieldChange("hero_image_url", e.target.value)}
                          className="w-full bg-white border border-gray-250 p-3 rounded-lg text-sm text-navy focus:border-gold outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-navy">
                          Footer Descriptive Copy
                        </label>
                        <textarea
                          rows={2}
                          value={formData.footer_desc || ""}
                          onChange={(e) => handleCMSFieldChange("footer_desc", e.target.value)}
                          className="w-full bg-white border border-gray-250 p-3 rounded-lg text-sm text-navy focus:border-gold outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                      <button
                        type="submit"
                        className="bg-navy hover:bg-gold hover:text-navy text-white font-extrabold px-6 py-3.5 rounded-lg text-xs md:text-sm uppercase tracking-wider cursor-pointer transition flex items-center gap-2 shadow-lg"
                      >
                        <Save className="w-4.5 h-4.5" />
                        Apply & Publish Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: SEO, LINKS & ALT TAGS */}
              {activeTab === "seo" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                  <div className="border-b border-gray-150 pb-5">
                    <h2 className="text-xl font-serif font-black text-navy flex items-center gap-2">
                      <Globe className="w-5.5 h-5.5 text-gold" />
                      Dynamic SEO Title, H1 & Image Alt Settings
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">
                      Directly change what search engine spiders crawl (headings, meta keywords, alt attributes).
                    </p>
                  </div>

                  <form onSubmit={handleSaveCMS} className="space-y-6">
                    <div className="space-y-6">
                      
                      {/* SEO Section: Home */}
                      <div className="bg-cream/35 p-5 rounded-xl border border-gray-200/60 space-y-4">
                        <span className="text-[11px] font-black uppercase tracking-widest text-gold bg-navy px-2.5 py-1 rounded block w-max">
                          Home Page Target
                        </span>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-navy">Meta Title Tag</label>
                            <input
                              type="text"
                              value={formData.seo_home_title || ""}
                              onChange={(e) => handleCMSFieldChange("seo_home_title", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-navy">Meta Description</label>
                            <textarea
                              rows={2}
                              value={formData.seo_home_desc || ""}
                              onChange={(e) => handleCMSFieldChange("seo_home_desc", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-navy">Hero Primary H1 Tag Equivalent</label>
                            <input
                              type="text"
                              value={formData.seo_home_h1 || ""}
                              onChange={(e) => handleCMSFieldChange("seo_home_h1", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SEO Section: About */}
                      <div className="bg-cream/35 p-5 rounded-xl border border-gray-200/60 space-y-4">
                        <span className="text-[11px] font-black uppercase tracking-widest text-gold bg-navy px-2.5 py-1 rounded block w-max">
                          About Page Target
                        </span>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold uppercase text-navy">Meta Title Tag</label>
                            <input
                              type="text"
                              value={formData.seo_about_title || ""}
                              onChange={(e) => handleCMSFieldChange("seo_about_title", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold uppercase text-navy">Main Header (H1) Text</label>
                            <input
                              type="text"
                              value={formData.seo_about_h1 || ""}
                              onChange={(e) => handleCMSFieldChange("seo_about_h1", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-navy">Meta Description</label>
                            <input
                              type="text"
                              value={formData.seo_about_desc || ""}
                              onChange={(e) => handleCMSFieldChange("seo_about_desc", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Accessibility Settings: Alt Tags */}
                      <div className="bg-cream/35 p-5 rounded-xl border border-gray-200/60 space-y-4">
                        <span className="text-[11px] font-black uppercase tracking-widest text-navy bg-gold px-2.5 py-1 rounded block w-max">
                          Image & Graphical Alt Attributes
                        </span>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold uppercase text-navy">Hero Main Graphic Alt</label>
                            <input
                              type="text"
                              value={formData.hero_image_alt || ""}
                              onChange={(e) => handleCMSFieldChange("hero_image_alt", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold uppercase text-navy">Home Logo Image Alt</label>
                            <input
                              type="text"
                              value={formData.logo_img_alt || ""}
                              onChange={(e) => handleCMSFieldChange("logo_img_alt", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-navy">About Page Intro Photo URL</label>
                            <input
                              type="text"
                              value={formData.about_intro_img || ""}
                              onChange={(e) => handleCMSFieldChange("about_intro_img", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy font-mono"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="block text-[11px] font-bold uppercase text-navy font-mono">About Page Intro Photo Alt Text</label>
                            <input
                              type="text"
                              value={formData.about_intro_img_alt || ""}
                              onChange={(e) => handleCMSFieldChange("about_intro_img_alt", e.target.value)}
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-md text-xs text-navy"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                      <button
                        type="submit"
                        className="bg-navy hover:bg-gold hover:text-navy text-white font-extrabold px-6 py-3.5 rounded-lg text-xs md:text-sm uppercase tracking-wider cursor-pointer transition flex items-center gap-2 shadow-lg"
                      >
                        <Save className="w-4.5 h-4.5" />
                        Apply & Publish Config
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: LEADS INBOX */}
              {activeTab === "leads" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                  <div className="border-b border-gray-150 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-serif font-black text-navy flex items-center gap-2">
                        <Database className="w-5.5 h-5.5 text-gold" />
                        Lead Acquisitions CRM ({filteredLeads.length})
                      </h2>
                      <p className="text-gray-500 text-xs mt-1">
                        Review submissions capture details from all site-wide contact forms and modal requests.
                      </p>
                    </div>
                    {leads.length > 0 && (
                      <button
                        onClick={exportLeadsCSV}
                        className="bg-cream hover:bg-gold text-navy font-black text-xs px-3.5 py-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 border border-gray-205"
                      >
                        <Download className="w-4 h-4" />
                        Export .CSV
                      </button>
                    )}
                  </div>

                  {/* Search and Filters */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search leads by name, email, query keyword or page source..."
                      value={searchLeadQuery}
                      onChange={(e) => setSearchLeadQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-gold outline-none rounded-lg text-xs"
                    />
                  </div>

                  {/* Table area */}
                  {isLoadingLogs ? (
                    <div className="text-center py-10 text-gray-400 text-xs font-bold animate-pulse">
                      Retrieving CRM databases...
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-16 bg-cream/15 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm">No lead submissions in the database record currently.</p>
                      <p className="text-gray-450 text-xs mt-1">Submit a query form on the home page to test real-time ingestion.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-150">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-navy text-white font-extrabold uppercase tracking-wide border-b border-gray-150">
                            <th className="p-3.5">Lead Info</th>
                            <th className="p-3.5">Source & Details</th>
                            <th className="p-3.5">Message / Instruction</th>
                            <th className="p-3.5 text-center">Settings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-cream/20 transition-all">
                              <td className="p-3.5 space-y-1">
                                <div className="font-serif font-black text-navy text-sm">{lead.name}</div>
                                <div className="text-gray-600 font-medium">{lead.email}</div>
                                <div className="text-gray-500">{lead.phone || "No Phone"}</div>
                              </td>
                              <td className="p-3.5 space-y-1">
                                <span className="inline-block bg-navy/10 text-navy font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
                                  {lead.source}
                                </span>
                                <div className="text-[10px] text-gray-450 flex items-center gap-1 font-medium">
                                  <Clock className="w-3 h-3 text-gold" />
                                  {new Date(lead.timestamp).toLocaleString()}
                                </div>
                              </td>
                              <td className="p-3.5 text-gray-700 leading-relaxed max-w-sm break-words whitespace-pre-wrap">
                                {lead.message}
                              </td>
                              <td className="p-3.5 text-center">
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition hover:scale-105 cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CHAT SESSIONS */}
              {activeTab === "chats" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm space-y-6">
                  <div className="border-b border-gray-150 pb-5">
                    <h2 className="text-xl font-serif font-black text-navy flex items-center gap-2">
                      <MessageSquare className="w-5.5 h-5.5 text-gold" />
                      Virtual Assistant Chat Tracker
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">
                      Monitor dialogues taking place with artificial support assistants live from the client terminal.
                    </p>
                  </div>

                  {isLoadingLogs ? (
                    <div className="text-center py-10 text-gray-400 text-xs font-bold animate-pulse">
                      Streaming telemetries...
                    </div>
                  ) : Object.keys(chatSessions).length === 0 ? (
                    <div className="text-center py-16 bg-cream/15 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm">No active virtual chat conversation records logged yet.</p>
                      <p className="text-gray-450 text-xs mt-1">Chat with the assistant floating on the bottom right corner to record telemetry.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-6 min-h-[460px]">
                      
                      {/* Session Selector list sidebar */}
                      <div className="md:col-span-1 rounded-xl border border-gray-150 overflow-y-auto max-h-[480px] p-2 space-y-1.5 bg-gray-50/50">
                        <span className="text-[10px] font-extrabold uppercase text-gray-450 px-2 pb-1.5 block border-b border-gray-150 mb-2">
                          Conversation Streams
                        </span>
                        {Object.entries(chatSessions).map(([sessionId, rawMsgs]) => {
                          const msgs = rawMsgs as ChatMessage[];
                          const lastMsg = msgs[msgs.length - 1];
                          const active = selectedSessionId === sessionId;
                          return (
                            <button
                              key={sessionId}
                              onClick={() => setSelectedSessionId(sessionId)}
                              className={`w-full text-left p-3 rounded-lg border transition-all text-xs cursor-pointer flex flex-col gap-1 ${
                                active
                                  ? "bg-navy text-white border-navy shadow-md"
                                  : "bg-white text-gray-600 hover:bg-cream border-gray-150"
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-mono font-bold uppercase truncate max-w-[120px]">
                                  ID: {sessionId.slice(0, 8)}...
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                                  active ? "bg-gold text-navy" : "bg-navy/10 text-navy"
                                }`}>
                                  {msgs.length} msg
                                </span>
                              </div>
                              <p className="truncate text-[11px] italic opacity-85">
                                {lastMsg ? `"${lastMsg.text}"` : "Empty conversation thread."}
                              </p>
                              <div className="text-[9px] text-[#999] text-right mt-1">
                                {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString() : ""}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Msg Thread Content Reader box */}
                      <div className="md:col-span-2 rounded-xl border border-gray-150 p-4.5 bg-gray-50 flex flex-col justify-between max-h-[480px]">
                        {selectedSessionId && chatSessions[selectedSessionId] ? (
                          <>
                            <div className="border-b border-gray-150 pb-2 mb-4 flex justify-between items-center">
                              <span className="text-xs font-mono font-bold text-navy">
                                SESSION STREAM: {selectedSessionId}
                              </span>
                              <span className="text-[10px] text-gray-450 flex items-center gap-1 font-medium">
                                <Clock className="w-3" />
                                Interactive Tracking Room
                              </span>
                            </div>

                            {/* Chat messages stream */}
                            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 scrollbar-none">
                              {chatSessions[selectedSessionId].map((m, mIdx) => {
                                const isAgent = m.from === "assistant" || m.from === "AI";
                                return (
                                  <div
                                    key={mIdx}
                                    className={`flex flex-col gap-1 max-w-[85%] ${
                                      isAgent ? "mr-auto text-left" : "ml-auto text-right"
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 justify-end">
                                      <span className={`text-[9px] font-extrabold uppercase tracking-widest ${
                                        isAgent ? "text-gold" : "text-gray-500"
                                      }`}>
                                        {isAgent ? "● AI Assistant Expert" : "● Visitor Agent"}
                                      </span>
                                    </div>
                                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                      isAgent
                                        ? "bg-navy text-white rounded-tl-none border border-navy"
                                        : "bg-gold text-navy font-bold rounded-tr-none shadow"
                                    }`}>
                                      {m.text}
                                    </div>
                                    <span className="text-[9px] text-gray-400 font-medium">
                                      {new Date(m.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex flex-col justify-center items-center text-gray-400 text-xs gap-1 py-12">
                            <MessageSquare className="w-8 h-8 text-gold/60" />
                            <span>Select a conversation stream from the Left Sidebar</span>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};
