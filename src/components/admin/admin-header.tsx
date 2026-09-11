"use client";

import { useSession, signOut } from "next-auth/react";
import { Search, Bell, LogOut, ShieldCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const { data: session } = useSession();

  const userRole = session?.user?.role || "STAFF";
  const userName = session?.user?.name || "Clinic Staff";
  const userEmail = session?.user?.email || "staff@healthsphere.example.com";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-brand-border bg-brand-surface px-6 transition-colors">
      <div className="flex max-w-md flex-1 items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search patients, charts, appointment IDs..."
            className="w-full rounded-clinic border border-brand-border bg-brand-background py-1.5 pl-9 pr-4 text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Identity & Role Badge */}
        <div className="flex items-center gap-3 border-r border-brand-border pr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-clinic bg-brand-primary text-xs font-bold text-brand-primary-foreground">
            {userName.charAt(0)}
          </div>
          <div className="hidden text-left sm:block">
            <div className="flex items-center gap-1.5">
              <span className="max-w-[150px] truncate text-xs font-semibold text-brand-text">
                {userName}
              </span>
              <Badge
                variant={userRole === "ADMIN" ? "default" : "secondary"}
                className="px-1.5 py-0 text-[9px]"
              >
                {userRole}
              </Badge>
            </div>
            <span className="block max-w-[150px] truncate text-[10px] text-brand-muted">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="h-8 gap-1.5 px-2.5 text-xs text-brand-muted hover:text-red-600"
          title="Sign out of clinic station"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
