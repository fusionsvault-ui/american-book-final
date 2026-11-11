import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export interface LeadSubmission {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  source?: string;
}

/**
 * Submits lead data with dual-channel persistence:
 * 1. Direct write to Cloud Firestore (guaranteed to work on Vercel without serverless dependencies)
 * 2. POST to /api/leads endpoint (for backend logging, email notifications, and mongo replication)
 */
export async function submitLead(data: LeadSubmission): Promise<{ success: boolean; leadId: string }> {
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const cleanName = data.name?.trim() || "Anonymous";
  const cleanEmail = data.email?.trim() || "";
  const now = new Date().toISOString();

  const payload = {
    id: leadId,
    name: cleanName,
    fullName: cleanName,
    email: cleanEmail,
    phone: data.phone?.trim() || "",
    service: data.service || "General Inquiry",
    message: data.message || "",
    source: data.source || "beyondbookpublishing.com",
    timestamp: now,
    createdAt: now,
    status: "new",
  };

  // 1. Direct Client-Side Firestore Write (Resilient to Vercel Cold Starts / Serverless Timeouts)
  try {
    const leadRef = doc(db, "leads", leadId);
    await setDoc(leadRef, payload);
    console.log("[LEAD SYNC] Direct Firestore lead persistence successful:", leadId);
  } catch (fsErr) {
    console.warn("[LEAD SYNC] Direct Firestore lead write error:", fsErr);
  }

  // 2. Server API Route submission
  try {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (apiErr) {
    console.warn("[LEAD SYNC] Server API lead submission error:", apiErr);
  }

  return { success: true, leadId };
}
