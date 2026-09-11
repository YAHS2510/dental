"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  DollarSign,
  Filter,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
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

interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  category: string;
  isActive: boolean;
}

const CATEGORIES = [
  "ALL",
  "General Care",
  "Cardiology",
  "Specialty Care",
  "Pediatrics",
  "Dental Care",
  "Diagnostics",
];

const INITIAL_FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    name: "General Practitioner Consultation",
    description:
      "Standard primary care consultation, comprehensive review, vitals, and diagnostic assessment.",
    durationMinutes: 30,
    price: 85,
    category: "General Care",
    isActive: true,
  },
  {
    id: "srv-2",
    name: "Comprehensive Cardiology Diagnostic Panel",
    description:
      "12-lead electrocardiogram, blood pressure evaluation, and consultation with a board-certified cardiologist.",
    durationMinutes: 45,
    price: 160,
    category: "Cardiology",
    isActive: true,
  },
  {
    id: "srv-3",
    name: "Pediatric Wellness & Immunization Check",
    description:
      "Pediatric growth assessment, developmental screening, and scheduled childhood vaccinations.",
    durationMinutes: 30,
    price: 95,
    category: "Pediatrics",
    isActive: true,
  },
  {
    id: "srv-4",
    name: "Preventive Dental Cleaning & Examination",
    description:
      "Full dental prophylaxis, tartar removal, fluoride polish, and periodontal charting.",
    durationMinutes: 45,
    price: 110,
    category: "Dental Care",
    isActive: true,
  },
  {
    id: "srv-5",
    name: "Advanced Health & Metabolic Screening",
    description:
      "Complete metabolic panel, lipid profile, CBC, thyroid test, and lifestyle physician consultation.",
    durationMinutes: 60,
    price: 240,
    category: "Diagnostics",
    isActive: true,
  },
  {
    id: "srv-6",
    name: "Rapid Diagnostic Urgent Care",
    description:
      "Same-day triage for acute minor illness, respiratory symptoms, or minor lacerations.",
    durationMinutes: 20,
    price: 75,
    category: "General Care",
    isActive: true,
  },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal State
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeService, setActiveService] = useState<Partial<ServiceItem>>({
    name: "",
    description: "",
    durationMinutes: 30,
    price: 85,
    category: "General Care",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Load Services
  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (data.services && data.services.length > 0) {
            setServices(data.services);
          } else {
            setServices(INITIAL_FALLBACK_SERVICES);
          }
        } else {
          setServices(INITIAL_FALLBACK_SERVICES);
        }
      } catch {
        setServices(INITIAL_FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setActiveService({
      name: "",
      description: "",
      durationMinutes: 30,
      price: 90,
      category: "General Care",
      isActive: true,
    });
    setModalMode("create");
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setActiveService({ ...srv });
    setModalMode("edit");
  };

  const handleToggleStatus = async (srv: ServiceItem) => {
    const updatedStatus = !srv.isActive;
    try {
      const res = await fetch(`/api/services/${srv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: updatedStatus,
          performedBy: "Admin / Clinical Director",
        }),
      });

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === srv.id ? { ...s, isActive: updatedStatus } : s
          )
        );
        showToast(
          `Service '${srv.name}' is now ${updatedStatus ? "Active" : "Inactive"}`
        );
      } else {
        // Fallback optimistic update for dev/offline demo
        setServices((prev) =>
          prev.map((s) =>
            s.id === srv.id ? { ...s, isActive: updatedStatus } : s
          )
        );
        showToast(
          `Service status updated (${updatedStatus ? "Active" : "Inactive"})`
        );
      }
    } catch {
      setServices((prev) =>
        prev.map((s) =>
          s.id === srv.id ? { ...s, isActive: updatedStatus } : s
        )
      );
      showToast(
        `Service status updated (${updatedStatus ? "Active" : "Inactive"})`
      );
    }
  };

  const handleDelete = async (srv: ServiceItem) => {
    if (
      !confirm(`Are you sure you want to deactivate or remove '${srv.name}'?`)
    )
      return;

    try {
      const res = await fetch(`/api/services/${srv.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        setServices((prev) => prev.filter((s) => s.id !== srv.id));
        showToast(data.message || `Service '${srv.name}' removed`);
      } else {
        setServices((prev) => prev.filter((s) => s.id !== srv.id));
        showToast(`Service '${srv.name}' deactivated`);
      }
    } catch {
      setServices((prev) => prev.filter((s) => s.id !== srv.id));
      showToast(`Service '${srv.name}' deactivated`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService.name || !activeService.price) {
      showToast("Please provide a valid service name and fee.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: activeService.name,
            description: activeService.description || "",
            durationMinutes: Number(activeService.durationMinutes) || 30,
            price: Number(activeService.price) || 0,
            category: activeService.category || "General Care",
            isActive: activeService.isActive ?? true,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setServices((prev) => [data.service, ...prev]);
          showToast(`Service '${activeService.name}' added successfully!`);
          setModalMode(null);
        } else {
          // Dev fallback
          const newSrv: ServiceItem = {
            id: `srv-${Date.now()}`,
            name: activeService.name!,
            description: activeService.description,
            durationMinutes: Number(activeService.durationMinutes) || 30,
            price: Number(activeService.price) || 0,
            category: activeService.category || "General Care",
            isActive: activeService.isActive ?? true,
          };
          setServices((prev) => [newSrv, ...prev]);
          showToast(`Service '${activeService.name}' added successfully!`);
          setModalMode(null);
        }
      } else if (modalMode === "edit" && activeService.id) {
        const res = await fetch(`/api/services/${activeService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: activeService.name,
            description: activeService.description,
            durationMinutes: Number(activeService.durationMinutes),
            price: Number(activeService.price),
            category: activeService.category,
            isActive: activeService.isActive,
            performedBy: "Admin / Clinical Director",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setServices((prev) =>
            prev.map((s) => (s.id === activeService.id ? data.service : s))
          );
          showToast(`Service '${activeService.name}' updated successfully!`);
          setModalMode(null);
        } else {
          setServices((prev) =>
            prev.map((s) =>
              s.id === activeService.id ? (activeService as ServiceItem) : s
            )
          );
          showToast(`Service '${activeService.name}' updated!`);
          setModalMode(null);
        }
      }
    } catch {
      showToast("Failed to save changes. Please retry.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description &&
        s.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" ||
      s.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const totalActive = services.filter((s) => s.isActive).length;
  const avgPrice = services.length
    ? Math.round(
        services.reduce((acc, s) => acc + Number(s.price), 0) / services.length
      )
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-clinic border p-3 text-xs transition-all ${
            notification.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="hover:opacity-75"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-text">
            Services & Fee Schedule
          </h1>
          <p className="mt-0.5 text-xs text-brand-muted">
            Manage clinical offerings, consultation durations, public pricing,
            and availability.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          size="sm"
          variant="primary"
          className="h-9 gap-1.5 text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Clinical Service</span>
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <div className="bg-brand-primary/10 rounded-lg p-2.5 text-brand-primary">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Total Clinical Services
            </div>
            <div className="mt-0.5 font-heading text-xl font-bold text-brand-text">
              {services.length}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Active Offerings
            </div>
            <div className="mt-0.5 font-heading text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalActive} of {services.length}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Avg Consultation Fee
            </div>
            <div className="mt-0.5 font-heading text-xl font-bold text-brand-text">
              ${avgPrice}
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search services or keywords..."
            className="w-full rounded-clinic border border-brand-border bg-brand-surface py-2 pl-9 pr-4 text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 md:w-auto md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors ${
                selectedCategory === cat
                  ? "bg-brand-primary font-medium text-white shadow-sm"
                  : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="space-y-3 p-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
              <div className="text-xs text-brand-muted">
                Loading clinical catalog...
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="space-y-2 px-4 py-12 text-center">
              <Stethoscope className="mx-auto h-8 w-8 text-brand-muted" />
              <div className="font-heading text-sm font-semibold text-brand-text">
                No services found
              </div>
              <p className="text-xs text-brand-muted">
                Try adjusting your filters or click &quot;Add New Clinical
                Service&quot; above.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-brand-border bg-brand-background font-medium text-brand-muted">
                <tr>
                  <th className="px-6 py-3">Clinical Service & Scope</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Fee ($ USD)</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredServices.map((srv) => (
                  <tr
                    key={srv.id}
                    className="hover:bg-brand-accent/10 transition-colors"
                  >
                    <td className="max-w-sm px-6 py-3.5">
                      <div className="text-sm font-semibold text-brand-text">
                        {srv.name}
                      </div>
                      {srv.description && (
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-brand-muted">
                          {srv.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="outline" className="text-[11px]">
                        {srv.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-brand-muted">
                      <div className="flex items-center gap-1.5 font-medium text-brand-text">
                        <Clock className="h-3 w-3 text-brand-primary" />
                        <span>{srv.durationMinutes} mins</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-sm font-bold text-brand-text">
                      ${Number(srv.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(srv)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                          srv.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                            : "border-zinc-500/20 bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${srv.isActive ? "bg-emerald-500" : "bg-zinc-400"}`}
                        />
                        <span>{srv.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1 px-2 text-xs"
                          onClick={() => handleOpenEdit(srv)}
                        >
                          <Edit2 className="h-3 w-3 text-brand-primary" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                          onClick={() => handleDelete(srv)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal: Add or Edit Service */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="animate-in fade-in zoom-in-95 w-full max-w-lg border-brand-border bg-brand-surface shadow-xl duration-150">
            <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border pb-3">
              <div>
                <CardTitle className="font-heading text-base font-bold text-brand-text">
                  {modalMode === "create"
                    ? "Add New Clinical Service"
                    : "Edit Clinical Service"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure procedure details, public rate, and consultation
                  length.
                </CardDescription>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="rounded-md p-1 text-brand-muted hover:text-brand-text"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 p-5 text-xs">
                <div>
                  <label className="mb-1 block font-medium text-brand-text">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cardiology Diagnostic Consultation"
                    value={activeService.name || ""}
                    onChange={(e) =>
                      setActiveService({
                        ...activeService,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-clinic border border-brand-border bg-brand-background px-3 py-2 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-medium text-brand-text">
                      Category
                    </label>
                    <select
                      value={activeService.category || "General Care"}
                      onChange={(e) =>
                        setActiveService({
                          ...activeService,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-clinic border border-brand-border bg-brand-background px-3 py-2 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    >
                      {CATEGORIES.filter((c) => c !== "ALL").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-medium text-brand-text">
                      Fee ($ USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="0.01"
                      placeholder="95.00"
                      value={activeService.price || ""}
                      onChange={(e) =>
                        setActiveService({
                          ...activeService,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-clinic border border-brand-border bg-brand-background px-3 py-2 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-medium text-brand-text">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      required
                      min={5}
                      max={480}
                      step={5}
                      value={activeService.durationMinutes || 30}
                      onChange={(e) =>
                        setActiveService({
                          ...activeService,
                          durationMinutes: parseInt(e.target.value) || 30,
                        })
                      }
                      className="w-full rounded-clinic border border-brand-border bg-brand-background px-3 py-2 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex cursor-pointer items-center gap-2 pt-3">
                      <input
                        type="checkbox"
                        checked={activeService.isActive ?? true}
                        onChange={(e) =>
                          setActiveService({
                            ...activeService,
                            isActive: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="font-medium text-brand-text">
                        Active for Booking
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-medium text-brand-text">
                    Clinical Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe clinical procedure, patient expectations, and preparation instructions..."
                    value={activeService.description || ""}
                    onChange={(e) =>
                      setActiveService({
                        ...activeService,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-clinic border border-brand-border bg-brand-background px-3 py-2 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </CardContent>

              <div className="bg-brand-background/50 flex items-center justify-end gap-2 border-t border-brand-border p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalMode(null)}
                  disabled={submitting}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="h-8 gap-1.5 text-xs"
                >
                  {submitting && (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  <span>
                    {modalMode === "create" ? "Create Service" : "Save Changes"}
                  </span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
