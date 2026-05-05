'use client';

import { useEffect } from 'react';

export function useThemeInitializer() {
  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('logic-lens-theme') || 'dark';
    const savedAccent = localStorage.getItem('logic-lens-accent') || '#4f46e5';
    const savedFontSize = localStorage.getItem('logic-lens-fontSize') || '16';

    // Apply theme to document
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // Apply accent color
    const hexToHSL = (hex: string): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return hex;

      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    document.documentElement.style.setProperty('--theme-accent', savedAccent);
    document.documentElement.style.setProperty('--accent-color-value', hexToHSL(savedAccent));

    // Apply font size
    const fontSize = parseInt(savedFontSize);
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, []);
}
