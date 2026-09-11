"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Bot,
  Filter,
  Check,
  Eye,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  flagged: boolean;
  createdAt: string;
}

interface ChatSession {
  id: string;
  visitorId: string;
  startedAt: string;
  status: "ACTIVE" | "REVIEWED" | "ESCALATED";
  messages: ChatMessage[];
}

export default function AdminTranscriptsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchTranscripts = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/transcripts");
      if (res.ok) {
        const data = await res.json();
        if (data.sessions && data.sessions.length > 0) {
          setSessions(data.sessions);
          setSelectedSessionId((prev) => prev || data.sessions[0].id);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTranscripts();
  }, [fetchTranscripts]);

  const handleUpdateStatus = async (
    sessionId: string,
    newStatus: "REVIEWED" | "ESCALATED" | "ACTIVE"
  ) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/ai/transcripts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: newStatus }),
      });

      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, status: newStatus } : s
          )
        );
      }
    } catch {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.visitorId &&
        s.visitorId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.messages.some((m) =>
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) ||
    filteredSessions[0] ||
    null;

  const totalFlagged = sessions.filter((s) => s.status === "ESCALATED").length;
  const totalReviewed = sessions.filter((s) => s.status === "REVIEWED").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-brand-text">
              AI Chat Transcripts & Safety Audits
            </h1>
            <Badge variant="outline" className="font-mono text-[10px]">
              QA Quality Review
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-brand-muted">
            Audit patient conversations with the AI front desk, inspect
            guardrails compliance, and verify medical triage handling.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={fetchTranscripts}
          className="h-8 gap-1.5 self-start text-xs sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Transcripts</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <div className="bg-brand-primary/10 rounded-lg p-2.5 text-brand-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Total Chat Sessions
            </div>
            <div className="mt-0.5 font-heading text-xl font-bold text-brand-text">
              {sessions.length} Logged
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Flagged Safety Triage
            </div>
            <div className="mt-0.5 font-heading text-xl font-bold text-amber-600 dark:text-amber-400">
              {totalFlagged} Intercepted
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Reviewed & Cleared
            </div>
            <div className="mt-0.5 font-heading text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalReviewed} Audited
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search transcripts by keyword or IP..."
            className="w-full rounded-clinic border border-brand-border bg-brand-surface py-2 pl-9 pr-4 text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex w-full items-center gap-1.5 overflow-x-auto sm:w-auto">
          {["ALL", "ESCALATED", "ACTIVE", "REVIEWED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors ${
                statusFilter === st
                  ? "bg-brand-primary font-medium text-white shadow-sm"
                  : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
              }`}
            >
              {st === "ALL"
                ? "All Sessions"
                : st === "ESCALATED"
                  ? "Flagged Safety (Escalated)"
                  : st}
            </button>
          ))}
        </div>
      </div>

      {/* Split Panel: Sessions List & Transcript Detail */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Sessions List */}
        <Card className="overflow-hidden p-0 lg:col-span-5">
          <CardHeader className="border-brand-border/60 border-b p-4">
            <CardTitle className="text-xs font-semibold text-brand-text">
              Conversations ({filteredSessions.length})
            </CardTitle>
          </CardHeader>
          <div className="max-h-[600px] divide-y divide-brand-border overflow-y-auto">
            {loading ? (
              <div className="space-y-2 p-12 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
                <div className="text-xs text-brand-muted">
                  Loading transcripts...
                </div>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-muted">
                No conversations match the current filter.
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isSelected = selectedSession?.id === session.id;
                const hasFlag =
                  session.status === "ESCALATED" ||
                  session.messages.some((m) => m.flagged);
                const lastMsg = session.messages[session.messages.length - 1];

                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`block w-full p-4 text-left transition-colors ${
                      isSelected
                        ? "bg-brand-accent/20 border-l-4 border-l-brand-primary"
                        : "hover:bg-brand-accent/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate font-mono text-xs font-semibold text-brand-text">
                        {session.id}
                      </div>
                      <Badge
                        variant={
                          session.status === "ESCALATED"
                            ? "destructive"
                            : session.status === "REVIEWED"
                              ? "success"
                              : "outline"
                        }
                        className="text-[10px]"
                      >
                        {session.status}
                      </Badge>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-brand-muted">
                      <span className="truncate">
                        IP: {session.visitorId || "Anonymous"}
                      </span>
                      <span>•</span>
                      <span>{session.messages.length} messages</span>
                    </div>

                    {lastMsg && (
                      <p className="mt-1.5 line-clamp-1 text-xs font-normal text-brand-muted">
                        <strong className="font-medium text-brand-text">
                          {lastMsg.role}:
                        </strong>{" "}
                        {lastMsg.content.slice(0, 75)}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between text-[10px] text-brand-muted">
                      <span>
                        {new Date(session.startedAt).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                      {hasFlag && (
                        <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Flagged for QA</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Column: Full Conversation Transcript Viewer */}
        <Card className="flex min-h-[500px] flex-col lg:col-span-7">
          {selectedSession ? (
            <>
              <CardHeader className="bg-brand-background/40 flex flex-row items-center justify-between border-b border-brand-border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-heading text-sm font-bold text-brand-text">
                      Session Transcript: {selectedSession.id}
                    </CardTitle>
                    <Badge
                      variant={
                        selectedSession.status === "ESCALATED"
                          ? "destructive"
                          : selectedSession.status === "REVIEWED"
                            ? "success"
                            : "outline"
                      }
                      className="text-[10px]"
                    >
                      {selectedSession.status}
                    </Badge>
                  </div>
                  <CardDescription className="mt-0.5 text-xs">
                    Visitor: {selectedSession.visitorId || "Anonymous"} •
                    Started:{" "}
                    {new Date(selectedSession.startedAt).toLocaleString()}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {selectedSession.status !== "REVIEWED" ? (
                    <Button
                      size="sm"
                      variant="primary"
                      className="h-7 gap-1 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                      disabled={updating}
                      onClick={() =>
                        handleUpdateStatus(selectedSession.id, "REVIEWED")
                      }
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark as Audited</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs"
                      disabled={updating}
                      onClick={() =>
                        handleUpdateStatus(selectedSession.id, "ACTIVE")
                      }
                    >
                      <span>Re-open for Review</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              {/* Guardrails Audit Banner */}
              {selectedSession.status === "ESCALATED" && (
                <div className="flex items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Clinical Safety Intercept:</strong> This session
                    triggered an automatic safety flag. The AI correctly refused
                    clinical advice or delivered emergency triage instructions.
                  </span>
                </div>
              )}

              {/* Message History Thread */}
              <CardContent className="bg-brand-background/20 max-h-[550px] flex-1 space-y-4 overflow-y-auto p-4">
                {selectedSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
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

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-sm ${
                        msg.role === "user"
                          ? "rounded-tr-none bg-brand-primary text-white"
                          : msg.flagged
                            ? "rounded-tl-none border border-amber-500/40 bg-amber-500/10 text-brand-text"
                            : "rounded-tl-none border border-brand-border bg-brand-surface text-brand-text"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold">
                          {msg.role === "user"
                            ? "Site Visitor"
                            : "AI Receptionist (Claude Engine)"}
                        </span>
                        {msg.flagged && (
                          <span className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                            [Safety Alert Triggered]
                          </span>
                        )}
                      </div>

                      <p className="whitespace-pre-line font-sans leading-relaxed">
                        {msg.content}
                      </p>

                      <div
                        className={`mt-1.5 text-right text-[9px] ${
                          msg.role === "user"
                            ? "text-white/70"
                            : "text-brand-muted"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center space-y-2 p-12 text-center text-brand-muted">
              <MessageSquare className="text-brand-muted/50 h-10 w-10" />
              <div className="text-sm font-semibold text-brand-text">
                No session selected
              </div>
              <p className="text-xs">
                Click on any conversation from the list to review the full
                transcript.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
