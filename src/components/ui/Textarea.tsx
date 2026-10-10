"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  counter?: { current: number; max: number };
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, counter, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="space-y-1.5">
        {(label || hint) && (
          <div className="flex items-baseline justify-between gap-2">
            {label && (
              <label
                htmlFor={inputId}
                className="text-[13px] font-medium text-text-primary"
              >
                {label}
              </label>
            )}
            {hint && (
              <span className="text-xs text-text-muted">{hint}</span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-md border border-border bg-surface-elevated px-3 py-2.5 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "resize-none transition-colors duration-200",
            "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "font-mono",
            className
          )}
          {...props}
        />
        {counter && (
          <div className="flex justify-end">
            <span
              className={cn(
                "text-xs tabular-nums",
                counter.current > counter.max * 0.9
                  ? "text-warning"
                  : "text-text-muted"
              )}
            >
              {counter.current.toLocaleString()} /{" "}
              {counter.max.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
