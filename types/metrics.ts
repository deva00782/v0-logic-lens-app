export interface AnalysisResult {
  overallScore: number;
  complexity: number;
  modularity: number;
  naming: number;
  duplication: number;
  logicalDepth: number;
  suggestions: string[];
  advancedMetrics?: AdvancedMetrics;
}

export interface AdvancedMetrics {
  maintainabilityIndex: number;
  maintainabilityDescription: string;
  couplingScore: number;
  couplingDescription: string;
  cohesionScore: number;
  cohesionDescription: string;
  functionLengthAnalysis: FunctionLengthAnalysis;
  deadCodeDetection: DeadCodeDetection;
}

export interface FunctionLengthAnalysis {
  averageLength: number;
  maxLength: number;
  minLength: number;
  functionsExceedingThreshold: number;
  totalFunctions: number;
  recommendedThreshold: number;
}

export interface DeadCodeDetection {
  potentialDeadCodeLines: number;
  deadCodePercentage: number;
  unusedVariables: string[];
  unusedFunctions: string[];
  unreachableCode: string[];
}

export interface SimilarityResult {
  overallScore: number;
  similarity: number;
  differences: string[];
}
