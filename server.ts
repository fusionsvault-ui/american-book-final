import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

const portArgIdx = process.argv.indexOf("--port");
const portFromArg = portArgIdx !== -1 ? parseInt(process.argv[portArgIdx + 1], 10) : NaN;
const PORT = !isNaN(portFromArg) ? portFromArg : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

const hostArgIdx = process.argv.indexOf("--host");
const HOST = hostArgIdx !== -1 ? process.argv[hostArgIdx + 1] : "0.0.0.0";

const UPSTREAM_URL = "https://american-book-founderszip--devwork65.replit.app";

// Serve public assets directly with proper cache headers
app.use(express.static(path.join(process.cwd(), "public")));

// Redirect/Proxy missing static assets to the upstream Replit site to ensure all images load perfectly
app.use((req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  const isImageAsset = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"].includes(ext);
  const isHashedAsset = req.path.startsWith("/assets/") && !req.path.endsWith(".js") && !req.path.endsWith(".css");

  if (isImageAsset || isHashedAsset) {
    const localDistPath = path.join(process.cwd(), "dist", req.path);
    const localPublicPath = path.join(process.cwd(), "public", req.path);
    
    if (!fs.existsSync(localDistPath) && !fs.existsSync(localPublicPath)) {
      console.log(`[ASSET REDIRECT] Redirecting ${req.path} to upstream: ${UPSTREAM_URL}${req.path}`);
      return res.redirect(302, `${UPSTREAM_URL}${req.path}`);
    }
  }
  next();
});

// MONGODB CONNECTION SETUP AND CONTROLS
const MONGODB_URI = process.env.MONGODB_URI;
let mongoConnected = false;

