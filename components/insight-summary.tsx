import { Card } from "@/components/ui/card";
import { Code, Zap, Layers, BookOpen } from "lucide-react";

interface InsightSummaryProps {
  summary: {
    totalLines: number;
    totalFunctions: number;
    complexity: string;
    mainPurpose: string;
  };
}

export function InsightSummary({ summary }: InsightSummaryProps) {
  const complexityColor =
    summary.complexity === "High Complexity"
      ? "text-orange-400"
      : summary.complexity === "Medium Complexity"
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Lines */}
      <Card className="p-4 border-indigo-500/20 bg-slate-900/60">
        <div className="flex items-start gap-3">
          <Code className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400">Total Lines</p>
            <p className="text-2xl font-bold text-white">
              {summary.totalLines}
            </p>
          </div>
        </div>
      </Card>

      {/* Total Functions */}
      <Card className="p-4 border-indigo-500/20 bg-slate-900/60">
        <div className="flex items-start gap-3">
          <Layers className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400">Functions/Methods</p>
            <p className="text-2xl font-bold text-white">
              {summary.totalFunctions}
            </p>
          </div>
        </div>
      </Card>

      {/* Complexity */}
      <Card className="p-4 border-indigo-500/20 bg-slate-900/60">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400">Complexity</p>
            <p className={`text-sm font-bold ${complexityColor}`}>
              {summary.complexity}
            </p>
          </div>
        </div>
      </Card>

      {/* Purpose */}
      <Card className="p-4 border-indigo-500/20 bg-slate-900/60">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400">Purpose</p>
            <p className="text-xs text-slate-200 line-clamp-2">
              {summary.mainPurpose}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
