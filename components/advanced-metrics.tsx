"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdvancedMetrics } from "@/types/metrics";

interface AdvancedMetricsProps {
  metrics: AdvancedMetrics;
}

export function AdvancedMetricsSection({ metrics }: AdvancedMetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-400/10";
    if (score >= 60) return "bg-yellow-400/10";
    if (score >= 40) return "bg-orange-400/10";
    return "bg-red-400/10";
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full"
      >
        <Card className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer border-indigo-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <div className="text-left">
                <h3 className="font-semibold text-white">Advanced Metrics</h3>
                <p className="text-sm text-gray-400">Deep code quality analysis</p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-cyan-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-cyan-400" />
            )}
          </div>
        </Card>
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Maintainability Index */}
          <Card className="p-4 border-indigo-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Maintainability Index</h4>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBg(
                    metrics.maintainabilityIndex
                  )}`}
                >
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      metrics.maintainabilityIndex
                    )}`}
                  >
                    {metrics.maintainabilityIndex}
                  </span>
                  <span className="text-xs text-gray-300">/100</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {metrics.maintainabilityDescription}
              </p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{
                    width: `${metrics.maintainabilityIndex}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Coupling Score */}
          <Card className="p-4 border-indigo-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Coupling Score</h4>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBg(
                    metrics.couplingScore
                  )}`}
                >
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      metrics.couplingScore
                    )}`}
                  >
                    {metrics.couplingScore}
                  </span>
                  <span className="text-xs text-gray-300">/100</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{metrics.couplingDescription}</p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                  style={{
                    width: `${metrics.couplingScore}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Cohesion Score */}
          <Card className="p-4 border-indigo-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Cohesion Score</h4>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBg(
                    metrics.cohesionScore
                  )}`}
                >
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      metrics.cohesionScore
                    )}`}
                  >
                    {metrics.cohesionScore}
                  </span>
                  <span className="text-xs text-gray-300">/100</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{metrics.cohesionDescription}</p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{
                    width: `${metrics.cohesionScore}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Function Length Analysis */}
          <Card className="p-4 border-indigo-500/20">
            <div className="space-y-3">
              <h4 className="font-medium text-white">Function Length Analysis</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Average Length</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {metrics.functionLengthAnalysis.averageLength}
                  </p>
                  <p className="text-xs text-gray-500">lines</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Max Length</p>
                  <p className="text-2xl font-bold text-indigo-400">
                    {metrics.functionLengthAnalysis.maxLength}
                  </p>
                  <p className="text-xs text-gray-500">lines</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Total Functions</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {metrics.functionLengthAnalysis.totalFunctions}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Exceeding Threshold</p>
                  <p
                    className={`text-2xl font-bold ${
                      metrics.functionLengthAnalysis.functionsExceedingThreshold > 0
                        ? "text-orange-400"
                        : "text-green-400"
                    }`}
                  >
                    {metrics.functionLengthAnalysis.functionsExceedingThreshold}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Recommended threshold: {metrics.functionLengthAnalysis.recommendedThreshold} lines
              </p>
            </div>
          </Card>

          {/* Dead Code Detection */}
          <Card className="p-4 border-indigo-500/20">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-400" />
                <h4 className="font-medium text-white">Dead Code Detection</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Potential Dead Lines</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {metrics.deadCodeDetection.potentialDeadCodeLines}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Dead Code %</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {metrics.deadCodeDetection.deadCodePercentage}%
                  </p>
                </div>
              </div>

              {/* Unused Variables */}
              {metrics.deadCodeDetection.unusedVariables.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-300 mb-2">
                    Unused Variables:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metrics.deadCodeDetection.unusedVariables.map((variable) => (
                      <Badge key={variable} variant="outline" className="bg-red-400/10 text-red-300">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Unused Functions */}
              {metrics.deadCodeDetection.unusedFunctions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-300 mb-2">
                    Unused Functions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metrics.deadCodeDetection.unusedFunctions.map((func) => (
                      <Badge key={func} variant="outline" className="bg-red-400/10 text-red-300">
                        {func}()
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Unreachable Code */}
              {metrics.deadCodeDetection.unreachableCode.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-300 mb-2">
                    Unreachable Code:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metrics.deadCodeDetection.unreachableCode.map((code) => (
                      <Badge key={code} variant="outline" className="bg-red-400/10 text-red-300">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {metrics.deadCodeDetection.unusedVariables.length === 0 &&
                metrics.deadCodeDetection.unusedFunctions.length === 0 &&
                metrics.deadCodeDetection.unreachableCode.length === 0 && (
                  <p className="text-sm text-green-400">
                    ✓ No obvious dead code patterns detected
                  </p>
                )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
