"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, hint, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="space-y-1.5">
        {label && (
          <div className="flex items-baseline justify-between gap-2">
            <label
              htmlFor={inputId}
              className="text-[13px] font-medium text-text-primary"
            >
              {label}
            </label>
            {hint && <span className="text-xs text-text-muted">{hint}</span>}
          </div>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-md border border-border bg-surface-elevated pl-3 pr-9 py-2.5 text-sm text-text-primary",
              "transition-colors duration-200",
              "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";
