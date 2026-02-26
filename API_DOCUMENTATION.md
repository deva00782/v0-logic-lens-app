# Logic Lens API Documentation

## Overview
The Logic Lens API provides endpoints for analyzing Python code and comparing code similarities. All endpoints return JSON responses.

## Base URL
```
/api
```

## Endpoints

### 1. Analyze Code

**POST** `/analyze`

Analyzes a single Python code file and returns comprehensive quality metrics.

#### Request Body
```json
{
  "code": "def hello():\n    print('Hello, World!')"
}
```

#### Response (200 OK)
```json
{
  "overallScore": 75,
  "complexity": 45,
  "modularity": 72,
  "naming": 68,
  "duplication": 82,
  "logicalDepth": 55,
  "suggestions": [
    "Consider breaking code into smaller, reusable modules",
    "Extract duplicated code into shared utility functions"
  ],
  "advancedMetrics": {
    "maintainabilityIndex": 82,
    "maintainabilityDescription": "Highly Maintainable - Excellent code quality",
    "couplingScore": 88,
    "couplingDescription": "Loosely Coupled - Good module independence",
    "cohesionScore": 76,
    "cohesionDescription": "Good Cohesion - Reasonable method grouping",
    "functionLengthAnalysis": {
      "averageLength": 12,
      "maxLength": 28,
      "minLength": 3,
      "functionsExceedingThreshold": 0,
      "totalFunctions": 5,
      "recommendedThreshold": 30
    },
    "deadCodeDetection": {
      "potentialDeadCodeLines": 2,
      "deadCodePercentage": 3,
      "unusedVariables": ["temp_buffer"],
      "unusedFunctions": [],
      "unreachableCode": []
    }
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid or missing code
```json
{
  "error": "Invalid or missing code"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to analyze code"
}
```

---

### 2. Compare Similarity

**POST** `/similarity`

Compares two code files and calculates their similarity percentage.

#### Request Body
```json
{
  "code1": "def add(a, b):\n    return a + b",
  "code2": "def sum_values(x, y):\n    return x + y"
}
```

#### Response (200 OK)
```json
{
  "similarity": 85,
  "differences": [
    "Different code structure and logic patterns detected",
    "Different variable naming conventions"
  ]
}
```

#### Error Responses

**400 Bad Request** - Invalid or missing code samples
```json
{
  "error": "Invalid or missing code samples"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to calculate similarity"
}
```

---

## Response Format

### Analysis Result Object

```typescript
interface AnalysisResult {
  overallScore: number           // 0-100
  complexity: number             // 0-100 (lower is better)
  modularity: number             // 0-100
  naming: number                 // 0-100
  duplication: number            // 0-100 (higher is better)
  logicalDepth: number           // 0-100 (lower is better)
  suggestions: string[]          // Array of improvement suggestions
  advancedMetrics?: AdvancedMetrics
}
```

### Advanced Metrics Object

```typescript
interface AdvancedMetrics {
  maintainabilityIndex: number
  maintainabilityDescription: string
  couplingScore: number
  couplingDescription: string
  cohesionScore: number
  cohesionDescription: string
  functionLengthAnalysis: FunctionLengthAnalysis
  deadCodeDetection: DeadCodeDetection
}
```

### Function Length Analysis

```typescript
interface FunctionLengthAnalysis {
  averageLength: number              // Average lines per function
  maxLength: number                  // Longest function
  minLength: number                  // Shortest function
  functionsExceedingThreshold: number // Count over 30 lines
  totalFunctions: number
  recommendedThreshold: number       // Default: 30
}
```

### Dead Code Detection

```typescript
interface DeadCodeDetection {
  potentialDeadCodeLines: number
  deadCodePercentage: number
  unusedVariables: string[]          // Mocked detection
  unusedFunctions: string[]          // Mocked detection
  unreachableCode: string[]          // Mocked detection
}
```

---

## Score Interpretation

### Overall Score & Metrics (0-100)
- **90-100**: Excellent - Highest quality
- **80-89**: Very Good - Production ready
- **70-79**: Good - Minor improvements recommended
- **60-69**: Fair - Some refactoring needed
- **50-59**: Poor - Significant issues
- **0-49**: Very Poor - Requires major refactoring

### Metric-Specific Notes

#### Complexity
- **Lower is better** (0-100, inverted scale in UI)
- Simple logic with minimal branching scores high
- Complex nested conditions score low

#### Modularity
- **Higher is better** (0-100)
- Well-organized, reusable code scores high
- Monolithic functions score low

#### Naming Conventions
- **Higher is better** (0-100)
- Clear, descriptive names score high
- Cryptic abbreviations score low

#### Duplication
- **Higher is better** (0-100)
- Low code duplication scores high
- Repeated blocks score low

#### Logical Depth
- **Lower is better** (0-100, inverted in UI)
- Shallow nesting and flat structure score high
- Deeply nested conditions score low

---

## Suggestions Logic

The API generates suggestions based on metric values:

- **Complexity > 70**: Break down complex functions
- **Modularity < 40**: Create reusable modules
- **Naming < 50**: Improve naming clarity
- **Duplication > 60**: Extract common code
- **Logical Depth > 70**: Reduce nesting
- **Large files (>500 lines)**: Split into multiple files

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Analyze code
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    code: 'def hello():\n    print("Hello")' 
  })
});

const result = await response.json();
console.log(`Quality Score: ${result.overallScore}`);
console.log(`Maintainability: ${result.advancedMetrics.maintainabilityIndex}`);
```

### cURL

```bash
# Analyze code
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"code":"def add(a,b):\n    return a+b"}'

# Compare similarity
curl -X POST http://localhost:3000/api/similarity \
  -H "Content-Type: application/json" \
  -d '{"code1":"def add(a,b):\n    return a+b","code2":"def sum(x,y):\n    return x+y"}'
```

---

## Performance Notes

- Analysis completes in <100ms for typical code files
- Similarity comparison in <50ms
- No external API calls or dependencies
- All calculations performed server-side
- Mocked detection for dead code (for prototype)

---

## Limitations (Prototype)

- Dead code detection is mocked (not real analysis)
- Python-specific features not fully parsed
- Does not execute code
- Limited to static analysis patterns
- No database persistence in prototype

---

## Future Enhancements

1. **Real Python Parsing**: Use Python AST parser
2. **Database**: Store analysis history and trends
3. **Comparison History**: Track changes over time
4. **Custom Rules**: Allow user-defined metric rules
5. **Real Dead Code Analysis**: Actual runtime tracking
6. **Multi-language Support**: Extend to other languages
7. **Webhooks**: Integration with CI/CD pipelines
8. **Batch Analysis**: Process multiple files
9. **Detailed Reports**: Export as PDF/HTML
10. **Real-time Analysis**: Live updates as code changes
