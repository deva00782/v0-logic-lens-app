"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/code-editor";
import { MetricsCard } from "@/components/metrics-card";
import { AdvancedMetricsSection } from "@/components/advanced-metrics";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Play, Copy } from "lucide-react";
import type { AnalysisResult } from "@/types/metrics";

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

export default function AnalyzePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [comparisonCode, setComparisonCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("single");

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert("Please enter some code to analyze");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setResult(data);
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Enter Your Python Code
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSample}
                  className="text-xs"
                >
                  Load Sample
                </Button>
              </div>
              <CodeEditor value={code} onChange={setCode} />

              <Button
                onClick={handleAnalyze}
                disabled={loading || !code.trim()}
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              >
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Analysis Results
                  </h2>

                  {/* Overall Score */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <MetricsCard
                      title="Overall Quality"
                      score={result.overallScore}
                      color={
                        result.overallScore >= 70
                          ? "green"
                          : result.overallScore >= 50
                            ? "yellow"
                            : "orange"
                      }
                    />
                    <MetricsCard
                      title="Complexity"
                      score={result.complexity}
                      color={
                        result.complexity <= 50 ? "green" : "orange"
                      }
                      description="Lower is better"
                    />
                    <MetricsCard
                      title="Modularity"
                      score={result.modularity}
                      color={
                        result.modularity >= 60 ? "cyan" : "orange"
                      }
                    />
                    <MetricsCard
                      title="Naming Conventions"
                      score={result.naming}
                      color={result.naming >= 60 ? "green" : "yellow"}
                    />
                    <MetricsCard
                      title="Duplication"
                      score={result.duplication}
                      color={
                        result.duplication >= 60
                          ? "green"
                          : result.duplication >= 40
                            ? "yellow"
                            : "orange"
                      }
                      description="Higher is better"
                    />
                    <MetricsCard
                      title="Logical Depth"
                      score={result.logicalDepth}
                      color={
                        result.logicalDepth <= 50 ? "green" : "orange"
                      }
                      description="Lower is better"
                    />
                  </div>

                  {/* Suggestions */}
                  <Card className="p-6 border-indigo-500/20">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {result.suggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-gray-300"
                        >
                          <span className="text-cyan-400 font-bold">→</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Advanced Metrics */}
                  {result.advancedMetrics && (
                    <AdvancedMetricsSection metrics={result.advancedMetrics} />
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Compare Files */}
          <TabsContent value="compare" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">File 1</h2>
                <CodeEditor value={code} onChange={setCode} />
              </div>
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">File 2</h2>
                <CodeEditor
                  value={comparisonCode}
                  onChange={setComparisonCode}
                />
              </div>
            </div>

            <Button
              onClick={handleCompareSimilarity}
              disabled={
                loading || !code.trim() || !comparisonCode.trim()
              }
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Comparing...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Compare Similarity
                </>
              )}
            </Button>

            {similarity !== null && (
              <Card className="p-6 border-indigo-500/20 animate-in fade-in">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-white">
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
                      <span className="text-4xl font-bold text-cyan-400">
                        {similarity}
                      </span>
                      <span className="text-gray-400">%</span>
                    </div>
                  </div>
                  <p className="text-gray-400">
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
