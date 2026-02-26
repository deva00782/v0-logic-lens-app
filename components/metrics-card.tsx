"use client";

import { Card } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  score: number;
  color: string;
  description?: string;
}

export function MetricsCard({
  title,
  score,
  color,
  description,
}: MetricsCardProps) {
  const getCircleColor = () => {
    if (color === "green") return "stroke-green-400";
    if (color === "yellow") return "stroke-yellow-400";
    if (color === "orange") return "stroke-orange-400";
    if (color === "cyan") return "stroke-cyan-400";
    return "stroke-indigo-400";
  };

  const getTextColor = () => {
    if (color === "green") return "text-green-400";
    if (color === "yellow") return "text-yellow-400";
    if (color === "orange") return "text-orange-400";
    if (color === "cyan") return "text-cyan-400";
    return "text-indigo-400";
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="p-6 flex flex-col items-center justify-center border-indigo-500/20 bg-slate-900/60">
      <div className="relative w-32 h-32 mb-4">
        <svg
          className="w-full h-full transform -rotate-90"
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
            className={getCircleColor()}
            fill="none"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getTextColor()}`}>
            {score}
          </span>
          <span className="text-xs text-slate-300">/100</span>
        </div>
      </div>

      <h3 className="font-semibold text-white text-center">{title}</h3>
      {description && (
        <p className="text-xs text-slate-200 text-center mt-2">{description}</p>
      )}
    </Card>
  );
}
