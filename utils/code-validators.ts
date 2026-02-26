/**
 * Utility functions for code validation and analysis helpers
 */

export function isValidPythonCode(code: string): {
  valid: boolean;
  error?: string;
} {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: "Code cannot be empty" };
  }

  // Basic Python syntax validation
  const lines = code.split("\n");
  let inMultilineString = false;
  let bracketBalance = { "(": 0, "[": 0, "{": 0 };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for triple quotes
    const tripleQuoteCount = (line.match(/"""/g) || []).length;
    if (tripleQuoteCount % 2 === 1) {
      inMultilineString = !inMultilineString;
    }

    if (inMultilineString) continue;

    // Check bracket balance
    for (const char of line) {
      if (char === "(") bracketBalance["("]++;
      if (char === ")") bracketBalance["("]--;
      if (char === "[") bracketBalance["["]++;
      if (char === "]") bracketBalance["["]--;
      if (char === "{") bracketBalance["{"]++;
      if (char === "}") bracketBalance["{"]--;
    }
  }

  for (const [bracket, count] of Object.entries(bracketBalance)) {
    if (count !== 0) {
      return {
        valid: false,
        error: `Unbalanced bracket: ${bracket}`,
      };
    }
  }

  return { valid: true };
}

export function getLineCount(code: string): number {
  return code.split("\n").filter((line) => line.trim().length > 0).length;
}

export function getCodeComplexity(code: string): number {
  // Count complexity indicators
  const ifCount = (code.match(/\bif\b/g) || []).length;
  const forCount = (code.match(/\bfor\b/g) || []).length;
  const whileCount = (code.match(/\bwhile\b/g) || []).length;
  const exceptCount = (code.match(/\bexcept\b/g) || []).length;
  const andOrCount = (code.match(/\band\b|\bor\b/g) || []).length;

  return ifCount + forCount + whileCount + exceptCount + andOrCount / 2;
}

export function extractFunctionNames(code: string): string[] {
  const functionPattern = /def\s+([a-zA-Z_]\w*)\s*\(/g;
  const functions: string[] = [];
  let match;

  while ((match = functionPattern.exec(code)) !== null) {
    functions.push(match[1]);
  }

  return functions;
}

export function extractClassNames(code: string): string[] {
  const classPattern = /class\s+([a-zA-Z_]\w*)\s*[\(:]?/g;
  const classes: string[] = [];
  let match;

  while ((match = classPattern.exec(code)) !== null) {
    classes.push(match[1]);
  }

  return classes;
}

export function calculateIndentation(code: string): number[] {
  const lines = code.split("\n");
  const indents: number[] = [];

  for (const line of lines) {
    if (line.trim().length > 0) {
      const indent = line.search(/\S/);
      indents.push(indent);
    }
  }

  return indents;
}

export function getMaximumNestingDepth(code: string): number {
  const indents = calculateIndentation(code);
  if (indents.length === 0) return 0;

  let maxDepth = 0;
  let currentDepth = 0;

  for (const indent of indents) {
    currentDepth = Math.floor(indent / 4); // Assuming 4-space indentation
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }
  }

  return maxDepth;
}
