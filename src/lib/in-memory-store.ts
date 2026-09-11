/**
 * In-Memory Clinic Data Store
 * Used as a stateful fallback in development environments when PostgreSQL
 * is not actively running. Supports end-to-end appointment lifecycle testing.
 */

export interface StoredAppointment {
  id: string;
  clinicId?: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "COMPLETED" | "CANCELLED";
  source: string;
  notes?: string;
  reason?: string;
  patientType?: "ADULT" | "CHILD" | string;
  childName?: string;
  guardianName?: string;
  preferredDoctor?: string;
  timeRange?: string;
  contactMethod?: "PHONE" | "WHATSAPP" | string;
  consentAgreed?: boolean;
  reminderSentAt?: string | null;
  patient: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  service: {
    name: string;
    price?: number;
    durationMinutes?: number;
  };
  staffUser?: {
    name: string;
    role?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Global reference so Hot Module Reloading in Next.js preserves state
declare global {
  // eslint-disable-next-line no-var
  var __inMemoryAppointments: Map<string, StoredAppointment> | undefined;
}

if (!global.__inMemoryAppointments) {
  global.__inMemoryAppointments = new Map<string, StoredAppointment>();

  // Seed sample initial appointments
  const seedAppointments: StoredAppointment[] = [
    {
      id: "APT-849101",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
      source: "WHATSAPP",
      patientType: "ADULT",
      preferredDoctor: "Dr. Sankar (Chief Dental Surgeon)",
      timeRange: "Afternoon (2:00 PM - 5:00 PM)",
      contactMethod: "WHATSAPP",
      consentAgreed: true,
      notes:
        "Severe lower molar sensitivity when drinking cold water. Prefers WhatsApp messaging.",
      patient: {
        firstName: "Anish",
        lastName: "Menon",
        email: "anish.menon@example.com",
        phone: "+91 98470 12345",
      },
      service: {
        name: "Root Canal Treatment & Endodontics",
        durationMinutes: 45,
      },
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "APT-849102",
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
      source: "WHATSAPP",
      patientType: "CHILD",
      childName: "Aarav Kumar",
      guardianName: "Sunitha Kumar (Mother)",
      preferredDoctor: "Dr. Vidhyamol (Pediatric Specialist)",
      timeRange: "Evening (5:00 PM - 7:30 PM)",
      contactMethod: "WHATSAPP",
      consentAgreed: true,
      notes:
        "Child has milk tooth decay and pain while chewing. First dental visit.",
      patient: {
        firstName: "Sunitha",
        lastName: "Kumar",
        email: "sunitha.kumar@example.com",
        phone: "+91 85904 99881",
      },
      service: {
        name: "Pediatric Dental Care & Milk Teeth",
        durationMinutes: 30,
      },
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "APT-849103",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 24.5 * 60 * 60 * 1000).toISOString(),
      status: "CONFIRMED",
      source: "WHATSAPP",
      patientType: "ADULT",
      preferredDoctor: "Dr. Sankar (Chief Dental Surgeon)",
      timeRange: "Morning (9:30 AM - 1:00 PM)",
      contactMethod: "WHATSAPP",
      consentAgreed: true,
      notes: "Routine ultrasonic scaling and polishing request via WhatsApp.",
      patient: {
        firstName: "Kavitha",
        lastName: "Pillai",
        email: "kavitha.p@example.com",
        phone: "+91 94471 55667",
      },
      service: {
        name: "Dental Prophylaxis & Scaling",
        durationMinutes: 30,
      },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "APT-849104",
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 48.5 * 60 * 60 * 1000).toISOString(),
      status: "CONFIRMED",
      source: "WEB_FORM",
      patientType: "ADULT",
      preferredDoctor: "Dr. Vidhyamol (Pediatric Specialist)",
      timeRange: "Morning (9:30 AM - 1:00 PM)",
      contactMethod: "PHONE",
      consentAgreed: true,
      notes: "Cosmetic smile assessment consultation.",
      patient: {
        firstName: "Rahul",
        lastName: "Nair",
        email: "rahul.nair@example.com",
        phone: "+91 97455 33221",
      },
      service: {
        name: "Cosmetic Dentistry & Smile Design",
        durationMinutes: 45,
      },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const apt of seedAppointments) {
    global.__inMemoryAppointments.set(apt.id, apt);
  }
}

export const inMemoryStore = {
  getAppointments(): StoredAppointment[] {
    return Array.from(global.__inMemoryAppointments!.values());
  },

  getAppointment(id: string): StoredAppointment | undefined {
    return global.__inMemoryAppointments!.get(id);
  },

  saveAppointment(appointment: StoredAppointment): StoredAppointment {
    global.__inMemoryAppointments!.set(appointment.id, appointment);
    return appointment;
  },

  updateAppointmentStatus(
    id: string,
    status: StoredAppointment["status"],
    notes?: string
  ): StoredAppointment | undefined {
    const existing = global.__inMemoryAppointments!.get(id);
    if (!existing) {
      // Create stub if it didn't exist
      const created: StoredAppointment = {
        id,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 24.5 * 60 * 60 * 1000).toISOString(),
        status,
        source: "AI_BOOKING",
        notes,
        patient: {
          firstName: "Valued",
          lastName: "Patient",
          email: "patient@example.com",
          phone: "+15551234567",
        },
        service: {
          name: "General Consultation",
          price: 85,
          durationMinutes: 30,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      global.__inMemoryAppointments!.set(id, created);
      return created;
    }

    const updated: StoredAppointment = {
      ...existing,
      status,
      notes: notes
        ? `${existing.notes ? existing.notes + " | " : ""}${notes}`
        : existing.notes,
      updatedAt: new Date().toISOString(),
    };
    global.__inMemoryAppointments!.set(id, updated);
    return updated;
  },

  stampReminder(id: string): boolean {
    const apt = global.__inMemoryAppointments!.get(id);
    if (apt) {
      apt.reminderSentAt = new Date().toISOString();
      return true;
    }
    return false;
  },
};
