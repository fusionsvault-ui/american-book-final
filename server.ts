import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import compression from "compression";
import mongoose from "mongoose";
import { initializeApp as initFirebaseApp } from "firebase/app";
import {
  getFirestore as getFirebaseFirestore,
  doc as fsDoc,
  getDoc as fsGetDoc,
  setDoc as fsSetDoc,
  collection as fsCollection,
  getDocs as fsGetDocs,
  deleteDoc as fsDeleteDoc,
} from "firebase/firestore";

dotenv.config();

const app = express();
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const portArgIdx = process.argv.indexOf("--port");
const portFromArg = portArgIdx !== -1 ? parseInt(process.argv[portArgIdx + 1], 10) : NaN;
const PORT = !isNaN(portFromArg) ? portFromArg : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

const hostArgIdx = process.argv.indexOf("--host");
const HOST = hostArgIdx !== -1 ? process.argv[hostArgIdx + 1] : "0.0.0.0";

const UPSTREAM_URL = "https://american-book-founderszip--devwork65.replit.app";

// Intercept requests for .png that have a modern .webp equivalent to eliminate 90%+ payload
app.use((req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  if (ext === ".png") {
    const webpPath = req.path.replace(/\.png$/, ".webp");
    const localWebpDist = path.join(process.cwd(), "dist", webpPath);
    const localWebpPublic = path.join(process.cwd(), "public", webpPath);
    if (fs.existsSync(localWebpDist) || fs.existsSync(localWebpPublic)) {
      return res.redirect(301, webpPath);
    }
  }
  next();
});

// Serve public assets directly with proper cache headers (7-day client cache)
app.use(
  express.static(path.join(process.cwd(), "public"), {
    maxAge: "7d",
    etag: true,
    lastModified: true,
  })
);

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

// FIREBASE FIRESTORE CLOUD DATABASE INTEGRATION
let firestoreDb: any = null;
let firebaseConnected = false;

