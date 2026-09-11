import { z } from "zod";

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Service name must be at least 2 characters")
    .max(120, "Service name cannot exceed 120 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  durationMinutes: z.coerce
    .number()
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration cannot exceed 480 minutes (8 hours)")
    .default(30),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z
    .string()
    .max(60, "Category cannot exceed 60 characters")
    .default("General Practice"),
  isActive: z.boolean().default(true),
  clinicSlug: z.string().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial().extend({
  performedBy: z.string().default("Clinic Staff"),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
