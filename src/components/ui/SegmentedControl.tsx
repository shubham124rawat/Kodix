"use client";

import { motion } from "motion/react";
import { cn } from "@/utils/cn";

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function SegmentedControl({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
  disabled?: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Select module"
      className={cn(
        "grid grid-flow-col auto-cols-fr gap-0.5 rounded-md border border-border bg-background p-0.5",
        disabled && "opacity-50"
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center justify-center gap-1.5 rounded-[5px] px-2.5 py-2 text-[13px] font-medium transition-colors duration-200",
              isActive
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary",
              disabled && "cursor-not-allowed"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="segmented-active"
                className="absolute inset-0 rounded-[5px] bg-surface-elevated border border-border-strong"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            {Icon && (
              <Icon className="relative z-10 h-4 w-4" aria-hidden="true" />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
