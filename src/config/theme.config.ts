import { ClinicTheme } from "@/types/theme";

/**
 * Predefined Clinic Themes
 * You can add new clinic themes here or load them dynamically from the database (e.g. Clinic.themeKey).
 * Changing branding takes effect everywhere without editing any component markup.
 */
export const clinicThemes: Record<string, ClinicTheme> = {
  "teal-serenity": {
    id: "teal-serenity",
    name: "Teal Serenity",
    tagline: "Calm, clean, and trusted medical care",
    borderRadius: "0.75rem",
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    colors: {
      primary: "#0d9488", // Teal 600
      primaryHover: "#0f766e", // Teal 700
      primaryForeground: "#ffffff",
      secondary: "#0284c7", // Sky 600
      secondaryHover: "#0369a1",
      secondaryForeground: "#ffffff",
      accent: "#ccfbf1", // Teal 100
      accentForeground: "#115e59",
      background: "#f8fafc", // Slate 50
      surface: "#ffffff",
      surfaceBorder: "#e2e8f0", // Slate 200
      textPrimary: "#0f172a", // Slate 900
      textMuted: "#64748b", // Slate 500
    },
  },
  "emerald-wellness": {
    id: "emerald-wellness",
    name: "Emerald Wellness",
    tagline: "Holistic, natural, and restorative health",
    borderRadius: "1rem",
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    colors: {
      primary: "#059669", // Emerald 600
      primaryHover: "#047857",
      primaryForeground: "#ffffff",
      secondary: "#10b981", // Emerald 500
      secondaryHover: "#059669",
      secondaryForeground: "#ffffff",
      accent: "#d1fae5", // Emerald 100
      accentForeground: "#065f46",
      background: "#f9fcf9",
      surface: "#ffffff",
      surfaceBorder: "#e5e7eb",
      textPrimary: "#111827",
      textMuted: "#6b7280",
    },
  },
  "sapphire-care": {
    id: "sapphire-care",
    name: "Sapphire Clinical",
    tagline: "Advanced clinical diagnostics and specialty care",
    borderRadius: "0.5rem",
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    colors: {
      primary: "#2563eb", // Blue 600
      primaryHover: "#1d4ed8",
      primaryForeground: "#ffffff",
      secondary: "#4f46e5", // Indigo 600
      secondaryHover: "#4338ca",
      secondaryForeground: "#ffffff",
      accent: "#dbeafe", // Blue 100
      accentForeground: "#1e40af",
      background: "#f8fafc",
      surface: "#ffffff",
      surfaceBorder: "#e2e8f0",
      textPrimary: "#0f172a",
      textMuted: "#64748b",
    },
  },
  "rose-vitality": {
    id: "rose-vitality",
    name: "Rose Aesthetics & Care",
    tagline: "Gentle dermatological and boutique health services",
    borderRadius: "1rem",
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    colors: {
      primary: "#e11d48", // Rose 600
      primaryHover: "#be123c",
      primaryForeground: "#ffffff",
      secondary: "#9333ea", // Purple 600
      secondaryHover: "#7e22ce",
      secondaryForeground: "#ffffff",
      accent: "#ffe4e6", // Rose 100
      accentForeground: "#9f1239",
      background: "#fffbfb",
      surface: "#ffffff",
      surfaceBorder: "#fecdd3",
      textPrimary: "#1e1b4b",
      textMuted: "#706e8b",
    },
  },
};

export const defaultThemeKey = "teal-serenity";

/**
 * Returns a clinic theme by key, falling back to the default theme.
 */
export function getClinicTheme(themeKey?: string): ClinicTheme {
  if (themeKey && clinicThemes[themeKey]) {
    return clinicThemes[themeKey];
  }
  return clinicThemes[defaultThemeKey];
}

/**
 * Generates CSS custom properties (variables) from a clinic theme.
 */
export function generateThemeCssVariables(
  theme: ClinicTheme
): Record<string, string> {
  return {
    "--color-primary": theme.colors.primary,
    "--color-primary-hover": theme.colors.primaryHover,
    "--color-primary-foreground": theme.colors.primaryForeground,
    "--color-secondary": theme.colors.secondary,
    "--color-secondary-hover": theme.colors.secondaryHover,
    "--color-secondary-foreground": theme.colors.secondaryForeground,
    "--color-accent": theme.colors.accent,
    "--color-accent-foreground": theme.colors.accentForeground,
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-border": theme.colors.surfaceBorder,
    "--color-text-primary": theme.colors.textPrimary,
    "--color-text-muted": theme.colors.textMuted,
    "--font-heading": theme.fonts.heading,
    "--font-body": theme.fonts.body,
    "--radius": theme.borderRadius,
  };
}