// Define Mongoose mongoose models
const cmsSchema = new mongoose.Schema({
  key: { type: String, default: "website_cms", unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const CMSModel = mongoose.models.CMS || mongoose.model("CMS", cmsSchema);

const leadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, default: "Anonymous" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  message: { type: String, default: "" },
  source: { type: String, default: "unknown" },
  timestamp: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const LeadModel = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  from: { type: String, required: true },
  text: { type: String, default: "" },
  timestamp: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const ChatMessageModel = mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);

const connectMongoDB = async () => {
  if (!MONGODB_URI) {
    console.log("[CMS DB] MONGODB_URI is not set. Operating in LOCAL file persistence mode.");
    return false;
  }
  try {
    console.log("[CMS DB] Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
    });
    console.log("[CMS DB] Connected successfully to Cloud MongoDB instance.");
    mongoConnected = true;
    return true;
  } catch (err) {
    console.error("[CMS DB] Failed to establish connection with MongoDB URI provided:", err);
    console.log("[CMS DB] Falling back to LOCAL JSON file persistence mode.");
    return false;
  }
};

// In-Memory & Persistent Database logs (using local JSON files for local/fallback persistence!)
const LEADS_FILE = path.join(process.cwd(), "leads.json");
const CHATS_FILE = path.join(process.cwd(), "chat-messages.json");
const CMS_FILE = path.join(process.cwd(), "cms_content.json");

let leads: any[] = [];
let chatMessages: any[] = [];

try {
  if (fs.existsSync(LEADS_FILE)) {
    leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
  }
} catch (e) {
  console.error("[CMS DB] Error loading leads.json:", e);
}

try {
  if (fs.existsSync(CHATS_FILE)) {
    chatMessages = JSON.parse(fs.readFileSync(CHATS_FILE, "utf-8"));
  }
} catch (e) {
  console.error("[CMS DB] Error loading chat-messages.json:", e);
}

const fallbackCMSData = {
  seo_home_title: "Beyond Book Publishing – Professional Ghostwriting, Editing & Book Publishing",
  seo_home_desc: "Beyond Book Publishing (BeyondBookpublishing.com) is your author-first publishing partner. Professional ghostwriting, editing, and distribution. Keep 100% royalties.",
  seo_home_h1: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  seo_about_title: "About Beyond Book Publishing — Our Story & Publishing Mission",
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
  seo_testimonials_title: "Author Reviews & Testimonials — Beyond Book Publishing",
  seo_testimonials_desc: "Read verified testimonials and reviews from published authors. See how Beyond Book Publishing ghostwriting and distribution helped them find success.",
  seo_testimonials_h1: "Reviews From Our Published Authors",
  seo_contact_title: "Request Free Publishing Consultation — Beyond Book Publishing",
  seo_contact_desc: "Get in touch with Beyond Book Publishing today for a custom proposal, pricing estimates, and manuscript timelines.",
  seo_contact_h1: "Begin Your Bestseller Journey",
  hero_eyebrow: "Become A Self-Published Author:",
  hero_headline: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  hero_subtext: "Beyond Book Publishing (BeyondBookpublishing.com) pairs authors with a master guild of bestselling ghostwriters, veteran editors, and global distribution specialists. Keep 100% of your earnings, copyright, and creative freedom.",
  hero_phone: "+1 (800) 555-0199",
  hero_ratingText: "Rated 9.1 out of 10",
  hero_ratingCount: "3,428",
  hero_image_url: "/assets/writing-desk-CeaHrFGY.png",
  hero_image_alt: "Beyond Book Publishing Editorial Desk",
  about_intro_img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
  about_intro_img_alt: "Stack of hardcover classical lit books",
  contact_sidebar_img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
  contact_sidebar_img_alt: "Writer notes and planner beside cup of hot coffee",
  logo_img_alt: "Beyond Book Publishing Premium Logo",
  footer_desc: "Beyond Book Publishing (BeyondBookpublishing.com) is an author-first publishing house. Providing professional ghostwriting, editing, cover design, and global distribution. Retain 100% of your royalties and copyright."
};

let cmsContent = { ...fallbackCMSData };
try {
  if (fs.existsSync(CMS_FILE)) {
    cmsContent = JSON.parse(fs.readFileSync(CMS_FILE, "utf-8"));
  } else {
    fs.writeFileSync(CMS_FILE, JSON.stringify(fallbackCMSData, null, 2), "utf-8");
  }
} catch (e) {
  console.error("[CMS DB] Error loading/initializing cms_content.json:", e);
}

// ADMIN Content CMS API Endpoints
app.get("/api/admin/content", async (req, res) => {
  if (mongoConnected) {
    try {
      const record = await CMSModel.findOne({ key: "website_cms" });
      if (record) {
        return res.json(record.data);
      } else {
        // Seed default content in mongo
        const newRecord = new CMSModel({ key: "website_cms", data: cmsContent });
        await newRecord.save();
        return res.json(cmsContent);
      }
    } catch (err) {
      console.error("[CMS DB] Error fetching CMS content from Mongo:", err);
    }
  }
  return res.json(cmsContent);
});

app.post("/api/admin/content", async (req, res) => {
  const updatedData = req.body;
  if (mongoConnected) {
    try {
      let record = await CMSModel.findOne({ key: "website_cms" });
      if (record) {
        record.data = { ...record.data, ...updatedData };
        // Mark as modified so Mongoose updates mixed-type field
        record.markModified("data");
        await record.save();
        return res.json({ success: true, data: record.data });
      } else {
        const dummyRecord = new CMSModel({ key: "website_cms", data: { ...cmsContent, ...updatedData } });
        await dummyRecord.save();
        return res.json({ success: true, data: dummyRecord.data });
      }
    } catch (err) {
      console.error("[CMS DB] Error saving CMS content to Mongo:", err);
      return res.status(500).json({ error: "Failed to save CMS configurations to MongoDB" });
    }
  }

  // Fallback to local file persistence
  cmsContent = { ...cmsContent, ...updatedData };
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(cmsContent, null, 2), "utf-8");
  } catch (e) {
    console.error("[CMS DB] Failed writing cms_content.json:", e);
    return res.status(500).json({ error: "Failed to persist CMS configurations" });
  }
  return res.json({ success: true });
});

