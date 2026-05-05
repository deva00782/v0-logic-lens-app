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

export function analyzeLogic(code: string): LogicExplanation {
  const lines = code.split('\n').filter(l => l.trim());
  
  // Detect function definitions
  const functionMatches = code.match(/def\s+(\w+)\s*\((.*?)\)/g) || [];
  const classMatches = code.match(/class\s+(\w+)/g) || [];
  const importMatches = code.match(/import\s+(.+?)(?:\s+from|$)/g) || [];
  
  // Detect loops and conditionals
  const hasForLoop = /\bfor\b/.test(code);
  const hasWhileLoop = /\bwhile\b/.test(code);
  const hasIfElse = /\bif\b.*\belse\b/.test(code);
  const hasRecursion = functionMatches.some(fn => {
    const funcName = fn.match(/def\s+(\w+)/)?.[1];
    return funcName && code.includes(funcName + '(');
  });
  
  // Detect data structures
  const usesList = /\[.*?\]|\blist\s*\(/.test(code);
  const usesDictionary = /\{.*?:.*?\}|\bdict\s*\(/.test(code);
  const usesSet = /\{.*?\}|\bset\s*\(/.test(code);
  
  // Count operations
  const operationCount = (code.match(/[+\-*/%]/g) || []).length;
  const comparisonCount = (code.match(/[<>=!]+/g) || []).length;
  
  const summary = generateSummary(
    functionMatches,
    classMatches,
    hasForLoop,
    hasWhileLoop,
    hasRecursion,
    code
  );

  const purpose = generatePurpose(code, functionMatches, classMatches);
  
  const inputs = extractInputs(code, functionMatches);
  const outputs = extractOutputs(code);
  
  const mainFlow = generateMainFlow(code, lines);
  
  const patterns = detectPatterns(
    code,
    usesList,
    usesDictionary,
    usesSet,
    hasRecursion,
    hasForLoop,
    hasWhileLoop,
    hasIfElse
  );
  
  const complexity = assessComplexity(
    lines.length,
    operationCount,
    hasRecursion,
    hasForLoop,
    hasWhileLoop
  );
  
  const timeComplexity = estimateTimeComplexity(code);
  const spaceComplexity = estimateSpaceComplexity(code);

  return {
    summary,
    purpose,
    inputs,
    outputs,
    mainFlow,
    patterns,
    complexity,
    timeComplexity,
    spaceComplexity,
  };
}

function generateSummary(
  functions: RegExpMatchArray | null,
  classes: RegExpMatchArray | null,
  hasForLoop: boolean,
  hasWhileLoop: boolean,
  hasRecursion: boolean,
  code: string
): string {
  const parts: string[] = [];

  if (classes && classes.length > 0) {
    parts.push(`Defines ${classes.length} class(es)`);
  }

  if (functions && functions.length > 0) {
    parts.push(`Contains ${functions.length} function(s)`);
  }

  if (hasForLoop) parts.push('uses iteration with for loops');
  if (hasWhileLoop) parts.push('uses while loops');
  if (hasRecursion) parts.push('implements recursion');

  if (parts.length === 0) {
    return 'A Python code block with various operations and logic';
  }

  return `Code ${parts.join(', ')}`;
}

function generatePurpose(code: string, functions: RegExpMatchArray | null, classes: RegExpMatchArray | null): string {
  const docstringMatch = code.match(/"""([\s\S]*?)"""|'''([\s\S]*?)'''/);
  if (docstringMatch) {
    return docstringMatch[1] || docstringMatch[2] || 'Executes defined logic';
  }

  // Try to infer from function/class names
  if (functions && functions.length > 0) {
    const mainFunc = functions[0];
    const name = mainFunc.match(/def\s+(\w+)/)?.[1] || '';
    
    if (name.includes('sort')) return 'Sorts data in a specific order';
    if (name.includes('search') || name.includes('find')) return 'Searches for elements or values';
    if (name.includes('calc') || name.includes('compute')) return 'Performs calculations';
    if (name.includes('parse')) return 'Parses and processes data';
    if (name.includes('validate')) return 'Validates input data';
  }

  return 'Executes a sequence of operations to process data and produce results';
}

function extractInputs(code: string, functions: RegExpMatchArray | null): string[] {
  const inputs: Set<string> = new Set();

  // Get function parameters
  if (functions && functions.length > 0) {
    const params = functions[0].match(/\((.*?)\)/);
    if (params && params[1]) {
      const paramList = params[1]
        .split(',')
        .map(p => p.trim())
        .filter(p => p && !p.includes('='));
      paramList.forEach(p => inputs.add(p));
    }
  }

  // Detect input() calls
  if (/input\s*\(/.test(code)) {
    inputs.add('User input via input()');
  }

  // Detect file operations
  if (/open\s*\(/.test(code)) {
    inputs.add('File contents');
  }

  // Detect API/requests
  if (/requests\.|urllib\./.test(code)) {
    inputs.add('External API responses');
  }

  if (inputs.size === 0) {
    return ['Data or parameters passed to the code'];
  }

  return Array.from(inputs);
}

function extractOutputs(code: string): string[] {
  const outputs: Set<string> = new Set();

  // Check for print statements
  if (/print\s*\(/.test(code)) {
    outputs.add('Console output via print()');
  }

  // Check for return statements
  if (/return\s+/.test(code)) {
    outputs.add('Function return values');
  }

  // Check for file writes
  if (/\.write\s*\(|open\s*\([^)]*['"](w|a)/.test(code)) {
    outputs.add('File write operations');
  }

  // Check for assignments
  if (/\w+\s*=/.test(code)) {
    outputs.add('Variable assignments and mutations');
  }

  if (outputs.size === 0) {
    return ['Computed results'];
  }

  return Array.from(outputs);
}

function generateMainFlow(code: string, lines: string[]): string[] {
  const flow: string[] = [];

  let stepNum = 1;

  // Check imports at beginning
  lines.slice(0, 5).forEach(line => {
    if (/^import\s+|^from\s+/.test(line.trim())) {
      flow.push(`Step ${stepNum++}: Import required libraries and modules`);
    }
  });

  // Check for class definition
  if (/class\s+\w+/.test(code)) {
    flow.push(`Step ${stepNum++}: Define class structure with properties and methods`);
  }

  // Check for function definitions
  const funcMatches = code.match(/def\s+(\w+)/g);
  if (funcMatches && funcMatches.length > 0) {
    funcMatches.slice(0, 2).forEach(match => {
      const name = match.replace('def ', '');
      flow.push(`Step ${stepNum++}: Define function '${name}' with specific logic`);
    });
  }

  // Check for main logic execution
  if (/if\s+__name__\s*==\s*['"']__main__['"]/.test(code)) {
    flow.push(`Step ${stepNum++}: Execute main logic when script runs`);
  } else if (/for\s+.+\s+in\s+/.test(code)) {
    flow.push(`Step ${stepNum++}: Iterate through data using loops`);
  } else if (/while\s+/.test(code)) {
    flow.push(`Step ${stepNum++}: Execute conditional loop logic`);
  }

  // Check for conditional logic
  if (/if\s+.*:/.test(code) && !/if\s+__name__/.test(code)) {
    flow.push(`Step ${stepNum++}: Apply conditional checks and branching logic`);
  }

  // Check for processing
  if (/\.append\(|\.extend\(|\.update\(/.test(code)) {
    flow.push(`Step ${stepNum++}: Accumulate or transform data`);
  }

  // Check for output
  if (/print\(|return\s+|\.write\(/.test(code)) {
    flow.push(`Step ${stepNum++}: Return or display results`);
  }

  if (flow.length === 0) {
    flow.push('Step 1: Initialize and prepare data');
    flow.push('Step 2: Apply processing logic');
    flow.push('Step 3: Generate and return output');
  }

  return flow;
}

function detectPatterns(
  code: string,
  usesList: boolean,
  usesDictionary: boolean,
  usesSet: boolean,
  hasRecursion: boolean,
  hasForLoop: boolean,
  hasWhileLoop: boolean,
  hasIfElse: boolean
): string[] {
  const patterns: string[] = [];

  if (hasForLoop || hasWhileLoop) {
    patterns.push('Iterative processing with loops');
  }

  if (hasRecursion) {
    patterns.push('Recursive function calls');
  }

  if (hasIfElse) {
    patterns.push('Conditional branching logic');
  }

  if (usesList) {
    patterns.push('List/Array data structure usage');
  }

  if (usesDictionary) {
    patterns.push('Dictionary/Hash map operations');
  }

  if (usesSet) {
    patterns.push('Set data structure for unique values');
  }

  if (/try:\s*[\s\S]*?except/.test(code)) {
    patterns.push('Exception handling with try-except');
  }

  if (/lambda\s+/.test(code)) {
    patterns.push('Lambda anonymous functions');
  }

  if (/\.map\(|\.filter\(|\.reduce\(/.test(code)) {
    patterns.push('Functional programming patterns');
  }

  if (/\*args|\*\*kwargs/.test(code)) {
    patterns.push('Variable argument handling');
  }

  if (patterns.length === 0) {
    patterns.push('Sequential code execution');
  }

  return patterns;
}

function assessComplexity(
  lineCount: number,
  operationCount: number,
  hasRecursion: boolean,
  hasForLoop: boolean,
  hasWhileLoop: boolean
): string {
  let complexity = 'Low';

  if (lineCount > 50) complexity = 'Medium';
  if (lineCount > 100) complexity = 'High';
  if (lineCount > 200) complexity = 'Very High';

  if (operationCount > lineCount * 2) complexity = 'High';
  if (hasRecursion) complexity = 'High';

  return `${complexity} (${lineCount} lines of code)`;
}

function estimateTimeComplexity(code: string): string {
  const nestedLoops = (code.match(/for\s+.*:\s*[\s\S]*?for\s+/g) || []).length;
  const hasDoubleNested = nestedLoops > 0;

  if (/def\s+\w+\([^)]*\)\s*:\s*return\s*\w+/.test(code)) {
    return 'O(1) - Constant time';
  }

  if (/(for|while)\s+.*\s+in\s+/.test(code) && hasDoubleNested) {
    return 'O(n²) - Quadratic time (nested loops)';
  }

  if (/(for|while)\s+/.test(code)) {
    return 'O(n) - Linear time';
  }

  if (/\.sort\(|sorted\(/.test(code)) {
    return 'O(n log n) - Logarithmic-linear time';
  }

  if (/binary.*search|bisect/.test(code.toLowerCase())) {
    return 'O(log n) - Logarithmic time';
  }

  return 'O(n) - Linear time (estimated)';
}

function estimateSpaceComplexity(code: string): string {
  const hasNestedStructures = /\[\s*\[|\{\s*\{/.test(code);
  const hasRecursion = /def\s+\w+[\s\S]*?\1\s*\(/.test(code);

  if (hasNestedStructures) {
    return 'O(n²) - Quadratic space (nested data structures)';
  }

  if (hasRecursion) {
    return 'O(n) - Linear space (call stack)';
  }

  if (/\[\s*for|{.*for/.test(code)) {
    return 'O(n) - Linear space (list/dict comprehension)';
  }

  return 'O(1) - Constant space (minimal extra memory)';
}