try {
  let firebaseConfig: any = null;
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");

  if (fs.existsSync(firebaseConfigPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
  } else {
    // Fallback to environment variables (for Vercel / Docker / Production Hosting)
    firebaseConfig = {
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "pristine-shade-ls7sz",
      appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "1:693433277059:web:e33a14840d737f844d99b6",
      apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "AIzaSyDQDuF7DcVnuyHBm4i1YVglr9bw2VE39Yw",
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "pristine-shade-ls7sz.firebaseapp.com",
      firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID || "ai-studio-americanbookfoun-0b29e0f1-db1b-4d01-9805-9afc639ab23d",
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "pristine-shade-ls7sz.firebasestorage.app",
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "693433277059",
      measurementId: "",
      oAuthClientId: process.env.VITE_FIREBASE_OAUTH_CLIENT_ID || process.env.FIREBASE_OAUTH_CLIENT_ID || "693433277059-vq25cvks0e3aljp1ijka2tcc8o85103e.apps.googleusercontent.com",
    };
  }

  if (firebaseConfig && firebaseConfig.projectId) {
    const fbApp = initFirebaseApp(firebaseConfig, "server_app");
    firestoreDb = getFirebaseFirestore(fbApp, firebaseConfig.firestoreDatabaseId);
    firebaseConnected = true;
    console.log(`[FIREBASE FIRESTORE] Connected server instance to ${firebaseConfig.firestoreDatabaseId}`);
  }
} catch (fbErr) {
  console.warn("[FIREBASE FIRESTORE] Server initialization warning:", fbErr);
}

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
  seo_home_title: "Beyond Book Publishing - Professional Ghostwriting, Editing & Book Publishing",
  seo_home_desc: "Beyond Book Publishing (BeyondBookpublishing.com) is your author-first publishing partner. Professional ghostwriting, editing, and distribution. Keep 100% royalties.",
  seo_home_h1: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  seo_about_title: "About Beyond Book Publishing - Our Story & Publishing Mission",
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
  seo_testimonials_title: "Author Reviews & Testimonials - Beyond Book Publishing",
  seo_testimonials_desc: "Read verified testimonials and reviews from published authors. See how Beyond Book Publishing ghostwriting and distribution helped them find success.",
  seo_testimonials_h1: "Reviews From Our Published Authors",
  seo_contact_title: "Request Free Publishing Consultation - Beyond Book Publishing",
  seo_contact_desc: "Get in touch with Beyond Book Publishing today for a custom proposal, pricing estimates, and manuscript timelines.",
  seo_contact_h1: "Begin Your Bestseller Journey",
  hero_eyebrow: "Become A Self-Published Author:",
  hero_headline: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  hero_subtext: "Beyond Book Publishing (BeyondBookpublishing.com) pairs authors with a master guild of bestselling ghostwriters, veteran editors, and global distribution specialists. Keep 100% of your earnings, copyright, and creative freedom.",
  hero_phone: "+1 (800) 555-0199",
  hero_ratingText: "Rated 9.1 out of 10",
  hero_ratingCount: "3,428",
  hero_image_url: "/assets/writing-desk-CeaHrFGY.webp",
  hero_image_alt: "Beyond Book Publishing Editorial Desk",
  about_intro_img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
  about_intro_img_alt: "Stack of hardcover classical lit books",
  contact_sidebar_img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
  contact_sidebar_img_alt: "Writer notes and planner beside cup of hot coffee",
  logo_img_alt: "Beyond Book Publishing Premium Logo",
  header_phone: "",
  header_show_phone: false,
  global_noindex: true,
  global_nofollow: true,
  page_noindex: {},
  custom_robots_txt: "User-agent: *\nDisallow: /\nSitemap: https://beyondbookpublishing.com/sitemap.xml",
  global_meta_defaults: {
    title_suffix: " | Beyond Book Publishing",
    default_meta_desc: "Beyond Book Publishing (BeyondBookpublishing.com) provides premier book publishing, ghostwriting, editorial, design, and marketing services. Retain 100% royalties.",
    default_og_image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200&h=630",
    default_author: "Beyond Book Publishing",
    default_keywords: "Beyond Book Publishing, BeyondBookpublishing.com, book publishing, ghostwriting services, self publishing, book editing, copy editing, proofreading, book cover design, book marketing, Amazon KDP, IngramSpark",
  },
  custom_pages: [],
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

// Initial Live Sync with Firebase Firestore on Boot
if (firestoreDb) {
  (async () => {
    try {
      const snap = await fsGetDoc(fsDoc(firestoreDb, "cms", "website_content"));
      if (snap.exists()) {
        const liveData = snap.data();
        cmsContent = { ...cmsContent, ...liveData };
        console.log("[FIREBASE FIRESTORE] Synced live CMS configurations from Firestore.");
      } else {
        await fsSetDoc(fsDoc(firestoreDb, "cms", "website_content"), {
          ...cmsContent,
          updatedAt: new Date().toISOString(),
        });
        console.log("[FIREBASE FIRESTORE] Initialized website_content in Firestore.");
      }
    } catch (e) {
      console.warn("[FIREBASE FIRESTORE] Startup sync warning:", e);
    }
  })();
}

// ADMIN Authentication API Endpoint
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username and password are required" });
  }

  let validUser = "admin";
  let validPass = "admin123";

  if (mongoConnected) {
    try {
      const record = await CMSModel.findOne({ key: "website_cms" });
      if (record?.data) {
        validUser = record.data.admin_username || validUser;
        validPass = record.data.admin_password || validPass;
      }
    } catch (e) {}
  } else {
    validUser = cmsContent.admin_username || validUser;
    validPass = cmsContent.admin_password || validPass;
  }

  const cleanUser = String(username).trim().toLowerCase();
  const isMatch =
    (cleanUser === validUser.toLowerCase() || cleanUser === "fusionsvault@gmail.com") &&
    String(password) === validPass;

  if (isMatch) {
    const token = `adm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return res.json({ success: true, token, username: validUser });
  } else {
    return res.status(401).json({ success: false, error: "Invalid username or password. Please verify credentials." });
  }
});

// ADMIN Content CMS API Endpoints
app.get("/api/admin/content", async (req, res) => {
  if (firestoreDb) {
    try {
      const snap = await fsGetDoc(fsDoc(firestoreDb, "cms", "website_content"));
      if (snap.exists()) {
        const liveData = snap.data();
        cmsContent = { ...cmsContent, ...liveData };
        return res.json(liveData);
      }
    } catch (err) {
      console.warn("[FIREBASE FIRESTORE] Error fetching CMS content:", err);
    }
  }

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
  cmsContent = { ...cmsContent, ...updatedData };

  // 1. Permanently Save to Cloud Firebase Firestore
  if (firestoreDb) {
    try {
      await fsSetDoc(fsDoc(firestoreDb, "cms", "website_content"), {
        ...cmsContent,
        updatedAt: new Date().toISOString(),
      });
      console.log("[FIREBASE FIRESTORE] Successfully saved CMS data permanently to Firestore.");
    } catch (err) {
      console.error("[FIREBASE FIRESTORE] Error saving CMS content to Firestore:", err);
    }
  }

  // 2. Save to Mongo if connected
  if (mongoConnected) {
    try {
      let record = await CMSModel.findOne({ key: "website_cms" });
      if (record) {
        record.data = { ...record.data, ...updatedData };
        record.markModified("data");
        await record.save();
      } else {
        const dummyRecord = new CMSModel({ key: "website_cms", data: { ...cmsContent, ...updatedData } });
        await dummyRecord.save();
      }
    } catch (err) {
      console.error("[CMS DB] Error saving CMS content to Mongo:", err);
    }
  }

  // 3. Fallback to local file persistence & sync sitemap / robots
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(cmsContent, null, 2), "utf-8");
    if (updatedData.custom_sitemap_xml) {
      fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), updatedData.custom_sitemap_xml, "utf-8");
    }
    if (updatedData.custom_robots_txt) {
      fs.writeFileSync(path.join(process.cwd(), "public", "robots.txt"), updatedData.custom_robots_txt, "utf-8");
    }
  } catch (e) {
    console.error("[CMS DB] Failed writing cms_content.json / SEO files:", e);
  }

  return res.json({ success: true, data: cmsContent });
});

// Dynamic SEO Sitemap Endpoint
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  if (cmsContent.custom_sitemap_xml) {
    return res.send(cmsContent.custom_sitemap_xml);
  }
  const defaultPath = path.join(process.cwd(), "public", "sitemap.xml");
  if (fs.existsSync(defaultPath)) {
    return res.send(fs.readFileSync(defaultPath, "utf-8"));
  }
  return res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://beyondbookpublishing.com/</loc><priority>1.0</priority></url></urlset>`);
});

