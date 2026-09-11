export interface ClinicThemeColors {
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  secondary: string;
  secondaryHover: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  surface: string;
  surfaceBorder: string;
  textPrimary: string;
  textMuted: string;
}

export interface ClinicThemeFonts {
  heading: string;
  body: string;
}

export interface ClinicTheme {
  id: string;
  name: string;
  tagline: string;
  borderRadius: string;
  colors: ClinicThemeColors;
  fonts: ClinicThemeFonts;
}
