export interface ParsedResponse {
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export const parseStreamResponse = (fullResponse: string): ParsedResponse => {
  // Extract code blocks from markdown
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
  const codeMatches = [...fullResponse.matchAll(codeBlockRegex)];
  
  let extractedCode = "";
  if (codeMatches.length > 0) {
    extractedCode = codeMatches.map(match => match[1].trim()).join("\n\n");
  } else {
    extractedCode = fullResponse; // Fallback if no code blocks found
  }

  // Remove code blocks to get explanation text
  const explanationText = fullResponse.replace(codeBlockRegex, "").trim();

  // Extract complexity metrics
  const timeMatch = explanationText.match(/Time\s*Complexity:\s*O\([^)]+\)/i);
  const spaceMatch = explanationText.match(/Space\s*Complexity:\s*O\([^)]+\)/i);

  return {
    code: extractedCode,
    explanation: explanationText,
    timeComplexity: timeMatch ? timeMatch[0] : "",
    spaceComplexity: spaceMatch ? spaceMatch[0] : "",
  };
};

export const getMonacoLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    Python: "python",
    JavaScript: "javascript",
    TypeScript: "typescript",
    Java: "java",
    "C++": "cpp",
    Go: "go",
    Rust: "rust",
    SQL: "sql",
  };
  return languageMap[language] || "python";
};
