"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Zap,
  BarChart3,
  GitBranch,
  Code2,
  AlertTriangle,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Cyclomatic Complexity Analysis",
    description: "Measure code complexity and identify hard-to-maintain functions",
  },
  {
    icon: Code2,
    title: "Code Duplication Detection",
    description: "Find repeated code patterns and consolidation opportunities",
  },
  {
    icon: GitBranch,
    title: "Naming Convention Evaluation",
    description: "Ensure consistent and meaningful variable/function names",
  },
  {
    icon: Layers,
    title: "Modular Design Assessment",
    description: "Analyze code structure and dependency relationships",
  },
  {
    icon: AlertTriangle,
    title: "Logical Depth Analysis",
    description: "Identify deeply nested code requiring refactoring",
  },
  {
    icon: Zap,
    title: "Advanced Metrics Suite",
    description:
      "Deep insights into maintainability, coupling, cohesion, and dead code",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            <span className="text-xl font-bold text-white">Logic Lens</span>
          </div>
          <Button
            onClick={() => router.push("/analyze")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-balance">
            Clarity to Program{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Structure
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto text-balance">
            Elevate your Python code quality with comprehensive static analysis.
            Get actionable insights to build cleaner, more maintainable software.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={() => router.push("/analyze")}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Code2 className="h-5 w-5" />
              Analyze Your Code
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-indigo-500/50 hover:bg-indigo-500/10 text-white"
            >
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-lg border border-indigo-500/20 bg-slate-800/30 hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="mb-4">
                  <Icon className="h-8 w-8 text-cyan-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-indigo-500/20">
        <div className="text-center space-y-6 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-2xl p-12 border border-indigo-500/20">
          <h2 className="text-3xl font-bold text-white">
            Ready to Improve Your Code?
          </h2>
          <p className="text-slate-200 max-w-xl mx-auto">
            Get instant metrics and actionable recommendations to write better Python
            code
          </p>
          <Button
            onClick={() => router.push("/analyze")}
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold"
          >
            Start Analyzing Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>
            Logic Lens — Professional Code Quality Analysis for Python Developers
          </p>
        </div>
      </footer>
    </main>
  );
}
