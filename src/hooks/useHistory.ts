import { useState, useEffect } from "react";
import { HistoryEntry } from "@/types/history";

const HISTORY_KEY = "kodix_history";
const MAX_HISTORY_ENTRIES = 20;

export const useHistory = () => {
  const [isClient, setIsClient] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Load history from localStorage
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (entry: HistoryEntry) => {
    if (!isClient) return;
    const updatedHistory = [entry, ...history].slice(0, MAX_HISTORY_ENTRIES);
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const restoreFromHistory = (entry: HistoryEntry, setters: {
    setSelectedModule: (module: string) => void;
    setSelectedLanguage: (language: string) => void;
    setPrompt: (prompt: string) => void;
    setBrokenCode: (code: string) => void;
    setGeneratedCode: (code: string) => void;
    setExplanation: (explanation: string) => void;
    setTimeComplexity: (complexity: string) => void;
    setSpaceComplexity: (complexity: string) => void;
    setError: (error: string | null) => void;
  }) => {
    setters.setSelectedModule(entry.module);
    setters.setSelectedLanguage(entry.language);
    setters.setPrompt(entry.prompt);
    setters.setBrokenCode(entry.brokenCode || "");
    setters.setGeneratedCode(entry.generatedCode);
    setters.setExplanation(entry.explanation);
    setters.setTimeComplexity(entry.timeComplexity);
    setters.setSpaceComplexity(entry.spaceComplexity);
    setters.setError(null);
  };

  return {
    isClient,
    history,
    saveToHistory,
    restoreFromHistory,
  };
};
