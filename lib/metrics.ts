import type {
  AnalysisResult,
  AdvancedMetrics,
  FunctionLengthAnalysis,
  DeadCodeDetection,
} from "@/types/metrics";

// Mock analysis function - simulates Python code analysis
export function analyzeCode(code: string): AnalysisResult {
  const lines = code.split("\n").filter((line) => line.trim().length > 0);
  const codeLength = code.length;

  // Simulate metric calculations
  const complexity = Math.min(
    100,
    Math.max(10, 50 + Math.random() * 30 - 15)
  );
  const modularity = Math.min(100, Math.max(20, 65 + Math.random() * 20));
  const naming = Math.min(100, Math.max(40, 70 + Math.random() * 25));
  const duplication = Math.min(100, Math.max(20, 60 + Math.random() * 30));
  const logicalDepth = Math.min(100, Math.max(30, 55 + Math.random() * 25));

  const overallScore = Math.round(
    (complexity + modularity + naming + duplication + logicalDepth) / 5
  );

  const suggestions = generateSuggestions(
    complexity,
    modularity,
    naming,
    duplication,
    logicalDepth,
    lines.length
  );

  const advancedMetrics = calculateAdvancedMetrics(code, lines);

  return {
    overallScore,
    complexity: Math.round(complexity),
    modularity: Math.round(modularity),
    naming: Math.round(naming),
    duplication: Math.round(duplication),
    logicalDepth: Math.round(logicalDepth),
    suggestions,
    advancedMetrics,
  };
}

function calculateAdvancedMetrics(code: string, lines: string[]): AdvancedMetrics {
  const maintainabilityIndex = calculateMaintainabilityIndex(code, lines);
  const couplingScore = calculateCouplingScore(code);
  const cohesionScore = calculateCohesionScore(code);
  const functionLengthAnalysis = analyzeFunctionLength(code, lines);
  const deadCodeDetection = detectDeadCode(code);

  return {
    maintainabilityIndex: Math.round(maintainabilityIndex),
    maintainabilityDescription: getMaintainabilityDescription(maintainabilityIndex),
    couplingScore: Math.round(couplingScore),
    couplingDescription: getCouplingDescription(couplingScore),
    cohesionScore: Math.round(cohesionScore),
    cohesionDescription: getCohesionDescription(cohesionScore),
    functionLengthAnalysis,
    deadCodeDetection,
  };
}

function calculateMaintainabilityIndex(code: string, lines: string[]): number {
  // Halstead Metrics based approach (mocked)
  const volume = code.length * Math.log2(code.length || 1);
  const cyclomatic = Math.min(15, 1 + (code.match(/if|for|while|except/gi) || []).length * 0.5);
  const linesOfCode = lines.length;

  const mi = Math.max(
    0,
    171 -
      5.2 * Math.log(volume) -
      0.23 * cyclomatic -
      16.2 * Math.log(Math.max(1, linesOfCode)) +
      50 * Math.sin(Math.sqrt(2.4 * linesOfCode))
  );

  return Math.min(100, mi);
}

function getMaintainabilityDescription(index: number): string {
  if (index >= 85) return "Highly Maintainable - Excellent code quality";
  if (index >= 70) return "Maintainable - Good code quality";
  if (index >= 50) return "Moderate - Some refactoring recommended";
  return "Low Maintainability - Requires significant refactoring";
}

function calculateCouplingScore(code: string): number {
  // Count import statements and external dependencies
  const imports = (code.match(/import|from|require/gi) || []).length;
  const classDefinitions = (code.match(/^class\s+/gm) || []).length || 1;
  const functionDefinitions = (code.match(/^def\s+/gm) || []).length || 1;

  const baseCoupling = Math.max(0, 100 - imports * 10);
  const couplingRatio = (imports / (classDefinitions + functionDefinitions)) * 50;

  return Math.max(0, Math.min(100, baseCoupling - couplingRatio));
}

function getCouplingDescription(score: number): string {
  if (score >= 80) return "Loosely Coupled - Good module independence";
  if (score >= 60) return "Moderately Coupled - Acceptable dependencies";
  if (score >= 40) return "Tightly Coupled - Consider refactoring";
  return "Highly Coupled - Urgent refactoring needed";
}

