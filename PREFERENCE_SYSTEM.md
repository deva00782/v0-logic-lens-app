# Preference System Documentation

## Overview
Logic Lens now has a fully functional preference system that saves user settings to localStorage and applies them across the entire application.

## How It Works

### 1. Theme Management
The application uses `next-themes` library to manage theme switching:

```typescript
// In layout.tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  {children}
</ThemeProvider>
```

**Features:**
- Saves theme preference to localStorage
- Syncs across browser tabs
- Supports system preference detection
- Smooth transitions between themes

### 2. Preferences Storage
User preferences are stored in localStorage with the following keys:

| Key | Description | Default | Type |
|-----|-------------|---------|------|
| `logic-lens-theme` | Selected theme (dark, light, system) | `dark` | string |
| `logic-lens-accent` | Accent color value | `#4f46e5` | hex string |
| `logic-lens-fontSize` | Base font size in pixels | `16` | number |

### 3. Accent Color Application
Accent colors are applied dynamically using CSS HSL values:

```javascript
// In appearance settings
const accentColor = accentColors.find(c => c.value === colorValue);
document.documentElement.style.setProperty('--accent-color', accentColor.hsl);
```

This updates the `--accent-color` CSS variable that can be used throughout the app.

### 4. Font Size Application
Font sizes are applied to the document root:

```javascript
document.documentElement.style.setProperty('--font-size-base', `${size}px`);
document.documentElement.style.fontSize = `${size}px`;
```

## Usage Example

### Accessing Current Theme
```typescript
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  // theme is current theme: 'dark', 'light', or 'system'
  // setTheme('dark') to change theme
}
```

### Accessing Saved Preferences
```typescript
// In browser console
localStorage.getItem('logic-lens-theme') // → 'dark'
localStorage.getItem('logic-lens-accent') // → '#4f46e5'
localStorage.getItem('logic-lens-fontSize') // → '16'
```

## Available Themes

### Midnight (Dark)
- Dark professional workspace
- Best for extended coding sessions
- Reduces eye strain

### Daylight (Light)
- Bright interface
- High contrast for accessibility
- Suitable for well-lit environments

### System
- Follows device preferences
- Automatically switches based on time of day
- Respects system dark mode setting

## Accent Colors
- **Indigo** (#4f46e5) - Default professional color
- **Cyan** (#06b6d4) - Modern tech aesthetic
- **Purple** (#a855f7) - Creative vibe
- **Pink** (#ec4899) - Contemporary feel
- **Green** (#10b981) - Natural calm
- **Orange** (#f97316) - Energetic warmth

## Font Sizes
- Small: 14px
- Default: 16px (recommended)
- Large: 18px
- Extra Large: 20px

All sizes maintain WCAG AA contrast compliance.

## Reset to Defaults
Users can reset all preferences to defaults from the Appearance Settings:
- Theme: dark
- Accent: Indigo (#4f46e5)
- Font Size: 16px

This is done by clicking "Reset to Default" button.

## File Structure

```
app/
├── layout.tsx                    # ThemeProvider integration
├── globals.css                   # Theme CSS variables
└── settings/
    └── appearance/
        └── page.tsx              # Settings interface
components/
└── theme-provider.tsx            # next-themes wrapper
```

## Technical Details

### Next-Themes Configuration
- `attribute="class"` - Applies theme via `data-theme` class
- `defaultTheme="dark"` - Default theme on first visit
- `enableSystem={true}` - Respects system preferences

### localStorage Keys
All preferences are stored with `logic-lens-` prefix to avoid conflicts:
- `logic-lens-theme`
- `logic-lens-accent`
- `logic-lens-fontSize`

### CSS Variables Available
When a theme is active, the following CSS variables are available:
```css
--bg-primary      /* Main background */
--bg-secondary    /* Secondary background */
--text-primary    /* Main text color */
--text-secondary  /* Secondary text color */
--accent-color    /* User-selected accent */
--border-color    /* Border color */
```

## Persistence & Sync
- Preferences persist across browser sessions
- Synced across tabs automatically
- Survives browser restarts
- Compatible with all modern browsers

## Future Enhancements
Potential improvements:
- Cloud sync across devices
- Team-wide theme preferences
- Custom theme builder
- Theme scheduling
- Per-page theme overrides
