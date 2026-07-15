"use client";

interface MetricsPanelProps {
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export default function MetricsPanel({
  explanation,
  timeComplexity,
  spaceComplexity,
}: MetricsPanelProps) {
  return (
    <div className="border-t border-surface flex flex-col flex-1 min-h-[250px]">
      <div className="flex border-b border-surface flex-shrink-0">
        <button className="px-4 py-2 text-sm font-medium text-accent-primary border-b-2 border-accent-primary">
          Explanation
        </button>
        <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-all duration-300 ease-in-out">
          Review
        </button>
      </div>
      <div className="p-4 bg-surface flex-1 overflow-y-auto">
        {explanation ? (
          <div className="space-y-3 text-sm">
            <div className="text-text-secondary whitespace-pre-wrap">{explanation}</div>
            {(timeComplexity || spaceComplexity) && (
              <div className="border-t border-surface pt-3 space-y-2">
                {timeComplexity && (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">Time Complexity:</span>
                    <span className="text-text-primary font-mono">{timeComplexity.replace("Time Complexity:", "").trim()}</span>
                  </div>
                )}
                {spaceComplexity && (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">Space Complexity:</span>
                    <span className="text-text-primary font-mono">{spaceComplexity.replace("Space Complexity:", "").trim()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">Time Complexity:</span>
              <span className="text-text-primary font-mono">O(2^n)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">Space Complexity:</span>
              <span className="text-text-primary font-mono">O(n)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