function calculateCohesionScore(code: string): number {
  // Measure how well methods/functions relate within classes
  const classMethods = (code.match(/def\s+\w+\s*\(/gm) || []).length;
  const classVariables = (code.match(/self\.\w+\s*=/gm) || []).length;
  const methodsUsingVariables = (code.match(/self\.\w+/gm) || []).length;

  if (classMethods === 0) return 75;

  const cohesion = (methodsUsingVariables / (classMethods * Math.max(1, classVariables))) * 100;
  return Math.min(100, Math.max(30, cohesion));
}

function getCohesionDescription(score: number): string {
  if (score >= 80) return "High Cohesion - Methods are well related";
  if (score >= 60) return "Good Cohesion - Reasonable method grouping";
  if (score >= 40) return "Low Cohesion - Consider splitting classes";
  return "Very Low Cohesion - Significant refactoring needed";
}

function analyzeFunctionLength(code: string, lines: string[]): FunctionLengthAnalysis {
  const functionRegex = /def\s+\w+\s*\([^)]*\):/g;
  const matches = code.matchAll(functionRegex);
  const functionStarts: number[] = [];

  let match;
  while ((match = matches.next()).value) {
    const index = code.lastIndexOf(match.value.input.substring(0, match.value.index));
    const lineNum = code.substring(0, index).split("\n").length;
    functionStarts.push(lineNum);
  }

  const functionLengths: number[] = [];

  for (let i = 0; i < functionStarts.length; i++) {
    const start = functionStarts[i];
    const end = i + 1 < functionStarts.length ? functionStarts[i + 1] : lines.length;
    functionLengths.push(end - start);
  }

  const recommendedThreshold = 30;
  const exceedingThreshold = functionLengths.filter(
    (len) => len > recommendedThreshold
  ).length;

  return {
    averageLength:
      functionLengths.length > 0
        ? Math.round(functionLengths.reduce((a, b) => a + b, 0) / functionLengths.length)
        : 0,
    maxLength: Math.max(...functionLengths, 0),
    minLength: functionLengths.length > 0 ? Math.min(...functionLengths) : 0,
    functionsExceedingThreshold: exceedingThreshold,
    totalFunctions: functionLengths.length,
    recommendedThreshold,
  };
}

function detectDeadCode(code: string): DeadCodeDetection {
  // Mocked dead code detection
  const lines = code.split("\n");
  const totalLines = lines.length;

  // Mock detection patterns
  const unusedVariables = [
    "temp_buffer",
    "old_config",
    "_cached_value",
  ].filter(() => Math.random() > 0.5);

  const unusedFunctions = [
    "parse_legacy_format",
    "deprecated_helper",
  ].filter(() => Math.random() > 0.6);

  const unreachableCode = ["after_return_statement", "dead_branch"].filter(
    () => Math.random() > 0.7
  );

  const potentialDeadCodeLines = Math.max(
    0,
    Math.floor(totalLines * (Math.random() * 0.15))
  );

  return {
    potentialDeadCodeLines,
    deadCodePercentage: Math.round(
      (potentialDeadCodeLines / Math.max(1, totalLines)) * 100
    ),
    unusedVariables,
    unusedFunctions,
    unreachableCode,
  };
}

function generateSuggestions(
  complexity: number,
  modularity: number,
  naming: number,
  duplication: number,
  logicalDepth: number,
  lineCount: number
): string[] {
  const suggestions: string[] = [];

  if (complexity > 70) {
    suggestions.push("Reduce cyclomatic complexity by breaking down complex functions");
  }
  if (modularity < 40) {
    suggestions.push("Consider breaking code into smaller, reusable modules");
  }
  if (naming < 50) {
    suggestions.push("Improve variable and function naming for better clarity");
  }
  if (duplication > 60) {
    suggestions.push("Extract duplicated code into shared utility functions");
  }
  if (logicalDepth > 70) {
    suggestions.push("Reduce nesting depth to improve code readability");
  }
  if (lineCount > 500) {
    suggestions.push("Consider splitting this file into multiple smaller files");
  }

  return suggestions.length > 0 ? suggestions : ["Code quality is excellent!"];
}

export function calculateSimilarity(code1: string, code2: string): number {
  // Simple Levenshtein-like similarity metric (mocked)
  const len1 = code1.length;
  const len2 = code2.length;
  const maxLen = Math.max(len1, len2);

  if (maxLen === 0) return 100;

  const diff = Math.abs(len1 - len2);
  let matches = 0;

  const minLen = Math.min(len1, len2);
  for (let i = 0; i < minLen; i++) {
    if (code1[i] === code2[i]) matches++;
  }

  const similarity = ((matches + (maxLen - diff)) / maxLen) * 100;
  return Math.min(100, Math.max(0, similarity));
}
