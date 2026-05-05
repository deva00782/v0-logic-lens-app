# Preference System - Testing Checklist

## Build & Compilation
- [x] Project builds without errors
- [x] No TypeScript errors
- [x] All imports resolved correctly
- [x] All routes accessible

## Theme Switching
- [ ] Navigate to `/settings/appearance`
- [ ] Click on "Themes" tab
- [ ] Select "Midnight" theme
  - Verify dark background is applied
  - Verify text is light colored
- [ ] Select "Daylight" theme
  - Verify light background is applied
  - Verify text is dark colored
- [ ] Select "System" theme
  - Verify it respects system preferences
- [ ] Refresh page
  - Verify selected theme persists

## Accent Color Selection
- [ ] On "Colors" tab, select different accent colors:
  - [ ] Indigo (default)
  - [ ] Cyan
  - [ ] Purple
  - [ ] Pink
  - [ ] Green
  - [ ] Orange
- [ ] Verify color preview updates
- [ ] Check buttons change color in preview
- [ ] Refresh page
  - Verify selected accent color persists

## Font Size Adjustment
- [ ] On "Accessibility" tab, adjust font size slider
  - [ ] Drag to smallest (14px)
  - [ ] Drag to default (16px)
  - [ ] Drag to largest (20px)
- [ ] Verify sample text updates in real-time
- [ ] Verify entire page text scales appropriately
- [ ] Refresh page
  - Verify font size persists

## localStorage Persistence
- [ ] Open DevTools Console
- [ ] Run: `localStorage.getItem('logic-lens-theme')`
  - Should return: `'dark'` or selected theme
- [ ] Run: `localStorage.getItem('logic-lens-accent')`
  - Should return: hex color value like `'#4f46e5'`
- [ ] Run: `localStorage.getItem('logic-lens-fontSize')`
  - Should return: number like `'16'`

## Reset to Defaults
- [ ] Change theme, accent, and font size
- [ ] Click "Reset to Default" button
- [ ] Verify all settings return to defaults:
  - Theme: Midnight (dark)
  - Accent: Indigo (#4f46e5)
  - Font Size: 16px
- [ ] Refresh page
  - Verify defaults persist

## Cross-Page Consistency
- [ ] Apply theme and accent on settings page
- [ ] Navigate to home page (`/`)
  - Verify theme is applied
  - Verify accent color is used
- [ ] Navigate to analyze page (`/analyze`)
  - Verify theme is applied
  - Verify accent color is used
- [ ] Navigate back to settings
  - Verify previous selections are still selected

## Browser Tab Sync
- [ ] Open `/settings/appearance` in two browser tabs
- [ ] Change theme in Tab 1
- [ ] Check Tab 2 (should update automatically)
- [ ] Change accent in Tab 2
- [ ] Check Tab 1 (should update automatically)

## Settings Button Navigation
- [ ] Go to `/analyze` page
- [ ] Click gear icon (⚙️) in top right
- [ ] Verify it navigates to `/settings/appearance`
- [ ] Click back arrow in settings
- [ ] Verify it returns to `/analyze`

## Mobile Responsiveness
- [ ] Reduce browser width to mobile size
- [ ] Verify all tabs display correctly
- [ ] Verify color swatches stack properly
- [ ] Verify sliders work on touch
- [ ] Verify buttons are clickable

## Error Handling
- [ ] Open DevTools Console
- [ ] Clear localStorage manually
- [ ] Refresh page
  - Should use defaults without errors
- [ ] Check for any console errors (red ❌)

## Dark Mode System Preference
- [ ] Set OS to dark mode
- [ ] Select "System" theme
- [ ] Verify dark theme applies
- [ ] Set OS to light mode
- [ ] Refresh page
  - Verify light theme applies

## Light Mode System Preference
- [ ] Set OS to light mode
- [ ] Select "System" theme
- [ ] Verify light theme applies
- [ ] Set OS to dark mode
- [ ] Refresh page
  - Verify dark theme applies

## Performance
- [ ] Theme switching happens instantly (< 100ms)
- [ ] Accent color changes appear smoothly
- [ ] Font size adjustments are responsive
- [ ] No layout shift or flashing
- [ ] Animations are smooth

## Documentation
- [ ] Read `PREFERENCE_SYSTEM.md`
- [ ] Understand theme architecture
- [ ] Know available localStorage keys
- [ ] Understand CSS variables used

## Summary
- [ ] All tests passed
- [ ] No errors in console
- [ ] Preferences persist correctly
- [ ] System is production-ready

---

## Test Execution Notes
Date Tested: _____________
Tested By: _____________
Environment: _____________
Notes: _____________
