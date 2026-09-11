"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Stethoscope,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClinicTheme } from "@/components/theme/clinic-theme-provider";
import { ClinicLogo } from "@/components/ui/clinic-logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const { currentTheme, brandConfig } = useClinicTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      setErrorMsg("Invalid email or password. Please verify credentials.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setErrorMsg(null);

    const res = await signIn("credentials", {
      email: demoEmail,
      password: demoPass,
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      setErrorMsg("Demo login failed.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="from-brand-accent/25 flex min-h-screen flex-col items-center justify-center bg-gradient-to-b via-brand-background to-brand-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Clinic Brand Header */}
        <div className="space-y-2 text-center">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <ClinicLogo size="lg" />
            <div className="text-left">
              <span className="block font-heading text-xl font-bold text-brand-text">
                {brandConfig?.logo?.clinicDisplayName || "HealthSphere"}
              </span>
              <span className="-mt-1 block text-xs font-medium text-brand-muted">
                {brandConfig?.logo?.tagline || `${currentTheme.name} Center`}
              </span>
            </div>
          </Link>

          <h1 className="pt-2 font-heading text-2xl font-extrabold tracking-tight text-brand-text">
            Staff Administration Portal
          </h1>
          <p className="text-xs text-brand-muted">
            Authenticated clinical operations, calendar, and patient management.
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border-brand-border shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Staff Authentication</CardTitle>
            <CardDescription>
              Enter your assigned clinical credentials to access your station
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-clinic border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Staff Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-brand-muted" />
                  <Input
                    required
                    type="email"
                    placeholder="name@healthsphere.example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-brand-muted" />
                  <Input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full font-semibold shadow-sm"
              >
                {loading ? "Authenticating..." : "Sign In to Clinic Dashboard"}
              </Button>
            </form>

            {/* Quick Demo Login Credentials Box */}
            <div className="space-y-2.5 border-t border-brand-border pt-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-brand-muted">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                  <span>One-Click Role Demonstration:</span>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Test Accounts
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemo(
                      "admin@healthsphere.example.com",
                      "AdminPass123!"
                    )
                  }
                  className="hover:border-brand-primary/50 rounded-clinic border border-brand-border bg-brand-background p-2.5 text-left transition-colors"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-text">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                    <span>Clinic Owner</span>
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-brand-muted">
                    Full Admin &amp; Structure Control
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemo(
                      "staff@healthsphere.example.com",
                      "StaffPass123!"
                    )
                  }
                  className="hover:border-brand-primary/50 rounded-clinic border border-brand-border bg-brand-background p-2.5 text-left transition-colors"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-text">
                    <UserCheck className="h-3.5 w-3.5 text-brand-secondary" />
                    <span>Clinical Staff</span>
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-brand-muted">
                    Operations Only (No Site Changes)
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Public Site */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-brand-muted transition-colors hover:text-brand-primary"
          >
            <span>Return to Public Clinic Website</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
