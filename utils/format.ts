/**
 * Utility functions for formatting numbers, scores, and text
 */

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

export function formatPercentage(value: number, decimals = 1): string {
  return (value * 100).toFixed(decimals) + "%";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

export function formatTime(ms: number): string {
  if (ms < 1000) {
    return ms + "ms";
  }
  return (ms / 1000).toFixed(2) + "s";
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 50) return "Poor";
  return "Very Poor";
}

export function getScoreGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