// Dynamic Robots.txt Endpoint
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  // If site-wide noindex is enabled (default active)
  if (cmsContent.global_noindex !== false) {
    if (cmsContent.custom_robots_txt && cmsContent.custom_robots_txt.includes("Disallow:")) {
      return res.send(cmsContent.custom_robots_txt);
    }
    return res.send(`# robots.txt for Beyond Book Publishing\n# Under Staging/Pre-launch: Site-wide crawling disabled per admin configuration\nUser-agent: *\nDisallow: /\n\nSitemap: https://beyondbookpublishing.com/sitemap.xml\n`);
  }
  if (cmsContent.custom_robots_txt) {
    return res.send(cmsContent.custom_robots_txt);
  }
  const defaultPath = path.join(process.cwd(), "public", "robots.txt");
  if (fs.existsSync(defaultPath)) {
    return res.send(fs.readFileSync(defaultPath, "utf-8"));
  }
  return res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://beyondbookpublishing.com/sitemap.xml`);
});

// Google Search Console HTML File Verification Wildcard
app.get("/google:verificationCode.html", (req, res) => {
  const { verificationCode } = req.params;
  res.setHeader("Content-Type", "text/html");
  return res.send(`google-site-verification: google${verificationCode}.html`);
});

// GET CRM leads
app.get("/api/leads", async (req, res) => {
  if (firestoreDb) {
    try {
      const snap = await fsGetDocs(fsCollection(firestoreDb, "leads"));
      if (!snap.empty) {
        const liveLeads = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        return res.json(liveLeads);
      }
    } catch (err) {
      console.warn("[FIREBASE FIRESTORE] Error reading leads from Firestore:", err);
    }
  }

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

  if (firestoreDb) {
    try {
      await fsDeleteDoc(fsDoc(firestoreDb, "leads", id));
      console.log("[FIREBASE FIRESTORE] Deleted lead from Firestore:", id);
    } catch (err) {
      console.warn("[FIREBASE FIRESTORE] Error deleting lead from Firestore:", err);
    }
  }

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

// Live active visitor sessions tracker (Tawk.to style profile & geolocation tracking)
interface VisitorSession {
  sessionId: string;
  lastSeen: number;
  visitorName?: string;
  email?: string;
  phone?: string;
  ip?: string;
  country?: string;
  countryCode?: string;
  flag?: string;
  city?: string;
  region?: string;
  browser?: string;
  os?: string;
  device?: string;
  currentPage?: string;
  notes?: string;
  agentConnected?: boolean;
}

const activeSessions: Record<string, VisitorSession> = {};

function resolveClientGeo(req: express.Request, body?: any) {
  // If client passes explicit geo info from browser/timeZone/navigator
  const passedIp = body?.ip;
  let ip = "72.229.28.185"; // Realistic default preview IP (New York, US)
  if (passedIp && passedIp !== "127.0.0.1" && passedIp !== "::1") {
    ip = passedIp;
  } else {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded) {
      const first = forwarded.split(",")[0].trim();
      if (first && first !== "127.0.0.1" && first !== "::1") ip = first;
    } else if (typeof req.headers["x-real-ip"] === "string" && req.headers["x-real-ip"]) {
      ip = req.headers["x-real-ip"] as string;
    }
  }

  // Parse user agent
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  let browser = "Chrome";
  if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edg")) browser = "Edge";

  let os = "macOS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("linux")) os = "Linux";

  const device = (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) ? "Mobile" : "Desktop";

  // Country and Flag lookup
  const country = body?.country || "United States";
  const countryCode = body?.countryCode || "US";
  const flag = body?.flag || (countryCode === "PK" ? "🇵🇰" : countryCode === "GB" ? "🇬🇧" : countryCode === "CA" ? "🇨🇦" : countryCode === "AU" ? "🇦🇺" : countryCode === "AE" ? "🇦🇪" : "🇺🇸");
  const city = body?.city || (countryCode === "PK" ? "Lahore" : countryCode === "GB" ? "London" : countryCode === "CA" ? "Toronto" : "New York");
  const region = body?.region || (countryCode === "US" ? "NY" : "");

  return {
    ip,
    country,
    countryCode,
    flag,
    city,
    region,
    browser: `${browser} / ${os}`,
    device,
    os,
  };
}

// GET Chat log telemetry (supports ?sessionId= filter)
app.get("/api/chat-messages", async (req, res) => {
  const { sessionId } = req.query;
  let allMsgs: any[] = [];
  if (mongoConnected) {
    try {
      allMsgs = await ChatMessageModel.find().sort({ timestamp: 1 });
    } catch (err) {
      console.error("[CMS DB] Error fetching chat logs from Mongo:", err);
      allMsgs = chatMessages;
    }
  } else {
    allMsgs = chatMessages;
  }

  if (sessionId) {
    return res.json(allMsgs.filter((m) => m.sessionId === sessionId));
  }
  return res.json(allMsgs);
});

// GET Live Chat Sessions Summary with active visitor count & tawk.to profiles
app.get("/api/chat/sessions", async (req, res) => {
  const now = Date.now();
  // Live threshold: active within last 3 minutes (180,000 ms)
  const activeCount = Object.values(activeSessions).filter((s) => now - s.lastSeen < 180000).length;

  let allMessages: any[] = [];
  if (mongoConnected) {
    try {
      allMessages = await ChatMessageModel.find().sort({ timestamp: 1 });
    } catch (e) {
      allMessages = chatMessages;
    }
  } else {
    allMessages = chatMessages;
  }

  const sessionMap: Record<string, any> = {};
  for (const msg of allMessages) {
    const sId = msg.sessionId || "default";
    if (!sessionMap[sId]) {
      const activeObj = activeSessions[sId];
      sessionMap[sId] = {
        sessionId: sId,
        visitorName: activeObj?.visitorName || `Author Visitor #${sId.slice(-4)}`,
        email: activeObj?.email || "",
        phone: activeObj?.phone || "",
        ip: activeObj?.ip || "72.229.28.185",
        country: activeObj?.country || "United States",
        countryCode: activeObj?.countryCode || "US",
        flag: activeObj?.flag || "🇺🇸",
        city: activeObj?.city || "New York",
        region: activeObj?.region || "NY",
        browser: activeObj?.browser || "Chrome / macOS",
        device: activeObj?.device || "Desktop",
        currentPage: activeObj?.currentPage || "/",
        agentConnected: activeObj?.agentConnected || false,
        notes: activeObj?.notes || "",
        messages: [],
        lastMessage: "",
        lastTimestamp: msg.timestamp || new Date().toISOString(),
        isOnline: activeObj ? now - activeObj.lastSeen < 180000 : false,
      };
    }
    sessionMap[sId].messages.push(msg);
    sessionMap[sId].lastMessage = msg.text;
    sessionMap[sId].lastTimestamp = msg.timestamp || new Date().toISOString();
  }

  // Also include any active session with no messages yet
  for (const [sId, sObj] of Object.entries(activeSessions)) {
    if (!sessionMap[sId] && now - sObj.lastSeen < 180000) {
      sessionMap[sId] = {
        sessionId: sId,
        visitorName: sObj.visitorName || `Author Visitor #${sId.slice(-4)}`,
        email: sObj.email || "",
        phone: sObj.phone || "",
        ip: sObj.ip || "72.229.28.185",
        country: sObj.country || "United States",
        countryCode: sObj.countryCode || "US",
        flag: sObj.flag || "🇺🇸",
        city: sObj.city || "New York",
        region: sObj.region || "NY",
        browser: sObj.browser || "Chrome / macOS",
        device: sObj.device || "Desktop",
        currentPage: sObj.currentPage || "/",
        agentConnected: sObj.agentConnected || false,
        notes: sObj.notes || "",
        messages: [],
        lastMessage: "Browsing website...",
        lastTimestamp: new Date(sObj.lastSeen).toISOString(),
        isOnline: true,
      };
    }
  }

  const sessionsList = Object.values(sessionMap).sort((a: any, b: any) => 
    new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
  );

  return res.json({
    activeCount: Math.max(activeCount, 1),
    sessions: sessionsList,
  });
});

// Admin Reply route
app.post("/api/chat/reply", async (req, res) => {
  const { sessionId, text } = req.body;
  if (!sessionId || !text) {
    return res.status(400).json({ error: "sessionId and text are required" });
  }

  // When admin replies, mark live agent as connected
  if (activeSessions[sessionId]) {
    activeSessions[sessionId].agentConnected = true;
  }

  const replyData = {
    sessionId,
    from: "agent",
    text,
    timestamp: new Date().toISOString(),
  };

  if (mongoConnected) {
    try {
      const newMsg = new ChatMessageModel(replyData);
      await newMsg.save();
    } catch (err) {
      console.error("[CMS DB] Mongo error saving agent reply:", err);
    }
  }

  chatMessages.push(replyData);
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chatMessages, null, 2), "utf-8");
  } catch (e) {
    console.error("[CMS DB] Failed to save agent reply to disk:", e);
  }

  return res.json({ success: true, message: replyData });
});

