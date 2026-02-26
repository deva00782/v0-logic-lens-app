import { calculateSimilarity } from "@/lib/metrics";

export async function POST(request: Request) {
  try {
    const { code1, code2 } = await request.json();

    if (!code1 || !code2 || typeof code1 !== "string" || typeof code2 !== "string") {
      return Response.json(
        { error: "Invalid or missing code samples" },
        { status: 400 }
      );
    }

    const similarity = calculateSimilarity(code1, code2);
    const differences = [];

    if (similarity < 100) {
      differences.push("Different code structure and logic patterns detected");
      if (Math.abs(code1.length - code2.length) > 50) {
        differences.push("Significant difference in file size");
      }
      if ((code1.match(/class/g) || []).length !== (code2.match(/class/g) || []).length) {
        differences.push("Different number of class definitions");
      }
    }

    return Response.json({
      similarity: Math.round(similarity),
      differences,
    });
  } catch (error) {
    console.error("Similarity error:", error);
    return Response.json(
      { error: "Failed to calculate similarity" },
      { status: 500 }
    );
  }
}
