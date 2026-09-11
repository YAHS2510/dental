export type LogoType = "ICON" | "IMAGE" | "MONOGRAM";

export type LogoShape = "rounded" | "circle" | "square";

export type LogoIconName =
  | "Stethoscope"
  | "Activity"
  | "HeartPulse"
  | "ShieldCheck"
  | "Smile"
  | "Cross"
  | "Sparkles"
  | "Building2"
  | "Pill"
  | "Eye"
  | "Hospital";

export interface ClinicLogoConfig {
  type: LogoType;
  iconName: LogoIconName;
  imageUrl: string; // Base64 data URL or HTTP URL or relative path
  monogramText: string; // e.g. "HS" or "VS"
  shape: LogoShape;
  altText: string;
  showClinicName: boolean;
  clinicDisplayName: string;
  tagline: string;
}

export interface ClinicBrandConfig {
  themeKey: string;
  clinicName: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  logo: ClinicLogoConfig;
}

export const DEFAULT_CLINIC_BRANDING: ClinicBrandConfig = {
  themeKey: "teal-serenity",
  clinicName: "HealthSphere",
  slug: "healthsphere-main",
  email: "contact@healthsphere.example.com",
  phone: "(800) 555-CLINIC",
  address: "742 Evergreen Medical Way, Suite 400",
  logo: {
    type: "ICON",
    iconName: "Stethoscope",
    imageUrl: "",
    monogramText: "HS",
    shape: "rounded",
    altText: "HealthSphere Clinic Logo",
    showClinicName: true,
    clinicDisplayName: "HealthSphere",
    tagline: "Medical Center",
  },
};
