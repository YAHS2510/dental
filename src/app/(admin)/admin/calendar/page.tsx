"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Stethoscope,
  Phone,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
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

interface AppointmentItem {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  service: string;
  doctor: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string;
  timeRange?: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "COMPLETED" | "CANCELLED";
  source: string;
  patientType?: string;
  childName?: string;
  guardianName?: string;
  notes?: string;
}

export default function AppointmentCalendarPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  // Current view month & selected date
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [activeMonthDate, setActiveMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchLiveAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments?limit=200");
      const data = await res.json();
      if (data.success && data.appointments) {
        const formatted: AppointmentItem[] = data.appointments.map(
          (apt: any) => {
            const startDate = new Date(apt.startTime);
            const dateStr = startDate.toISOString().split("T")[0];
            return {
              id: apt.id,
              patientName:
                apt.patientType === "CHILD" && apt.childName
                  ? `${apt.childName} (Child)`
                  : apt.patient
                    ? `${apt.patient.firstName} ${apt.patient.lastName}`
                    : "Patient",
              phone: apt.patient?.phone || "",
              email: apt.patient?.email,
              service: apt.service?.name || apt.reason || "Dental Consultation",
              doctor: apt.preferredDoctor || "Any Available Specialist",
              dateStr,
              timeStr: startDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }),
              timeRange: apt.timeRange,
              status: apt.status || "PENDING",
              source: apt.source || "WEB_FORM",
              patientType: apt.patientType || "ADULT",
              childName: apt.childName,
              guardianName: apt.guardianName,
              notes: apt.notes,
            };
          }
        );
        setAppointments(formatted);

        // If currently selected date has no bookings, but there are bookings in the list,
        // select the date of the earliest upcoming booking if today has 0
        const hasToday = formatted.some((a) => a.dateStr === todayStr);
        if (!hasToday && formatted.length > 0) {
          // Keep selectedDate or switch to first available appointment date
          setSelectedDate((prev) =>
            prev === todayStr ? formatted[0].dateStr : prev
          );
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    fetchLiveAppointments();
  }, [fetchLiveAppointments]);

  const handleQuickApprove = async (aptId: string) => {
    try {
      await fetch(`/api/appointments/${aptId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CONFIRMED",
          performedBy: "Clinical Staff (Calendar View)",
          reason: "Confirmed and scheduled via Calendar dashboard",
        }),
      });

      setAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: "CONFIRMED" } : a))
      );
      setActionSuccessMsg(`Appointment ${aptId} approved and confirmed!`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch {
      alert("Failed to confirm appointment.");
    }
  };

  // Month Grid Calculation
  const year = activeMonthDate.getFullYear();
  const month = activeMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setActiveMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setActiveMonthDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    const now = new Date();
    setActiveMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(todayStr);
  };

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, AppointmentItem[]>();
    for (const apt of appointments) {
      const list = map.get(apt.dateStr) || [];
      list.push(apt);
      map.set(apt.dateStr, list);
    }
    return map;
  }, [appointments]);

  // Filter appointments for the SELECTED DATE
  const selectedDateAppointments = useMemo(() => {
    const list = appointmentsByDate.get(selectedDate) || [];
    if (statusFilter === "ALL") return list;
    return list.filter((a) => a.status === statusFilter);
  }, [appointmentsByDate, selectedDate, statusFilter]);

  const monthName = activeMonthDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDateObj = new Date(selectedDate + "T00:00:00");
  const formattedSelectedDate = isNaN(selectedDateObj.getTime())
    ? selectedDate
    : selectedDateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-brand-text">
              Appointment Booking Calendar
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Live Interactive Schedule
            </span>
          </div>
          <p className="mt-0.5 text-xs text-brand-muted">
            Select any date on the calendar below to view all booked patients
            and manage appointments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveAppointments}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleGoToday}
            className="gap-1.5 text-xs font-semibold"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Today</span>
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="shadow-xs flex items-center gap-2 rounded-clinic border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main 2-Column Layout: Calendar Grid on Left (or Top), Selected Date Bookings on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Interactive Month Calendar */}
        <Card className="border-brand-border lg:col-span-6 xl:col-span-5">
          <CardHeader className="border-brand-border/70 border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-base font-bold text-brand-text">
                  {monthName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Click any date to view all scheduled patients
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="hover:bg-brand-accent/20 rounded-clinic border border-brand-border p-1.5 text-brand-muted transition-colors hover:text-brand-text"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="hover:bg-brand-accent/20 rounded-clinic border border-brand-border p-1.5 text-brand-muted transition-colors hover:text-brand-text"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Date Picker Input */}
            <div className="border-brand-border/60 mt-2.5 flex items-center gap-2 border-t pt-2">
              <span className="whitespace-nowrap text-[11px] font-semibold text-brand-muted">
                Jump to Date:
              </span>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                    const parsed = new Date(e.target.value + "T00:00:00");
                    if (!isNaN(parsed.getTime())) {
                      setActiveMonthDate(
                        new Date(parsed.getFullYear(), parsed.getMonth(), 1)
                      );
                    }
                  }
                }}
                className="h-8 py-1 text-xs"
              />
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {/* Day of Week Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase text-brand-muted">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading offset cells */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="h-14 rounded-clinic bg-slate-50/40 opacity-30"
                />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const formattedMonth = String(month + 1).padStart(2, "0");
                const formattedDay = String(dayNum).padStart(2, "0");
                const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

                const dayApts = appointmentsByDate.get(dateKey) || [];
                const isSelected = selectedDate === dateKey;
                const isToday = todayStr === dateKey;
                const hasApts = dayApts.length > 0;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDate(dateKey)}
                    className={`group relative flex h-14 flex-col items-center justify-between rounded-clinic p-1.5 text-xs transition-all ${
                      isSelected
                        ? "bg-brand-primary text-white shadow-md ring-2 ring-brand-primary ring-offset-2"
                        : isToday
                          ? "border border-emerald-400 bg-emerald-50 font-bold text-emerald-950"
                          : hasApts
                            ? "hover:border-brand-primary/60 border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                            : "border border-transparent bg-slate-50/60 text-slate-500 hover:bg-slate-100/80"
                    }`}
                  >
                    <span className="text-[11px] font-bold">{dayNum}</span>

                    {/* Booking Count Pill / Dot */}
                    {hasApts && (
                      <span
                        className={`py-0.2 inline-flex items-center rounded-full px-1.5 text-[9px] font-extrabold ${
                          isSelected
                            ? "bg-white/30 text-white"
                            : "border border-emerald-200 bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {dayApts.length} {dayApts.length === 1 ? "apt" : "apts"}
                      </span>
                    )}

                    {isToday && !isSelected && (
                      <span className="text-[8px] font-bold uppercase text-emerald-700">
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: ALL PERSONS / BOOKINGS ON SELECTED DATE */}
        <div className="space-y-4 lg:col-span-6 xl:col-span-7">
          <Card className="border-brand-border">
            <CardHeader className="border-b border-brand-border pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-brand-primary" />
                    <CardTitle className="font-heading text-lg font-bold text-brand-text">
                      {formattedSelectedDate}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-0.5 text-xs">
                    {selectedDateAppointments.length}{" "}
                    {selectedDateAppointments.length === 1
                      ? "patient scheduled on this date"
                      : "patients scheduled on this date"}
                  </CardDescription>
                </div>

                {/* Status Filter on Selected Date */}
                <div className="flex items-center gap-1 text-xs">
                  {["ALL", "CONFIRMED", "PENDING"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`rounded-clinic px-2.5 py-1 font-semibold transition-colors ${
                        statusFilter === st
                          ? "bg-brand-primary text-white"
                          : "border border-brand-border text-brand-muted hover:text-brand-text"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-clinic border border-brand-border p-4"
                    >
                      <div className="bg-brand-border/60 mb-2 h-5 w-40 rounded" />
                      <div className="bg-brand-border/40 h-4 w-60 rounded" />
                    </div>
                  ))}
                </div>
              ) : selectedDateAppointments.length === 0 ? (
                /* Empty State for Selected Date */
                <div className="space-y-3 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    No Bookings on this Date
                  </h3>
                  <p className="mx-auto max-w-sm text-xs text-brand-muted">
                    There are no patient appointments scheduled for{" "}
                    <strong>{formattedSelectedDate}</strong>. Click another date
                    on the calendar or jump to today.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={handleGoToday}>
                      View Today
                    </Button>
                    <a href="/admin/pending">
                      <Button variant="primary" size="sm">
                        Review Pending Requests &rarr;
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                /* Patient Cards for Selected Date */
                <div className="space-y-3.5">
                  {selectedDateAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="shadow-xs hover:border-brand-primary/50 space-y-3 rounded-clinic border border-brand-border bg-brand-surface p-4 transition-all"
                    >
                      <div className="border-brand-border/60 flex flex-col justify-between gap-2 border-b pb-2.5 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-brand-accent/40 flex h-9 w-9 shrink-0 items-center justify-center rounded-clinic text-xs font-bold text-brand-primary">
                            {apt.patientName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-sm font-bold text-brand-text sm:text-base">
                                {apt.patientName}
                              </span>
                              {apt.source === "WHATSAPP" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>WhatsApp</span>
                                </span>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  Web Intake
                                </Badge>
                              )}
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
                                      : "destructive"
                                }
                                className="text-[10px]"
                              >
                                {apt.status}
                              </Badge>
                            </div>

                            {apt.guardianName && (
                              <p className="mt-0.5 text-[11px] text-brand-muted">
                                Parent/Guardian:{" "}
                                <strong>{apt.guardianName}</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="font-mono text-xs font-bold text-brand-muted">
                          {apt.id}
                        </span>
                      </div>

                      {/* Clinical Slot & Doctor Details */}
                      <div className="bg-brand-background/70 border-brand-border/70 grid grid-cols-1 gap-2 rounded-clinic border p-3 text-xs sm:grid-cols-3">
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
                            Scheduled Slot:
                          </span>
                          <span className="flex items-center gap-1 font-medium text-brand-text">
                            <Clock className="h-3.5 w-3.5 text-brand-primary" />
                            {apt.timeRange || apt.timeStr}
                          </span>
                        </div>
                        <div>
                          <span className="block font-semibold text-brand-text">
                            Assigned Doctor:
                          </span>
                          <span className="text-brand-muted">{apt.doctor}</span>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="rounded border border-amber-100 bg-amber-50/60 p-2.5 text-xs text-brand-text">
                          <strong>Clinical Notes:</strong> {apt.notes}
                        </div>
                      )}

                      {/* Direct Patient Contact & Approval Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {apt.phone && (
                            <a
                              href={`tel:${apt.phone.replace(/[^\d+]/g, "")}`}
                              className="shadow-xs inline-flex items-center gap-1.5 rounded-clinic border border-brand-border bg-white px-2.5 py-1 text-xs font-semibold text-brand-text transition-all hover:border-brand-primary hover:text-brand-primary"
                            >
                              <Phone className="h-3.5 w-3.5 text-brand-primary" />
                              <span>Call {apt.phone}</span>
                            </a>
                          )}
                          {apt.phone && (
                            <a
                              href={`https://wa.me/${apt.phone.replace(/\D/g, "").length === 10 ? `91${apt.phone.replace(/\D/g, "")}` : apt.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Hello ${apt.patientName}, this is VS Dental Clinic regarding your scheduled appointment on ${formattedSelectedDate} (${apt.service}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shadow-xs inline-flex items-center gap-1 rounded-clinic bg-[#25D366] px-2.5 py-1 text-xs font-bold text-white transition-all hover:bg-[#20ba59]"
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>

                        {apt.status === "PENDING" && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleQuickApprove(apt.id)}
                            className="shadow-xs gap-1 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Confirm Booking</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
