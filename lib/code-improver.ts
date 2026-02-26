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

export function generateImprovements(code: string): CodeImprovement[] {
  const improvements: CodeImprovement[] = [];

  // Check for specific improvement patterns
  if (checkNestedLoopOptimization(code)) {
    improvements.push(generateNestedLoopOptimization(code));
  }

  if (checkStringConcatenationOptimization(code)) {
    improvements.push(generateStringConcatenationOptimization(code));
  }

  if (checkErrorHandling(code)) {
    improvements.push(generateErrorHandlingImprovement(code));
  }

  if (checkComprehensionUsage(code)) {
    improvements.push(generateComprehensionImprovement(code));
  }

  if (checkEnumerateUsage(code)) {
    improvements.push(generateEnumerateImprovement(code));
  }

  if (checkContextManagerUsage(code)) {
    improvements.push(generateContextManagerImprovement(code));
  }

  if (checkTypingUsage(code)) {
    improvements.push(generateTypingImprovement(code));
  }

  if (checkDocstringUsage(code)) {
    improvements.push(generateDocstringImprovement(code));
  }

  return improvements;
}

// Helper functions for each improvement type

function checkNestedLoopOptimization(code: string): boolean {
  return /for\s+\w+\s+in[\s\S]*?for\s+\w+\s+in/.test(code) && !/set\(/.test(code);
}

function generateNestedLoopOptimization(code: string): CodeImprovement {
  return {
    title: 'Optimize Nested Loops with Set Lookup',
    category: 'performance',
    severity: 'major',
    currentCode: `# O(n²) nested loop search
found_items = []
for item in large_list1:
    for search_item in large_list2:
        if item == search_item:
            found_items.append(item)`,
    improvedCode: `# O(n) optimized with set lookup
list2_set = set(large_list2)
found_items = [item for item in large_list1 if item in list2_set]`,
    explanation:
      'Nested loops check every combination, causing O(n²) complexity. Using a set for membership testing is O(1), reducing overall to O(n).',
    benefits: [
      'Reduces time complexity from O(n²) to O(n)',
      'Much faster for large datasets',
      'More readable and Pythonic',
      'Avoids redundant comparisons',
    ],
    considerations:
      'If the list needs to be checked multiple times, the set creation cost is worth it. For small lists, the improvement is negligible.',
  };
}

function checkStringConcatenationOptimization(code: string): boolean {
  return /for\s+[\s\S]*?\+=\s*["']/.test(code);
}

function generateStringConcatenationOptimization(code: string): CodeImprovement {
  return {
    title: 'Use join() Instead of String Concatenation',
    category: 'performance',
    severity: 'major',
    currentCode: `result = ""
for word in words:
    result += " " + word
print(result)`,
    improvedCode: `result = " ".join(words)
print(result)`,
    explanation:
      'Each += operation creates a new string object. With 1000 words, you create 1000 intermediate strings. str.join() builds the result once efficiently.',
    benefits: [
      'Reduces time complexity from O(n²) to O(n)',
      'Significantly less memory usage',
      'Cleaner, more readable code',
      'Performance improves dramatically with more iterations',
    ],
    considerations:
      'str.join() only works with strings. If you have mixed types, convert first using a list comprehension.',
  };
}

function checkErrorHandling(code: string): boolean {
  return (
    (/open\(|\.get\(|int\(|json\.load|requests\./.test(code)) &&
    !/try:/.test(code)
  );
}

function generateErrorHandlingImprovement(code: string): CodeImprovement {
  return {
    title: 'Add Comprehensive Error Handling',
    category: 'best-practice',
    severity: 'critical',
    currentCode: `file_content = open("data.txt").read()
value = int(user_input)
data = json.loads(json_string)`,
    improvedCode: `try:
    with open("data.txt") as f:
        file_content = f.read()
except FileNotFoundError:
    print("Error: File not found")
    file_content = ""

try:
    value = int(user_input)
except ValueError:
    print("Error: Please enter a valid number")
    value = 0

try:
    data = json.loads(json_string)
except json.JSONDecodeError:
    print("Error: Invalid JSON format")
    data = {}`,
    explanation:
      'Without error handling, code crashes on invalid input. Try-except blocks gracefully handle errors and continue execution or provide meaningful feedback.',
    benefits: [
      'Code never crashes unexpectedly',
      'Users get helpful error messages',
      'Program can recover from errors',
      'Makes code more robust and production-ready',
    ],
    considerations:
      'Catch specific exceptions (FileNotFoundError, ValueError) not generic Exception. Also use context managers (with) for file operations to ensure cleanup.',
  };
}

function checkComprehensionUsage(code: string): boolean {
  return /for\s+\w+\s+in\s+.+:\s+.+\.append\(/.test(code);
}

function generateComprehensionImprovement(code: string): CodeImprovement {
  return {
    title: 'Use List Comprehension Instead of Loop + Append',
    category: 'readability',
    severity: 'minor',
    currentCode: `squares = []
for num in numbers:
    if num % 2 == 0:
        squares.append(num ** 2)`,
    improvedCode: `squares = [num ** 2 for num in numbers if num % 2 == 0]`,
    explanation:
      'List comprehensions are more concise, faster, and considered Pythonic. They express intent more clearly in a single line.',
    benefits: [
      'More concise and readable',
      '15-30% faster than loop + append',
      'Creates list in single expression',
      'Considered idiomatic Python',
    ],
    considerations:
      'Use comprehensions for simple transformations. For complex logic, traditional loops are clearer.',
  };
}

function checkEnumerateUsage(code: string): boolean {
  return /for\s+\w+\s+in\s+range\s*\(\s*len\s*\(/.test(code);
}

function generateEnumerateImprovement(code: string): CodeImprovement {
  return {
    title: 'Use enumerate() for Index and Value',
    category: 'readability',
    severity: 'minor',
    currentCode: `for i in range(len(items)):
    print(f"{i}: {items[i]}")`,
    improvedCode: `for i, item in enumerate(items):
    print(f"{i}: {item}")`,
    explanation:
      'enumerate() gives both index and value, eliminating redundant indexing and range(len()) which are anti-patterns in Python.',
    benefits: [
      'More readable and Pythonic',
      'Avoids redundant indexing',
      'Eliminates range(len()) anti-pattern',
      'Clearer intent of what code does',
    ],
    considerations:
      'Use enumerate() whenever you need both index and value. It works with any iterable, not just lists.',
  };
}

function checkContextManagerUsage(code: string): boolean {
  return /open\([^)]*\)/ .test(code) && !/with\s+open/.test(code);
}

function generateContextManagerImprovement(code: string): CodeImprovement {
  return {
    title: 'Use Context Manager (with) for File Operations',
    category: 'best-practice',
    severity: 'major',
    currentCode: `f = open("data.txt")
data = f.read()
f.close()

# If exception occurs before close(), file never closes!`,
    improvedCode: `with open("data.txt") as f:
    data = f.read()
# File automatically closed, even if exception occurs`,
    explanation:
      'Context managers (with statement) ensure resources are properly cleaned up. Even if an exception occurs, the file is closed. Manual close() can be forgotten or skipped on errors.',
    benefits: [
      'File always closes, preventing resource leaks',
      'Exception-safe resource management',
      'Cleaner, more readable code',
      'Standard Python practice',
    ],
    considerations:
      'Use with statement for any resource: files, locks, database connections, etc. This is a critical best practice.',
  };
}

function checkTypingUsage(code: string): boolean {
  return /def\s+\w+\s*\([^)]*\)\s*:/.test(code) && !/->|:.*str|:.*int/.test(code);
}

function generateTypingImprovement(code: string): CodeImprovement {
  return {
    title: 'Add Type Hints for Better Code Clarity',
    category: 'maintainability',
    severity: 'minor',
    currentCode: `def calculate(x, y):
    return x + y

def process_list(items):
    return [x * 2 for x in items]`,
    improvedCode: `def calculate(x: float, y: float) -> float:
    return x + y

def process_list(items: list[int]) -> list[int]:
    return [x * 2 for x in items]`,
    explanation:
      'Type hints document what types functions expect and return. They help catch bugs early and make code self-documenting.',
    benefits: [
      'Code is self-documenting',
      'IDE provides better autocomplete',
      'Type checkers (mypy) catch bugs early',
      'Makes refactoring safer',
    ],
    considerations:
      'Type hints are optional but recommended. They have zero runtime overhead in Python.',
  };
}

function checkDocstringUsage(code: string): boolean {
  return /def\s+\w+/.test(code) && !/"""[\s\S]*?"""/.test(code);
}

function generateDocstringImprovement(code: string): CodeImprovement {
  return {
    title: 'Add Docstrings to Document Functions',
    category: 'maintainability',
    severity: 'minor',
    currentCode: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    improvedCode: `def fibonacci(n: int) -> int:
    """
    Calculate the nth Fibonacci number.
    
    Args:
        n: The position in Fibonacci sequence (0-indexed)
    
    Returns:
        The nth Fibonacci number
    
    Example:
        >>> fibonacci(5)
        5
    """
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    explanation:
      'Docstrings explain what functions do, their parameters, return values, and usage. They help other developers (and future you) understand code quickly.',
    benefits: [
      'Code is easier to understand',
      'Documentation tools can extract help',
      'IDE shows docstrings on hover',
      'Makes onboarding easier for teams',
    ],
    considerations:
      'Use docstring style like Google or NumPy conventions for consistency. Every function should have a docstring.',
  };
}

export function generateFixedCode(code: string, errorType: string): string {
  const lines = code.split('\n');

  switch (errorType) {
    case 'missing-colon':
      return lines
        .map(line => {
          if (/^(def|class|if|elif|else|for|while|try|except|finally)\s+/.test(line.trim()) && !line.trim().endsWith(':')) {
            return line + ':';
          }
          return line;
        })
        .join('\n');

    case 'string-concat':
      // Replace += string concatenation with join
      if (/(.*?)\s*\+=\s*["'](.+?)["']/.test(code)) {
        return code.replace(
          /(\w+)\s*\+=\s*["'](.+?)["']/g,
          '$1 = $1 + "$2"'
        );
      }
      break;

    case 'nested-loop':
      // Convert nested loop to set lookup
      const nestedLoopPattern =
        /for\s+(\w+)\s+in\s+(.+?):\s+for\s+(\w+)\s+in\s+(.+?):\s+if\s+\1\s*==\s*\3/g;
      return code.replace(
        nestedLoopPattern,
        `$3_set = set($4)\nfor $1 in $2:\n    if $1 in $3_set`
      );

    case 'error-handling':
      // Add try-except wrapper
      return `try:\n${
        lines
          .map(l => '    ' + l)
          .join('\n')
      }\nexcept Exception as e:\n    print(f"Error: {e}")`;

    case 'infinite-loop':
      // Add break condition hint
      return code.replace(
        /while\s+True\s*:/g,
        'while True:  # TODO: Add break condition'
      );

    default:
      return code;
  }

  return code;
}
