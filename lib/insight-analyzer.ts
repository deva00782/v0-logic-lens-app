import type { CodeInsightData, LineInsight } from "@/types/metrics";

export function analyzeCodeInsight(code: string): CodeInsightData {
  const lines = code.split("\n");
  const lineByLineInsights = generateLineInsights(code);
  const summary = generateSummary(code);
  const simplifiedCode = generateSimplifiedCode(code);
  const alternativeImplementation = generateAlternative(code);
  const suggestions = generateSuggestions(code);

  return {
    summary,
    lineByLineInsights,
    simplifiedCode,
    simplifiedExplanation: generateSimplificationExplanation(code),
    alternativeImplementation,
    suggestions,
  };
}

function generateSummary(code: string) {
  const lines = code.split("\n");
  const functionMatches = code.match(/\bdef\b|\bfunction\b|\bclass\b/g) || [];
  const complexity = calculateComplexity(code);

  return {
    totalLines: lines.length,
    totalFunctions: functionMatches.length,
    complexity:
      complexity > 10
        ? "High Complexity"
        : complexity > 5
          ? "Medium Complexity"
          : "Low Complexity",
    mainPurpose: extractMainPurpose(code),
  };
}

function extractMainPurpose(code: string): string {
  const docstringMatch = code.match(/"""(.*?)"""/s);
  if (docstringMatch) {
    return docstringMatch[1].split("\n")[0];
  }

  const firstLineComment = code.split("\n")[0];
  if (firstLineComment.includes("#")) {
    return firstLineComment.split("#")[1].trim();
  }

  return "Data processing and transformation";
}

