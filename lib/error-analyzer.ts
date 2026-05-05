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

export function detectErrors(code: string): CodeError[] {
  const errors: CodeError[] = [];
  const lines = code.split('\n');

  // Syntax errors
  errors.push(...detectSyntaxErrors(code, lines));
  
  // Logic errors
  errors.push(...detectLogicErrors(code, lines));
  
  // Performance issues
  errors.push(...detectPerformanceIssues(code, lines));
  
  // Best practices
  errors.push(...detectBestPracticeViolations(code, lines));

  // Sort by line number and remove duplicates
  return errors
    .sort((a, b) => a.line - b.line)
    .filter((err, idx, arr) => idx === 0 || err.id !== arr[idx - 1].id);
}

function detectSyntaxErrors(code: string, lines: string[]): CodeError[] {
  const errors: CodeError[] = [];

  // Missing colons after definitions
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (
      /^(def|class|if|elif|else|for|while|try|except|finally)\s+/.test(trimmed) &&
      !trimmed.endsWith(':') &&
      trimmed.length > 0
    ) {
      errors.push({
        id: `missing-colon-${idx}`,
        line: idx + 1,
        type: 'syntax',
        severity: 'critical',
        message: 'Missing colon (:) at end of statement',
        explanation:
          'Python requires a colon at the end of control flow statements (def, class, if, for, while, etc.) to indicate the start of a code block.',
        whyItOccurs:
          'Developer forgot to add the colon character after the control statement syntax.',
        impact:
          'Code will not run and Python will raise a SyntaxError preventing execution.',
        suggestion: `Add ':' at the end: ${trimmed}:`,
        example: `# Wrong\nif x > 5\n    print("x is large")\n\n# Correct\nif x > 5:\n    print("x is large")`,
      });
    }
  });

  // Mismatched parentheses/brackets
  const openParen = (code.match(/\(/g) || []).length;
  const closeParen = (code.match(/\)/g) || []).length;
  if (openParen !== closeParen) {
    errors.push({
      id: 'mismatched-parentheses',
      line: 1,
      type: 'syntax',
      severity: 'critical',
      message: 'Mismatched parentheses',
      explanation:
        'Every opening parenthesis "(" must have a corresponding closing parenthesis ")".',
      whyItOccurs: `Found ${openParen} opening parentheses but ${closeParen} closing parentheses.`,
      impact: 'Code will raise SyntaxError and fail to execute.',
      suggestion: 'Review all function calls and expressions to ensure balanced parentheses.',
      example: `# Wrong\nprint("hello"  # Missing closing paren\n\n# Correct\nprint("hello")`,
    });
  }

  // Mixed tabs and spaces
  const hasTabs = /\t/.test(code);
  const hasSpaces = / {2,}/.test(code);
  if (hasTabs && hasSpaces) {
    errors.push({
      id: 'mixed-indentation',
      line: 1,
      type: 'syntax',
      severity: 'critical',
      message: 'Mixed tabs and spaces in indentation',
      explanation:
        'Python does not allow mixing tabs and spaces for indentation. Choose one consistently.',
      whyItOccurs: 'Code uses both tab characters and space characters for indentation.',
      impact: 'Python will raise TabError preventing code execution.',
      suggestion: 'Use either tabs or spaces throughout (typically 4 spaces per indent level).',
      example: `# Wrong\ndef func():\n\tprint("indented with tab")\n    print("indented with spaces")\n\n# Correct\ndef func():\n    print("indented with spaces")\n    print("also spaces")`,
    });
  }

  // Undefined variables - basic detection
  const assignments = new Set<string>();
  lines.forEach(line => {
    const match = line.match(/^[ \t]*(\w+)\s*=/);
    if (match) assignments.add(match[1]);
  });

  lines.forEach((line, idx) => {
    const usages = line.match(/\b([a-z_]\w*)\b/gi) || [];
    usages.forEach(usage => {
      if (
        !['if', 'else', 'for', 'while', 'def', 'class', 'return', 'print', 'len', 'range', 'str', 'int', 'list', 'dict'].includes(usage.toLowerCase()) &&
        !assignments.has(usage) &&
        !['True', 'False', 'None'].includes(usage)
      ) {
        // Only report once per variable
        if (!errors.some(e => e.message.includes(`Variable '${usage}'`))) {
          errors.push({
            id: `undefined-${usage}`,
            line: idx + 1,
            type: 'syntax',
            severity: 'warning',
            message: `Potentially undefined variable: '${usage}'`,
            explanation:
              'This variable appears to be used before it is defined or assigned a value.',
            whyItOccurs:
              'The variable was referenced but never initialized with an assignment statement.',
            impact:
              'Code will raise NameError at runtime when this line is executed.',
            suggestion: `Ensure '${usage}' is defined before use: ${usage} = value`,
            example: `# Wrong\nprint(x)  # NameError: x not defined\n\n# Correct\nx = 10\nprint(x)`,
          });
        }
      }
    });
  });

  return errors;
}

