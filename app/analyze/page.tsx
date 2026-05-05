"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/code-editor";
import { MetricsCard } from "@/components/metrics-card";
import { AdvancedMetricsSection } from "@/components/advanced-metrics";
import { LogicExplanationSection } from "@/components/logic-explanation";
import { ErrorAnalysisSection } from "@/components/error-analysis";
import { CodeImprovementsSection } from "@/components/code-improvements";
import { InsightSummary } from "@/components/insight-summary";
import { LineByLineInsights } from "@/components/line-by-line-insights";
import { SimplifiedCode } from "@/components/simplified-code";
import { AlternativeImplementation } from "@/components/alternative-implementation";
import { InsightSuggestions } from "@/components/insight-suggestions";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Play, Copy } from "lucide-react";
import type { AnalysisResult, LogicExplanation, CodeError, CodeImprovement, CodeInsightData } from "@/types/metrics";

const sampleCode = `def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

class DataProcessor:
    def __init__(self, data):
        self.data = data
        self.cache = {}
        
    def process(self):
        result = []
        for item in self.data:
            if item in self.cache:
                result.append(self.cache[item])
            else:
                value = self._transform(item)
                self.cache[item] = value
                result.append(value)
        return result
    
    def _transform(self, value):
        if value > 100:
            if value > 500:
                if value > 1000:
                    return value * 0.5
                return value * 0.7
            return value * 0.9
        return value

def validate_email(email):
    # Email validation with nested conditions
    if "@" in email:
        if "." in email:
            parts = email.split("@")
            if len(parts) == 2:
                local, domain = parts
                if len(local) > 0:
                    if len(domain) > 0:
                        return True
    return False`;

interface ExtendedAnalysisResult {
  metrics: AnalysisResult;
  logic: LogicExplanation;
  errors: CodeError[];
  improvements: CodeImprovement[];
}