// GET CRM leads
app.get("/api/leads", async (req, res) => {
  if (mongoConnected) {
    try {
      const mongoLeads = await LeadModel.find().sort({ createdAt: -1 });
      return res.json(mongoLeads);
    } catch (err) {
      console.error("[CMS DB] Mongo error fetching leads:", err);
    }
  }
  return res.json(leads);
});

// DELETE CRM lead
app.delete("/api/leads/:id", async (req, res) => {
  const { id } = req.params;
  if (mongoConnected) {
    try {
      await LeadModel.deleteOne({ id: id });
      return res.json({ success: true });
    } catch (err) {
      console.error("[CMS DB] Mongo error deleting lead:", err);
      return res.status(500).json({ error: "Could not delete lead" });
    }
  }

  // Fallback
  leads = leads.filter((l) => l.id !== id);
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (e) {
    console.error("[CMS DB] Failed deleting lead item:", e);
  }
  return res.json({ success: true });
});

// GET Chat log telemetry
app.get("/api/chat-messages", async (req, res) => {
  if (mongoConnected) {
    try {
      const mongoMsgs = await ChatMessageModel.find().sort({ createdAt: 1 });
      return res.json(mongoMsgs);
    } catch (err) {
      console.error("[CMS DB] Error fetching chat logs from Mongo:", err);
    }
  }
  return res.json(chatMessages);
});

// API leads submission ingestion route
app.post("/api/leads", async (req, res) => {
  const { name, email, phone, message, source } = req.body;
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const leadData = {
    id: leadId,
    name: name || "Anonymous",
    email: email || "",
    phone: phone || "",
    message: message || "",
    source: source || "unknown",
    timestamp: new Date().toISOString(),
  };

  if (mongoConnected) {
    try {
      const newLeadDoc = new LeadModel(leadData);
      await newLeadDoc.save();
      return res.status(201).json({ success: true, leadId });
    } catch (err) {
      console.error("[CMS DB] Mongo error uploading lead:", err);
    }
  }

  // Fallback
  leads.push(leadData);
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (e) {
    console.error("[CMS DB] Could not write new lead to disk:", e);
  }
  console.log(`[LEAD RECEIVED]:`, JSON.stringify(leadData, null, 2));
  return res.status(201).json({ success: true, leadId });
});

// Chat session messages logging route
app.post("/api/chat-messages", async (req, res) => {
  const { sessionId, from, text } = req.body;
  const msgData = {
    sessionId: sessionId || `session_${Math.random().toString(36).slice(2, 8)}`,
    from: from || "user",
    text: text || "",
    timestamp: new Date().toISOString(),
  };

  if (mongoConnected) {
    try {
      const newMsgDoc = new ChatMessageModel(msgData);
      await newMsgDoc.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("[CMS DB] Mongo error saving chat history:", err);
    }
  }

  // Fallback
  chatMessages.push(msgData);
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chatMessages, null, 2), "utf-8");
  } catch (e) {
    console.error("[CMS DB] Could not log chat session history:", e);
  }
  console.log(`[CHAT MESSAGE]:`, JSON.stringify(msgData, null, 2));
  return res.status(200).json({ success: true });
});

async function startServer() {
  // Connect to MongoDB Atlas in background (non-blocking) so server binds immediately
  connectMongoDB().catch((err) => {
    console.error("[CMS DB] Background connection error:", err);
  });

  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log("Starting server in DEVELOPMENT mode (coupling with Vite server)...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode (serving compiled /dist assets)...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files from compiled dist folder
    app.use(express.static(distPath));
    
    // Fallback all SPA pages to dist/index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`=================================================`);
    console.log(`  Express Server running at http://${HOST}:${PORT}`);
    console.log(`=================================================`);
  });
}

const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;

if (isVercel) {
  // Pre-connect to MongoDB on Vercel boot for instantly responsive API requests
  connectMongoDB().catch((err) => {
    console.error("[Vercel Boot] Pre-connecting to MongoDB Atlas encountered error:", err);
  });
} else {
  // Standalone server start
  startServer().catch((err) => {
    console.error("Critical error starting fullstack server:", err);
  });
}

export default app;


