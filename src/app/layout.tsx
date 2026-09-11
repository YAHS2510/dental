import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClinicThemeProvider } from "@/components/theme/clinic-theme-provider";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HealthSphere Clinic Platform",
  description:
    "Modern multi-tenant clinic management and patient booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-brand-background text-brand-text antialiased">
        <ClinicThemeProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </ClinicThemeProvider>
      </body>
    </html>
  );
}
