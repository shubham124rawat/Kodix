"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

type AlertTone = "warning" | "info" | "error";

const toneStyles: Record<AlertTone, { box: string; icon: ReactNode }> = {
  warning: {
    box: "border-warning/30 bg-warning/10",
    icon: <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />,
  },
  info: {
    box: "border-info/30 bg-info/10",
    icon: <Info className="h-4 w-4 text-info" aria-hidden="true" />,
  },
  error: {
    box: "border-error/30 bg-error/10",
    icon: <AlertTriangle className="h-4 w-4 text-error" aria-hidden="true" />,
  },
};

export function Alert({
  tone = "warning",
  title,
  children,
  onDismiss,
  className,
}: {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-md border p-3",
        toneStyles[tone].box,
        className
      )}
    >
      <div className="mt-0.5 flex-shrink-0">{toneStyles[tone].icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-text-primary">{title}</p>
        {children && (
          <div className="mt-0.5 text-xs leading-5 text-text-secondary">
            {children}
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="mt-0.5 flex-shrink-0 rounded p-0.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
