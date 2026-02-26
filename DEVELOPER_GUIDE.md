# Logic Lens - Developer Guide

## Quick Start

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Project Structure at a Glance
```
app/                    # Pages and API routes
├── page.tsx           # Landing page
├── analyze/page.tsx   # Main analysis interface
└── api/               # Backend endpoints

components/           # Reusable React components
├── ui/               # ShadCN UI components
├── advanced-metrics.tsx    # Expandable metrics section
├── code-editor.tsx        # Code input with upload
├── metrics-card.tsx       # Metric display card
├── loading-animation.tsx  # Loading indicator
└── score-indicator.tsx    # Score badge

lib/                  # Core logic
└── metrics.ts        # Analysis algorithms

utils/                # Helper functions
├── code-validators.ts # Python validation
└── format.ts          # Formatting utilities

types/                # TypeScript definitions
└── metrics.ts         # Analysis result types
```

---

## Component Usage

### CodeEditor Component
Used for code input with file upload and display options.

```tsx
import { CodeEditor } from '@/components/code-editor';

export function MyComponent() {
  const [code, setCode] = useState('');

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      placeholder="Enter Python code..."
      readOnly={false}
    />
  );
}
```

**Props:**
- `value: string` - Current code
- `onChange: (value: string) => void` - Update handler
- `placeholder?: string` - Editor placeholder
- `readOnly?: boolean` - Read-only mode

---

### MetricsCard Component
Displays individual metric scores with circular progress.

```tsx
import { MetricsCard } from '@/components/metrics-card';

<MetricsCard
  title="Code Quality"
  score={82}
  color="green"
  description="Excellent quality"
/>
```

**Props:**
- `title: string` - Metric name
- `score: number` - 0-100 score
- `color: string` - Color: "green", "yellow", "orange", "cyan", "indigo"
- `description?: string` - Optional description text

---

### AdvancedMetricsSection Component
Expandable section showing advanced metrics.

```tsx
import { AdvancedMetricsSection } from '@/components/advanced-metrics';
import type { AdvancedMetrics } from '@/types/metrics';

const metrics: AdvancedMetrics = {
  maintainabilityIndex: 85,
  // ... other metrics
};

<AdvancedMetricsSection metrics={metrics} />
```

**Props:**
- `metrics: AdvancedMetrics` - Advanced metrics object

---

### ScoreIndicator Component
Compact score badge for inline display.

```tsx
import { ScoreIndicator } from '@/components/score-indicator';

<ScoreIndicator score={78} label="Quality" size="md" />
```

**Props:**
- `score: number` - Score to display
- `label?: string` - Optional label text
- `size?: "sm" | "md" | "lg"` - Badge size

---

## API Integration

### Using the Analysis API

```typescript
async function analyzeCode(code: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  if (!response.ok) throw new Error('Analysis failed');
  return response.json();
}

// Usage
const result = await analyzeCode(pythonCode);
console.log(`Overall Score: ${result.overallScore}`);
```

### Handling Analysis Results

```typescript
import type { AnalysisResult } from '@/types/metrics';

function displayResults(result: AnalysisResult) {
  // Access basic metrics
  console.log(`Complexity: ${result.complexity}`);
  console.log(`Suggestions:`, result.suggestions);

  // Access advanced metrics if available
  if (result.advancedMetrics) {
    const { maintainabilityIndex, deadCodeDetection } = result.advancedMetrics;
    console.log(`Maintainability: ${maintainabilityIndex}`);
    console.log(`Dead Code: ${deadCodeDetection.deadCodePercentage}%`);
  }
}
```

---

## Adding New Metrics

### 1. Define Type in `types/metrics.ts`

```typescript
export interface AdvancedMetrics {
  // ... existing metrics
  newMetricScore: number;
  newMetricDescription: string;
}
```

### 2. Implement Calculation in `lib/metrics.ts`

```typescript
function calculateNewMetric(code: string): number {
  // Your calculation logic
  return score;
}

function calculateAdvancedMetrics(
  code: string, 
  lines: string[]
): AdvancedMetrics {
  return {
    // ... existing metrics
    newMetricScore: calculateNewMetric(code),
    newMetricDescription: getNewMetricDescription(score)
  };
}
```

### 3. Add Display in Component

