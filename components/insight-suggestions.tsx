import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface SuggestionItem {
  category: string;
  suggestion: string;
  example: string;
}

interface InsightSuggestionsProps {
  suggestions: SuggestionItem[];
}

export function InsightSuggestions({ suggestions }: InsightSuggestionsProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "pythonic code":
        return "bg-green-500/10 border-green-500/20 text-green-400";
      case "code clarity":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "type safety":
        return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "error handling":
        return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "documentation":
        return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
      case "code maintainability":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      default:
        return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  return (
    <Card className="p-6 border-indigo-500/20 bg-slate-900/60">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">
          Improvement Suggestions
        </h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-4 ${getCategoryColor(
              item.category
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold mb-2">{item.category}</p>
                <p className="text-sm text-slate-200 mb-3">{item.suggestion}</p>
                <div className="bg-slate-950/50 rounded px-3 py-2 border border-slate-700/50">
                  <p className="text-xs font-mono text-slate-300">
                    {item.example}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">
            Great code! No major suggestions at this time.
          </p>
        </div>
      )}
    </Card>
  );
}