// Connect Live Agent route (marks session as connected to live consultant and prevents automated looping)
app.post("/api/chat/connect-agent", async (req, res) => {
  const { sessionId, visitorName } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  if (!activeSessions[sessionId]) {
    const geo = resolveClientGeo(req, req.body);
    activeSessions[sessionId] = {
      sessionId,
      lastSeen: Date.now(),
      visitorName: visitorName || `Author Visitor #${sessionId.slice(-4)}`,
      agentConnected: true,
      ...geo,
    };
  } else {
    activeSessions[sessionId].agentConnected = true;
    activeSessions[sessionId].lastSeen = Date.now();
  }

  // Broadcast system confirmation message if not already present
  const sysMsg = {
    sessionId,
    from: "agent",
    text: "🟢 Sarah (Senior Publishing Consultant) has joined the chat. How can I help with your book today?",
    timestamp: new Date().toISOString(),
  };

  const alreadySent = chatMessages.some(m => m.sessionId === sessionId && m.text.includes("joined the chat"));
  if (!alreadySent) {
    chatMessages.push(sysMsg);
    try {
      fs.writeFileSync(CHATS_FILE, JSON.stringify(chatMessages, null, 2), "utf-8");
    } catch (e) {}
  }

  return res.json({ success: true, agentConnected: true, message: sysMsg });
});

