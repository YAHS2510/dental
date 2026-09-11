import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientType: z.enum(["ADULT", "CHILD"]).default("ADULT"),
  fullName: z.string().optional(),
  childName: z.string().optional(),
  guardianName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .max(25, "Phone number cannot exceed 25 characters"),
  preferredDoctor: z.string().optional(),
  treatment: z.string().optional(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  preferredDate: z.string().optional(),
  timeRange: z
    .enum([
      "Morning (9:30 AM - 1:00 PM)",
      "Afternoon (2:00 PM - 5:00 PM)",
      "Evening (5:00 PM - 7:30 PM)",
    ])
    .or(z.string())
    .optional(),
  contactMethod: z.enum(["PHONE", "WHATSAPP"]).default("PHONE"),
  startTime: z.string().or(z.date()).optional(),
  appointmentDate: z.string().optional(),
  appointmentTime: z.string().optional(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
  reason: z.string().max(255, "Reason cannot exceed 255 characters").optional(),
  consentAgreed: z.boolean().default(true),
  source: z
    .enum(["MANUAL", "AI_BOOKING", "WHATSAPP", "WEB_FORM"])
    .default("MANUAL"),
  clinicSlug: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "DECLINED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
  staffUserId: z.string().optional(),
  performedBy: z
    .string()
    .min(1, "Name of person performing action is required")
    .default("Staff Member"),
  reason: z
    .string()
    .max(500, "Reason notes cannot exceed 500 characters")
    .optional(),
});

export type UpdateAppointmentStatusInput = z.infer<
  typeof updateAppointmentStatusSchema
>;

export const appointmentQuerySchema = z.object({
  status: z
    .enum([
      "ALL",
      "PENDING",
      "CONFIRMED",
      "DECLINED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ])
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  serviceId: z.string().optional(),
  clinicSlug: z.string().optional(),
  source: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  page: z.coerce.number().min(1).default(1),
});

export type AppointmentQueryParams = z.infer<typeof appointmentQuerySchema>;
