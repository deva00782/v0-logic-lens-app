# Theme & Preference System - Complete Working Guide

## Overview
The Logic Lens application now has a **fully functional theme and preference system** that applies changes in real-time and persists across sessions.

## How It Works

### 1. Architecture

```
User Changes Theme/Color/Font
    ↓
Appearance Settings Page detects change
    ↓
applyTheme() function executes
    ↓
Updates CSS variables on document.documentElement
    ↓
Updates localStorage
    ↓
UI updates instantly (CSS reflects new values)
```

### 2. Theme System Components

#### `globals.css`
- Defines base Tailwind color system for light/dark modes
- Contains CSS variable definitions for `--theme-accent`
- Uses `.dark` class for dark mode detection

#### `hooks/use-theme-initializer.ts`
- Runs on app load
- Reads saved preferences from localStorage
- Applies theme, accent color, and font size to document
- Runs before any UI components render

#### `components/root-layout-client.tsx`
- Client component wrapper for ThemeProvider
- Initializes theme on app load
- Wraps entire application with next-themes provider

#### `app/settings/appearance/page.tsx`
- Full appearance settings interface
- Real-time theme/color/font changes
- Live preview of accent color on buttons
- All changes saved to localStorage immediately

### 3. Preference Storage

All preferences saved in `localStorage`:

```javascript
// Theme (dark or light)
localStorage.getItem('logic-lens-theme')

// Accent color as hex value
localStorage.getItem('logic-lens-accent')

// Font size as number (14-20)
localStorage.getItem('logic-lens-fontSize')
```

### 4. How Changes Apply

**When user selects a new theme:**
1. `handleThemeChange()` is called
2. Updates `selectedTheme` state
3. Calls `setTheme()` from next-themes (adds/removes `.dark` class)
4. Saves to localStorage
5. Calls `applyTheme()` to update CSS variables
6. All components using Tailwind dark mode classes update instantly

**When user selects a new accent color:**
1. `handleAccentChange()` is called
2. Updates `selectedAccent` state
3. Saves hex value to localStorage
4. Calls `applyTheme()` which:
   - Sets `--theme-accent` to hex value
   - Converts hex to HSL and sets `--accent-color-value`
5. Any component using accent color CSS variable updates

**When user changes font size:**
1. `handleFontSizeChange()` is called
2. Updates `fontSize` state
3. Saves to localStorage
4. Calls `applyTheme()` which sets `document.documentElement.style.fontSize`
5. All text scales proportionally

### 5. Persistence & Initialization

**On first load:**
1. `useThemeInitializer()` hook executes
2. Reads all preferences from localStorage
3. Applies theme class to html element
4. Sets CSS variables on document root
5. Sets font size on document

**On subsequent loads:**
1. Same initialization happens automatically
2. User sees their saved preferences immediately
3. No flash of wrong theme

### 6. CSS Variables Used

```css
/* Accent color (hex value) */
--theme-accent: #4f46e5

/* Accent color converted to HSL for gradients */
--accent-color-value: 226 100% 55%

/* Font size applied to document */
document.documentElement.style.fontSize: "16px"
```

## Testing the System

### To verify theme switching works:

1. Go to `/settings/appearance`
2. Click "Midnight" or "Daylight"
3. Entire page should change theme immediately
4. Check DevTools: `document.documentElement.classList` should have `.dark` class
5. Refresh page - theme persists

### To verify color changing works:

1. Go to `/settings/appearance`
2. Click different accent color (e.g., Cyan, Purple)
3. Preview buttons should change color immediately
4. Check DevTools: `getComputedStyle(document.documentElement).getPropertyValue('--theme-accent')`
5. Should match the selected color hex value

### To verify font size works:

1. Go to `/settings/appearance`
2. Drag font size slider
3. All text should scale proportionally
4. Check DevTools: `document.documentElement.style.fontSize` should update

### To verify persistence works:

1. Change theme, color, and font size
2. Refresh the page
3. All changes should persist
4. Check localStorage in DevTools Console:
   ```javascript
   console.log(localStorage.getItem('logic-lens-theme'))
   console.log(localStorage.getItem('logic-lens-accent'))
   console.log(localStorage.getItem('logic-lens-fontSize'))
   ```

## How Components Use the Theme

### Dark Mode (via Tailwind)
```jsx
<div className="dark:bg-slate-900 dark:text-white">
  Content that changes in dark mode
</div>
```

The `.dark` class is added/removed by next-themes based on selected theme.

### Accent Color (via CSS Variables)
```jsx
<Button style={{ backgroundColor: selectedAccent }}>
  Uses accent color
</Button>
```

Or in CSS:
```css
button {
  background-color: var(--theme-accent);
}
```

### Font Size (via Document Style)
Automatically applied to entire document:
```javascript
document.documentElement.style.fontSize = "16px"
```

All relative units (em, rem) scale accordingly.

## File Structure

```
app/
├── layout.tsx                 (imports RootLayoutClient)
├── globals.css               (CSS variable definitions)
└── settings/
    └── appearance/
        └── page.tsx          (settings interface)

components/
├── theme-provider.tsx        (next-themes wrapper)
└── root-layout-client.tsx    (initializes theme)

hooks/
└── use-theme-initializer.ts  (loads preferences on mount)
```

## Key Features Implemented

✅ **Real-time theme switching** - Changes apply instantly
✅ **Accent color customization** - 6 color options
✅ **Font size adjustment** - 14px to 20px range
✅ **Persistent storage** - Preferences saved across sessions
✅ **System preference detection** - next-themes handles OS theme preference
✅ **Live preview** - See accent color on buttons before saving
✅ **Reset functionality** - One click to restore defaults
✅ **Dark/Light modes** - Full support for both

## Troubleshooting

If theme changes aren't showing:

1. **Check localStorage is enabled** - Open DevTools Console:
   ```javascript
   localStorage.setItem('test', '1');
   localStorage.getItem('test'); // should return '1'
   ```

2. **Check if ThemeProvider is in layout** - Look at `app/layout.tsx`, should have `<RootLayoutClient>`

3. **Clear browser cache** - Theme might be cached
   - Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

4. **Check CSS is loading** - Open DevTools, inspect an element, should see Tailwind classes

5. **Verify hook is running** - Add console.log in `use-theme-initializer.ts` to debug

## Future Enhancements

Possible improvements:
- More theme presets (Cyberpunk, Pastel, etc.)
- Custom color picker with more colors
- Custom font family selection
- Theme preview before applying
- Import/export theme settings
- Per-page theme overrides
