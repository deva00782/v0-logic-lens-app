"use client";

interface ScoreIndicatorProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreIndicator({
  score,
  label,
  size = "md",
}: ScoreIndicatorProps) {
  const getColor = () => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getBgColor = () => {
    if (score >= 80) return "bg-green-400/10";
    if (score >= 60) return "bg-yellow-400/10";
    if (score >= 40) return "bg-orange-400/10";
    return "bg-red-400/10";
  };

  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-2",
    lg: "text-lg px-4 py-3",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full inline-flex items-center gap-2 ${getBgColor()}`}
    >
      <span className={`font-bold ${getColor()}`}>{Math.round(score)}</span>
      {label && <span className="text-gray-300">{label}</span>}
    </div>
  );
}