function detectLogicErrors(code: string, lines: string[]): CodeError[] {
  const errors: CodeError[] = [];

  // Unreachable code after return
  let inFunction = false;
  let foundReturn = false;
  let returnLine = 0;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (/^def\s+\w+/.test(trimmed)) {
      inFunction = true;
      foundReturn = false;
    }

    if (inFunction && /^def\s+\w+/.test(trimmed) && idx > 0) {
      inFunction = true;
      foundReturn = false;
    }

    if (inFunction && /^return\s+/.test(trimmed)) {
      foundReturn = true;
      returnLine = idx;
    }

    if (foundReturn && idx > returnLine && trimmed.length > 0 && !/^def\s+/.test(trimmed)) {
      const indentation = line.match(/^[ \t]*/)[0].length;
      const returnIndentation = lines[returnLine].match(/^[ \t]*/)[0].length;

      if (indentation > returnIndentation) {
        errors.push({
          id: `unreachable-${idx}`,
          line: idx + 1,
          type: 'logic',
          severity: 'warning',
          message: 'Unreachable code after return statement',
          explanation:
            'Code that appears after a return statement will never be executed because the function exits.',
          whyItOccurs: `Return statement at line ${returnLine + 1} causes function to exit before reaching this line.`,
          impact:
            'This code will never run, potentially hiding bugs or causing confusion about program flow.',
          suggestion: `Move this code before the return statement or remove it if no longer needed.`,
        });

        foundReturn = false; // Only report once per function
      }
    }
  });

  // Comparison in loops that never changes
  lines.forEach((line, idx) => {
    if (/while\s+True/.test(line)) {
      // Check if there's a break statement in the next 5 lines
      let hasBreak = false;
      for (let i = idx + 1; i < Math.min(idx + 10, lines.length); i++) {
        if (/\bbreak\b/.test(lines[i])) {
          hasBreak = true;
          break;
        }
      }

      if (!hasBreak) {
        errors.push({
          id: `infinite-loop-${idx}`,
          line: idx + 1,
          type: 'logic',
          severity: 'critical',
          message: 'Infinite loop detected (while True without break)',
          explanation: 'A while True loop will run forever unless there is a break statement.',
          whyItOccurs: 'The condition "True" is always true, and no exit condition was provided.',
          impact:
            'Program will hang indefinitely, consuming CPU and never completing.',
          suggestion:
            'Add a break statement when a condition is met, or use a proper loop condition.',
          example: `# Wrong\nwhile True:\n    print("endless")\n\n# Correct\nwhile True:\n    user_input = input("Continue? ")\n    if user_input == "no":\n        break`,
        });
      }
    }
  });

  // Off-by-one errors in ranges
  lines.forEach((line, idx) => {
    const rangeMatch = line.match(/range\((\d+),\s*(\d+)\)/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);

      if (start >= end) {
        errors.push({
          id: `invalid-range-${idx}`,
          line: idx + 1,
          type: 'logic',
          severity: 'warning',
          message: 'Invalid range: start value is greater than or equal to end value',
          explanation:
            'The range() function with start >= end will produce an empty sequence.',
          whyItOccurs: `Start value (${start}) is >= end value (${end}), creating an empty range.`,
          impact:
            'Loop will not execute any iterations, potentially causing unexpected behavior.',
          suggestion: `Ensure start < end: range(${Math.min(start, end)}, ${Math.max(start, end)})`,
          example: `# Wrong\nfor i in range(10, 5):\n    print(i)  # Never executes\n\n# Correct\nfor i in range(5, 10):\n    print(i)  # Prints 5, 6, 7, 8, 9`,
        });
      }
    }
  });

  // Logic: Comparison with assignment (== vs =)
  lines.forEach((line, idx) => {
    if (/if\s+.*=\s+[^=]|while\s+.*=\s+[^=]/.test(line) && !/==[^=]/.test(line)) {
      errors.push({
        id: `assignment-in-condition-${idx}`,
        line: idx + 1,
        type: 'logic',
        severity: 'warning',
        message: 'Possible assignment in conditional (should use == for comparison)',
        explanation:
          'Using = (assignment) instead of == (comparison) in a condition assigns a value instead of checking equality.',
        whyItOccurs: 'Single = assigns, while == compares. This often happens as a typo.',
        impact:
          'Code will assign rather than compare, causing logic errors and unexpected behavior.',
        suggestion: 'Use == for comparison: if x == value:',
        example: `# Wrong\nif x = 5:  # SyntaxError or assigns x\n\n# Correct\nif x == 5:\n    print("x is 5")`,
      });
    }
  });

  return errors;
}

