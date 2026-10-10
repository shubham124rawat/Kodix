"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Braces,
  Bug,
  FileText,
  Gauge,
  History,
  Inbox,
  Search,
  Sparkles,
} from "lucide-react";
import type { HistoryEntry } from "@/types/history";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

const MODULES = [
  { value: "Code Generator", label: "Generate", icon: Braces },
  { value: "Debugger", label: "Debug", icon: Bug },
  { value: "Explainer", label: "Explain", icon: FileText },
  { value: "Optimizer", label: "Optimize", icon: Gauge },
  { value: "Code Review", label: "Review", icon: Search },
];

const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "Rust",
  "SQL",
];

interface SidebarProps {
  selectedModule: string;
  setSelectedModule: (module: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  prompt: string;
  brokenCode: string;
  isGenerating: boolean;
  isServiceUnavailable: boolean;
  characterCount: number;
  brokenCodeCount: number;
  isClient: boolean;
  history: HistoryEntry[];
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBrokenCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onGenerate: () => void;
  onHistoryClick: (entry: HistoryEntry) => void;
  onDismissServiceUnavailable: () => void;
}

export default function Sidebar({
  selectedModule,
  setSelectedModule,
  selectedLanguage,
  setSelectedLanguage,
  prompt,
  brokenCode,
  isGenerating,
  isServiceUnavailable,
  characterCount,
  brokenCodeCount,
  isClient,
  history,
  onPromptChange,
  onBrokenCodeChange,
  onGenerate,
  onHistoryClick,
  onDismissServiceUnavailable,
}: SidebarProps) {
  const generateLabel =
    selectedModule === "Debugger"
      ? "Debug Code"
      : selectedModule === "Explainer"
      ? "Explain Code"
      : selectedModule === "Optimizer"
      ? "Optimize Code"
      : selectedModule === "Code Review"
      ? "Review Code"
      : "Generate Code";

  const generateActiveLabel =
    selectedModule === "Debugger"
      ? "Debugging..."
      : selectedModule === "Explainer"
      ? "Explaining..."
      : selectedModule === "Optimizer"
      ? "Optimizing..."
      : selectedModule === "Code Review"
      ? "Reviewing..."
      : "Generating Code...";

  const needsBrokenCode =
    selectedModule === "Debugger" ||
    selectedModule === "Explainer" ||
    selectedModule === "Optimizer";

  return (
    <aside className="flex w-full flex-col border-b border-border bg-surface lg:h-full lg:w-[380px] lg:border-b-0 lg:border-r">
      {/* Workspace controls */}
      <div className="space-y-5 overflow-y-auto p-4 lg:p-5">
        {/* Module */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Module
          </h2>
          <SegmentedControl
            value={selectedModule}
            onChange={setSelectedModule}
            options={MODULES}
            disabled={isGenerating}
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Language
          </h2>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            options={LANGUAGES}
            disabled={isGenerating}
          />
        </div>

        {/* Prompt / Code inputs */}
        <div className="space-y-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedModule}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-4"
            >
              {needsBrokenCode && (
                <Textarea
                  label="Instructions"
                  hint="Optional"
                  placeholder={
                    selectedModule === "Debugger"
                      ? "Describe what's wrong or what you want to fix..."
                      : "Describe what you want to do with the code..."
                  }
                  value={prompt}
                  onChange={onPromptChange}
                  disabled={isGenerating}
                  maxLength={4000}
                  counter={{ current: characterCount, max: 4000 }}
                  className="h-20"
                />
              )}

              <Textarea
                label={
                  selectedModule === "Debugger"
                    ? "Paste Broken Code"
                    : selectedModule === "Code Generator"
                    ? "Prompt"
                    : "Paste Code"
                }
                placeholder={
                  selectedModule === "Debugger"
                    ? "Paste your broken code here..."
                    : selectedModule === "Code Generator"
                    ? "e.g. Create a function to calculate factorial"
                    : "Paste the code you want to analyze..."
                }
                value={needsBrokenCode ? brokenCode : prompt}
                onChange={
                  needsBrokenCode ? onBrokenCodeChange : onPromptChange
                }
                disabled={isGenerating}
                maxLength={needsBrokenCode ? 10000 : 4000}
                counter={
                  needsBrokenCode
                    ? { current: brokenCodeCount, max: 10000 }
                    : { current: characterCount, max: 4000 }
                }
                className="h-40"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Service unavailable */}
        <AnimatePresence>
          {isServiceUnavailable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Alert
                tone="warning"
                title="Service Temporarily Unavailable"
                onDismiss={onDismissServiceUnavailable}
              >
                The AI servers are experiencing heavy traffic. Please wait a
                few seconds and try again.
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate */}
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={onGenerate}
          isLoading={isGenerating}
          disabled={
            isGenerating ||
            (selectedModule === "Debugger"
              ? !brokenCode.trim()
              : !prompt.trim())
          }
          className="shadow-lg shadow-accent/20"
        >
          {isGenerating ? (
            <span>{generateActiveLabel}</span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>{generateLabel}</span>
            </>
          )}
        </Button>
      </div>

      {/* History */}
      <div className="flex min-h-0 flex-1 flex-col border-t border-border">
        <div className="flex items-center justify-between px-4 py-3 lg:px-5">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            History
          </h2>
          {history.length > 0 && (
            <span className="text-xs tabular-nums text-text-muted">
              {history.length}
            </span>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 lg:px-3">
          {!isClient ? (
            <div className="space-y-2 p-2">
              <div className="h-14 animate-pulse rounded-md bg-surface-elevated" />
              <div className="h-14 animate-pulse rounded-md bg-surface-elevated opacity-70" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-text-muted">
                <Inbox className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-sm text-text-secondary">No history yet</p>
              <p className="text-xs text-text-muted">
                Generated outputs will appear here
              </p>
            </div>
          ) : (
            <ul className="space-y-1.5">
              <AnimatePresence initial={false}>
                {history.map((entry) => (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <button
                      type="button"
                      onClick={() => onHistoryClick(entry)}
                      className="group w-full rounded-md border border-transparent bg-surface-elevated/50 px-3 py-2.5 text-left transition-colors duration-150 hover:border-border-strong hover:bg-surface-elevated"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <Badge tone="accent">{entry.module}</Badge>
                        <span className="text-xs text-text-muted">
                          {entry.language}
                        </span>
                      </div>
                      <p className="truncate text-xs text-text-secondary">
                        {entry.prompt || "No prompt"}
                      </p>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
