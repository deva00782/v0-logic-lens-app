import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import type { LineInsight } from "@/types/metrics";

interface LineByLineInsightsProps {
  insights: LineInsight[];
}

export function LineByLineInsights({ insights }: LineByLineInsightsProps) {
  const [expandedLines, setExpandedLines] = useState<Set<number>>(new Set());

  const toggleExpand = (lineNumber: number) => {
    const newExpanded = new Set(expandedLines);
    if (newExpanded.has(lineNumber)) {
      newExpanded.delete(lineNumber);
    } else {
      newExpanded.add(lineNumber);
    }
    setExpandedLines(newExpanded);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "good":
        return "bg-green-500/10 border-green-500/20";
      case "warning":
        return "bg-orange-500/10 border-orange-500/20";
      case "improvement":
        return "bg-blue-500/10 border-blue-500/20";
      default:
        return "bg-slate-500/10 border-slate-500/20";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "good":
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded font-medium">
            Good Practice
          </span>
        );
      case "warning":
        return (
          <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded font-medium">
            Warning
          </span>
        );
      case "improvement":
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded font-medium">
            Improvement
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-500/20 text-slate-300 text-xs rounded font-medium">
            Info
          </span>
        );
    }
  };

  return (
    <Card className="p-6 border-indigo-500/20 bg-slate-900/60">
      <h3 className="text-lg font-semibold text-white mb-4">
        Line-by-Line Analysis
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {insights.map((insight) => (
          <div
            key={`${insight.lineNumber}`}
            className={`border rounded-lg overflow-hidden transition-all ${getTypeColor(
              insight.type
            )}`}
          >
            <button
              onClick={() => toggleExpand(insight.lineNumber)}
              className="w-full p-3 flex items-start justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex-1 text-left flex items-start gap-3">
                <span className="text-xs text-slate-400 font-mono w-8">
                  {insight.lineNumber}
                </span>
                <div className="flex-1">
                  <p className="text-xs text-slate-300 font-mono mb-2">
                    {insight.code.substring(0, 60)}
                    {insight.code.length > 60 ? "..." : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(insight.type)}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${
                  expandedLines.has(insight.lineNumber) ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedLines.has(insight.lineNumber) && (
              <div className="border-t border-inherit px-3 py-3 bg-slate-800/20">
                <p className="text-sm text-slate-200">{insight.insight}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
