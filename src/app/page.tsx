"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import EditorPanel from "@/components/EditorPanel";
import MetricsPanel from "@/components/MetricsPanel";
import { useHistory } from "@/hooks/useHistory";
import { useCodeGenerator } from "@/hooks/useCodeGenerator";
import { copyToClipboard, downloadFile } from "@/utils/file";

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

  const handleHistoryClick = (entry: any) => {
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
    <div className="flex flex-col min-h-screen lg:h-screen bg-background lg:overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-surface flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Kodix</h1>
          <span className="text-sm text-text-secondary">AI Code Assistant</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {codeGenerator.error && (
        <div className="bg-error/10 border-b border-error px-4 py-3">
          <div className="flex items-center gap-2 text-error text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{codeGenerator.error}</span>
            <button
              onClick={() => codeGenerator.setError(null)}
              className="ml-auto hover:text-error/80"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        {/* Left Sidebar - Controls */}
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
          onDismissServiceUnavailable={() => codeGenerator.setIsServiceUnavailable(false)}
        />

        {/* Right Panel - Monaco Editor + Metrics */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
      </div>
    </div>
  );
}
