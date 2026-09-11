"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Palette,
  Check,
  Building2,
  Database,
  Mail,
  Bot,
  Save,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Stethoscope,
  Smile,
  HeartPulse,
  ShieldCheck,
  Hospital,
  Activity,
  Cross,
  Eye,
  Pill,
  Shield,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useClinicTheme } from "@/components/theme/clinic-theme-provider";
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
import { ClinicLogo } from "@/components/ui/clinic-logo";
import {
  ClinicLogoConfig,
  LogoIconName,
  LogoShape,
  LogoType,
} from "@/types/branding";

const PRESET_ICONS: { name: LogoIconName; label: string; icon: any }[] = [
  { name: "Stethoscope", label: "General Practice", icon: Stethoscope },
  { name: "Smile", label: "Dental Care", icon: Smile },
  { name: "HeartPulse", label: "Cardiology", icon: HeartPulse },
  { name: "ShieldCheck", label: "Accredited Health", icon: ShieldCheck },
  { name: "Hospital", label: "Clinical Center", icon: Hospital },
  { name: "Activity", label: "Diagnostics & ECG", icon: Activity },
  { name: "Cross", label: "Emergency & First Aid", icon: Cross },
  { name: "Eye", label: "Ophthalmology / Vision", icon: Eye },
  { name: "Pill", label: "Pharmacy & Medicine", icon: Pill },
  { name: "Sparkles", label: "Cosmetic & Wellness", icon: Sparkles },
  { name: "Building2", label: "Multi-Specialty Facility", icon: Building2 },
];

const SAMPLE_LOGOS = [
  {
    name: "Dental Clinic Vector Logo",
    url: "/logos/dental-clinic-logo.svg",
    specialty: "Dental Surgery",
  },
  {
    name: "Cardiology Heart & Pulse",
    url: "/logos/heart-cardio-logo.svg",
    specialty: "Cardiology",
  },
  {
    name: "Modern Health Cross",
    url: "/logos/cross-health-logo.svg",
    specialty: "General Healthcare",
  },
];