function detectPerformanceIssues(code: string, lines: string[]): CodeError[] {
  const errors: CodeError[] = [];

  // Nested loops (O(n²))
  const nestedLoopMatches = code.match(/for\s+\w+\s+in[\s\S]*?for\s+\w+\s+in/g) || [];
  if (nestedLoopMatches.length > 0) {
    errors.push({
      id: 'nested-loops',
      line: lines.findIndex(l => /for\s+\w+\s+in/.test(l)) + 1,
      type: 'performance',
      severity: 'info',
      message: 'Nested loops detected (O(n²) complexity)',
      explanation:
        'Nested loops multiply the number of iterations, causing quadratic time complexity.',
      whyItOccurs:
        'Inner loop runs completely for each iteration of the outer loop.',
      impact:
        'Performance degrades significantly with larger datasets. For n=1000, this becomes 1,000,000 iterations.',
      suggestion:
        'Consider using built-in functions, sets, or dictionaries for lookups to reduce complexity.',
      example: `# O(n²) - Slow\nfor x in list1:\n    for y in list2:\n        if x == y: process()\n\n# O(n) - Fast\nset2 = set(list2)\nfor x in list1:\n    if x in set2: process()`,
    });
  }

  // String concatenation in loops
  if (/for\s+.*:\s*[\s\S]*?\+=\s*["']/.test(code)) {
    errors.push({
      id: 'string-concat-loop',
      line: lines.findIndex(l => /for\s+/.test(l)) + 1,
      type: 'performance',
      severity: 'info',
      message: 'String concatenation in loop (inefficient)',
      explanation:
        'Strings are immutable. Each += creates a new string, wasting memory and CPU.',
      whyItOccurs:
        'Python must copy the entire string for each concatenation operation.',
      impact:
        'Performance is O(n²). Building a large string from many concatenations is very slow.',
      suggestion: 'Use list.append() and "".join() instead.',
      example: `# Slow - O(n²)\nresult = ""\nfor word in words:\n    result += word\n\n# Fast - O(n)\nresult = "".join(words)`,
    });
  }

  // Redundant list operations
  if (/\.copy\(\)|list\(.*\)[\s\S]*?for/.test(code)) {
    errors.push({
      id: 'redundant-copy',
      line: 1,
      type: 'performance',
      severity: 'info',
      message: 'Potentially redundant list copying',
      explanation: 'Copying lists uses extra memory and CPU without benefit.',
      whyItOccurs:
        'Code explicitly copies data when iteration or modification could be done in place.',
      impact:
        'Unnecessary memory usage and slower execution, especially with large lists.',
      suggestion:
        'Avoid copying unless mutation of the original is required.',
      example: `# Unnecessary copy\nfor x in mylist.copy():\n    process(x)\n\n# Better\nfor x in mylist:\n    process(x)`,
    });
  }

  return errors;
}

function detectBestPracticeViolations(code: string, lines: string[]): CodeError[] {
  const errors: CodeError[] = [];

  // Missing docstrings
  const hasFunctions = /def\s+\w+/.test(code);
  const hasDocstring = /"""[\s\S]*?"""/.test(code);

  if (hasFunctions && !hasDocstring) {
    errors.push({
      id: 'missing-docstring',
      line: 1,
      type: 'best-practice',
      severity: 'info',
      message: 'Missing docstring for functions',
      explanation:
        'Docstrings provide documentation for what functions do, their parameters, and return values.',
      whyItOccurs: 'Functions defined without accompanying docstring.',
      impact:
        'Code is harder to understand and maintain. Documentation tools cannot extract help.',
      suggestion:
        'Add triple-quoted docstrings to all functions and classes.',
      example: `# Wrong\ndef calculate(x, y):\n    return x + y\n\n# Correct\ndef calculate(x, y):\n    """Calculate sum of two numbers."""\n    return x + y`,
    });
  }

  // Magic numbers
  const magicNumbers = code.match(/[^a-zA-Z0-9_](100|256|1024|99|42)(?![a-zA-Z0-9_])/g) || [];
  if (magicNumbers.length > 0) {
    errors.push({
      id: 'magic-numbers',
      line: lines.findIndex(l => /\b(100|256|1024|99|42)\b/.test(l)) + 1,
      type: 'best-practice',
      severity: 'info',
      message: 'Magic numbers found (hardcoded values)',
      explanation:
        'Hardcoded numbers without explanation are called "magic numbers" and reduce code clarity.',
      whyItOccurs:
        'Values are embedded directly in code without being assigned to named variables.',
      impact:
        'Code is less readable and maintainable. The purpose of numbers is unclear.',
      suggestion:
        'Extract to named constants: MAX_SIZE = 1024 then use MAX_SIZE in code.',
      example: `# Wrong\nif file_size > 1024:\n    compress()\n\n# Correct\nMAX_FILE_SIZE = 1024\nif file_size > MAX_FILE_SIZE:\n    compress()`,
    });
  }

  // Poor variable names
  const poorNames = code.match(/\b[a-z](?![a-z])\b|\b[a-z]{1,2}\b(?!:)/g) || [];
  if (poorNames.length > 3) {
    errors.push({
      id: 'poor-names',
      line: 1,
      type: 'best-practice',
      severity: 'info',
      message: 'Single-letter or very short variable names',
      explanation:
        'Short variable names like i, x, d provide no context about what they represent.',
      whyItOccurs:
        'Developers use shortcuts for temporary or quick-and-dirty code.',
      impact:
        'Code is confusing to read and maintain. Context is lost.',
      suggestion:
        'Use descriptive names: counter instead of i, user_data instead of d.',
      example: `# Poor\nfor i in range(len(x)):\n    print(x[i])\n\n# Better\nfor index, value in enumerate(items):\n    print(value)`,
    });
  }

  // No error handling
  if (/open\(|\.get\(|int\(|json\.load/.test(code) && !/try:|except/.test(code)) {
    errors.push({
      id: 'no-error-handling',
      line: lines.findIndex(l => /open\(|\.get\(|int\(|json\.load/.test(l)) + 1,
      type: 'best-practice',
      severity: 'warning',
      message: 'No error handling for risky operations',
      explanation:
        'File operations, conversions, and API calls can fail. Without error handling, crashes occur.',
      whyItOccurs:
        'Code does not use try-except to handle potential exceptions.',
      impact:
        'Program crashes when unexpected input or conditions are encountered.',
      suggestion:
        'Wrap risky operations in try-except blocks.',
      example: `# Wrong\ndata = int(user_input)\n\n# Correct\ntry:\n    data = int(user_input)\nexcept ValueError:\n    print("Please enter a valid number")`,
    });
  }

  return errors;
}
