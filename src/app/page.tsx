"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CircleAlert, Settings, Terminal } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MetricsPanel from "@/components/MetricsPanel";
import { useHistory } from "@/hooks/useHistory";
import { useCodeGenerator } from "@/hooks/useCodeGenerator";
import { copyToClipboard, downloadFile } from "@/utils/file";
import { Tooltip } from "@/components/ui/Tooltip";
import { Skeleton } from "@/components/ui/Skeleton";
import type { HistoryEntry } from "@/types/history";

// Monaco is heavy (~MB); defer it out of the critical path so the shell
// paints instantly and only loads the editor when the page needs it.
const EditorPanel = dynamic(
  () => import("@/components/EditorPanel").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="flex h-[45vh] min-h-[320px] flex-col overflow-hidden border-b border-border bg-editor lg:h-[520px] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="h-4 w-32 animate-pulse rounded bg-surface-elevated" />
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-8 animate-pulse rounded-md bg-surface-elevated" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </section>
    ),
  }
);

export default function Home() {
  const [copySuccess, setCopySuccess] = useState(false);
  const { isClient, history, saveToHistory, restoreFromHistory } = useHistory();
  const codeGenerator = useCodeGenerator(isClient, saveToHistory);

  const handleCopy = async () => {
    const success = await copyToClipboard(codeGenerator.generatedCode);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(codeGenerator.generatedCode, codeGenerator.selectedLanguage);
  };

  const handleHistoryClick = (entry: HistoryEntry) => {
    restoreFromHistory(entry, {
      setSelectedModule: codeGenerator.setSelectedModule,
      setSelectedLanguage: codeGenerator.setSelectedLanguage,
      setPrompt: codeGenerator.setPrompt,
      setBrokenCode: codeGenerator.setBrokenCode,
      setGeneratedCode: codeGenerator.setGeneratedCode,
      setExplanation: codeGenerator.setExplanation,
      setTimeComplexity: codeGenerator.setTimeComplexity,
      setSpaceComplexity: codeGenerator.setSpaceComplexity,
      setError: codeGenerator.setError,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-border bg-surface/60 px-4 py-3 backdrop-blur lg:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-lg shadow-accent/25">
            <Terminal className="h-5 w-5 text-text-on-accent" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-text-primary">
                Kodix
              </h1>
              <span className="rounded-full border border-border bg-surface-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Beta
              </span>
            </div>
            <p className="text-xs text-text-secondary">AI Code Assistant</p>
          </div>
        </div>

        <Tooltip content="Settings" side="bottom">
          <button
            type="button"
            aria-label="Settings"
            className="rounded-md p-2 text-text-secondary transition-colors duration-150 hover:bg-surface-elevated hover:text-text-primary"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </Tooltip>
      </header>

      {/* Error Banner */}
      <AnimatePresence>
        {codeGenerator.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 overflow-hidden border-b border-error/30 bg-error/10"
          >
            <div className="flex items-center gap-2.5 px-4 py-3 lg:px-6">
              <CircleAlert className="h-4 w-4 flex-shrink-0 text-error" aria-hidden="true" />
              <span className="text-sm text-text-primary">{codeGenerator.error}</span>
              <button
                type="button"
                onClick={() => codeGenerator.setError(null)}
                aria-label="Dismiss error"
                className="ml-auto rounded p-1 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Sidebar
          selectedModule={codeGenerator.selectedModule}
          setSelectedModule={codeGenerator.setSelectedModule}
          selectedLanguage={codeGenerator.selectedLanguage}
          setSelectedLanguage={codeGenerator.setSelectedLanguage}
          prompt={codeGenerator.prompt}
          brokenCode={codeGenerator.brokenCode}
          isGenerating={codeGenerator.isGenerating}
          isServiceUnavailable={codeGenerator.isServiceUnavailable}
          characterCount={codeGenerator.characterCount}
          brokenCodeCount={codeGenerator.brokenCodeCount}
          isClient={isClient}
          history={history}
          onPromptChange={codeGenerator.handlePromptChange}
          onBrokenCodeChange={codeGenerator.handleBrokenCodeChange}
          onGenerate={codeGenerator.handleGenerate}
          onHistoryClick={handleHistoryClick}
          onDismissServiceUnavailable={() =>
            codeGenerator.setIsServiceUnavailable(false)
          }
        />

        {/* Code + Metrics */}
        <div className="flex min-h-0 flex-1 flex-col">
          <EditorPanel
            selectedLanguage={codeGenerator.selectedLanguage}
            generatedCode={codeGenerator.generatedCode}
            isGenerating={codeGenerator.isGenerating}
            copySuccess={copySuccess}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
          <MetricsPanel
            explanation={codeGenerator.explanation}
            timeComplexity={codeGenerator.timeComplexity}
            spaceComplexity={codeGenerator.spaceComplexity}
          />
        </div>
      </main>
    </div>
  );
}