export default function AdminSettingsPage() {
  const {
    currentTheme,
    themeKey,
    setThemeKey,
    availableThemes,
    brandConfig,
    updateBrandConfig,
    resetBrandConfig,
  } = useClinicTheme();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Logo configuration local draft state
  const [logoState, setLogoState] = useState<ClinicLogoConfig>(
    brandConfig.logo
  );
  const [clinicProfile, setClinicProfile] = useState({
    name: brandConfig.clinicName,
    slug: brandConfig.slug,
    email: brandConfig.email,
    phone: brandConfig.phone,
    address: brandConfig.address,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (brandConfig) {
      setLogoState(brandConfig.logo);
      setClinicProfile({
        name: brandConfig.clinicName,
        slug: brandConfig.slug,
        email: brandConfig.email,
        phone: brandConfig.phone,
        address: brandConfig.address,
      });
    }
  }, [brandConfig]);

  // Handle Logo Image File Upload (PNG, JPG, SVG, WebP)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Please select a valid image file (PNG, SVG, JPG, WebP)."
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image file size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoState((prev) => ({
        ...prev,
        type: "IMAGE",
        imageUrl: dataUrl,
      }));
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const ok = await updateBrandConfig({
      themeKey,
      clinicName: clinicProfile.name,
      slug: clinicProfile.slug,
      email: clinicProfile.email,
      phone: clinicProfile.phone,
      address: clinicProfile.address,
      logo: logoState,
    });

    setSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      setErrorMessage(
        "Failed to persist branding settings. Please verify administrator rights."
      );
    }
  };

  const handleResetDefaults = async () => {
    if (
      !confirm(
        "Reset all clinic branding, colors, and logo to default factory settings?"
      )
    ) {
      return;
    }
    setSaving(true);
    await resetBrandConfig();
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-text">
            Clinic Branding &amp; Logo Settings
          </h1>
          <p className="mt-0.5 text-xs text-brand-muted sm:text-sm">
            Customize the clinic brand logo, color palettes, typography, and
            clinic contact details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            disabled={saving}
            className="h-8 gap-1.5 text-xs text-brand-muted hover:text-red-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            disabled={saving}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Branding"}</span>
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-clinic border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            <strong>Clinic branding updated live!</strong> New logo, theme, and
            profile settings are now active across the entire website and admin
            portal.
          </span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-clinic border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-800 dark:text-red-300">
          <Shield className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: CLINIC LOGO CUSTOMIZER                                         */}
      {/* ========================================================================= */}
      <Card className="border-brand-primary/40 border-2 shadow-sm">
        <CardHeader className="border-brand-border/60 border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="shadow-xs flex h-10 w-10 items-center justify-center rounded-clinic bg-brand-primary text-brand-primary-foreground">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Clinic Logo &amp; Identity
                </CardTitle>
                <CardDescription>
                  Upload your clinic logo, pick an official medical emblem, or
                  set a custom monogram
                </CardDescription>
              </div>
            </div>
            <Badge variant="default" className="text-xs">
              Live Preview Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Live Logo Preview Box */}
          <div className="rounded-clinic border border-brand-border bg-brand-background p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Live Multi-Surface Logo Previews
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Preview 1: Navbar Preview */}
              <div className="flex flex-col justify-between rounded-clinic border border-brand-border bg-brand-surface p-3.5">
                <span className="text-[10px] font-semibold text-brand-muted">
                  Public Navbar (Desktop &amp; Mobile)
                </span>
                <div className="mt-3 flex items-center gap-2.5">
                  <ClinicLogo size="md" configOverride={logoState} />
                  <div>
                    <span className="block font-heading text-sm font-bold text-brand-text">
                      {logoState.clinicDisplayName || clinicProfile.name}
                    </span>
                    <span className="-mt-1 block text-[10px] text-brand-muted">
                      {logoState.tagline || currentTheme.name + " Center"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-brand-muted">
                  Size: 40×40px
                </div>
              </div>

              {/* Preview 2: Admin Sidebar Preview */}
              <div className="flex flex-col justify-between rounded-clinic border border-brand-border bg-brand-surface p-3.5">
                <span className="text-[10px] font-semibold text-brand-muted">
                  Admin Sidebar Header
                </span>
                <div className="mt-3 flex items-center gap-2.5">
                  <ClinicLogo size="sm" configOverride={logoState} />
                  <div>
                    <span className="block font-heading text-xs font-bold text-brand-text">
                      {logoState.clinicDisplayName || "HealthSphere"}
                    </span>
                    <span className="block text-[9px] text-brand-muted">
                      Clinical Portal
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-brand-muted">
                  Size: 32×32px
                </div>
              </div>

              {/* Preview 3: Large Brand Badge */}
              <div className="flex flex-col justify-between rounded-clinic border border-brand-border bg-brand-surface p-3.5">
                <span className="text-[10px] font-semibold text-brand-muted">
                  Portal Login &amp; Confirmation Badge
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <ClinicLogo size="xl" configOverride={logoState} />
                  <div>
                    <span className="block font-heading text-sm font-bold text-brand-text">
                      Official Clinic Seal
                    </span>
                    <span className="text-[10px] text-brand-muted">
                      Format: {logoState.type}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-brand-muted">
                  Size: 64×64px
                </div>
              </div>
            </div>
          </div>

          {/* Logo Type Tabs */}
          <div className="space-y-4">
            <label className="text-xs font-semibold text-brand-text">
              Choose Logo Format:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLogoState({ ...logoState, type: "ICON" })}
                className={`rounded-clinic border p-3 text-left transition-all ${
                  logoState.type === "ICON"
                    ? "bg-brand-primary/10 border-brand-primary ring-2 ring-brand-primary"
                    : "hover:border-brand-primary/50 border-brand-border bg-brand-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-brand-primary" />
                  <span className="text-xs font-bold text-brand-text">
                    Medical Icon
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-brand-muted">
                  Select from curated clinical icons
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLogoState({ ...logoState, type: "IMAGE" })}
                className={`rounded-clinic border p-3 text-left transition-all ${
                  logoState.type === "IMAGE"
                    ? "bg-brand-primary/10 border-brand-primary ring-2 ring-brand-primary"
                    : "hover:border-brand-primary/50 border-brand-border bg-brand-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-brand-primary" />
                  <span className="text-xs font-bold text-brand-text">
                    Custom Image / SVG
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-brand-muted">
                  Upload file or enter image URL
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLogoState({ ...logoState, type: "MONOGRAM" })}
                className={`rounded-clinic border p-3 text-left transition-all ${
                  logoState.type === "MONOGRAM"
                    ? "bg-brand-primary/10 border-brand-primary ring-2 ring-brand-primary"
                    : "hover:border-brand-primary/50 border-brand-border bg-brand-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xs font-extrabold text-brand-primary">
                    HS
                  </span>
                  <span className="text-xs font-bold text-brand-text">
                    Monogram Initials
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-brand-muted">
                  Stylized clinic name initials
                </p>
              </button>
            </div>
          </div>

          {/* Type 1: Preset Icons Selection */}
          {logoState.type === "ICON" && (
            <div className="space-y-3 rounded-clinic border border-brand-border bg-brand-surface p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-brand-text">
                  Choose Medical Icon Emblem:
                </label>
                <span className="text-[11px] text-brand-muted">
                  Active: <strong>{logoState.iconName}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {PRESET_ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = logoState.iconName === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        setLogoState((prev) => ({
                          ...prev,
                          iconName: item.name,
                        }))
                      }
                      className={`flex items-center gap-2.5 rounded-clinic border p-2.5 text-left transition-all ${
                        isSelected
                          ? "shadow-xs border-brand-primary bg-brand-primary text-brand-primary-foreground"
                          : "hover:border-brand-primary/50 border-brand-border bg-brand-background text-brand-text"
                      }`}
                    >
                      <IconComp className="h-4 w-4 shrink-0" />
                      <span className="truncate text-xs font-medium">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Type 2: Custom Image Logo (Upload or URL) */}
          {logoState.type === "IMAGE" && (
            <div className="space-y-4 rounded-clinic border border-brand-border bg-brand-surface p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-brand-text">
                  Upload Custom Clinic Logo Image:
                </label>
                {logoState.imageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLogoState((prev) => ({
                        ...prev,
                        imageUrl: "",
                      }))
                    }
                    className="h-7 gap-1 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear Image</span>
                  </Button>
                )}
              </div>

              {/* Upload Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="hover:border-brand-primary/60 bg-brand-background/60 flex cursor-pointer flex-col items-center justify-center rounded-clinic border-2 border-dashed border-brand-border p-6 text-center transition-colors"
              >
                <div className="bg-brand-primary/10 flex h-10 w-10 items-center justify-center rounded-full text-brand-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="mt-2 text-xs font-semibold text-brand-text">
                  Click to browse and upload clinic logo image
                </div>
                <p className="mt-0.5 text-[11px] text-brand-muted">
                  Supports PNG, SVG, JPG, WebP (Max 2MB). Transparent background
                  recommended.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Or Direct Image URL Input */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-brand-text">
                  Or Enter Direct Image URL:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/logo.png or /logos/dental-clinic-logo.svg"
                    value={logoState.imageUrl}
                    onChange={(e) =>
                      setLogoState((prev) => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              {/* Ready-to-Use Vector SVG Presets */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold text-brand-muted">
                  Or select a ready-made clinic vector logo:
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {SAMPLE_LOGOS.map((sample) => (
                    <button
                      key={sample.url}
                      type="button"
                      onClick={() =>
                        setLogoState((prev) => ({
                          ...prev,
                          imageUrl: sample.url,
                        }))
                      }
                      className={`flex items-center gap-2.5 rounded-clinic border p-2 text-left transition-all ${
                        logoState.imageUrl === sample.url
                          ? "bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary"
                          : "hover:border-brand-primary/50 border-brand-border bg-brand-background"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="h-8 w-8 shrink-0 rounded object-contain"
                      />
                      <div className="overflow-hidden">
                        <div className="truncate text-xs font-semibold text-brand-text">
                          {sample.name}
                        </div>
                        <div className="text-[10px] text-brand-muted">
                          {sample.specialty}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Type 3: Monogram Initials */}
          {logoState.type === "MONOGRAM" && (
            <div className="space-y-3 rounded-clinic border border-brand-border bg-brand-surface p-4">
              <label className="text-xs font-semibold text-brand-text">
                Clinic Monogram Letters (1-3 Characters):
              </label>
              <div className="flex items-center gap-4">
                <Input
                  maxLength={3}
                  placeholder="e.g. HS, VS, MD"
                  value={logoState.monogramText}
                  onChange={(e) =>
                    setLogoState((prev) => ({
                      ...prev,
                      monogramText: e.target.value.toUpperCase(),
                    }))
                  }
                  className="w-32 text-base font-bold uppercase tracking-wider"
                />
                <span className="text-xs text-brand-muted">
                  Preview in active badge:{" "}
                  <strong>{logoState.monogramText || "HS"}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Logo Presentation & Text Controls */}
          <div className="grid grid-cols-1 gap-4 border-t border-brand-border pt-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-text">
                Logo Badge Shape
              </label>
              <select
                value={logoState.shape}
                onChange={(e) =>
                  setLogoState((prev) => ({
                    ...prev,
                    shape: e.target.value as LogoShape,
                  }))
                }
                className="w-full rounded-clinic border border-brand-border bg-brand-background px-3 py-2 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                <option value="rounded">Clinic Theme Radius (Default)</option>
                <option value="circle">Full Circle</option>
                <option value="square">Subtle Rounded Square</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-text">
                Clinic Brand Display Name
              </label>
              <Input
                value={logoState.clinicDisplayName}
                onChange={(e) =>
                  setLogoState((prev) => ({
                    ...prev,
                    clinicDisplayName: e.target.value,
                  }))
                }
                placeholder="HealthSphere or Clinic Name"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-text">
                Brand Subtitle / Tagline
              </label>
              <Input
                value={logoState.tagline}
                onChange={(e) =>
                  setLogoState((prev) => ({
                    ...prev,
                    tagline: e.target.value,
                  }))
                }
                placeholder="Medical Center, Dental Care, etc."
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* SECTION 2: THEME CUSTOMIZER SHOWCASE                                      */}
      {/* ========================================================================= */}
      <Card className="border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-clinic bg-brand-primary text-brand-primary-foreground">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Swappable Clinic Theme System
                </CardTitle>
                <CardDescription>
                  Switch color schemes and aesthetics instantly across the
                  public site and admin portal
                </CardDescription>
              </div>
            </div>
            <Badge variant="default" className="gap-1.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
              <span>Current: {currentTheme.name}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(availableThemes).map((theme) => {
              const isSelected = themeKey === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setThemeKey(theme.id)}
                  className={`relative cursor-pointer rounded-clinic border p-4 transition-all ${
                    isSelected
                      ? "bg-brand-accent/20 border-brand-primary ring-2 ring-brand-primary"
                      : "hover:border-brand-primary/50 border-brand-border bg-brand-surface"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-brand-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-6 w-6 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="-ml-2 h-6 w-6 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="-ml-2 h-6 w-6 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                  <div className="font-heading text-sm font-bold text-brand-text">
                    {theme.name}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-brand-muted">
                    {theme.tagline}
                  </p>

                  <div className="border-brand-border/60 mt-3 flex items-center justify-between border-t pt-2 text-[10px] text-brand-muted">
                    <span>Radius: {theme.borderRadius}</span>
                    <span className="font-mono">{theme.colors.primary}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time preview snippet */}
          <div className="space-y-3 rounded-clinic border border-brand-border bg-brand-background p-4">
            <span className="text-xs font-semibold text-brand-text">
              Component Live Re-skinning Preview:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">
                Primary Button
              </Button>
              <Button variant="secondary" size="sm">
                Secondary Button
              </Button>
              <Button variant="outline" size="sm">
                Outline Button
              </Button>
              <Badge variant="default">Primary Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="success">Success Badge</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* SECTION 3: CLINIC PROFILE & CONTACT INFO                                  */}
      {/* ========================================================================= */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-brand-primary" />
              <div>
                <CardTitle className="text-base">
                  Clinic Profile Information
                </CardTitle>
                <CardDescription>
                  Multi-tenant details stored in PostgreSQL via Prisma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Clinic Legal Name
                </label>
                <Input
                  value={clinicProfile.name}
                  onChange={(e) =>
                    setClinicProfile({ ...clinicProfile, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  URL Tenant Slug
                </label>
                <Input
                  value={clinicProfile.slug}
                  onChange={(e) =>
                    setClinicProfile({ ...clinicProfile, slug: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Official Email
                </label>
                <Input
                  value={clinicProfile.email}
                  onChange={(e) =>
                    setClinicProfile({
                      ...clinicProfile,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Contact Phone
                </label>
                <Input
                  value={clinicProfile.phone}
                  onChange={(e) =>
                    setClinicProfile({
                      ...clinicProfile,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-text">
                Physical Address
              </label>
              <Input
                value={clinicProfile.address}
                onChange={(e) =>
                  setClinicProfile({
                    ...clinicProfile,
                    address: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Environment Integrations Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Integrated Services &amp; Environment Status
            </CardTitle>
            <CardDescription>
              Status of environment variables declared in .env.example
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-clinic border border-brand-border bg-brand-background p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Database className="h-4 w-4 text-brand-primary" />
                <div>
                  <div className="font-semibold text-brand-text">
                    PostgreSQL Database (Prisma ORM)
                  </div>
                  <div className="text-[11px] text-brand-muted">
                    DATABASE_URL connected
                  </div>
                </div>
              </div>
              <Badge variant="success">Active (Prisma 5.x)</Badge>
            </div>

            <div className="flex items-center justify-between rounded-clinic border border-brand-border bg-brand-background p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-primary" />
                <div>
                  <div className="font-semibold text-brand-text">
                    Transactional Email Provider
                  </div>
                  <div className="text-[11px] text-brand-muted">
                    EMAIL_API_KEY (Resend / SendGrid)
                  </div>
                </div>
              </div>
              <Badge variant="default">Configured</Badge>
            </div>

            <div className="flex items-center justify-between rounded-clinic border border-brand-border bg-brand-background p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Bot className="h-4 w-4 text-brand-primary" />
                <div>
                  <div className="font-semibold text-brand-text">
                    AI Clinical Triage Assistant
                  </div>
                  <div className="text-[11px] text-brand-muted">
                    AI_API_KEY (Google Gemini / OpenAI)
                  </div>
                </div>
              </div>
              <Badge variant="default">Ready</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sticky/Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-brand-border pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            disabled={saving}
            className="gap-1.5 text-xs text-brand-muted hover:text-red-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Factory Defaults</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="shadow-xs gap-2 font-semibold"
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            <span>
              {saving
                ? "Saving All Settings..."
                : "Save Clinic Branding & Logo"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