// Update Visitor Profile (tawk.to style profile update)
app.post("/api/chat/visitor-profile", (req, res) => {
  const { sessionId, visitorName, email, phone, notes } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  const geo = resolveClientGeo(req, req.body);
  const existing = activeSessions[sessionId] || {
    sessionId,
    lastSeen: Date.now(),
  };

  activeSessions[sessionId] = {
    ...existing,
    ...geo,
    visitorName: visitorName || existing.visitorName || `Author Visitor #${sessionId.slice(-4)}`,
    email: email !== undefined ? email : existing.email,
    phone: phone !== undefined ? phone : existing.phone,
    notes: notes !== undefined ? notes : existing.notes,
    lastSeen: Date.now(),
  };

  return res.json({ success: true, profile: activeSessions[sessionId] });
});

// Heartbeat route to mark visitor online with IP, Flag & Geolocation
app.post("/api/chat/heartbeat", (req, res) => {
  const { sessionId, visitorName, email, phone, currentPage } = req.body;
  if (sessionId) {
    const geo = resolveClientGeo(req, req.body);
    const existing = activeSessions[sessionId];
    activeSessions[sessionId] = {
      sessionId,
      lastSeen: Date.now(),
      visitorName: visitorName || existing?.visitorName || `Author Visitor #${sessionId.slice(-4)}`,
      email: email || existing?.email || "",
      phone: phone || existing?.phone || "",
      currentPage: currentPage || existing?.currentPage || "/",
      notes: existing?.notes || "",
      agentConnected: existing?.agentConnected || false,
      ip: geo.ip,
      country: existing?.country || geo.country,
      countryCode: existing?.countryCode || geo.countryCode,
      flag: existing?.flag || geo.flag,
      city: existing?.city || geo.city,
      region: existing?.region || geo.region,
      browser: geo.browser,
      device: geo.device,
      os: geo.os,
    };
  }
  const activeCount = Object.values(activeSessions).filter((s) => Date.now() - s.lastSeen < 180000).length;
  return res.json({ 
    success: true, 
    activeCount: Math.max(activeCount, 1),
    session: sessionId ? activeSessions[sessionId] : null
  });
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

  // 1. Permanently Save to Cloud Firebase Firestore
  if (firestoreDb) {
    try {
      await fsSetDoc(fsDoc(firestoreDb, "leads", leadId), leadData);
      console.log(`[FIREBASE FIRESTORE] Successfully saved lead ${leadId} to Firestore.`);
    } catch (err) {
      console.error("[FIREBASE FIRESTORE] Error saving lead to Firestore:", err);
    }
  }

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
  const currentSessionId = sessionId || `session_${Math.random().toString(36).slice(2, 8)}`;
  
  // Update heartbeat on activity
  activeSessions[currentSessionId] = {
    sessionId: currentSessionId,
    lastSeen: Date.now(),
  };

  const msgData = {
    sessionId: currentSessionId,
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
    
    // Serve static files from compiled dist folder with aggressive caching for hashed assets
    app.use(
      express.static(distPath, {
        maxAge: "1y",
        immutable: true,
        etag: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      })
    );
    
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


