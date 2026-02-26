import { analyzeCodeInsight } from "@/lib/insight-analyzer";
import type { CodeInsightData } from "@/types/metrics";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

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

    const result: CodeInsightData = analyzeCodeInsight(code);

    return Response.json(result);
  } catch (error) {
    console.error("Code Insight error:", error);
    return Response.json(
      { error: "Failed to analyze code insight" },
      { status: 500 }
    );
  }
}
