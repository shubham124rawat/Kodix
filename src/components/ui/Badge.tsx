import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type BadgeTone = "accent" | "neutral" | "success" | "warning" | "error" | "info";

const toneClasses: Record<BadgeTone, string> = {
  accent: "bg-accent-soft text-accent-hover border-accent/30",
  neutral: "bg-surface-elevated text-text-secondary border-border",
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  error: "bg-error/10 text-error border-error/25",
  info: "bg-info/10 text-info border-info/25",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-4",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
