"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpenText, Gauge, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

interface MetricsPanelProps {
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const stripLabel = (value: string, prefix: string) =>
  value.replace(prefix, "").trim();

export default function MetricsPanel({
  explanation,
  timeComplexity,
  spaceComplexity,
}: MetricsPanelProps) {
  const hasExplanation = Boolean(explanation.trim());
  const hasMetrics = Boolean(timeComplexity || spaceComplexity);

  return (
    <section className="flex min-h-[200px] flex-1 flex-col overflow-hidden bg-surface">
      {/* Tabs */}
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-border px-3 pt-2 lg:px-4">
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-sm font-medium transition-colors duration-150",
            "border-accent text-text-primary"
          )}
        >
          <BookOpenText className="h-4 w-4 text-accent" aria-hidden="true" />
          Explanation
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={hasExplanation ? "content" : "empty"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {hasExplanation ? (
              <div className="space-y-4 text-sm leading-6 text-text-secondary">
                <p className="whitespace-pre-wrap text-[13px]">{explanation}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background/40 text-text-muted">
                  <BookOpenText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    No explanation yet
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Run a request to see the explanation here
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {(hasMetrics || !hasExplanation) && (
          <div
            className={cn(
              "grid gap-2 sm:grid-cols-2",
              hasExplanation && "mt-4 border-t border-border pt-4"
            )}
          >
            <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <Gauge className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                Time
              </span>
              <span className="font-mono text-sm text-text-primary">
                {timeComplexity
                  ? stripLabel(timeComplexity, "Time Complexity:")
                  : hasExplanation
                  ? "—"
                  : "O(2^n)"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <Layers className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                Space
              </span>
              <span className="font-mono text-sm text-text-primary">
                {spaceComplexity
                  ? stripLabel(spaceComplexity, "Space Complexity:")
                  : hasExplanation
                  ? "—"
                  : "O(n)"}
              </span>
            </div>
          </div>
        )}

        {hasExplanation && hasMetrics && (
          <div className="mt-3">
            <Badge tone="neutral" className="text-[11px]">
              Estimated complexity
            </Badge>
          </div>
        )}
      </div>
    </section>
  );
}