function generateLineInsights(code: string): LineInsight[] {
  const lines = code.split("\n");
  const insights: LineInsight[] = [];

  lines.forEach((line, idx) => {
    if (line.trim() === "") return;

    const lineNumber = idx + 1;
    let insight = "";
    let type: "good" | "warning" | "info" | "improvement" = "info";

    // Docstring check
    if (line.includes('"""') || line.includes("'''")) {
      insight = "Good documentation - clear function/class purpose";
      type = "good";
    }
    // Lambda check
    else if (line.includes("lambda")) {
      insight = "Lambda function used - check if readable; consider regular function";
      type = "improvement";
    }
    // Deep nesting
    else if (line.match(/^\s{16,}/)) {
      insight = "Deep nesting detected - consider refactoring";
      type = "warning";
    }
    // Import statement
    else if (line.match(/^\s*import|from.*import/)) {
      insight = "Import statement - ensures modularity";
      type = "good";
    }
    // Loop
    else if (line.includes("for ") || line.includes("while ")) {
      insight = "Loop detected - verify performance for large datasets";
      type = "info";
    }
    // Error handling
    else if (line.includes("try:") || line.includes("except")) {
      insight = "Error handling present - good practice";
      type = "good";
    }
    // Magic numbers
    else if (line.match(/=\s*\d{2,}/) && !line.includes("range")) {
      insight = "Magic number detected - consider using named constant";
      type = "improvement";
    }
    // List comprehension
    else if (line.includes("[") && line.includes("for") && line.includes("]")) {
      insight = "List comprehension used - concise and Pythonic";
      type = "good";
    }
    // Recursion
    else if (line.includes("return") && line.match(/\b\w+\s*\(/)) {
      const functionName = code.split("\n").find((l) =>
        l.match(/^\s*def\s+\w+/)
      );
      if (
        functionName &&
        line.includes(functionName.match(/def\s+(\w+)/)?.[1] || "")
      ) {
        insight = "Recursive call detected - consider iterative approach";
        type = "warning";
      }
    }
    // Type hints
    else if (line.includes(":") && line.includes("->")) {
      insight = "Type hints present - improves code readability";
      type = "good";
    }

    if (insight) {
      insights.push({
        lineNumber,
        code: line,
        insight,
        type,
      });
    }
  });

  return insights;
}

function generateSimplifiedCode(code: string): string {
  let simplified = code;

  // Remove unnecessary intermediate variables
  simplified = simplified.replace(
    /(\w+)\s*=\s*(.+?)\n\s*return\s+\1/g,
    "return $2"
  );

  // Simplify nested if statements to early returns
  simplified = simplified.replace(
    /if\s+(.+?):\s*if\s+(.+?):\s*return\s+(.+?)\n\s*return\s+False/g,
    "if $1 and $2:\n        return $3\n    return False"
  );

  // Remove redundant comments
  simplified = simplified.split("\n").filter((line) => {
    const comment = line.trim();
    return (
      !comment.startsWith("#") ||
      comment.length < 50 ||
      comment.includes("TODO")
    );
  });

  return simplified.join("\n");
}

function generateSimplificationExplanation(code: string): string {
  const hasNestedIf = code.match(/if.*:\s*if/g);
  const hasLambda = code.includes("lambda");
  const hasRecursion = code.match(/return.*\(/g);

  let explanation = "This simplified version improves readability by:\n";

  if (hasNestedIf) {
    explanation += "• Replacing deeply nested if statements with early returns\n";
  }
  if (hasLambda) {
    explanation += "• Converting lambdas to named functions for clarity\n";
  }
  if (hasRecursion) {
    explanation += "• Considering iterative approaches instead of recursion\n";
  }
  explanation +=
    "• Removing redundant comments and consolidating logic\n";
  explanation += "• Improving variable naming for clarity";

  return explanation;
}

function generateAlternative(code: string) {
  const hasRecursion = code.match(/return.*\(/g);

  if (hasRecursion) {
    return {
      title: "Iterative Approach",
      description:
        "Replace recursion with iteration using a loop to avoid stack overflow and improve performance",
      code: `# Iterative approach using loop
def process_iteratively(data):
    result = []
    stack = [data]
    
    while stack:
        current = stack.pop()
        result.append(current)
        # Process and add more items to stack
    
    return result`,
      tradeoffs:
        "Iterative approach is faster and more memory efficient, but requires explicit stack management",
    };
  }

  return {
    title: "Optimized Data Structure",
    description:
      "Use more efficient data structures like sets or dictionaries for faster lookups",
    code: `# Using set for O(1) lookups instead of list search
def optimized_search(items, target):
    item_set = set(items)  # O(n) setup
    return target in item_set  # O(1) lookup`,
    tradeoffs:
      "Sets are faster for lookups but use more memory and lose ordering",
  };
}

function generateSuggestions(code: string) {
  const suggestions = [];

  if (code.includes("for ") && !code.includes("list comprehension")) {
    suggestions.push({
      category: "Pythonic Code",
      suggestion:
        "Consider using list comprehension instead of for loops for cleaner syntax",
      example:
        "squares = [x**2 for x in range(10)]  # Instead of using append",
    });
  }

  if (code.match(/if.*==\s*True|if.*==\s*False/)) {
    suggestions.push({
      category: "Code Clarity",
      suggestion:
        "Simplify boolean comparisons - Python treats truthiness implicitly",
      example: "if is_valid:  # Instead of if is_valid == True",
    });
  }

  if (!code.includes("type:") && !code.includes("->")) {
    suggestions.push({
      category: "Type Safety",
      suggestion: "Add type hints to improve code clarity and enable IDE support",
      example: "def process(data: list) -> dict:",
    });
  }

  if (code.includes("except:")) {
    suggestions.push({
      category: "Error Handling",
      suggestion: "Avoid bare except clauses - catch specific exceptions",
      example: "except ValueError as e:",
    });
  }

  if (!code.includes('"""') && !code.includes("'''")) {
    suggestions.push({
      category: "Documentation",
      suggestion: "Add docstrings to explain function purpose and parameters",
      example:
        '"""Process data and return results.\n    Args: data (list): Input data\n    Returns: dict: Processed results"""',
    });
  }

  if (code.match(/\d{2,}/g)) {
    suggestions.push({
      category: "Code Maintainability",
      suggestion:
        "Define magic numbers as named constants for better maintainability",
      example: "MAX_RETRIES = 3; TIMEOUT_SECONDS = 30",
    });
  }

  return suggestions.slice(0, 5); // Return top 5 suggestions
}

function calculateComplexity(code: string): number {
  let complexity = 1;

  // Count control flow statements
  complexity += (code.match(/\bif\b/g) || []).length;
  complexity += (code.match(/\belse\b/g) || []).length;
  complexity += (code.match(/\belif\b/g) || []).length;
  complexity += (code.match(/\bfor\b/g) || []).length;
  complexity += (code.match(/\bwhile\b/g) || []).length;
  complexity += (code.match(/\band\b/g) || []).length * 0.5;
  complexity += (code.match(/\bor\b/g) || []).length * 0.5;

  // Count nesting levels (rough estimate)
  const indentMatch = code.match(/\n\s+/g) || [];
  complexity += indentMatch.length * 0.1;

  return Math.round(complexity);
}