```tsx
// In advanced-metrics.tsx, add a new Card

<Card className="p-4 border-indigo-500/20">
  <div className="space-y-3">
    <h4 className="font-medium text-white">New Metric</h4>
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBg(
      metrics.newMetricScore
    )}`}>
      <span className={`text-lg font-bold ${getScoreColor(
        metrics.newMetricScore
      )}`}>
        {metrics.newMetricScore}
      </span>
    </div>
    <p className="text-sm text-gray-400">
      {metrics.newMetricDescription}
    </p>
  </div>
</Card>
```

---

## Utility Functions

### Code Validators

```typescript
import { 
  isValidPythonCode, 
  extractFunctionNames,
  getMaximumNestingDepth 
} from '@/utils/code-validators';

const { valid, error } = isValidPythonCode(code);
const functions = extractFunctionNames(code);
const depth = getMaximumNestingDepth(code);
```

### Formatting

```typescript
import { 
  getScoreLabel, 
  getScoreGrade,
  formatPercentage 
} from '@/utils/format';

const label = getScoreLabel(85);        // "Very Good"
const grade = getScoreGrade(85);        // "B"
const percent = formatPercentage(0.75); // "75.0%"
```

---

## Styling Guidelines

### Color System
- **Primary**: Indigo (`indigo-500`, `indigo-600`, `indigo-700`)
- **Accent**: Cyan (`cyan-400`, `cyan-500`)
- **Neutral**: Slate (`slate-900`, `slate-800`, `slate-700`)
- **Status**: Green/Yellow/Orange/Red for scores

### Class Naming
- Use Tailwind classes for styling
- Custom classes in `globals.css` for animations
- BEM naming for complex components

### Responsive Design
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

---

## State Management

### Component State
Use `useState` for component-level state:

```tsx
const [code, setCode] = useState('');
const [result, setResult] = useState<AnalysisResult | null>(null);
```

### Data Flow
1. User input → Component state
2. API call on button click
3. Response → Set result state
4. Render results from state

### Adding Global State (Future)
```typescript
// Example with Zustand (to be added)
import { create } from 'zustand';

const useAnalysisStore = create((set) => ({
  results: [],
  addResult: (result) => set((state) => ({
    results: [...state.results, result]
  }))
}));
```

---

## Testing Components

### Manual Testing
1. Run `pnpm dev`
2. Open http://localhost:3000/analyze
3. Test with sample code (button loads example)
4. Test file upload with `.py` files
5. Test Advanced Metrics expand/collapse
6. Test comparison feature

### Error Testing
- Empty code submission
- Invalid files (non-.py)
- Very large files
- Special characters in code

---

## Performance Tips

1. **Memoize Calculations**
   ```typescript
   const memoizedResult = useMemo(() => 
     analyzeCode(code), [code]
   );
   ```

2. **Lazy Load Advanced Metrics**
   - Currently done with expand/collapse
   - Only render when expanded

3. **Optimize Re-renders**
   - Use React.memo for pure components
   - Separate presentation from logic

---

## Common Issues & Solutions

### Issue: Analysis not updating
**Solution**: Check that API route is accessible at `/api/analyze`

### Issue: Styles not applying
**Solution**: Ensure Tailwind classes are correct and `globals.css` is imported

### Issue: File upload not working
**Solution**: Check browser console for FileReader errors

### Issue: Advanced metrics showing as undefined
**Solution**: Verify API response includes `advancedMetrics` field

---

## Extending the Project

### Add Database Support
```typescript
// Example with Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Store analysis results
await supabase
  .from('analyses')
  .insert([{ code, result }]);
```

### Add Authentication
```typescript
// Add NextAuth.js for user sessions
import { auth } from '@/auth';

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect('/login');
  // ...
}
```

### Add Real-time Updates
```typescript
// Use Supabase Realtime or WebSockets
const subscription = supabase
  .channel('analyses')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'analyses' },
    (payload) => console.log('New analysis:', payload)
  )
  .subscribe();
```

---

## Environment Variables

None required for prototype version (all calculations are client/server side).

For future enhancements:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

---

## Building & Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Deploy to Vercel
```bash
# Connect GitHub repo, or use Vercel CLI
vercel deploy
```

### Performance Optimization
```javascript
// next.config.mjs
const nextConfig = {
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false
};
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

---

## Support & Contribution

For questions or improvements:
1. Check existing documentation
2. Review component implementations
3. Test thoroughly before committing
4. Follow project structure conventions
5. Write descriptive commit messages
