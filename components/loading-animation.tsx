"use client";

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
        style={{ animationDelay: "0.1s" }}
      />
      <div
        className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
    </div>
  );
}
