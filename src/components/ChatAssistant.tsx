import React, { useState, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";

interface ChatMessage {
  from: "agent" | "user";
  text: string;
}

const consultant = {
  name: "Sarah",
  role: "Publishing Consultant",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
};

const initialMessages: ChatMessage[] = [
  { from: "agent", text: "Hi there! 👋 Ready to publish your book? 📖" },
  {
    from: "agent",
    text: "I'm Sarah, your personal publishing consultant. What kind of book are you working on?",
  },
];

const quickChips = [
  "I have a manuscript ready",
  "I need a ghostwriter",
  "Tell me about pricing",
  "I want to self-publish",
];

export const ChatAssistant: React.FC = () => {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("chat-seen")) return;

    const timer = setTimeout(() => {
      setBubbleVisible(true);
      setMessages(initialMessages);
      setUnreadCount(initialMessages.length);
      initialMessages.forEach((m) => triggerAnalyticsTracking(m.from, m.text));
    }, 30000); // 30 sec delay in original

    return () => clearTimeout(timer);
  }, []);

  const triggerAnalyticsTracking = async (from: string, text: string) => {
    try {
      const sessionId = `chat-${sessionStorage.getItem("chat-session-id") || Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("chat-session-id", sessionId.replace("chat-", ""));
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

  const handleResponseSimulation = (userText: string) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      let reply =
        "Thanks for reaching out! One of our publishing experts will be in touch shortly. In the meantime, feel free to call us at +1 (800) 555-0199.";
      const query = userText.toLowerCase();

      if (query.includes("manuscript") || query.includes("ready")) {
        reply =
          "That's exciting! Our editors and publishing team can get your manuscript publish-ready in as little as 2 weeks. Would you like a free consultation? 🚀";
      } else if (query.includes("ghost") || query.includes("write")) {
        reply =
          "We have an amazing team of U.S.-based ghostwriters covering every genre. They'll capture your unique voice perfectly. Want to see some samples? ✍️";
      } else if (
        query.includes("pric") ||
        query.includes("cost") ||
        query.includes("package")
      ) {
        reply =
          "Our packages start at $999 and go up depending on the service. We also offer custom bundles! Want me to walk you through the options? 💰";
      } else if (query.includes("self") || query.includes("publish")) {
        reply =
          "Self-publishing is our specialty! We handle Amazon KDP, IngramSpark, distribution, and you keep 100% of your royalties. Want to learn more? 📚";
      }

      setMessages((prev) => [...prev, { from: "agent", text: reply }]);
      triggerAnalyticsTracking("agent", reply);
    }, 1400);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInputValue("");
    triggerAnalyticsTracking("user", text);
    handleResponseSimulation(text);
  };

  if (!bubbleVisible && !open) {
    // If not active, let's offer small clickable trigger instead of completely empty
    return (
      <div className="fixed bottom-24 left-5 z-50">
        <button
          onClick={startChat}
          className="bg-navy hover:bg-navy-light text-white w-12 h-12 rounded-full shadow-2xl border-2 border-gold flex items-center justify-center transition-all hover:scale-105 active:scale-95"
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
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[320px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
          style={{ maxHeight: 480 }}
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={consultant.avatar}
                alt={consultant.name}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border-2 border-gold"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">
                {consultant.name}
              </p>
              <p className="text-gray-400 text-xs">
                {consultant.role} · Online now
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors ml-1 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
            style={{ minHeight: 200, maxHeight: 260 }}
          >
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
                    className="w-6 h-6 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                    msg.from === "user"
                      ? "bg-gold text-navy rounded-br-sm font-medium"
                      : "bg-white text-gray-700 shadow-sm rounded-bl-sm border border-gray-100"
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
                <div className="bg-white shadow-sm border border-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick options */}
          {messages.length <= 2 && (
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 bg-gray-50 border-t border-gray-100">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="text-xs bg-white border border-gold/50 text-navy font-semibold px-2.5 py-1.5 rounded-full hover:bg-gold hover:text-navy hover:border-gold transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }}
            className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 bg-white"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        !minimized && (
          <div className="flex flex-col items-start gap-2 animate-in slide-in-from-bottom-4 duration-300">
            {/* Popover Bubble */}
            <div className="relative bg-white rounded-2xl rounded-bl-none shadow-xl border border-gray-100 px-4 py-3 max-w-[260px]">
              <button
                onClick={dismissBubble}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 hover:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors p-0.5 text-xs"
                style={{ fontSize: "9px" }}
              >
                <X className="w-3 h-3" />
              </button>
              <p className="text-navy text-sm font-semibold leading-snug">
                Hi! Ready to publish your book? 📖
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Chat with a publishing consultant →
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
              <div className="bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-full shadow group-hover:bg-gold group-hover:text-navy transition-colors">
                Chat with {consultant.name}
              </div>
            </button>
          </div>
        )
      )}
    </div>
  );
};
