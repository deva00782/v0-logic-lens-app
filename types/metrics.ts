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

export interface LogicExplanation {
  summary: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  mainFlow: string[];
  patterns: string[];
  complexity: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface CodeError {
  id: string;
  line: number;
  type: 'syntax' | 'logic' | 'performance' | 'best-practice';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  explanation: string;
  whyItOccurs: string;
  impact: string;
  suggestion: string;
  example?: string;
}

export interface CodeImprovement {
  title: string;
  category: 'performance' | 'readability' | 'best-practice' | 'maintainability';
  severity: 'critical' | 'major' | 'minor';
  currentCode: string;
  improvedCode: string;
  explanation: string;
  benefits: string[];
  considerations: string;
}

export interface LineInsight {
  lineNumber: number;
  code: string;
  insight: string;
  type: 'good' | 'warning' | 'info' | 'improvement';
}

export interface CodeInsightData {
  summary: {
    totalLines: number;
    totalFunctions: number;
    complexity: string;
    mainPurpose: string;
  };
  lineByLineInsights: LineInsight[];
  simplifiedCode: string;
  simplifiedExplanation: string;
  alternativeImplementation: {
    title: string;
    description: string;
    code: string;
    tradeoffs: string;
  };
  suggestions: {
    category: string;
    suggestion: string;
    example: string;
  }[];
}
