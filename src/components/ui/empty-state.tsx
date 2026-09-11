import React from "react";
import Link from "next/link";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`mx-auto flex max-w-sm flex-col items-center justify-center space-y-3 px-4 py-12 text-center ${className}`}
    >
      <div className="bg-brand-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl text-brand-primary shadow-inner">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-heading text-sm font-semibold text-brand-text">
          {title}
        </h3>
        {description && (
          <p className="text-xs leading-relaxed text-brand-muted">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="pt-2">
          {action.href ? (
            <Link href={action.href}>
              <Button size="sm" variant="primary" className="h-8 text-xs">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={action.onClick}
              className="h-8 text-xs"
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
