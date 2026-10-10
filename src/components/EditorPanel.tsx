"use client";

import { useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import {
  Check,
  Copy,
  Download,
  FileCode2,
  Minus,
  Plus,
  WrapText,
} from "lucide-react";
import { getMonacoLanguage } from "@/utils/parser";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/utils/cn";

// Self-host Monaco from our own static assets instead of fetching ~3MB+ from
// a third-party CDN at runtime. This makes the editor load fast and reliably.
loader.config({ paths: { vs: "/vs" } });

interface EditorPanelProps {
  selectedLanguage: string;
  generatedCode: string;
  isGenerating: boolean;
  copySuccess: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export default function EditorPanel({
  selectedLanguage,
  generatedCode,
  isGenerating,
  copySuccess,
  onCopy,
  onDownload,
}: EditorPanelProps) {
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);

  const handleFontSizeChange = (delta: number) => {
    setFontSize((prev) => Math.max(12, Math.min(20, prev + delta)));
  };

  const fileBase = selectedLanguage.toLowerCase().replace("++", "pp");

  return (
    <section className="flex h-[45vh] min-h-[320px] flex-col overflow-hidden border-b border-border bg-editor lg:h-[520px] lg:border-b-0 lg:border-r">
      {/* Toolbar */}
      <header className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 lg:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <FileCode2 className="h-4 w-4 flex-shrink-0 text-text-muted" aria-hidden="true" />
          <span className="truncate text-sm font-medium text-text-primary font-mono">
            main.{fileBase}
          </span>
          {isGenerating && (
            <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-hover">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Streaming
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div className="mr-1 hidden items-center gap-0.5 rounded-md border border-border bg-background/50 p-0.5 md:flex">
            <Tooltip content="Decrease font size">
              <button
                type="button"
                onClick={() => handleFontSizeChange(-1)}
                disabled={fontSize <= 12}
                aria-label="Decrease font size"
                className="rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </Tooltip>
            <span className="w-9 text-center text-xs tabular-nums text-text-secondary">
              {fontSize}px
            </span>
            <Tooltip content="Increase font size">
              <button
                type="button"
                onClick={() => handleFontSizeChange(1)}
                disabled={fontSize >= 20}
                aria-label="Increase font size"
                className="rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </Tooltip>
          </div>

          <Tooltip content={wordWrap ? "Disable word wrap" : "Enable word wrap"}>
            <button
              type="button"
              onClick={() => setWordWrap((w) => !w)}
              aria-pressed={wordWrap}
              aria-label="Toggle word wrap"
              className={cn(
                "rounded-md p-2 transition-colors duration-150",
                wordWrap
                  ? "bg-accent-soft text-accent-hover"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
              )}
            >
              <WrapText className="h-4 w-4" aria-hidden="true" />
            </button>
          </Tooltip>

          <Tooltip content={copySuccess ? "Copied" : "Copy code"}>
            <button
              type="button"
              onClick={onCopy}
              aria-label="Copy code"
              className={cn(
                "rounded-md p-2 transition-colors duration-150",
                copySuccess
                  ? "bg-success/10 text-success"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
              )}
            >
              {copySuccess ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </Tooltip>

          <Tooltip content="Download code">
            <button
              type="button"
              onClick={onDownload}
              aria-label="Download code"
              className="rounded-md p-2 text-text-secondary transition-colors duration-150 hover:bg-surface-elevated hover:text-text-primary"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Monaco Editor */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage="python"
          language={getMonacoLanguage(selectedLanguage)}
          value={generatedCode}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: wordWrap ? "on" : "off",
            renderLineHighlight: "line",
            cursorStyle: "line",
            folding: false,
            contextmenu: false,
            smoothScrolling: true,
          }}
        />
      </div>
    </section>
  );
}
