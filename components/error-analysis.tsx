'use client';

import { Card } from '@/components/ui/card';
import { CodeError } from '@/types/metrics';
import { AlertCircle, AlertTriangle, Info, AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ErrorAnalysisProps {
  errors: CodeError[];
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'warning':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'info':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'syntax':
      return 'bg-red-500/20 text-red-200';
    case 'logic':
      return 'bg-orange-500/20 text-orange-200';
    case 'performance':
      return 'bg-yellow-500/20 text-yellow-200';
    case 'best-practice':
      return 'bg-blue-500/20 text-blue-200';
    default:
      return 'bg-slate-500/20 text-slate-200';
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical':
      return <AlertOctagon className="h-5 w-5" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5" />;
    case 'info':
      return <Info className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
}

export function ErrorAnalysisSection({ errors }: ErrorAnalysisProps) {
  const [expandedError, setExpandedError] = useState<string | null>(
    errors.length > 0 ? errors[0].id : null
  );

  if (errors.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Error Analysis</h2>
        <Card className="p-8 border-emerald-500/30 bg-emerald-500/10 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-emerald-500/20 rounded-full p-3">
              <AlertCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <p className="text-emerald-300 font-semibold">No Errors Detected</p>
          <p className="text-emerald-200 text-sm mt-1">Your code looks great! No critical issues found.</p>
        </Card>
      </div>
    );
  }

  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const warningErrors = errors.filter(e => e.severity === 'warning');
  const infoErrors = errors.filter(e => e.severity === 'info');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Error Analysis</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4 border-red-500/30 bg-red-500/10">
          <p className="text-xs text-red-200 mb-1">Critical Issues</p>
          <p className="text-2xl font-bold text-red-400">{criticalErrors.length}</p>
        </Card>
        <Card className="p-4 border-yellow-500/30 bg-yellow-500/10">
          <p className="text-xs text-yellow-200 mb-1">Warnings</p>
          <p className="text-2xl font-bold text-yellow-400">{warningErrors.length}</p>
        </Card>
        <Card className="p-4 border-blue-500/30 bg-blue-500/10">
          <p className="text-xs text-blue-200 mb-1">Info</p>
          <p className="text-2xl font-bold text-blue-400">{infoErrors.length}</p>
        </Card>
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {errors.map(error => (
          <Card
            key={error.id}
            className={`p-4 border-2 cursor-pointer transition-all hover:border-opacity-100 ${getSeverityColor(
              error.severity
            )}`}
            onClick={() =>
              setExpandedError(expandedError === error.id ? null : error.id)
            }
          >
            {/* Error Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="pt-1">{getSeverityIcon(error.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{error.message}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(error.type)}`}>
                      {error.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Line {error.line}</p>
                </div>
              </div>
              <div className="pt-1">
                {expandedError === error.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedError === error.id && (
              <div className="mt-4 pt-4 border-t border-current border-opacity-30 space-y-3">
                {/* Explanation */}
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">What It Means</p>
                  <p className="text-sm text-slate-200">{error.explanation}</p>
                </div>

                {/* Why It Occurs */}
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">Why It Occurs</p>
                  <p className="text-sm text-slate-200">{error.whyItOccurs}</p>
                </div>

                {/* Impact */}
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">Impact on Code</p>
                  <p className="text-sm text-slate-200">{error.impact}</p>
                </div>

                {/* Suggestion */}
                <div className="bg-slate-800/50 rounded p-3">
                  <p className="text-xs font-semibold text-emerald-300 mb-2">How to Fix</p>
                  <p className="text-sm text-slate-200">{error.suggestion}</p>
                </div>

                {/* Code Example */}
                {error.example && (
                  <div className="bg-slate-900/50 rounded p-3 border border-slate-700">
                    <p className="text-xs font-semibold text-cyan-300 mb-2">Example</p>
                    <pre className="text-xs text-slate-300 overflow-x-auto">
                      <code>{error.example}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
