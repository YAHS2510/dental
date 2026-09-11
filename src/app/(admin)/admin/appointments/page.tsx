"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  RefreshCw,
  Phone,
  User,
  ExternalLink,
  Check,
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

interface FormattedAppointment {
  id: string;
  patientType?: string;
  patientName: string;
  childName?: string;
  guardianName?: string;
  phone: string;
  email?: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "DECLINED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
  source: string;
  contactMethod?: string;
  notes?: string;
}

export default function AdminAppointmentsPage() {
  const { data: session } = useSession();
  const performedBy = session?.user?.name || "Clinic Staff";

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<FormattedAppointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments?limit=100");
      const data = await res.json();
      if (data.success && data.appointments) {
        const formatted: FormattedAppointment[] = data.appointments.map(
          (apt: any) => {
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
              phone: apt.patient?.phone || "",
              email: apt.patient?.email || undefined,
              service: apt.service?.name || apt.reason || "Dental Consultation",
              doctor: apt.preferredDoctor || "Any Available Specialist",
              date: startTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              time:
                apt.timeRange ||
                startTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              status: apt.status || "PENDING",
              source: apt.source || "WEB_FORM",
              contactMethod: apt.contactMethod,
              notes: apt.notes,
            };
          }
        );
        setAppointments(formatted);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (
    aptId: string,
    newStatus: "CONFIRMED" | "DECLINED" | "COMPLETED" | "CANCELLED"
  ) => {
    try {
      await fetch(`/api/appointments/${aptId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          performedBy,
          reason: `Updated to ${newStatus} from All Bookings admin portal`,
        }),
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === aptId ? { ...apt, status: newStatus } : apt
        )
      );

      setActionSuccessMsg(`Appointment ${aptId} marked as ${newStatus}.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch {
      alert("Failed to update status.");
    }
  };

  const getWhatsAppChatUrl = (apt: FormattedAppointment) => {
    const cleanPhone = apt.phone.replace(/\D/g, "");
    const formattedPhone =
      cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = encodeURIComponent(
      `Hello ${apt.patientName}, this is VS Dental Clinic regarding your appointment (${apt.id}) for ${apt.service}.`
    );
    return `https://wa.me/${formattedPhone}?text=${msg}`;
  };

  const filteredList = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
    const matchesSource =
      sourceFilter === "ALL" ||
      (sourceFilter === "WHATSAPP"
        ? apt.source === "WHATSAPP" || apt.contactMethod === "WHATSAPP"
        : apt.source !== "WHATSAPP" && apt.contactMethod !== "WHATSAPP");
    const matchesSearch =
      searchQuery === "" ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSource && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-text">
            All Patient Bookings &amp; Schedules
          </h1>
          <p className="mt-1 text-xs text-brand-muted">
            Complete database of web inquiries, WhatsApp requests, and active
            clinic appointments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAppointments}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
          <a
            href="/admin/pending"
            className="shadow-xs hover:bg-brand-primary/90 rounded-clinic bg-brand-primary px-3 py-2 text-xs font-semibold text-white transition-colors"
          >
            Review Pending Queue &rarr;
          </a>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="shadow-xs flex items-center gap-2 rounded-clinic border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <Card className="border-brand-border">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
              <Input
                type="text"
                placeholder="Search patient, phone, service, or Ref ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Source Segmented Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="mr-1 font-semibold text-brand-muted">
                Source:
              </span>
              <button
                type="button"
                onClick={() => setSourceFilter("ALL")}
                className={`rounded-clinic px-2.5 py-1 font-semibold transition-colors ${
                  sourceFilter === "ALL"
                    ? "bg-slate-800 text-white"
                    : "border border-brand-border text-brand-muted hover:text-brand-text"
                }`}
              >
                All Sources
              </button>
              <button
                type="button"
                onClick={() => setSourceFilter("WHATSAPP")}
                className={`flex items-center gap-1 rounded-clinic px-2.5 py-1 font-semibold transition-colors ${
                  sourceFilter === "WHATSAPP"
                    ? "bg-[#25D366] text-white"
                    : "border border-brand-border text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceFilter("WEB_FORM")}
                className={`rounded-clinic px-2.5 py-1 font-semibold transition-colors ${
                  sourceFilter === "WEB_FORM"
                    ? "bg-brand-primary text-white"
                    : "border border-brand-border text-brand-muted hover:text-brand-text"
                }`}
              >
                Web Form
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="border-brand-border/60 flex items-center gap-1.5 overflow-x-auto border-t pt-3 text-xs">
            <span className="mr-1 font-semibold text-brand-muted">Status:</span>
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "DECLINED"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-clinic px-3 py-1 font-semibold transition-colors ${
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

      {/* Bookings Table / Card View */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse p-5">
              <div className="bg-brand-border/60 mb-2 h-5 w-48 rounded" />
              <div className="bg-brand-border/40 h-4 w-72 rounded" />
            </Card>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-brand-text">
            No Bookings Match Your Filter
          </h3>
          <p className="mt-1 text-xs text-brand-muted">
            Try resetting your status or source filters.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredList.map((apt) => (
            <Card
              key={apt.id}
              className="hover:border-brand-primary/40 shadow-xs transition-colors"
            >
              <CardContent className="space-y-3 p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-3 border-b border-brand-border pb-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-accent/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-clinic text-sm font-bold text-brand-primary">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-sm font-bold text-brand-text sm:text-base">
                          {apt.patientName}
                        </span>
                        {apt.source === "WHATSAPP" ||
                        apt.contactMethod === "WHATSAPP" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <MessageSquare className="h-3 w-3" />
                            <span>WhatsApp</span>
                          </span>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Web Intake
                          </Badge>
                        )}
                        {apt.patientType === "CHILD" ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Child Patient
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

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="h-3 w-3 text-brand-primary" />
                          {apt.phone}
                        </span>
                        {apt.guardianName && (
                          <span>• Parent: {apt.guardianName}</span>
                        )}
                        {apt.email && <span>• {apt.email}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between sm:flex-col sm:justify-center">
                    <span className="font-mono text-xs font-bold text-brand-muted">
                      {apt.id}
                    </span>
                  </div>
                </div>

                {/* Treatment & Time */}
                <div className="bg-brand-background/60 grid grid-cols-1 gap-2 rounded-clinic border border-brand-border p-3 text-xs sm:grid-cols-3">
                  <div>
                    <span className="block font-semibold text-brand-text">
                      Service / Treatment:
                    </span>
                    <span className="font-medium text-brand-primary">
                      {apt.service}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-brand-text">
                      Appointment Slot:
                    </span>
                    <span className="flex items-center gap-1 font-medium text-brand-text">
                      <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                      {apt.date} • {apt.time}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-brand-text">
                      Doctor:
                    </span>
                    <span className="text-brand-muted">{apt.doctor}</span>
                  </div>
                </div>

                {apt.notes && (
                  <div className="rounded border border-slate-200 bg-slate-50 p-2.5 text-xs text-brand-text">
                    <strong>Notes:</strong> {apt.notes}
                  </div>
                )}

                {/* Actions Row */}
                <div className="border-brand-border/60 flex flex-wrap items-center justify-between gap-2 border-t pt-1">
                  {apt.phone ? (
                    <a
                      href={getWhatsAppChatUrl(apt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shadow-xs inline-flex items-center gap-1.5 rounded-clinic bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#20ba59]"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat on WhatsApp</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <div />
                  )}

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
                          <span>Confirm</span>
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
