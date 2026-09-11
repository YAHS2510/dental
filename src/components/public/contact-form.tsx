"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "General Patient Inquiries",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    referenceId?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit inquiry.");
      }

      setResult({
        success: true,
        message: data.message,
        referenceId: data.referenceId,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "General Patient Inquiries",
        message: "",
      });
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Something went wrong. Please try calling our desk.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Send an Online Inquiry</CardTitle>
        <CardDescription>
          Fill out the details below and our patient coordination desk will respond within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result?.success ? (
          <div className="rounded-clinic bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-heading font-bold text-lg text-emerald-900">
              Message Received
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
              {result.message}
            </p>
            {result.referenceId && (
              <div className="text-xs font-mono font-bold text-emerald-700 pt-2">
                Reference ID: {result.referenceId}
              </div>
            )}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                className="text-xs gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Send Another Message</span>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {result && !result.success && (
              <div className="rounded-clinic bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{result.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Your Full Name *
                </label>
                <Input
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Email Address *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="jane.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Phone Number (Optional)
                </label>
                <Input
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-text">
                  Clinical Department
                </label>
                <select
                  className="flex h-10 w-full rounded-clinic border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="General Patient Inquiries">General Patient Inquiries</option>
                  <option value="Primary Care & Prevention">Primary Care & Prevention</option>
                  <option value="Cardiology Department">Cardiology Department</option>
                  <option value="Pediatrics & Immunizations">Pediatrics & Immunizations</option>
                  <option value="Dental Clinic">Dental Clinic</option>
                  <option value="Medical Records & Billing">Medical Records & Billing</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-text">
                How Can We Help You? *
              </label>
              <textarea
                required
                rows={4}
                className="w-full rounded-clinic border border-brand-border bg-brand-surface p-3 text-sm text-brand-text placeholder:text-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                placeholder="Please do not include sensitive credit card numbers..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="font-semibold gap-2 min-w-[140px]"
              >
                {loading ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
