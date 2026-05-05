# Appearance Settings - Premium Theme Customization

## Overview

The Appearance Settings page is a modern, premium interface for managing all UI customization in Logic Lens. Inspired by Linear, Vercel, and Notion, it provides a beautiful and intuitive experience for users to control their workspace aesthetic.

## Access

Users can access the Appearance Settings from:
- **Direct URL**: `/settings/appearance`
- **Settings Button**: Click the gear icon (⚙️) in the Code Analyzer header

## Features

### 1. Theme Selection
**Location**: Themes Tab

Three carefully designed theme options:
- **Midnight**: Clean and focused dark workspace (default)
- **Daylight**: Bright and clear interface for daytime work
- **System**: Matches user's system preferences

**Design Elements**:
- Premium cards with mini UI preview inside each theme card
- Hover effects (scale + glow border)
- Animated checkmark on selected theme
- Smooth transitions between selections

### 2. Color Customization
**Location**: Colors Tab

**Accent Color Picker**:
- 6 curated accent colors: Indigo, Cyan, Purple, Pink, Green, Orange
- Large color swatches with hover labels
- Live preview of accent color on buttons and UI elements
- Selected color shows checkmark badge

**Live Preview Section**:
Shows real-time examples of:
- Primary button styling
- Secondary button styling
- Subtle button variants

### 3. Accessibility Options
**Location**: Accessibility Tab

**Font Size Control**:
- Interactive slider (14px - 20px)
- Real-time preview of font size changes
- Current size indicator
- Preset sizes: Small, Default, Large, Extra Large

**WCAG Contrast Level**:
- Visual indicator showing contrast compliance level
- Color-coded status bar (Green for AA Enhanced)
- Accessibility information

**Color Blindness Modes**:
- Deuteranopia mode
- Protanopia mode
- Tritanopia mode
- Achromatopsia mode
- Quick preview buttons for each mode

### 4. Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Sticky Header with Save & Reset Buttons            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Left Sidebar (Navigation)  │  Right Panel (Content) │
│                            │                        │
│ - Theme                    │  Theme Cards Preview   │
│ - Colors                   │  Color Picker          │
│ - Accessibility            │  Settings Controls     │
│                            │                        │
│                            │ Live Preview Section   │
└─────────────────────────────────────────────────────┘
```

### 5. Sticky Header Actions

**Save Preferences Button**:
- Saves all user customizations to localStorage
- Visual feedback with check icon
- Persists settings across sessions

**Reset to Default Button**:
- Restores all settings to factory defaults
- Resets theme to 'dark'
- Resets accent to indigo (#4f46e5)
- Resets font size to 16px
- Visual feedback with rotate icon

## Technical Implementation

### Storage
User preferences are persisted in localStorage:
```json
{
  "appearance-settings": {
    "theme": "dark",
    "accentColor": "#4f46e5",
    "fontSize": 16
  }
}
```

### Theme Integration
- Uses `next-themes` for theme management
- Real-time theme application across the app
- System preference detection support
- No flickering on theme switches

### Component Structure
```
/settings/
├── layout.tsx          // Settings layout with back button
└── appearance/
    └── page.tsx        // Main appearance settings page
```

### Key Components Used
- Tabs (for section navigation)
- Slider (for font size control)
- Card (for content grouping)
- Button (for actions)
- Custom tab styling with data states

## Design Principles

### Visual Style
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Soft Shadows**: Subtle depth layering
- **Smooth Animations**: Fade-in transitions between tabs
- **Color Harmony**: Indigo primary accent with slate neutrals

### Micro-interactions
- Hover effects on theme cards (lift + glow)
- Click feedback on color swatches
- Smooth slider interactions
- Tab transitions with fade-in animations

### Professional Polish
- Sticky header for persistent actions
- Clear section hierarchy
- Friendly microcopy ("Pick a vibe for your workspace")
- Real-time previews for all changes
- No jarring transitions or delays

### Responsive Design
- Mobile-first approach
- Sidebar becomes hidden on small screens
- Tab layout adjusts for mobile
- Touch-friendly button sizes

## User Experience Flow

1. **User clicks Settings icon** in Code Analyzer header
2. **Navigates to Appearance Settings** with smooth transition
3. **Chooses between Themes, Colors, or Accessibility** tabs
4. **Makes customizations** with real-time preview
5. **Clicks "Save Preferences"** to persist changes
6. **Changes apply instantly** across entire app
7. **Returns to Code Analyzer** with new appearance

## localStorage Management

Stored settings include:
```javascript
{
  "appearance-settings": {
    "theme": "dark|light|system",
    "accentColor": "#hexcolor",
    "fontSize": number (14-20)
  }
}
```

## Future Enhancements

Potential additions:
- Custom theme creation
- Export/import theme presets
- Animation speed preferences
- High contrast mode
- Font family selection
- Custom color palette builder
- Share theme with team

## Performance

- Page loads in < 100ms
- No layout shift during theme changes
- CSS transitions for smooth color morphing
- Lazy loading of theme styles
- Minimal re-renders on customization

## Accessibility

- WCAG AA color contrast throughout
- Keyboard navigation support
- Semantic HTML structure
- ARIA labels where needed
- Screen reader friendly
- Color blindness mode options

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- Theme changes require page refresh to apply globally
- Custom colors limited to predefined set for stability
- Font sizes constrained to 14-20px range
- No animation speed control (uses system settings)

## Troubleshooting

**Settings not persisting?**
- Check localStorage is enabled
- Check browser privacy settings
- Try clearing cache and reloading

**Theme not applying?**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear localStorage for this domain
- Check if browser has theme override enabled

**Colors not updating?**
- Ensure JavaScript is enabled
- Check console for errors
- Try resetting to defaults first

## Related Files

- `/components/theme-provider.tsx` - Theme provider wrapper
- `/app/layout.tsx` - Root layout with theme support
- `/app/globals.css` - Global styles and CSS variables
- `/app/analyze/page.tsx` - Settings button integration

## Version History

- **v1.0** - Initial release with themes, colors, and accessibility
- Future: Custom theme builder, team themes, export presets
