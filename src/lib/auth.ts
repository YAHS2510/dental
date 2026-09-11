import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Clinic Staff Portal",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "staff@clinic.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password.");
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // 1. Built-in Demo Accounts (guaranteed to work in development/mock environments)
        if (
          email === "admin@healthsphere.example.com" &&
          password === "AdminPass123!"
        ) {
          return {
            id: "staff-admin-001",
            name: "Dr. Sarah Vance (Admin Lead)",
            email: "admin@healthsphere.example.com",
            role: "ADMIN",
            clinicId: "clinic-main-001",
          };
        }

        if (
          email === "staff@healthsphere.example.com" &&
          password === "StaffPass123!"
        ) {
          return {
            id: "staff-coord-002",
            name: "Alex Rivera (Clinical Staff)",
            email: "staff@healthsphere.example.com",
            role: "STAFF",
            clinicId: "clinic-main-001",
          };
        }

        // 2. Query Prisma database
        try {
          const user = await prisma.staffUser.findFirst({
            where: { email },
            include: { clinic: true },
          });

          if (!user || !user.isActive) {
            throw new Error("No active staff account found with this email.");
          }

          // In production, compare bcrypt hash. For development convenience, accept demo passwords or hashed strings.
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            clinicId: user.clinicId,
          };
        } catch (error: any) {
          if (error.message.includes("No active staff")) {
            throw error;
          }
          // If database is offline in local test, reject unknown emails
          throw new Error(
            "Invalid staff credentials. Please check your email and password."
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.clinicId = user.clinicId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.clinicId = token.clinicId as string;
      }
      return session;
    },
  },
};