export default function AnalyzePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [comparisonCode, setComparisonCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtendedAnalysisResult | null>(null);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("single");
  const [resultsTab, setResultsTab] = useState("metrics");
  const [analysisMode, setAnalysisMode] = useState<"full" | "insight">("full");
  const [insightResult, setInsightResult] = useState<CodeInsightData | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert("Please enter some code to analyze");
      return;
    }

    setLoading(true);
    try {
      if (analysisMode === "full") {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) throw new Error("Analysis failed");
        const data: ExtendedAnalysisResult = await response.json();
        setResult(data);
        setResultsTab("metrics");
      } else {
        const response = await fetch("/api/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) throw new Error("Insight analysis failed");
        const data: CodeInsightData = await response.json();
        setInsightResult(data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze code");
    } finally {
      setLoading(false);
    }
  };

  const handleCompareSimilarity = async () => {
    if (!code.trim() || !comparisonCode.trim()) {
      alert("Please enter code in both editors");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/similarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code1: code, code2: comparisonCode }),
      });

      if (!response.ok) throw new Error("Comparison failed");
      const data = await response.json();
      setSimilarity(data.similarity);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to compare code");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setCode(sampleCode);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">Code Analyzer</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-800/50 border border-indigo-500/20">
            <TabsTrigger value="single">Single File</TabsTrigger>
            <TabsTrigger value="compare">Compare Files</TabsTrigger>
          </TabsList>

          {/* Single File Analysis */}
          <TabsContent value="single" className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Analyze Python Code
                </h2>
                <p className="text-slate-300 text-sm">
                  Choose an analysis mode and paste your code to get started
                </p>
              </div>

              {/* Mode Selection Tabs */}
              <div className="flex gap-2 p-2 bg-slate-800/30 rounded-lg border border-indigo-500/20">
                <Button
                  variant={analysisMode === "full" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setAnalysisMode("full");
                    setInsightResult(null);
                    setResult(null);
                  }}
                  className={`flex-1 ${
                    analysisMode === "full"
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  Full Analysis
                </Button>
                <Button
                  variant={analysisMode === "insight" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setAnalysisMode("insight");
                    setResult(null);
                    setInsightResult(null);
                  }}
                  className={`flex-1 ${
                    analysisMode === "insight"
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  Code Insight Mode
                </Button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200">
                  Python Code
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSample}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Load Sample Code
                </Button>
              </div>
              <CodeEditor value={code} onChange={setCode} />
            </div>

              <Button
                onClick={handleAnalyze}
                disabled={loading || !code.trim()}
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold gap-2 rounded-lg transition-all"
              >
                {loading ? (
                  <>
                    <Spinner className="h-5 w-5" />
                    <span>Analyzing Your Code...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Run Analysis</span>
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            {result && analysisMode === "full" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Results Header */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Analysis Results
                  </h2>
                  <p className="text-slate-300 text-sm">
                    Review detailed metrics, code logic, errors, and improvement suggestions
                  </p>
                </div>

                {/* Results Tabs */}
                <Tabs value={resultsTab} onValueChange={setResultsTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800/40 border border-slate-700/50 rounded-lg p-1">
                    <TabsTrigger value="metrics" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded">Metrics</TabsTrigger>
                    <TabsTrigger value="logic" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded">Code Logic</TabsTrigger>
                    <TabsTrigger value="errors" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded">Errors</TabsTrigger>
                    <TabsTrigger value="improvements" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded">Improvements</TabsTrigger>
                  </TabsList>

                  {/* Metrics Tab */}
                  <TabsContent value="metrics" className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Analysis Results
                      </h2>

                      {/* Overall Score */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <MetricsCard
                          title="Overall Quality"
                          score={result.metrics.overallScore}
                          color={
                            result.metrics.overallScore >= 70
                              ? "green"
                              : result.metrics.overallScore >= 50
                                ? "yellow"
                                : "orange"
                          }
                        />
                        <MetricsCard
                          title="Complexity"
                          score={result.metrics.complexity}
                          color={
                            result.metrics.complexity <= 50 ? "green" : "orange"
                          }
                          description="Lower is better"
                        />
                        <MetricsCard
                          title="Modularity"
                          score={result.metrics.modularity}
                          color={
                            result.metrics.modularity >= 60 ? "cyan" : "orange"
                          }
                        />
                        <MetricsCard
                          title="Naming Conventions"
                          score={result.metrics.naming}
                          color={result.metrics.naming >= 60 ? "green" : "yellow"}
                        />
                        <MetricsCard
                          title="Duplication"
                          score={result.metrics.duplication}
                          color={
                            result.metrics.duplication >= 60
                              ? "green"
                              : result.metrics.duplication >= 40
                                ? "yellow"
                                : "orange"
                          }
                          description="Higher is better"
                        />
                        <MetricsCard
                          title="Logical Depth"
                          score={result.metrics.logicalDepth}
                          color={
                            result.metrics.logicalDepth <= 50 ? "green" : "orange"
                          }
                          description="Lower is better"
                        />
                      </div>

                      {/* Suggestions */}
                      <Card className="p-6 border-indigo-500/30 bg-indigo-950/20">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Recommendations
                        </h3>
                        <ul className="space-y-3">
                          {result.metrics.suggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 text-slate-100"
                            >
                              <span className="text-indigo-400 font-bold min-w-fit">→</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      {/* Advanced Metrics */}
                      {result.metrics.advancedMetrics && (
                        <AdvancedMetricsSection metrics={result.metrics.advancedMetrics} />
                      )}
                    </div>
                  </TabsContent>

                  {/* Logic Explanation Tab */}
                  <TabsContent value="logic" className="space-y-6">
                    <LogicExplanationSection logic={result.logic} />
                  </TabsContent>

                  {/* Error Analysis Tab */}
                  <TabsContent value="errors" className="space-y-6">
                    <ErrorAnalysisSection errors={result.errors} />
                  </TabsContent>

                  {/* Code Improvements Tab */}
                  <TabsContent value="improvements" className="space-y-6">
                    <CodeImprovementsSection improvements={result.improvements} />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Code Insight Results */}
            {insightResult && analysisMode === "insight" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Code Insight Analysis</h2>
                  <p className="text-slate-300 text-sm">
                    Deep analysis of your code with practical insights and actionable suggestions
                  </p>
                </div>
                
                {/* Summary Cards */}
                <InsightSummary summary={insightResult.summary} />

                {/* Line-by-Line Insights */}
                <LineByLineInsights insights={insightResult.lineByLineInsights} />

                {/* Simplified Code */}
                <SimplifiedCode
                  simplifiedCode={insightResult.simplifiedCode}
                  explanation={insightResult.simplifiedExplanation}
                />

                {/* Alternative Implementation */}
                <AlternativeImplementation
                  title={insightResult.alternativeImplementation.title}
                  description={insightResult.alternativeImplementation.description}
                  code={insightResult.alternativeImplementation.code}
                  tradeoffs={insightResult.alternativeImplementation.tradeoffs}
                />

                {/* Suggestions */}
                <InsightSuggestions suggestions={insightResult.suggestions} />
              </div>
            )}
          </TabsContent>

          {/* Compare Files */}
          <TabsContent value="compare" className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Compare Files
              </h2>
              <p className="text-slate-300 text-sm">
                Paste two Python files to compare their similarity and differences
              </p>
            </div>

            {/* Editor Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200">
                  Python Code - File 1
                </label>
                <CodeEditor value={code} onChange={setCode} />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200">
                  Python Code - File 2
                </label>
                <CodeEditor
                  value={comparisonCode}
                  onChange={setComparisonCode}
                />
              </div>
            </div>

            {/* Compare Button */}
            <Button
              onClick={handleCompareSimilarity}
              disabled={
                loading || !code.trim() || !comparisonCode.trim()
              }
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold gap-2 rounded-lg transition-all"
            >
              {loading ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Comparing Files...</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span>Compare Similarity</span>
                </>
              )}
            </Button>

            {similarity !== null && (
              <Card className="p-8 border-indigo-500/30 bg-indigo-950/20 animate-in fade-in rounded-lg">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    Similarity Score
                  </h3>
                  <div className="flex justify-center mb-6">
                    <svg
                      className="w-48 h-48 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-slate-700"
                        fill="none"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-cyan-400"
                        fill="none"
                        strokeWidth="8"
                        strokeDasharray={`${(similarity / 100) * 282.7} 282.7`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-indigo-400">
                        {similarity}
                      </span>
                      <span className="text-slate-200">%</span>
                    </div>
                  </div>
                  <p className="text-slate-100 font-medium">
                    {similarity > 80
                      ? "Files are very similar"
                      : similarity > 50
                        ? "Files have moderate similarity"
                        : "Files are quite different"}
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
