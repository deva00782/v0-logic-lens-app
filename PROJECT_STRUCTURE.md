# Logic Lens - Project Structure

## Overview
Logic Lens is a professional Python code quality analysis tool built with Next.js, TypeScript, and TailwindCSS. It provides comprehensive metrics and actionable insights for code improvement.

## Directory Structure

```
project/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   ├── analyze/
│   │   └── page.tsx            # Main analysis interface
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts        # Code analysis API endpoint
│   │   └── similarity/
│   │       └── route.ts        # File similarity comparison API
│   └── globals.css             # Global styles
│
├── components/                   # React components
│   ├── ui/                      # ShadCN UI components (pre-installed)
│   ├── advanced-metrics.tsx     # Expandable advanced metrics section
│   ├── code-editor.tsx          # Code input component with file upload
│   ├── metrics-card.tsx         # Individual metric display card
│   └── theme-provider.tsx       # Theme configuration
│
├── lib/                          # Business logic
│   └── metrics.ts               # Core metric calculation functions
│
├── utils/                        # Utility functions
│   ├── code-validators.ts       # Python code validation helpers
│   └── format.ts                # Number/text formatting utilities
│
├── types/                        # TypeScript type definitions
│   └── metrics.ts               # Type definitions for analysis results
│
├── public/                       # Static assets
│   └── icons/
│
├── package.json                 # Project dependencies
└── tsconfig.json               # TypeScript configuration
```

## Key Features

### 1. **Landing Page** (`app/page.tsx`)
- Hero section with call-to-action
- Feature highlights grid
- Professional SaaS-style design
- Dark theme with indigo + cyan accents

### 2. **Analysis Interface** (`app/analyze/page.tsx`)
- **Single File Analysis Tab**
  - Code editor with syntax highlighting
  - File upload capability (.py files)
  - Sample code loading
  - Run analysis button with loading state

- **Compare Files Tab**
  - Side-by-side code editors
  - Similarity percentage calculation
  - Visual comparison results

### 3. **Metrics Display**
- **Standard Metrics Cards** (MetricsCard component)
  - Circular progress indicator
  - Color-coded scoring (green/yellow/orange/red)
  - Individual metric cards for each analysis dimension

- **Advanced Metrics Section** (AdvancedMetricsSection component)
  - **Expandable accordion interface**
  - **Maintainability Index**: 0-100 score with description
  - **Coupling Score**: Module independence analysis
  - **Cohesion Score**: Method relationship analysis
  - **Function Length Analysis**:
    - Average, max, min function lengths
    - Functions exceeding 30-line threshold
    - Total function count
  - **Dead Code Detection** (Mocked):
    - Potential dead code lines and percentage
    - Unused variables list
    - Unused functions list
    - Unreachable code patterns

### 4. **API Routes**
- `POST /api/analyze`: Analyzes single Python code file
- `POST /api/similarity`: Compares two code files

## Core Functions

### Analysis Engine (`lib/metrics.ts`)

#### `analyzeCode(code: string): AnalysisResult`
Main analysis function that returns:
- Overall quality score (0-100)
- Cyclomatic complexity (0-100)
- Modularity score (0-100)
- Naming conventions score (0-100)
- Code duplication score (0-100)
- Logical depth score (0-100)
- Suggestions array
- Advanced metrics object

#### Advanced Metric Calculations
- **Maintainability Index**: Uses Halstead metrics approach
- **Coupling Score**: Based on import count and module independence
- **Cohesion Score**: Measures method-to-variable relationships
- **Function Length Analysis**: Identifies long functions
- **Dead Code Detection**: Mocked patterns for unused code

### Utility Functions

#### Code Validators (`utils/code-validators.ts`)
- `isValidPythonCode()`: Validates Python syntax
- `getLineCount()`: Counts non-empty lines
- `getCodeComplexity()`: Counts complexity indicators
- `extractFunctionNames()`: Parses function definitions
- `extractClassNames()`: Parses class definitions
- `getMaximumNestingDepth()`: Calculates max indentation depth

#### Formatting (`utils/format.ts`)
- `formatScore()`: Rounds and formats scores
- `getScoreLabel()`: Returns text label for score
- `getScoreGrade()`: Returns letter grade (A-F)
- `formatPercentage()`: Formats decimal to percentage

## Type Definitions (`types/metrics.ts`)

```typescript
interface AnalysisResult {
  overallScore: number
  complexity: number
  modularity: number
  naming: number
  duplication: number
  logicalDepth: number
  suggestions: string[]
  advancedMetrics?: AdvancedMetrics
}

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

interface FunctionLengthAnalysis {
  averageLength: number
  maxLength: number
  minLength: number
  functionsExceedingThreshold: number
  totalFunctions: number
  recommendedThreshold: number
}

interface DeadCodeDetection {
  potentialDeadCodeLines: number
  deadCodePercentage: number
  unusedVariables: string[]
  unusedFunctions: string[]
  unreachableCode: string[]
}
```

## Design System

### Colors (Dark Theme)
- **Background**: `from-slate-950 via-slate-900 to-slate-950`
- **Primary Accent**: Indigo (`indigo-500`, `indigo-600`)
- **Secondary Accent**: Cyan (`cyan-400`)
- **Neutral**: Slate grays (`slate-800`, `slate-700`, etc.)

### Components
- All components use ShadCN UI library
- Custom components built on top of Radix UI primitives
- Responsive design (mobile-first approach)
- Smooth animations and transitions

## State Management

- **React hooks** for component state
- **SWR** can be added for data fetching
- **Client-side API calls** to `/api/*` endpoints
- Mock data generation for advanced metrics

## Performance Optimizations

- Code splitting with Next.js App Router
- Client components only where necessary
- Memoization of expensive calculations
- Lazy loading of advanced metrics section

## Future Enhancements

1. Database integration for storing analysis history
2. User authentication and saved projects
3. CI/CD integration
4. Real Python code execution (sandboxed)
5. Export results as PDF/JSON
6. Comparison history and trends
7. Team collaboration features
8. Custom metric rules
9. Browser-based code editor (Monaco/CodeMirror)
10. Real-time analysis as you type

## Getting Started

1. Install dependencies: `pnpm install`
2. Run development server: `pnpm dev`
3. Open http://localhost:3000
4. Navigate to `/analyze` to test the tool
5. Load sample code or paste your own Python code

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5.7.3
- **Styling**: TailwindCSS 4.2.0
- **Components**: ShadCN UI / Radix UI
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React 0.564.0
- **Animations**: Tailwind CSS with CSS transitions
- **Form Handling**: React Hook Form 7.54.1
- **Runtime**: Node.js (API routes)
