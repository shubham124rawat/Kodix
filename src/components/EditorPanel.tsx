"use client";

import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { getMonacoLanguage } from "@/utils/parser";

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
  const editorRef = useRef<any>(null);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(20, fontSize + delta));
    setFontSize(newSize);
  };

  const toggleWordWrap = () => {
    setWordWrap(!wordWrap);
  };

  return (
    <div className="flex flex-col bg-editor h-[50vh] lg:h-[500px]">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">main.{selectedLanguage.toLowerCase().replace("++", "pp")}</span>
          {isGenerating && (
            <span className="flex items-center gap-1 text-xs text-accent-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
              </span>
              Streaming...
              <span className="animate-pulse ml-1">|</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Font Size Controls */}
          <div className="flex items-center gap-1 border-r border-surface pr-2 mr-2">
            <button
              className="px-2 py-1 text-sm text-text-secondary hover:text-text-primary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleFontSizeChange(-1)}
              disabled={fontSize <= 12}
            >
              -
            </button>
            <span className="text-sm text-text-secondary w-6 text-center">{fontSize}px</span>
            <button
              className="px-2 py-1 text-sm text-text-secondary hover:text-text-primary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleFontSizeChange(1)}
              disabled={fontSize >= 20}
            >
              +
            </button>
          </div>
          {/* Word Wrap Toggle */}
          <button
            className={`px-3 py-1 text-sm transition-all duration-300 ease-in-out ${wordWrap
              ? "text-accent-primary bg-accent-primary/10"
              : "text-text-secondary hover:text-text-primary"
              }`}
            onClick={toggleWordWrap}
            title="Toggle Word Wrap"
          >
            Wrap
          </button>
          {/* Copy Button */}
          <button
            className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary transition-all duration-300 ease-in-out"
            onClick={onCopy}
          >
            {copySuccess ? "Copied!" : "Copy"}
          </button>
          {/* Download Button */}
          <button
            className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary transition-all duration-300 ease-in-out"
            onClick={onDownload}
          >
            Download
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
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
          }}
        />
      </div>
    </div>
  );
}
