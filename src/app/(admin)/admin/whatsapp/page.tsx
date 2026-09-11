"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Search,
  RefreshCw,
  ExternalLink,
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Check,
  CalendarClock,
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
import { Input } from "@/components/ui/input";

interface WhatsAppBooking {
  id: string;
  patientType?: string;
  patientName: string;
  childName?: string;
  guardianName?: string;
  phone: string;
  email?: string;
  treatment: string;
  requestedDate: string;
  requestedTime: string;
  preferredDoctor?: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

export default function AdminWhatsAppBookingsPage() {
  const { data: session } = useSession();
  const performedBy = session?.user?.name || "Clinic Staff";

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<WhatsAppBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchWhatsAppBookings = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch appointments where source=WHATSAPP or contactMethod=WHATSAPP
      const res = await fetch("/api/appointments?limit=100");
      const data = await res.json();

      if (data.success && data.appointments) {
        // Filter for WhatsApp origin or contact method
        const waList = data.appointments.filter(
          (apt: any) =>
            apt.source === "WHATSAPP" ||
            apt.contactMethod === "WHATSAPP" ||
            apt.notes?.includes("WhatsApp")
        );

        const formatted: WhatsAppBooking[] = waList.map((apt: any) => {
          const startTime = new Date(apt.startTime);
          return {
            id: apt.id,
            patientType: apt.patientType || "ADULT",
            patientName:
              apt.patientType === "CHILD" && apt.childName
                ? `${apt.childName} (Child)`
                : apt.patient
                  ? `${apt.patient.firstName} ${apt.patient.lastName}`
                  : "Patient",
            childName: apt.childName,
            guardianName: apt.guardianName,
            phone: apt.patient?.phone || "+91 85904 22464",
            email: apt.patient?.email || undefined,
            treatment: apt.service?.name || apt.reason || "Dental Consultation",
            requestedDate: startTime.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            requestedTime:
              apt.timeRange ||
              startTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
            preferredDoctor: apt.preferredDoctor,
            status: apt.status || "PENDING",
            notes: apt.notes,
            createdAt: new Date(apt.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),
          };
        });

        setAppointments(formatted);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWhatsAppBookings();
  }, [fetchWhatsAppBookings]);

