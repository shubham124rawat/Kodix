"use client";

import { HistoryEntry } from "@/types/history";

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
  return (
    <div className="w-full lg:w-96 flex flex-col border-r border-surface lg:border-r border-b lg:border-b-0 bg-background max-h-[calc(100vh-80px)] overflow-hidden">
      <div className="p-4 space-y-4 overflow-y-auto flex-shrink-0">
        {/* Module Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Select Module
          </label>
          <select
            className="w-full px-3 py-2 bg-surface border border-surface rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            disabled={isGenerating}
          >
            <option>Code Generator</option>
            <option>Debugger</option>
            <option>Explainer</option>
            <option>Optimizer</option>
            <option>Code Review</option>
          </select>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Programming Language
          </label>
          <select
            className="w-full px-3 py-2 bg-surface border border-surface rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isGenerating}
          >
            <option>Python</option>
            <option>JavaScript</option>
            <option>TypeScript</option>
            <option>Java</option>
            <option>C++</option>
            <option>Go</option>
            <option>Rust</option>
            <option>SQL</option>
          </select>
        </div>

        {/* Prompt Input */}
        {selectedModule === "Debugger" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Instructions (optional)
              </label>
              <textarea
                className="w-full h-20 px-3 py-2 bg-surface border border-surface rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                placeholder="Describe what's wrong or what you want to fix..."
                value={prompt}
                onChange={onPromptChange}
                disabled={isGenerating}
                maxLength={4000}
              />
              <div className="text-right text-xs text-text-secondary mt-1">
                {characterCount} / 4000 characters
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Paste Broken Code Here
              </label>
              <textarea
                className="w-full h-40 px-3 py-2 bg-surface border border-surface rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs transition-all duration-300 ease-in-out"
                placeholder="Paste your broken code here..."
                value={brokenCode}
                onChange={onBrokenCodeChange}
                disabled={isGenerating}
                maxLength={10000}
              />
              <div className="text-right text-xs text-text-secondary mt-1">
                {brokenCodeCount} / 10000 characters
              </div>
            </div>
          </>
        ) : selectedModule === "Explainer" || selectedModule === "Optimizer" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Instructions
              </label>
              <textarea
                className="w-full h-20 px-3 py-2 bg-surface border border-surface rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                placeholder="Describe what you want to explain or optimize..."
                value={prompt}
                onChange={onPromptChange}
                disabled={isGenerating}
                maxLength={4000}
              />
              <div className="text-right text-xs text-text-secondary mt-1">
                {characterCount} / 4000 characters
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Paste Code Here
              </label>
              <textarea
                className="w-full h-40 px-3 py-2 bg-surface border border-surface rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs transition-all duration-300 ease-in-out"
                placeholder="Paste the code you want to explain or optimize..."
                value={brokenCode}
                onChange={onBrokenCodeChange}
                disabled={isGenerating}
                maxLength={10000}
              />
              <div className="text-right text-xs text-text-secondary mt-1">
                {brokenCodeCount} / 10000 characters
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Prompt
            </label>
            <textarea
              className="w-full h-40 px-3 py-2 bg-surface border border-surface rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
              placeholder="Enter your requirements here... (e.g., 'Create a function to calculate factorial')"
              value={prompt}
              onChange={onPromptChange}
              disabled={isGenerating}
              maxLength={4000}
            />
            <div className="text-right text-xs text-text-secondary mt-1">
              {characterCount} / 4000 characters
            </div>
          </div>
        )}

        {/* Service Unavailable Warning Banner */}
        {isServiceUnavailable && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium">Service Temporarily Unavailable</p>
                <p className="text-xs text-yellow-700 mt-1">The AI servers are currently experiencing heavy traffic. Please wait a few seconds and try clicking generate again!</p>
              </div>
              <button
                onClick={onDismissServiceUnavailable}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          className="w-full py-3 bg-accent-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={onGenerate}
          disabled={isGenerating || (selectedModule === "Debugger" ? !brokenCode.trim() : !prompt.trim())}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {selectedModule === "Debugger" ? "Debugging..." : selectedModule === "Explainer" ? "Explaining..." : selectedModule === "Optimizer" ? "Optimizing..." : "Generating Code..."}
            </>
          ) : (
            selectedModule === "Debugger" ? "Debug Code" : selectedModule === "Explainer" ? "Explain Code" : selectedModule === "Optimizer" ? "Optimize Code" : "Generate Code"
          )}
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 border-t border-surface p-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-text-secondary mb-3">History</h3>
        {isClient && history.length > 0 ? (
          <div className="space-y-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="px-3 py-2 bg-surface rounded-lg text-sm text-text-primary hover:bg-surface/80 cursor-pointer transition-all duration-300 ease-in-out"
                onClick={() => onHistoryClick(entry)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-accent-primary">{entry.module}</span>
                  <span className="text-xs text-text-secondary">{entry.language}</span>
                </div>
                <div className="text-xs text-text-secondary truncate">
                  {entry.prompt || "No prompt"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-text-secondary text-center py-4">
            {isClient ? "No history yet" : "Loading..."}
          </div>
        )}
      </div>
    </div>
  );
}
