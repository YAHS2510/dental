"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  Activity,
  Filter,
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

export default function AdminPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const allPatients = [
    {
      id: "PAT-001",
      name: "Eleanor Pena",
      age: 38,
      gender: "Female",
      email: "eleanor.pena@example.com",
      phone: "(555) 234-5678",
      bloodType: "A+",
      lastVisit: "Sep 18, 2026",
      totalVisits: 6,
      condition: "Hypertension Stage 1",
    },
    {
      id: "PAT-002",
      name: "Robert Fox",
      age: 52,
      gender: "Male",
      email: "robert.fox@example.com",
      phone: "(555) 345-6789",
      bloodType: "O+",
      lastVisit: "Sep 18, 2026",
      totalVisits: 14,
      condition: "Coronary Artery Monitoring",
    },
    {
      id: "PAT-003",
      name: "Courtney Henry",
      age: 8,
      gender: "Female",
      email: "henry.family@example.com",
      phone: "(555) 456-7890",
      bloodType: "B+",
      lastVisit: "Sep 18, 2026",
      totalVisits: 3,
      condition: "Annual Pediatric Wellness",
    },
    {
      id: "PAT-004",
      name: "Jerome Bell",
      age: 29,
      gender: "Male",
      email: "jerome.bell@example.com",
      phone: "(555) 567-8901",
      bloodType: "A-",
      lastVisit: "Sep 19, 2026",
      totalVisits: 2,
      condition: "Dental Prophylaxis",
    },
    {
      id: "PAT-005",
      name: "Floyd Miles",
      age: 45,
      gender: "Male",
      email: "floyd.miles@example.com",
      phone: "(555) 678-9012",
      bloodType: "AB+",
      lastVisit: "Sep 15, 2026",
      totalVisits: 9,
      condition: "Seasonal Bronchitis",
    },
    {
      id: "PAT-006",
      name: "Jonathan Swift",
      age: 41,
      gender: "Male",
      email: "j.swift@example.com",
      phone: "555-0182",
      bloodType: "O-",
      lastVisit: "Today (Intake)",
      totalVisits: 1,
      condition: "Cardiovascular Screen",
    },
  ];

  const filteredPatients = allPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-text">
            Patient Directory & EMR
          </h1>
          <p className="mt-0.5 text-xs text-brand-muted">
            Electronic Medical Records, clinical history, and demographic
            profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" className="gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>New Patient Intake</span>
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
        <input
          type="text"
          placeholder="Search by name, patient ID, phone, or condition..."
          className="w-full rounded-clinic border border-brand-border bg-brand-surface py-2 pl-9 pr-4 text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Patients Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          {filteredPatients.length === 0 ? (
            <div className="space-y-2 px-4 py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-brand-muted" />
              <div className="font-heading text-sm font-semibold text-brand-text">
                No patients matched your search
              </div>
              <p className="text-xs text-brand-muted">
                Try adjusting your search terms or register a new patient.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-brand-border bg-brand-background font-medium text-brand-muted">
                <tr>
                  <th className="px-6 py-3">Patient ID & Name</th>
                  <th className="px-6 py-3">Demographics</th>
                  <th className="px-6 py-3">Contact Details</th>
                  <th className="px-6 py-3">Primary Diagnosis / Alert</th>
                  <th className="px-6 py-3">Visits</th>
                  <th className="px-6 py-3 text-right">Medical Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredPatients.map((pat) => (
                  <tr
                    key={pat.id}
                    className="hover:bg-brand-accent/10 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/patients/${pat.id}`}
                        className="block font-semibold text-brand-text transition-colors hover:text-brand-primary"
                      >
                        {pat.name}
                      </Link>
                      <span className="font-mono text-[10px] text-brand-muted">
                        {pat.id}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-brand-muted">
                      <span>
                        {pat.age} yrs • {pat.gender}
                      </span>
                      <div className="text-[10px] font-semibold text-brand-primary">
                        Blood: {pat.bloodType}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-brand-text">
                        <Phone className="h-3 w-3 text-brand-primary" />
                        <span>{pat.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                        <Mail className="h-3 w-3 text-brand-muted" />
                        <span>{pat.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="outline">{pat.condition}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-brand-muted">
                      <div>{pat.totalVisits} visits</div>
                      <div className="text-[10px] font-medium text-brand-primary">
                        {pat.lastVisit}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link href={`/admin/patients/${pat.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 px-2.5 text-xs"
                        >
                          <FileText className="h-3 w-3 text-brand-primary" />
                          <span>View Chart</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
