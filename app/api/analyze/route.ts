import { analyzeCode } from "@/lib/metrics";
import { analyzeLogic } from "@/lib/logic-analyzer";
import { detectErrors } from "@/lib/error-analyzer";
import { generateImprovements } from "@/lib/code-improver";
import type { AnalysisResult, LogicExplanation, CodeError, CodeImprovement } from "@/types/metrics";

export interface ExtendedAnalysisResult {
  metrics: AnalysisResult;
  logic: LogicExplanation;
  errors: CodeError[];
  improvements: CodeImprovement[];
}

export async function POST(request: Request) {
  try {
    const { code, analysisType = "full" } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json(
        { error: "Invalid or missing code" },
        { status: 400 }
      );
    }

    if (code.trim().length === 0) {
      return Response.json(
        { error: "Code cannot be empty" },
        { status: 400 }
      );
    }

    const result: ExtendedAnalysisResult = {
      metrics: analyzeCode(code),
      logic: analyzeLogic(code),
      errors: detectErrors(code),
      improvements: generateImprovements(code),
    };

    return Response.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze code" },
      { status: 500 }
    );
  }
}
