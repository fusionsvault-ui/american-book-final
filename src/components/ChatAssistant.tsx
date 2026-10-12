import React, { useState, useEffect } from "react";
import { X, Send, MessageCircle, User, Shield, Check, Globe, MapPin, Phone, Mail, Sparkles, UserCheck } from "lucide-react";

interface ChatMessage {
  from: "agent" | "user";
  text: string;
  timestamp?: string;
}

const consultant = {
  name: "Sarah Jenkins",
  role: "Senior Publishing Consultant",
  department: "Author Advisory Guild",
  location: "New York, NY",
  countryFlag: "🇺🇸",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
  bio: "12+ years guiding independent and commercial authors to Amazon #1 Bestseller & Barnes & Noble placement.",
};

const initialMessages: ChatMessage[] = [
  { from: "agent", text: "Hello! Welcome to Beyond Book Publishing. 📖" },
  {
    from: "agent",
    text: "I'm Sarah, your publishing consultant. Tell me about your book idea or manuscript!",
  },
];

const quickChips = [
  "I have a manuscript ready",
  "I need a professional ghostwriter",
  "Request a custom project quote",
  "I want to self-publish on Amazon & Ingram",
];

export const ChatAssistant: React.FC = () => {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Live Agent Connection State
  const [agentConnected, setAgentConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Visitor Profile State (Tawk.to style)
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem("bbp_visitor_name") || "");
  const [visitorEmail, setVisitorEmail] = useState(() => localStorage.getItem("bbp_visitor_email") || "");
  const [visitorPhone, setVisitorPhone] = useState(() => localStorage.getItem("bbp_visitor_phone") || "");
  const [visitorGeo, setVisitorGeo] = useState<{
    ip: string;
    country: string;
    countryCode: string;
    flag: string;
    city: string;
  }>({
    ip: "72.229.28.185",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    city: "New York",
  });
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  const getSessionId = () => {
    let sId = sessionStorage.getItem("chat-session-id");
    if (!sId) {
      sId = `author_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("chat-session-id", sId);
    }
    return sId;
  };

  useEffect(() => {
    if (sessionStorage.getItem("chat-seen")) return;

    const timer = setTimeout(() => {
      setBubbleVisible(true);
      setMessages(initialMessages);
      setUnreadCount(initialMessages.length);
      initialMessages.forEach((m) => triggerAnalyticsTracking(m.from, m.text));
    }, 15000); // 15 sec delay

    return () => clearTimeout(timer);
  }, []);

  // Site-wide visitor heartbeat (tracks active visitors & syncs IP/Flag)
  useEffect(() => {
    const currentSessionId = getSessionId();
    const sendVisitorHeartbeat = async () => {
      const pagePath = typeof window !== "undefined" ? window.location.pathname : "/";
      try {
        const res = await fetch("/api/chat/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: currentSessionId,
            visitorName: visitorName || `Author Visitor browsing ${pagePath}`,
            email: visitorEmail,
            phone: visitorPhone,
            currentPage: pagePath,
            country: visitorGeo.country,
            countryCode: visitorGeo.countryCode,
            flag: visitorGeo.flag,
            city: visitorGeo.city,
            ip: visitorGeo.ip,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.session) {
            if (json.session.agentConnected) {
              setAgentConnected(true);
            }
            if (json.session.ip) {
              setVisitorGeo({
                ip: json.session.ip || visitorGeo.ip,
                country: json.session.country || visitorGeo.country,
                countryCode: json.session.countryCode || visitorGeo.countryCode,
                flag: json.session.flag || visitorGeo.flag,
                city: json.session.city || visitorGeo.city,
              });
            }
          }
        }
      } catch (e) {
        // Heartbeat error ignored
      }
    };

    const initialTimer = setTimeout(sendVisitorHeartbeat, 3000);
    const hbInterval = setInterval(sendVisitorHeartbeat, 25000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(hbInterval);
    };
  }, [visitorName, visitorEmail, visitorPhone]);

  // Live admin reply listener when chat window is active
  useEffect(() => {
    if (!open) return;
    const currentSessionId = getSessionId();

    const fetchLiveMessages = async () => {
      try {
        const res = await fetch(`/api/chat-messages?sessionId=${currentSessionId}`);
        if (res.ok) {
          const serverMsgs: Array<{ from: "agent" | "user"; text: string }> = await res.json();
          if (serverMsgs && serverMsgs.length > 0) {
            setMessages((prev) => {
              if (serverMsgs.length > prev.length) {
                // If there's an agent reply, ensure agentConnected is set to true
                if (serverMsgs.some(m => m.from === "agent")) {
                  setAgentConnected(true);
                  setIsConnecting(false);
                }
                return serverMsgs;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        // Ignore poll error
      }
    };

    fetchLiveMessages();
    const pollInterval = setInterval(fetchLiveMessages, 2500);
    return () => clearInterval(pollInterval);
  }, [open]);

  const triggerAnalyticsTracking = async (from: string, text: string) => {
    try {
      const sessionId = getSessionId();
      await fetch("/api/chat-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, from, text }),
      });
    } catch (e) {
      // Ignored
    }
  };

  const startChat = () => {
    setOpen(true);
    setUnreadCount(0);
    sessionStorage.setItem("chat-seen", "1");
    if (messages.length === 0) {
      setMessages(initialMessages);
    }
  };

  const dismissBubble = () => {
    setBubbleVisible(false);
    setMinimized(true);
    sessionStorage.setItem("chat-seen", "1");
  };

  // Connect directly with live consultant (Sarah)
  const handleConnectLiveAgent = async () => {
    if (agentConnected || isConnecting) return;
    setIsConnecting(true);

    const sessionId = getSessionId();
    try {
      const res = await fetch("/api/chat/connect-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName: visitorName || `Author Visitor #${sessionId.slice(-4)}`,
          country: visitorGeo.country,
          countryCode: visitorGeo.countryCode,
          flag: visitorGeo.flag,
          city: visitorGeo.city,
          ip: visitorGeo.ip,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setAgentConnected(true);
        setIsConnecting(false);
        if (json.message) {
          setMessages((prev) => {
            const exists = prev.some(m => m.text.includes("joined the chat"));
            return exists ? prev : [...prev, json.message];
          });
        }
      }
    } catch (e) {
      setIsConnecting(false);
      setAgentConnected(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("bbp_visitor_name", visitorName);
    localStorage.setItem("bbp_visitor_email", visitorEmail);
    localStorage.setItem("bbp_visitor_phone", visitorPhone);

    const sessionId = getSessionId();
    try {
      await fetch("/api/chat/visitor-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName: visitorName || `Author Visitor #${sessionId.slice(-4)}`,
          email: visitorEmail,
          phone: visitorPhone,
          country: visitorGeo.country,
          countryCode: visitorGeo.countryCode,
          flag: visitorGeo.flag,
          city: visitorGeo.city,
          ip: visitorGeo.ip,
        }),
      });
      setProfileSavedNotice(true);
      setTimeout(() => {
        setProfileSavedNotice(false);
        setShowProfileDrawer(false);
      }, 1200);
    } catch (err) {}
  };

  const handleResponseSimulation = (userText: string) => {
    // CRITICAL: If live agent is already connected, do NOT send canned automated bot responses!
    if (agentConnected) {
      return;
    }

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      let reply =
        "Thank you for contacting Beyond Book Publishing! A senior consultant is reviewing your message. You can also connect directly using the 'Connect Live Agent' button above.";
      const query = userText.toLowerCase();

      if (query.includes("manuscript") || query.includes("ready")) {
        reply =
          "That's fantastic! Our editorial and publishing team can evaluate your manuscript within 48 hours. Would you like a personalized evaluation and quote? 🚀";
      } else if (query.includes("ghost") || query.includes("write")) {
        reply =
          "We pair authors with award-winning, U.S.-based ghostwriters across every genre. You retain 100% of royalties and copyright. Would you like to review sample excerpts? ✍️";
      } else if (
        query.includes("pric") ||
        query.includes("cost") ||
        query.includes("quote") ||
        query.includes("package")
      ) {
        reply =
          "We offer custom publishing packages tailored specifically to your book's word count and distribution goals. Would you like a custom quote breakdown? 📋";
      } else if (query.includes("self") || query.includes("publish")) {
        reply =
          "Self-publishing is our core specialty! We coordinate Amazon KDP, IngramSpark, hardcover distribution, and library placement while you keep 100% of your royalties. 📚";
      }

      setMessages((prev) => [...prev, { from: "agent", text: reply }]);
      triggerAnalyticsTracking("agent", reply);
    }, 1200);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = { from: "user", text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    triggerAnalyticsTracking("user", text);

    if (!agentConnected) {
      handleResponseSimulation(text);
    }
  };

  if (!bubbleVisible && !open) {
    return (
      <div className="fixed bottom-24 left-5 z-50">
        <button
          onClick={startChat}
          className="bg-navy hover:bg-navy-light text-white w-12 h-12 rounded-full shadow-2xl border-2 border-gold flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Chat with Sarah"
          title="Chat with Sarah"
        >
          <MessageCircle className="w-6 h-6 text-gold" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-5 z-50 flex flex-col items-start gap-2" id="chat-assistant-panel">
      {open ? (
        <div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[335px] sm:w-[350px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
          style={{ height: 520, maxHeight: "85vh" }}
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center justify-between border-b border-navy-light/40">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  width={38}
                  height={38}
                  className="w-9 h-9 rounded-full object-cover border-2 border-gold"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-navy" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-bold text-xs leading-tight">
                    {consultant.name}
                  </p>
                  <span className="text-[11px]" title="Consultant Location">{consultant.countryFlag}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>{agentConnected ? "Live Agent Connected" : "Publishing Consultant"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Tawk.to Profile & Geolocation Button */}
              <button
                type="button"
                onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showProfileDrawer
                    ? "bg-gold text-navy font-bold shadow-xs"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Edit Your Profile & Geolocation Info (Tawk.to Style)"
              >
                <User className="w-3.5 h-3.5 text-gold" />
                <span>{visitorGeo.flag} Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connection Status Bar & Agent Trigger */}
          <div className="bg-amber-50/90 border-b border-amber-200/60 px-3 py-1.5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-gray-700">
              <span className={`w-2 h-2 rounded-full ${agentConnected ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="font-semibold text-navy">
                {agentConnected ? "Live Human Consultant Active" : "Author Support Chat"}
              </span>
              <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                ({visitorGeo.ip})
              </span>
            </div>
            {!agentConnected ? (
              <button
                type="button"
                disabled={isConnecting}
                onClick={handleConnectLiveAgent}
                className="text-[10px] font-bold bg-navy text-white hover:bg-gold hover:text-navy px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <UserCheck className="w-3 h-3 text-gold" />
                <span>{isConnecting ? "Connecting..." : "Connect Live Agent"}</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold text-green-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Connected</span>
              </span>
            )}
          </div>

          {/* Tawk.to Style Visitor & Agent Profile Drawer */}
          {showProfileDrawer ? (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-1.5 text-navy font-serif font-bold text-xs uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-gold" />
                  <span>Session Geolocation &amp; Profile</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileDrawer(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  Back to chat
                </button>
              </div>

              {/* Verified Geolocation & IP Card */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-medium">Country / Region</span>
                  <span className="font-bold text-navy flex items-center gap-1.5">
                    <span className="text-base">{visitorGeo.flag}</span>
                    <span>{visitorGeo.country} ({visitorGeo.city})</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-medium">Visitor IP Address</span>
                  <span className="font-mono text-gray-800 font-semibold bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                    {visitorGeo.ip}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Session Status</span>
                  <span className="text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    🟢 Live Verified
                  </span>
                </div>
              </div>

              {/* Editable Visitor Details (Tawk.to pre-chat / contact card) */}
              <form onSubmit={handleSaveProfile} className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-xs space-y-2.5">
                <h4 className="text-xs font-bold text-navy flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span>Author Contact Details</span>
                </h4>
                <p className="text-[10px] text-gray-400">
                  Update your details so your dedicated publishing consultant can reach out with manuscript proposals.
                </p>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Your Name</label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. John Hemingway"
                    className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-gold outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Email Address</label>
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="author@example.com"
                    className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-gold outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Phone Number</label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-gold outline-none text-slate-800"
                  />
                </div>

                {profileSavedNotice && (
                  <div className="bg-green-50 text-green-700 text-[11px] font-bold p-2 rounded-lg text-center flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Profile updated and synced with consultant!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-navy hover:bg-navy-light text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Save Visitor Profile
                </button>
              </form>

              {/* Consultant Bio */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 text-xs space-y-1.5">
                <h5 className="font-bold text-navy text-[11px] uppercase tracking-wider text-gold">About Consultant</h5>
                <p className="font-bold text-gray-800">{consultant.name}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{consultant.bio}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Flow */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/70"
                id="chat-messages-container"
              >
                {/* Session Welcome Pill */}
                <div className="text-center my-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[10px] text-gray-500 shadow-xs font-medium">
                    <span>{visitorGeo.flag}</span>
                    <span>Session encrypted · Connected to Beyond Book Guild</span>
                  </span>
                </div>

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.from === "agent" && (
                      <img
                        src={consultant.avatar}
                        alt={consultant.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover mr-2 mt-1 flex-shrink-0 border border-gold"
                      />
                    )}
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.from === "user"
                          ? "bg-navy text-white rounded-br-sm shadow-xs font-normal"
                          : "bg-white text-gray-800 shadow-xs rounded-bl-sm border border-gray-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-start items-end gap-2">
                    <img
                      src={consultant.avatar}
                      alt={consultant.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="bg-white shadow-xs border border-gray-100 px-3.5 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick suggestions when chat is starting */}
              {messages.length <= 2 && (
                <div className="px-3 pt-2 pb-1.5 flex flex-wrap gap-1 bg-white border-t border-gray-100">
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-[11px] bg-gray-50 border border-gold/40 text-navy font-medium px-2.5 py-1 rounded-full hover:bg-gold hover:text-navy transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(inputValue);
                }}
                className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 bg-white"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-xs border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors disabled:opacity-40 cursor-pointer flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        !minimized && (
          <div className="flex flex-col items-start gap-2 animate-in slide-in-from-bottom-4 duration-300">
            {/* Popover Bubble */}
            <div className="relative bg-white rounded-2xl rounded-bl-none shadow-xl border border-gray-100 px-4 py-3 max-w-[260px]">
              <button
                onClick={dismissBubble}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 hover:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors p-0.5 text-xs cursor-pointer"
                style={{ fontSize: "9px" }}
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">{consultant.countryFlag}</span>
                <p className="text-navy text-xs font-bold leading-snug">
                  Publishing Advisory Active
                </p>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Connect live with {consultant.name} for publishing guidance →
              </p>
            </div>

            {/* Main Circle Trigger */}
            <button onClick={startChat} className="flex items-center gap-2 group cursor-pointer text-left">
              <div className="relative">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  width={52}
                  height={52}
                  className="w-13 h-13 rounded-full object-cover border-3 border-gold shadow-lg group-hover:scale-105 transition-transform"
                  style={{ width: 52, height: 52, borderWidth: 3 }}
                />
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-full shadow group-hover:bg-gold group-hover:text-navy transition-colors flex items-center gap-1.5">
                <span>Chat with Sarah</span>
                <span className="text-[10px]">{consultant.countryFlag}</span>
              </div>
            </button>
          </div>
        )
      )}
    </div>
  );
};
