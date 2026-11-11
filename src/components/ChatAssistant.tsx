import React, { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle, User, Shield, Check, Globe, MapPin, Phone, Mail, Sparkles, Minus, ChevronDown, CheckCheck } from "lucide-react";
import { useCMS } from "./CMSContext";
import { detectVisitorGeo, VisitorGeo } from "../lib/geo";

interface ChatMessage {
  id?: string;
  sessionId?: string;
  from: "agent" | "user";
  text: string;
  timestamp?: string;
}

const DEFAULT_CHIPS = [
  "I have a manuscript ready 📖",
  "Request a custom project quote 📋",
  "I need an expert ghostwriter ✍️",
  "Self-publish on Amazon & Barnes & Noble 🚀",
];

export const ChatAssistant: React.FC = () => {
  const { data: cms } = useCMS();
  const agentProfile = cms.agent_profile || {
    name: "Sarah Jenkins",
    role: "Senior Publishing Consultant",
    department: "Author Advisory Guild",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    welcomeMessage: "Hello! Welcome to Beyond Book Publishing. I'm Sarah, your senior publishing consultant. Tell me about your book idea or manuscript!",
    statusText: "Online & replying instantly",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [bubblePromptVisible, setBubblePromptVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Author details
  const [visitorName, setVisitorName] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("bbp_visitor_name") || "";
    return "";
  });
  const [visitorEmail, setVisitorEmail] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("bbp_visitor_email") || "";
    return "";
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactSavedNotice, setContactSavedNotice] = useState(false);

  // Dynamic Real Geolocation (No hardcoded IP or fake New York location!)
  const [geo, setGeo] = useState<VisitorGeo>({
    ip: "",
    country: "Global",
    countryCode: "US",
    flag: "🌐",
    city: "Online",
    region: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getSessionId = () => {
    if (typeof window === "undefined") return "server_session";
    let sId = sessionStorage.getItem("bbp_chat_session_id");
    if (!sId) {
      sId = `author_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem("bbp_chat_session_id", sId);
    }
    return sId;
  };

  // 1. Detect Real Visitor Location on Mount
  useEffect(() => {
    let mounted = true;
    detectVisitorGeo().then((detected) => {
      if (mounted && detected) {
        setGeo(detected);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Delayed Initial Welcome Bubble
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("bbp_chat_dismissed")) return;

    const timer = setTimeout(() => {
      setBubblePromptVisible(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  // 3. Heartbeat: Sync active presence with real IP & Geo
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionId = getSessionId();
    const pagePath = window.location.pathname || "/";

    const sendHeartbeat = async () => {
      try {
        const { db } = await import("../lib/firebase");
        const { doc, setDoc } = await import("firebase/firestore");
        await setDoc(
          doc(db, "visitor_sessions", sessionId),
          {
            sessionId,
            visitorName: visitorName || `Author Visitor browsing ${pagePath}`,
            email: visitorEmail || "",
            currentPage: pagePath,
            country: geo.country,
            countryCode: geo.countryCode,
            flag: geo.flag,
            city: geo.city,
            ip: geo.ip,
            lastSeen: new Date().toISOString(),
            isOnline: true,
          },
          { merge: true }
        );
      } catch (e) {}

      try {
        await fetch("/api/chat/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            visitorName: visitorName || `Author Visitor browsing ${pagePath}`,
            email: visitorEmail,
            currentPage: pagePath,
            country: geo.country,
            countryCode: geo.countryCode,
            flag: geo.flag,
            city: geo.city,
            ip: geo.ip,
          }),
        });
      } catch (e) {}
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 25000);
    return () => clearInterval(interval);
  }, [visitorName, visitorEmail, geo]);

  // 4. Real-time Firestore sync on chat_messages for this session
  useEffect(() => {
    const sessionId = getSessionId();
    let unsub: (() => void) | undefined;

    (async () => {
      try {
        const { db } = await import("../lib/firebase");
        const { collection, onSnapshot, query } = await import("firebase/firestore");

        unsub = onSnapshot(collection(db, "chat_messages"), (snapshot) => {
          if (!snapshot.empty) {
            const allDocs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            const sessionDocs = allDocs
              .filter((m) => m.sessionId === sessionId)
              .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());

            if (sessionDocs.length > 0) {
              setMessages(sessionDocs);
              // If window is minimized or closed and a new agent message arrived, increment unread
              if (!isOpen) {
                const agentMsgs = sessionDocs.filter((m) => m.from === "agent");
                setUnreadCount(agentMsgs.length);
              }
            }
          }
        });
      } catch (e) {
        // Fallback to polling API
      }
    })();

    // Initial load from server API
    const loadFromApi = async () => {
      try {
        const res = await fetch(`/api/chat-messages?sessionId=${sessionId}`);
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setMessages((prev) => (list.length > prev.length ? list : prev));
          }
        }
      } catch (e) {}
    };
    loadFromApi();

    return () => {
      if (unsub) unsub();
    };
  }, [isOpen]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Open Chat Window
  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setBubblePromptVisible(false);
    setUnreadCount(0);
    sessionStorage.setItem("bbp_chat_dismissed", "1");

    // If no messages yet, seed with initial welcome message
    if (messages.length === 0) {
      const welcome: ChatMessage = {
        from: "agent",
        text: agentProfile.welcomeMessage || "Hello! Welcome to Beyond Book Publishing. How can I assist with your book project today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
      postMessageToServer("agent", welcome.text);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleMinimizeChat = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  // Post message to Firestore & backend server
  const postMessageToServer = async (from: "user" | "agent", text: string) => {
    const sessionId = getSessionId();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const payload = {
      id: msgId,
      sessionId,
      from,
      text,
      timestamp: now,
    };

    try {
      const { db } = await import("../lib/firebase");
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "chat_messages", msgId), payload);
      await setDoc(
        doc(db, "visitor_sessions", sessionId),
        {
          sessionId,
          lastSeen: now,
          lastMessage: text,
          visitorName: visitorName || `Author Visitor #${sessionId.slice(-4)}`,
          email: visitorEmail || "",
          country: geo.country,
          countryCode: geo.countryCode,
          flag: geo.flag,
          city: geo.city,
          ip: geo.ip,
          isOnline: true,
        },
        { merge: true }
      );
    } catch (e) {}

    try {
      await fetch("/api/chat-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {}
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!text || isSending) return;

    setIsSending(true);
    setInputValue("");

    const newMsg: ChatMessage = {
      from: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Send to Firestore & backend
    await postMessageToServer("user", text);
    setIsSending(false);

    // If visitor has not provided email yet, show contact prompt after 1st user message
    if (!visitorEmail && messages.filter((m) => m.from === "user").length === 0) {
      setTimeout(() => {
        setShowContactForm(true);
      }, 1000);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() && !visitorEmail.trim()) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("bbp_visitor_name", visitorName);
      localStorage.setItem("bbp_visitor_email", visitorEmail);
    }

    const sessionId = getSessionId();
    try {
      const { db } = await import("../lib/firebase");
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(
        doc(db, "visitor_sessions", sessionId),
        {
          visitorName: visitorName || `Author Visitor #${sessionId.slice(-4)}`,
          email: visitorEmail,
        },
        { merge: true }
      );
    } catch (e) {}

    try {
      await fetch("/api/chat/visitor-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName,
          email: visitorEmail,
          country: geo.country,
          countryCode: geo.countryCode,
          flag: geo.flag,
          city: geo.city,
          ip: geo.ip,
        }),
      });
    } catch (e) {}

    setContactSavedNotice(true);
    setTimeout(() => {
      setContactSavedNotice(false);
      setShowContactForm(false);
    }, 1500);
  };

  return (
    <>
      {/* ================= FLOATING LAUNCHER BUTTON & WELCOME BUBBLE ================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Unread & Welcome Peek Bubble */}
        {bubblePromptVisible && !isOpen && (
          <div className="mb-3 max-w-xs sm:max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200/80 p-4 animate-in fade-in slide-in-from-bottom-3 duration-300 relative">
            <button
              onClick={() => {
                setBubblePromptVisible(false);
                sessionStorage.setItem("bbp_chat_dismissed", "1");
              }}
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              aria-label="Dismiss chat prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3 cursor-pointer" onClick={handleOpenChat}>
              <div className="relative flex-shrink-0">
                <img
                  src={agentProfile.avatar}
                  alt={agentProfile.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white animate-pulse" />
              </div>
              <div className="pr-4">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-navy">{agentProfile.name}</h4>
                  <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.2 rounded font-semibold">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {agentProfile.welcomeMessage || "Hello! Have a question about publishing or ghostwriting? Let's chat live."}
                </p>
                <span className="text-[11px] font-bold text-gold inline-flex items-center gap-1 mt-2 hover:underline">
                  Start Live Chat &rarr;
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Bubble Button */}
        {!isOpen && (
          <button
            onClick={handleOpenChat}
            className="group relative flex items-center gap-2.5 bg-navy hover:bg-[#1a2c42] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:shadow-gold/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gold/40"
            aria-label="Open live chat"
          >
            {/* Live pulsing indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>

            <div className="flex items-center gap-2">
              <img
                src={agentProfile.avatar}
                alt={agentProfile.name}
                className="w-7 h-7 rounded-full object-cover border border-gold/60"
              />
              <div className="text-left">
                <div className="text-xs font-bold tracking-wide flex items-center gap-1">
                  <span>Chat with {agentProfile.name?.split(" ")[0] || "Consultant"}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium -mt-0.5">
                  {agentProfile.statusText || "Live Support Online"}
                </div>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ================= LIVE CHAT MESSENGER WINDOW ================= */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[380px] md:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy via-[#1a2e48] to-navy text-white p-4 border-b border-gold/30 flex items-center justify-between relative shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src={agentProfile.avatar}
                  alt={agentProfile.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-gold shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-navy animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  <span>{agentProfile.name}</span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-gold/90 font-medium">
                  {agentProfile.role}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{agentProfile.statusText || "Replies in ~2 minutes"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleMinimizeChat}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleCloseChat}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Location & Telemetry Mini Banner */}
          <div className="bg-slate-50 border-b border-gray-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm">{geo.flag}</span>
              <span className="font-semibold text-slate-700 truncate">
                {geo.city ? `${geo.city}, ` : ""}{geo.country}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Consultant Channel</span>
            </div>
          </div>

          {/* Optional Inline Lead Info Box */}
          {showContactForm && (
            <div className="bg-amber-50/90 border-b border-amber-200 p-3 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-navy flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Where can we email your quote?</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-[10px]"
                >
                  Skip
                </button>
              </div>
              <form onSubmit={handleSaveContact} className="space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Your Name"
                    className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-navy bg-white"
                  />
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="Your Email"
                    className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-navy bg-white"
                  />
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[10px] text-gray-500">
                    {contactSavedNotice ? "✅ Saved! Consultant will follow up." : "We respect author confidentiality."}
                  </span>
                  <button
                    type="submit"
                    className="bg-navy hover:bg-gold hover:text-navy text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fcfcfd]">
            {/* Disclaimer & Security Badge */}
            <div className="text-center py-1">
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white border border-gray-200/80 px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
                <Shield className="w-2.5 h-2.5 text-gold" />
                <span>256-Bit Encrypted Author Advisory Session</span>
              </span>
            </div>

            {messages.map((msg, idx) => {
              const isAgent = msg.from === "agent";
              return (
                <div
                  key={msg.id || idx}
                  className={`flex gap-2 items-end ${isAgent ? "justify-start" : "justify-end"}`}
                >
                  {isAgent && (
                    <img
                      src={agentProfile.avatar}
                      alt={agentProfile.name}
                      className="w-7 h-7 rounded-full object-cover border border-gold flex-shrink-0 mb-1"
                    />
                  )}

                  <div className={`max-w-[78%] flex flex-col ${isAgent ? "items-start" : "items-end"}`}>
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold text-gray-500">
                        {isAgent ? agentProfile.name : visitorName || "You"}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isAgent
                          ? "bg-white text-gray-800 border border-gray-200/90 rounded-bl-xs"
                          : "bg-navy text-white rounded-br-xs"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {!isAgent && (
                      <span className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                        <CheckCheck className="w-3 h-3 text-emerald-500" />
                        <span>Delivered</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 bg-gray-50/80 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {DEFAULT_CHIPS.map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="whitespace-nowrap text-[10px] font-medium bg-white hover:bg-gold/10 hover:border-gold/50 text-navy border border-gray-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Reply Input Bar */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message to the consultant..."
                className="flex-1 bg-gray-50 border border-gray-200 focus:bg-white focus:border-navy rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className="bg-navy hover:bg-gold hover:text-navy disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 px-1">
              <span>Press Enter to send</span>
              <span>100% Author Royalties</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