  const handleUpdateStatus = async (
    aptId: string,
    newStatus: "CONFIRMED" | "DECLINED" | "COMPLETED"
  ) => {
    try {
      await fetch(`/api/appointments/${aptId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          performedBy,
          reason: `Updated to ${newStatus} via WhatsApp management queue`,
        }),
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === aptId ? { ...apt, status: newStatus } : apt
        )
      );

      setActionSuccessMsg(`Booking ${aptId} updated to ${newStatus}`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch {
      alert("Failed to update status.");
    }
  };

  const getWhatsAppChatUrl = (apt: WhatsAppBooking) => {
    const cleanPhone = apt.phone.replace(/\D/g, "");
    const formattedPhone =
      cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(
      `Hello ${apt.patientName}, this is VS Dental Clinic regarding your appointment request (${apt.id}) for ${apt.treatment}.`
    );
    return `https://wa.me/${formattedPhone}?text=${msg}`;
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery) ||
      apt.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalCount = appointments.length;
  const pendingCount = appointments.filter(
    (a) => a.status === "PENDING"
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === "CONFIRMED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-text">
              WhatsApp Bookings &amp; Inquiries
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live WhatsApp Desk
            </span>
          </div>
          <p className="mt-1 text-xs text-brand-muted">
            Direct WhatsApp appointment requests, mobile chats, and instant
            patient follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchWhatsAppBookings}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
          <a
            href="https://wa.me/918590422464"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-clinic bg-[#25D366] px-3 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-[#20ba59]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Clinic WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="shadow-xs flex items-center gap-2 rounded-clinic border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-brand-border bg-brand-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">
              Total WhatsApp Bookings
            </span>
            <span className="rounded-md bg-emerald-50 p-1.5 text-emerald-600">
              <MessageSquare className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-brand-text">
            {totalCount}
          </div>
          <div className="mt-1 text-[11px] text-brand-muted">
            Captured via website &amp; WhatsApp
          </div>
        </Card>

        <Card className="border-brand-border bg-brand-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">
              Awaiting Action
            </span>
            <span className="rounded-md bg-amber-50 p-1.5 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-amber-600">
            {pendingCount}
          </div>
          <div className="mt-1 text-[11px] text-brand-muted">
            Requires slot confirmation
          </div>
        </Card>

        <Card className="border-brand-border bg-brand-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted">
              Confirmed Slots
            </span>
            <span className="rounded-md bg-blue-50 p-1.5 text-blue-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-brand-primary">
            {confirmedCount}
          </div>
          <div className="mt-1 text-[11px] text-brand-muted">
            Added to clinic schedule
          </div>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <Card className="border-brand-border">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
            <Input
              type="text"
              placeholder="Search by patient, phone, or Ref ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "DECLINED"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-clinic px-3 py-1.5 font-semibold transition-colors ${
                    statusFilter === st
                      ? "bg-brand-primary text-white"
                      : "border border-brand-border bg-brand-background text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Booking Cards List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="bg-brand-border/60 mb-2 h-5 w-48 rounded" />
              <div className="bg-brand-border/40 h-4 w-72 rounded" />
            </Card>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-brand-text">
            No WhatsApp Bookings Found
          </h3>
          <p className="mt-1 text-xs text-brand-muted">
            {searchQuery
              ? "Try adjusting your search query or filter"
              : "New WhatsApp bookings submitted via website will appear here automatically."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((apt) => (
            <Card
              key={apt.id}
              className="shadow-xs transition-colors hover:border-emerald-400/50"
            >
              <CardContent className="space-y-3.5 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-3 border-b border-brand-border pb-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-clinic bg-[#25D366]/15 font-bold text-[#25D366]">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-bold text-brand-text sm:text-base">
                          {apt.patientName}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          WhatsApp
                        </span>
                        {apt.patientType === "CHILD" ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Child
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            Adult
                          </span>
                        )}
                        <Badge
                          variant={
                            apt.status === "CONFIRMED"
                              ? "default"
                              : apt.status === "PENDING"
                                ? "outline"
                                : apt.status === "COMPLETED"
                                  ? "success"
                                  : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {apt.status}
                        </Badge>
                      </div>

                      {apt.guardianName && (
                        <p className="mt-0.5 text-xs text-brand-muted">
                          Parent/Guardian: <strong>{apt.guardianName}</strong>
                        </p>
                      )}

                      <div className="mt-1 flex items-center gap-3 text-xs text-brand-muted">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="h-3 w-3 text-brand-primary" />
                          {apt.phone}
                        </span>
                        <span>•</span>
                        <span>Logged: {apt.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between sm:flex-col sm:justify-center">
                    <span className="font-mono text-xs font-bold text-brand-muted">
                      {apt.id}
                    </span>
                  </div>
                </div>

                {/* Treatment & Time Details */}
                <div className="bg-brand-background/60 grid grid-cols-1 gap-2.5 rounded-clinic border border-brand-border p-3 text-xs sm:grid-cols-3">
                  <div>
                    <span className="block font-semibold text-brand-text">
                      Treatment:
                    </span>
                    <span className="font-medium text-brand-primary">
                      {apt.treatment}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-brand-text">
                      Requested Slot:
                    </span>
                    <span className="flex items-center gap-1 font-medium text-brand-text">
                      <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                      {apt.requestedDate} • {apt.requestedTime}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-brand-text">
                      Doctor:
                    </span>
                    <span className="text-brand-muted">
                      {apt.preferredDoctor || "Any Specialist"}
                    </span>
                  </div>
                </div>

                {apt.notes && (
                  <div className="rounded border border-amber-100 bg-amber-50/70 p-2.5 text-xs text-brand-text">
                    <strong>Patient Note:</strong> {apt.notes}
                  </div>
                )}

                {/* Action Row */}
                <div className="border-brand-border/60 flex flex-wrap items-center justify-between gap-2 border-t pt-1">
                  <a
                    href={getWhatsAppChatUrl(apt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shadow-xs inline-flex items-center gap-1.5 rounded-clinic bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#20ba59]"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Open WhatsApp Chat</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    {apt.status === "PENDING" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(apt.id, "CONFIRMED")
                          }
                          className="gap-1 text-xs"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Confirm Slot</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(apt.id, "DECLINED")}
                          className="text-xs text-red-600 hover:bg-red-50"
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {apt.status === "CONFIRMED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(apt.id, "COMPLETED")}
                        className="text-xs text-emerald-700 hover:bg-emerald-50"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
