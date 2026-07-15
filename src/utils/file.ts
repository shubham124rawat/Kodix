export const getFileExtension = (language: string): string => {
  const extensionMap: Record<string, string> = {
    Python: "py",
    JavaScript: "js",
    TypeScript: "ts",
    Java: "java",
    "C++": "cpp",
    Go: "go",
    Rust: "rs",
    SQL: "sql",
  };
  return extensionMap[language] || "txt";
};

export const downloadFile = (content: string, language: string): void => {
  const extension = getFileExtension(language);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kodix_output.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (err) {
    console.error("Failed to copy", err);
    return false;
  }
};
