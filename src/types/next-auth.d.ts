import { DefaultSession, DefaultUser } from "next-auth";
import { StaffRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: StaffRole | "ADMIN" | "STAFF";
      clinicId?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: StaffRole | "ADMIN" | "STAFF";
    clinicId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: StaffRole | "ADMIN" | "STAFF";
    clinicId?: string;
  }
}
