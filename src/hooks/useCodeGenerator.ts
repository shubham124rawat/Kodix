import { useState } from "react";
import { RateLimitEntry } from "@/types/history";
import { parseStreamResponse } from "@/utils/parser";

const RATE_LIMIT_KEY = "kodix_rate_limit";
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;

export const useCodeGenerator = (isClient: boolean, saveToHistory: (entry: any) => void) => {
  const [selectedModule, setSelectedModule] = useState("Code Generator");
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [prompt, setPrompt] = useState("");
  const [brokenCode, setBrokenCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(`// Welcome to Kodix - AI-Powered Code Generator
// This is a sample code display

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);

// Time Complexity: O(2^n)
// Space Complexity: O(n)`);
  const [explanation, setExplanation] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [brokenCodeCount, setBrokenCodeCount] = useState(0);

  const checkRateLimit = (): boolean => {
    if (!isClient) return true; // Skip rate limit check during SSR
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const entries: RateLimitEntry[] = stored ? JSON.parse(stored) : [];

    // Filter out entries older than the rate limit window
    const validEntries = entries.filter((entry) => now - entry.timestamp < RATE_LIMIT_WINDOW);

    if (validEntries.length >= MAX_REQUESTS_PER_WINDOW) {
      return false;
    }

    // Add current request timestamp
    validEntries.push({ timestamp: now });
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(validEntries));
    return true;
  };

  const handleGenerate = async () => {
    if (selectedModule === "Debugger" && !brokenCode.trim()) {
      setError("Please paste the broken code");
      return;
    }

    if (selectedModule !== "Debugger" && !prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (!checkRateLimit()) {
      setError("Rate limit exceeded. Please wait a moment before making another request.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setIsServiceUnavailable(false);
    setGeneratedCode("");
    setExplanation("");
    setTimeComplexity("");
    setSpaceComplexity("");

    try {
      let requestPrompt = prompt;
      if (selectedModule === "Debugger") {
        requestPrompt = `Instructions: ${prompt}\n\nBroken Code:\n${brokenCode}`;
      } else if (selectedModule === "Explainer" || selectedModule === "Optimizer") {
        requestPrompt = `${prompt}\n\nCode:\n${brokenCode}`;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: requestPrompt,
          language: selectedLanguage,
          module: selectedModule.toLowerCase().replace(" ", "_"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check for 503 Service Unavailable error
        if (response.status === 503) {
          setIsServiceUnavailable(true);
          throw new Error(errorData.error || "The AI servers are currently experiencing heavy traffic. Please wait a few seconds and try clicking generate again!");
        }

        throw new Error(errorData.error || "Failed to generate code");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedResponse = "";
      let finalCode = "";
      let finalExplanation = "";
      let finalTimeComplexity = "";
      let finalSpaceComplexity = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;

        // Parse and update in real-time
        const parsed = parseStreamResponse(accumulatedResponse);
        setGeneratedCode(parsed.code);
        setExplanation(parsed.explanation);
        setTimeComplexity(parsed.timeComplexity);
        setSpaceComplexity(parsed.spaceComplexity);

        // Store final values for history
        finalCode = parsed.code;
        finalExplanation = parsed.explanation;
        finalTimeComplexity = parsed.timeComplexity;
        finalSpaceComplexity = parsed.spaceComplexity;
      }

      // Save to history after successful generation
      if (finalCode) {
        saveToHistory({
          id: Date.now().toString(),
          timestamp: Date.now(),
          prompt: selectedModule === "Debugger" || selectedModule === "Explainer" || selectedModule === "Optimizer" ? prompt : prompt,
          module: selectedModule,
          language: selectedLanguage,
          generatedCode: finalCode,
          explanation: finalExplanation,
          timeComplexity: finalTimeComplexity,
          spaceComplexity: finalSpaceComplexity,
          brokenCode: brokenCode || undefined,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setGeneratedCode(`// Error occurred: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 4000) {
      setPrompt(value);
      setCharacterCount(value.length);
    }
  };

  const handleBrokenCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 10000) {
      setBrokenCode(value);
      setBrokenCodeCount(value.length);
    }
  };

  return {
    selectedModule,
    setSelectedModule,
    selectedLanguage,
    setSelectedLanguage,
    prompt,
    setPrompt,
    brokenCode,
    setBrokenCode,
    generatedCode,
    setGeneratedCode,
    explanation,
    setExplanation,
    timeComplexity,
    setTimeComplexity,
    spaceComplexity,
    setSpaceComplexity,
    isGenerating,
    error,
    setError,
    isServiceUnavailable,
    setIsServiceUnavailable,
    characterCount,
    brokenCodeCount,
    handleGenerate,
    handlePromptChange,
    handleBrokenCodeChange,
  };
};
