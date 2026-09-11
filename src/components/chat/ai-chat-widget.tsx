"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Clock,
  Calendar,
  Phone,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  flagged?: boolean;
  timestamp: string;
  suggestedActions?: Array<{ label: string; href: string }>;
}

const INITIAL_GREETING: ChatMessageItem = {
  id: "msg-welcome",
  role: "assistant",
  content:
    "Hello! 👋 I am the **HealthSphere AI Receptionist**.\n\nI can answer questions about our **operating hours, accepted insurance networks, consultation pricing**, or help you [Book an Appointment](/book).\n\n*Please note: I cannot provide medical diagnoses or treatment advice.* How may I assist you today?",
  timestamp: "Just now",
};

const SUGGESTED_PROMPTS = [
  "What insurance do you accept?",
  "What are your operating hours?",
  "How much does a checkup cost?",
  "How do I book an appointment?",
];

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    INITIAL_GREETING,
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadNotification(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || loading) return;

    const userMessage: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          sessionId,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        const assistantMsg: ChatMessageItem = {
          id: `ast-${Date.now()}`,
          role: "assistant",
          content: data.reply || "Thank you for reaching out.",
          flagged: data.flagged,
          suggestedActions: data.suggestedActions,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } else if (res.status === 429) {
        const errorData = await res.json();
        const rateLimitMsg: ChatMessageItem = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⏳ ${errorData.message || "Too many messages sent. Please wait 60 seconds."}`,
          flagged: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, rateLimitMsg]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch {
      const fallbackMsg: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "I apologize, but I am having trouble connecting to the clinic service right now. Please call our front desk directly at **(555) 234-5678** or submit an inquiry via our [Contact Form](/contact).",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_GREETING]);
    setSessionId(null);
  };

  // Helper to parse Markdown-like bold text and links
  const renderFormattedMessage = (text: string) => {
    // Split by Markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <Link
          key={match.index}
          href={match[2]}
          className="inline-flex items-center gap-0.5 font-semibold text-brand-primary underline transition-opacity hover:opacity-80"
        >
          <span>{match[1]}</span>
          <ExternalLink className="inline h-3 w-3" />
        </Link>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return (
      <div className="whitespace-pre-line leading-relaxed">
        {parts.map((part, i) => {
          if (typeof part === "string") {
            // Simple bold replacement for **text**
            const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
            return (
              <span key={i}>
                {boldParts.map((bp, bIdx) => {
                  if (bp.startsWith("**") && bp.endsWith("**")) {
                    return (
                      <strong
                        key={bIdx}
                        className="font-semibold text-brand-text"
                      >
                        {bp.slice(2, -2)}
                      </strong>
                    );
                  }
                  return bp;
                })}
              </span>
            );
          }
          return part;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Unread Prompt Bubble (shown when closed) */}
        {!isOpen && hasUnreadNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="hover:border-brand-primary/50 mb-3 hidden cursor-pointer items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-3.5 py-1.5 text-xs font-medium text-brand-text shadow-lg transition-colors sm:flex"
            onClick={() => setIsOpen(true)}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Questions? Ask our AI Receptionist</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadNotification(false);
              }}
              className="ml-1 text-brand-muted hover:text-brand-text"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}

        {/* Main Launcher Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={
            isOpen ? "Close clinic chat" : "Open AI receptionist chat"
          }
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 active:scale-95"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <MessageSquare className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Expanded Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="animate-in fixed bottom-24 right-4 z-50 flex h-[580px] max-h-[82vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-2xl sm:right-6 sm:w-[410px]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between bg-brand-primary p-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand-primary bg-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading text-sm font-bold tracking-tight text-white">
                      Clinic AI Receptionist
                    </h3>
                    <span className="py-0.2 inline-flex items-center rounded bg-white/20 px-1.5 text-[10px] font-medium">
                      24/7 Desk
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    Logistics, pricing, hours & scheduling
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize chat"
                  className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips (only if 1 message) */}
            {messages.length === 1 && (
              <div className="border-brand-border/60 bg-brand-background/40 border-b px-4 pb-1 pt-3">
                <p className="mb-2 text-[11px] font-medium text-brand-muted">
                  Frequently asked questions:
                </p>
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-full border border-brand-border bg-brand-surface px-2.5 py-1 text-left text-[11px] text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Feed */}
            <div className="bg-brand-background/20 flex-1 space-y-4 overflow-y-auto p-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      msg.role === "user"
                        ? "bg-brand-primary text-white"
                        : "border border-brand-border bg-brand-surface text-brand-primary"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs shadow-sm ${
                      msg.role === "user"
                        ? "rounded-tr-none bg-brand-primary text-white"
                        : msg.flagged
                          ? "rounded-tl-none border border-amber-500/30 bg-amber-500/10 text-brand-text"
                          : "rounded-tl-none border border-brand-border bg-brand-surface text-brand-text"
                    }`}
                  >
                    {msg.flagged && (
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Clinical Safety Notice</span>
                      </div>
                    )}

                    {renderFormattedMessage(msg.content)}

                    {/* Suggested Action Buttons */}
                    {msg.suggestedActions &&
                      msg.suggestedActions.length > 0 && (
                        <div className="border-brand-border/60 mt-3 flex flex-wrap gap-1.5 border-t pt-2">
                          {msg.suggestedActions.map((act, aIdx) => (
                            <Link key={aIdx} href={act.href}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 gap-1 bg-brand-surface px-2 text-[10px] hover:bg-brand-primary hover:text-white"
                              >
                                <span>{act.label}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}

                    <div
                      className={`mt-1.5 text-right text-[9px] ${
                        msg.role === "user"
                          ? "text-white/70"
                          : "text-brand-muted"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-primary">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-brand-border bg-brand-surface p-3 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-primary" />
                    <span className="ml-1.5 text-[11px] text-brand-muted">
                      Checking clinic catalog...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="shrink-0 border-t border-brand-border bg-brand-surface p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about hours, fees, insurance, or booking..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={loading}
                  className="flex-1 rounded-full border border-brand-border bg-brand-background px-3.5 py-2 text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={!inputText.trim() || loading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Strict Medical Disclaimer Notice */}
              <p className="mt-2 text-center text-[10px] leading-tight text-brand-muted">
                ⚠️{" "}
                <strong className="font-semibold text-brand-text">
                  Emergency:
                </strong>{" "}
                Dial 911 immediately. This AI answers administrative questions
                and cannot provide medical advice.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
