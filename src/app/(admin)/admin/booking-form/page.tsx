"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Stethoscope,
  Clock,
  User,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookingFormConfig,
  BookingFormFieldConfig,
  defaultBookingFormConfig,
} from "@/data/booking-form-config";

export default function AdminBookingFormBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active configuration state
  const [config, setConfig] = useState<BookingFormConfig>(
    defaultBookingFormConfig
  );
  const [activeTab, setActiveTab] = useState<
    "fields" | "treatments" | "slots" | "doctors" | "preview"
  >("fields");

  // New item input states
  const [newTreatment, setNewTreatment] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [newDoctor, setNewDoctor] = useState("");

  // Custom Field Creator Modal State
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState("");
  const [customFieldType, setCustomFieldType] = useState<
    "text" | "select" | "checkbox" | "textarea"
  >("text");
  const [customFieldRequired, setCustomFieldRequired] = useState(false);
  const [customFieldOptions, setCustomFieldOptions] = useState("");
  const [customFieldPlaceholder, setCustomFieldPlaceholder] = useState("");

  // Fetch live configuration from API
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/booking-form/config");
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch {
      setErrorMsg("Failed to load booking form configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Save updated config to API
  const handleSaveConfig = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/booking-form/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setSuccessMsg(
          "Booking form configuration updated successfully! All changes are live on the website."
        );
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.error || "Failed to save configuration.");
      }
    } catch {
      setErrorMsg("Network error saving configuration.");
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleResetDefaults = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all booking form fields, treatments, and time slots to default clinic settings?"
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/booking-form/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setSuccessMsg("Reset to clinic default configuration successfully.");
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch {
      setErrorMsg("Failed to reset configuration.");
    } finally {
      setSaving(false);
    }
  };

  // Field toggles
  const toggleFieldEnabled = (fieldId: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === fieldId ? { ...f, enabled: !f.enabled } : f
      ),
    }));
  };

  const toggleFieldRequired = (fieldId: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === fieldId ? { ...f, required: !f.required } : f
      ),
    }));
  };

  const deleteCustomField = (fieldId: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
    }));
  };

  // Add Custom Field Submit
  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFieldLabel.trim()) return;

    const newId = `custom_${Date.now()}`;
    const optionsArray =
      customFieldType === "select"
        ? customFieldOptions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    const newField: BookingFormFieldConfig = {
      id: newId,
      label: customFieldLabel.trim(),
      type: customFieldType,
      required: customFieldRequired,
      enabled: true,
      placeholder: customFieldPlaceholder.trim() || undefined,
      options: optionsArray,
      isCustom: true,
      helpText: "Custom question added by clinic administrator",
    };

    setConfig((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    // Reset modal form
    setCustomFieldLabel("");
    setCustomFieldType("text");
    setCustomFieldRequired(false);
    setCustomFieldOptions("");
    setCustomFieldPlaceholder("");
    setCustomFieldModalOpen(false);
    setSuccessMsg(
      `Added custom field "${newField.label}". Remember to click "Save Changes"!`
    );
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Treatments manager
  const handleAddTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreatment.trim()) return;
    if (config.treatments.includes(newTreatment.trim())) {
      alert("This treatment option already exists.");
      return;
    }
    setConfig((prev) => ({
      ...prev,
      treatments: [...prev.treatments, newTreatment.trim()],
    }));
    setNewTreatment("");
  };

  const handleDeleteTreatment = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      treatments: prev.treatments.filter((_, idx) => idx !== index),
    }));
  };

  // Time slots manager
  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimeSlot.trim()) return;
    if (config.timeSlots.includes(newTimeSlot.trim())) {
      alert("This time slot already exists.");
      return;
    }
    setConfig((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newTimeSlot.trim()],
    }));
    setNewTimeSlot("");
  };

  const handleDeleteTimeSlot = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, idx) => idx !== index),
    }));
  };

  // Doctors manager
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.trim()) return;
    if (config.doctors.includes(newDoctor.trim())) {
      alert("This doctor already exists.");
      return;
    }
    setConfig((prev) => ({
      ...prev,
      doctors: [...prev.doctors, newDoctor.trim()],
    }));
    setNewDoctor("");
  };

  const handleDeleteDoctor = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      doctors: prev.doctors.filter((_, idx) => idx !== index),
    }));
  };

  const enabledFieldsCount = config.fields.filter((f) => f.enabled).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header with Save & Reset Buttons */}
      <div className="flex flex-col gap-4 border-b border-brand-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-brand-text">
              Booking Form Builder &amp; Field Settings
            </h1>
            <Badge
              variant="default"
              className="bg-emerald-600 text-xs text-white"
            >
              Admin Live Control
            </Badge>
          </div>
          <p className="mt-1 text-xs text-brand-muted sm:text-sm">
            Add, remove, toggle, or customize any field, question, treatment
            concern, time slot, or doctor in the public appointment booking
            form.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            disabled={saving}
            className="gap-1.5 text-xs text-brand-muted hover:text-brand-text"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveConfig}
            disabled={saving}
            className="shadow-xs gap-1.5 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
          >
            <Save className={`h-3.5 w-3.5 ${saving ? "animate-spin" : ""}`} />
            <span>{saving ? "Saving Changes..." : "Save & Apply Live"}</span>
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="shadow-xs flex items-center justify-between rounded-clinic border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="ml-4 font-bold text-emerald-700 hover:text-emerald-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMsg && (
        <div className="shadow-xs flex items-center justify-between rounded-clinic border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="ml-4 font-bold text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Quick KPI Stat Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-brand-border bg-brand-surface p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Total Form Fields
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand-text">
              {config.fields.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              ({enabledFieldsCount} active)
            </span>
          </div>
        </Card>

        <Card className="border-brand-border bg-brand-surface p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Treatments &amp; Concerns
          </div>
          <div className="mt-1 text-2xl font-bold text-brand-text">
            {config.treatments.length}
          </div>
        </Card>

        <Card className="border-brand-border bg-brand-surface p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Active Time Slots
          </div>
          <div className="mt-1 text-2xl font-bold text-brand-text">
            {config.timeSlots.length}
          </div>
        </Card>

        <Card className="border-brand-border bg-brand-surface p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Available Doctors
          </div>
          <div className="mt-1 text-2xl font-bold text-brand-text">
            {config.doctors.length}
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("fields")}
          className={`flex items-center gap-1.5 rounded-clinic px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "fields"
              ? "shadow-xs bg-brand-primary text-white"
              : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Form Fields &amp; Questions ({config.fields.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("treatments")}
          className={`flex items-center gap-1.5 rounded-clinic px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "treatments"
              ? "shadow-xs bg-brand-primary text-white"
              : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
          }`}
        >
          <Stethoscope className="h-3.5 w-3.5" />
          <span>Treatments &amp; Concerns ({config.treatments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("slots")}
          className={`flex items-center gap-1.5 rounded-clinic px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "slots"
              ? "shadow-xs bg-brand-primary text-white"
              : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Time Slots ({config.timeSlots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("doctors")}
          className={`flex items-center gap-1.5 rounded-clinic px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "doctors"
              ? "shadow-xs bg-brand-primary text-white"
              : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Doctors List ({config.doctors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-1.5 rounded-clinic px-3.5 py-2 text-xs font-bold transition-all ${
            activeTab === "preview"
              ? "shadow-xs bg-brand-primary text-white"
              : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Live Form Preview</span>
        </button>
      </div>

      {/* TAB 1: FORM FIELDS & CUSTOM QUESTIONS */}
      {activeTab === "fields" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-brand-text">
                Manage Booking Form Fields
              </h2>
              <p className="text-xs text-brand-muted">
                Toggle fields on or off to show/hide them on the public form.
                Mark fields as mandatory or optional.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCustomFieldModalOpen(true)}
              className="border-brand-primary/40 hover:bg-brand-primary/10 gap-1.5 text-xs font-bold text-brand-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Field / Question</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {config.fields.map((field) => (
              <Card
                key={field.id}
                className={`border p-4 transition-all ${
                  field.enabled
                    ? "shadow-xs border-brand-border bg-brand-surface"
                    : "border-dashed border-slate-300 bg-slate-50/70 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-bold text-brand-text">
                        {field.label}
                      </span>
                      {field.isCustom && (
                        <span className="py-0.2 rounded bg-purple-100 px-1.5 text-[9px] font-bold text-purple-800">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase text-brand-muted">
                        Type: {field.type}
                      </span>
                      {field.required ? (
                        <span className="py-0.2 rounded bg-red-100 px-1.5 text-[9px] font-bold text-red-800">
                          Required
                        </span>
                      ) : (
                        <span className="py-0.2 rounded bg-slate-100 px-1.5 text-[9px] text-slate-600">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>

                  {field.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteCustomField(field.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete custom field"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {field.helpText && (
                  <p className="mt-2 text-[11px] leading-relaxed text-brand-muted">
                    {field.helpText}
                  </p>
                )}

                {/* Field Controls: Enabled Toggle & Required Toggle */}
                <div className="border-brand-border/60 mt-4 flex items-center justify-between border-t pt-3 text-xs">
                  <label className="flex cursor-pointer select-none items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={() => toggleFieldEnabled(field.id)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="font-semibold text-brand-text">
                      {field.enabled ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Eye className="h-3 w-3" /> Visible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      )}
                    </span>
                  </label>

                  <label className="flex cursor-pointer select-none items-center gap-1.5 text-brand-muted hover:text-brand-text">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={() => toggleFieldRequired(field.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-[11px]">Mandatory</span>
                  </label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TREATMENTS & CONCERNS MANAGER */}
      {activeTab === "treatments" && (
        <Card className="border-brand-border p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-text">
                  Treatment Options on Booking Form
                </h2>
                <p className="text-xs text-brand-muted">
                  These treatments appear in the &quot;Treatment or
                  Concern&quot; dropdown on the public booking form and WhatsApp
                  widget.
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {config.treatments.length} Options
              </Badge>
            </div>

            {/* Add New Treatment Form */}
            <form onSubmit={handleAddTreatment} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter new dental treatment or clinical procedure..."
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                className="text-xs"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="gap-1 whitespace-nowrap font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Treatment</span>
              </Button>
            </form>

            {/* Treatments List */}
            <div className="divide-brand-border/60 divide-y rounded-clinic border border-brand-border bg-brand-surface">
              {config.treatments.map((treatment, idx) => (
                <div
                  key={idx}
                  className="hover:bg-brand-background/50 flex items-center justify-between p-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 font-mono text-xs text-brand-muted">
                      {idx + 1}.
                    </span>
                    <span className="font-medium text-brand-text">
                      {treatment}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTreatment(idx)}
                    className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    title="Remove treatment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: TIME SLOTS MANAGER */}
      {activeTab === "slots" && (
        <Card className="border-brand-border p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-text">
                  Time Slots &amp; Shift Schedule
                </h2>
                <p className="text-xs text-brand-muted">
                  Patients select from these available time slot ranges when
                  requesting their appointment.
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {config.timeSlots.length} Slots
              </Badge>
            </div>

            {/* Add New Time Slot Form */}
            <form onSubmit={handleAddTimeSlot} className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g. Early Morning (8:00 AM - 9:30 AM) or Night Care..."
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="text-xs"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="gap-1 whitespace-nowrap font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Time Slot</span>
              </Button>
            </form>

            {/* Time Slots List */}
            <div className="divide-brand-border/60 divide-y rounded-clinic border border-brand-border bg-brand-surface">
              {config.timeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="hover:bg-brand-background/50 flex items-center justify-between p-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-3.5 w-3.5 text-brand-primary" />
                    <span className="font-medium text-brand-text">{slot}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTimeSlot(idx)}
                    className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    title="Remove slot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: DOCTORS ON BOOKING FORM */}
      {activeTab === "doctors" && (
        <Card className="border-brand-border p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-text">
                  Doctors Appearing in Booking Form
                </h2>
                <p className="text-xs text-brand-muted">
                  Doctors and specialists available for patients to pick in the
                  &quot;Preferred Doctor&quot; dropdown.
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {config.doctors.length} Doctors
              </Badge>
            </div>

            {/* Add New Doctor Form */}
            <form onSubmit={handleAddDoctor} className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g. Dr. Name, Degree (Specialty)..."
                value={newDoctor}
                onChange={(e) => setNewDoctor(e.target.value)}
                className="text-xs"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="gap-1 whitespace-nowrap font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Doctor</span>
              </Button>
            </form>

            {/* Doctors List */}
            <div className="divide-brand-border/60 divide-y rounded-clinic border border-brand-border bg-brand-surface">
              {config.doctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="hover:bg-brand-background/50 flex items-center justify-between p-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="h-3.5 w-3.5 text-brand-primary" />
                    <span className="font-medium text-brand-text">{doc}</span>
                  </div>

                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteDoctor(idx)}
                      className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                      title="Remove doctor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: LIVE PREVIEW */}
      {activeTab === "preview" && (
        <Card className="border-brand-border p-6">
          <div className="space-y-4">
            <div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                Real-Time Public Preview
              </span>
              <h2 className="mt-1 font-heading text-lg font-bold text-brand-text">
                Live Preview of Patient Booking Form
              </h2>
              <p className="text-xs text-brand-muted">
                This shows exactly how the appointment form renders to patients
                on the website with your current settings.
              </p>
            </div>

            {/* Mock Booking Form rendering current state */}
            <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-600">
                    {config.headerBadge}
                  </span>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    {config.title}
                  </h3>
                </div>
                <div className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {config.clinicName}
                </div>
              </div>

              {/* Render enabled fields */}
              <div className="space-y-3">
                {config.fields
                  .filter((f) => f.enabled)
                  .map((f) => (
                    <div key={f.id} className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        {f.label}{" "}
                        {f.required ? (
                          <span className="text-red-500">*</span>
                        ) : (
                          <span className="font-normal text-slate-400">
                            (Optional)
                          </span>
                        )}
                      </label>

                      {f.id === "patientType" ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-2 text-center font-bold text-emerald-800">
                            Adult Patient
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-center text-slate-600">
                            Child Patient
                          </div>
                        </div>
                      ) : f.id === "treatment" ? (
                        <select className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs">
                          {config.treatments.map((t, i) => (
                            <option key={i}>{t}</option>
                          ))}
                        </select>
                      ) : f.id === "preferredDoctor" ? (
                        <select className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs">
                          {config.doctors.map((d, i) => (
                            <option key={i}>{d}</option>
                          ))}
                        </select>
                      ) : f.id === "timeRange" ? (
                        <select className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs">
                          {config.timeSlots.map((s, i) => (
                            <option key={i}>{s}</option>
                          ))}
                        </select>
                      ) : f.id === "contactMethod" ? (
                        <div className="flex gap-4 pt-1">
                          <label className="flex items-center gap-1.5">
                            <input type="radio" checked readOnly />
                            <span>Phone Call</span>
                          </label>
                          <label className="flex items-center gap-1.5">
                            <input type="radio" readOnly />
                            <span>WhatsApp</span>
                          </label>
                        </div>
                      ) : f.type === "textarea" ? (
                        <textarea
                          rows={2}
                          placeholder={f.placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"
                          readOnly
                        />
                      ) : f.type === "checkbox" ? (
                        <label className="flex items-center gap-2 pt-1">
                          <input type="checkbox" checked readOnly />
                          <span className="text-[11px] text-slate-600">
                            I agree to receive clinic communications regarding
                            this appointment.
                          </span>
                        </label>
                      ) : f.type === "select" && f.options ? (
                        <select className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs">
                          {f.options.map((opt, i) => (
                            <option key={i}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"
                          readOnly
                        />
                      )}
                    </div>
                  ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="shadow-xs flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#881318] font-bold text-white"
                >
                  <span>{config.submitButtonText}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* MODAL: ADD CUSTOM FIELD */}
      {customFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md space-y-4 rounded-clinic border border-brand-border bg-brand-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-brand-border pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-brand-text">
                  Add Custom Field / Question
                </h3>
                <p className="text-xs text-brand-muted">
                  Create a new question to show in the appointment booking form.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomFieldModalOpen(false)}
                className="text-base text-brand-muted hover:text-brand-text"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleAddCustomField}
              className="space-y-3.5 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-brand-text">
                  Question / Field Label *
                </label>
                <Input
                  required
                  placeholder="e.g. Do you have dental insurance? or Referral Code"
                  value={customFieldLabel}
                  onChange={(e) => setCustomFieldLabel(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-brand-text">
                  Field Input Type
                </label>
                <select
                  value={customFieldType}
                  onChange={(e) =>
                    setCustomFieldType(
                      e.target.value as
                        "text" | "select" | "checkbox" | "textarea"
                    )
                  }
                  className="h-9 w-full rounded-clinic border border-brand-border bg-brand-background px-3 text-xs text-brand-text"
                >
                  <option value="text">Single Line Text</option>
                  <option value="select">Dropdown Selection</option>
                  <option value="textarea">Multi-line Paragraph</option>
                  <option value="checkbox">Single Checkbox (Yes/No)</option>
                </select>
              </div>

              {customFieldType === "select" && (
                <div className="space-y-1">
                  <label className="font-semibold text-brand-text">
                    Dropdown Options (comma-separated) *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Yes, No, Self-Pay, Private Insurance"
                    value={customFieldOptions}
                    onChange={(e) => setCustomFieldOptions(e.target.value)}
                    className="text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-brand-text">
                  Placeholder Text (Optional)
                </label>
                <Input
                  placeholder="e.g. Enter details here..."
                  value={customFieldPlaceholder}
                  onChange={(e) => setCustomFieldPlaceholder(e.target.value)}
                  className="text-xs"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={customFieldRequired}
                  onChange={(e) => setCustomFieldRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-primary"
                />
                <span className="font-semibold text-brand-text">
                  Mark this custom question as mandatory (Required)
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 border-t border-brand-border pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomFieldModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-brand-primary font-bold text-white"
                >
                  Add Field to Form
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
