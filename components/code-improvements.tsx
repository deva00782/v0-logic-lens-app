'use client';

import { Card } from '@/components/ui/card';
import { CodeImprovement } from '@/types/metrics';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeImprovementsProps {
  improvements: CodeImprovement[];
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'performance':
      return 'text-orange-400 bg-orange-500/10';
    case 'readability':
      return 'text-blue-400 bg-blue-500/10';
    case 'best-practice':
      return 'text-emerald-400 bg-emerald-500/10';
    case 'maintainability':
      return 'text-purple-400 bg-purple-500/10';
    default:
      return 'text-slate-400 bg-slate-500/10';
  }
}

function getSeverityBadge(severity: string) {
  const colors = {
    critical: 'bg-red-500/20 text-red-200',
    major: 'bg-orange-500/20 text-orange-200',
    minor: 'bg-blue-500/20 text-blue-200',
  };
  return colors[severity as keyof typeof colors] || colors.minor;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded hover:bg-slate-700 transition-colors"
      title="Copy code"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4 text-slate-400" />
      )}
    </button>
  );
}

export function CodeImprovementsSection({ improvements }: CodeImprovementsProps) {
  const [expandedImprovement, setExpandedImprovement] = useState<number | null>(
    improvements.length > 0 ? 0 : null
  );

  if (improvements.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Code Improvements</h2>
        <Card className="p-8 border-slate-500/30 bg-slate-500/10 text-center">
          <p className="text-slate-300 font-semibold">No Suggestions</p>
          <p className="text-slate-400 text-sm mt-1">Your code is already well-optimized!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Code Improvements</h2>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['performance', 'readability', 'best-practice', 'maintainability'].map(
          category => {
            const count = improvements.filter(i => i.category === category).length;
            return (
              <Card
                key={category}
                className={`p-3 border border-opacity-30 ${getCategoryColor(category)}`}
              >
                <p className="text-xs font-medium capitalize">{category}</p>
                <p className="text-2xl font-bold mt-1">{count}</p>
              </Card>
            );
          }
        )}
      </div>

      {/* Improvements List */}
      <div className="space-y-3">
        {improvements.map((improvement, idx) => (
          <Card
            key={idx}
            className="border-indigo-500/20 bg-slate-900/60 cursor-pointer transition-all hover:border-indigo-500/40 overflow-hidden"
            onClick={() =>
              setExpandedImprovement(expandedImprovement === idx ? null : idx)
            }
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-white">{improvement.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${getSeverityBadge(improvement.severity)}`}>
                    {improvement.severity}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded capitalize font-medium ${getCategoryColor(
                      improvement.category
                    )}`}
                  >
                    {improvement.category}
                  </span>
                </div>
              </div>
              {expandedImprovement === idx ? (
                <ChevronUp className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedImprovement === idx && (
              <div className="border-t border-slate-700 p-4 space-y-4">
                {/* Explanation */}
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2">Explanation</p>
                  <p className="text-sm text-slate-200">{improvement.explanation}</p>
                </div>

                {/* Before and After Code */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-red-300">Before (Current)</p>
                      <CopyButton text={improvement.currentCode} />
                    </div>
                    <pre className="bg-slate-800/50 rounded p-3 text-xs text-slate-300 overflow-x-auto border border-slate-700">
                      <code>{improvement.currentCode}</code>
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-emerald-300">After (Improved)</p>
                      <CopyButton text={improvement.improvedCode} />
                    </div>
                    <pre className="bg-slate-800/50 rounded p-3 text-xs text-slate-300 overflow-x-auto border border-emerald-500/30">
                      <code>{improvement.improvedCode}</code>
                    </pre>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2">Benefits</p>
                  <ul className="space-y-1">
                    {improvement.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex gap-2 text-sm text-slate-200">
                        <span className="text-emerald-400 flex-shrink-0">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Considerations */}
                <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
                  <p className="text-xs font-semibold text-slate-300 mb-2">Important Considerations</p>
                  <p className="text-sm text-slate-200">{improvement.considerations}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
