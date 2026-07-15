export interface HistoryEntry {
  id: string;
  timestamp: number;
  prompt: string;
  module: string;
  language: string;
  generatedCode: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  brokenCode?: string;
}

export interface RateLimitEntry {
  timestamp: number;
}
