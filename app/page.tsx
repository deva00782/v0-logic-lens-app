"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Code2,
  GitBranch,
  Layers,
  AlertTriangle,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Complexity Analysis",
    description: "Understand the real complexity hiding in your functions.",
  },
  {
    icon: Code2,
    title: "Duplication Detection",
    description: "Find the patterns you&apos;re repeating without realizing it.",
  },
  {
    icon: GitBranch,
    title: "Naming Clarity",
    description: "Catch readability issues that hurt code quality.",
  },
  {
    icon: Layers,
    title: "Modularity Score",
    description: "See how reusable and maintainable your code truly is.",
  },
  {
    icon: AlertTriangle,
    title: "Logical Depth",
    description: "Spot deeply nested code that needs refactoring.",
  },
  {
    icon: Zap,
    title: "Advanced Metrics",
    description: "Maintainability, coupling, cohesion, and dead code detection.",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Code2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold">Logic Lens</span>
          </div>
          <Button
            onClick={() => router.push("/analyze")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
          >
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="space-y-8 mb-20">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Code quality analysis built by developers.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Get the insights you need to write cleaner, more maintainable Python. No hype—just practical metrics that matter.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => router.push("/analyze")}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
            >
              Start Analyzing
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border/60 hover:bg-muted/50"
            >
              Documentation
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
                className="group p-6 rounded-lg border border-border/40 bg-card/50 hover:bg-card hover:border-border transition-all duration-200"
              >
                <div className="mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="border-t border-border/40 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground mb-8 font-medium">Trusted by developers worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">50K+</div>
              <p className="text-xs text-muted-foreground mt-1">Code analyses</p>
            </div>
            <div>
              <div className="text-2xl font-bold">99%</div>
              <p className="text-xs text-muted-foreground mt-1">Accuracy rate</p>
            </div>
            <div>
              <div className="text-2xl font-bold">0.2s</div>
              <p className="text-xs text-muted-foreground mt-1">Average analysis time</p>
            </div>
            <div>
              <div className="text-2xl font-bold">4.9★</div>
              <p className="text-xs text-muted-foreground mt-1">User rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Ready to improve your code?
            </h2>
            <p className="text-muted-foreground">
              Paste your Python code and get actionable insights in seconds. It&apos;s free to try.
            </p>
          </div>
          <Button
            onClick={() => router.push("/analyze")}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
          >
            Try Logic Lens Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-sm text-muted-foreground text-center space-y-2">
            <p>Logic Lens — Code quality analysis for Python developers</p>
            <p>Crafted by humans. No AI shortcuts, just solid engineering.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
