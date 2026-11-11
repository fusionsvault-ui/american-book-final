// Real Geolocation and Visitor Telemetry Utility
// Accurately detects country, city, flag, and public IP without hardcoding

export interface VisitorGeo {
  ip: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  region?: string;
}

const COUNTRY_NAMES: Record<string, string> = {
  PK: "Pakistan",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  IN: "India",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  IE: "Ireland",
  NZ: "New Zealand",
  SG: "Singapore",
  MY: "Malaysia",
  ZA: "South Africa",
  BR: "Brazil",
  MX: "Mexico",
};

export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Fallback timezone to country mapping if public geo APIs are blocked
function inferGeoFromTimezone(): Partial<VisitorGeo> {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Karachi")) {
      return { country: "Pakistan", countryCode: "PK", flag: "🇵🇰", city: "Karachi" };
    }
    if (tz.includes("London")) {
      return { country: "United Kingdom", countryCode: "GB", flag: "🇬🇧", city: "London" };
    }
    if (tz.includes("Dubai")) {
      return { country: "United Arab Emirates", countryCode: "AE", flag: "🇦🇪", city: "Dubai" };
    }
    if (tz.includes("Riyadh")) {
      return { country: "Saudi Arabia", countryCode: "SA", flag: "🇸🇦", city: "Riyadh" };
    }
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Montreal")) {
      return { country: "Canada", countryCode: "CA", flag: "🇨🇦", city: tz.split("/")[1]?.replace(/_/g, " ") || "Toronto" };
    }
    if (tz.includes("Sydney") || tz.includes("Melbourne")) {
      return { country: "Australia", countryCode: "AU", flag: "🇦🇺", city: tz.split("/")[1]?.replace(/_/g, " ") || "Sydney" };
    }
    if (tz.includes("New_York")) {
      return { country: "United States", countryCode: "US", flag: "🇺🇸", city: "New York" };
    }
    if (tz.includes("Chicago")) {
      return { country: "United States", countryCode: "US", flag: "🇺🇸", city: "Chicago" };
    }
    if (tz.includes("Los_Angeles")) {
      return { country: "United States", countryCode: "US", flag: "🇺🇸", city: "Los Angeles" };
    }
    if (tz.includes("Kolkata")) {
      return { country: "India", countryCode: "IN", flag: "🇮🇳", city: "New Delhi" };
    }
    if (tz.includes("Berlin")) {
      return { country: "Germany", countryCode: "DE", flag: "🇩🇪", city: "Berlin" };
    }
    if (tz.includes("Paris")) {
      return { country: "France", countryCode: "FR", flag: "🇫🇷", city: "Paris" };
    }

    // Generic continent/city split
    const parts = tz.split("/");
    if (parts.length === 2) {
      const city = parts[1].replace(/_/g, " ");
      return { city };
    }
  } catch (e) {
    // Ignore timezone extraction errors
  }
  return {};
}

let cachedGeo: VisitorGeo | null = null;

export async function detectVisitorGeo(): Promise<VisitorGeo> {
  if (cachedGeo) return cachedGeo;

  // Check sessionStorage
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("bbp_visitor_geo");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.country && parsed.country !== "Unknown") {
          cachedGeo = parsed;
          return parsed;
        }
      }
    } catch (e) {}
  }

  const fallback = inferGeoFromTimezone();
  let detected: VisitorGeo = {
    ip: "",
    country: fallback.country || "Global Visitor",
    countryCode: fallback.countryCode || "US",
    flag: fallback.flag || "🌐",
    city: fallback.city || "Online",
    region: "",
  };

  // 1. Try server endpoint first (which reads Vercel / Cloudflare real client headers)
  try {
    const res = await fetch("/api/visitor/geo", { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.country && data.country !== "Unknown") {
        detected = {
          ip: data.ip || "",
          country: data.country,
          countryCode: data.countryCode || "US",
          flag: data.flag || getFlagEmoji(data.countryCode || "US"),
          city: data.city || fallback.city || "Online",
          region: data.region || "",
        };
        cachedGeo = detected;
        try {
          sessionStorage.setItem("bbp_visitor_geo", JSON.stringify(detected));
        } catch (e) {}
        return detected;
      }
    }
  } catch (e) {
    // Server endpoint not reachable or timeout, try direct public ip lookup
  }

  // 2. Direct client-side lookup via country.is (free, very fast, HTTPS)
  try {
    const res = await fetch("https://api.country.is/", { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        const code = data.country.toUpperCase();
        const countryName = COUNTRY_NAMES[code] || code;
        detected = {
          ip: data.ip || detected.ip,
          country: countryName,
          countryCode: code,
          flag: getFlagEmoji(code),
          city: fallback.city || countryName,
          region: "",
        };
        cachedGeo = detected;
        try {
          sessionStorage.setItem("bbp_visitor_geo", JSON.stringify(detected));
        } catch (e) {}
        return detected;
      }
    }
  } catch (e) {
    // Continue to next fallback
  }

  // 3. Direct client-side lookup via ipwho.is
  try {
    const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.country) {
        const code = (data.country_code || "US").toUpperCase();
        detected = {
          ip: data.ip || detected.ip,
          country: data.country || COUNTRY_NAMES[code] || "Global Visitor",
          countryCode: code,
          flag: data.flag?.emoji || getFlagEmoji(code),
          city: data.city || fallback.city || "Online",
          region: data.region || "",
        };
        cachedGeo = detected;
        try {
          sessionStorage.setItem("bbp_visitor_geo", JSON.stringify(detected));
        } catch (e) {}
        return detected;
      }
    }
  } catch (e) {}

  cachedGeo = detected;
  return detected;
}
