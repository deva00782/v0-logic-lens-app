'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { RotateCcw, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const accentColors = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('dark');
  const [selectedAccent, setSelectedAccent] = useState<string>('#4f46e5');
  const [fontSize, setFontSize] = useState<number>(16);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    const savedTheme = localStorage.getItem('logic-lens-theme') || 'dark';
    const savedAccent = localStorage.getItem('logic-lens-accent') || '#4f46e5';
    const savedFontSize = parseInt(localStorage.getItem('logic-lens-fontSize') || '16');

    setSelectedTheme(savedTheme);
    setSelectedAccent(savedAccent);
    setFontSize(savedFontSize);

    // Apply saved preferences
    applyTheme(savedTheme, savedAccent, savedFontSize);
  }, []);

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

  const applyTheme = (themeType: string, accentColor: string, fontSize: number) => {
    // Apply theme class
    if (themeType === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // Apply accent color
    document.documentElement.style.setProperty('--theme-accent', accentColor);
    document.documentElement.style.setProperty('--accent-color-value', hexToHSL(accentColor));

    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
  };

  const handleThemeChange = (themeType: string) => {
    setSelectedTheme(themeType);
    setTheme(themeType);
    localStorage.setItem('logic-lens-theme', themeType);
    applyTheme(themeType, selectedAccent, fontSize);
  };

  const handleAccentChange = (color: string) => {
    setSelectedAccent(color);
    localStorage.setItem('logic-lens-accent', color);
    applyTheme(selectedTheme, color, fontSize);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    localStorage.setItem('logic-lens-fontSize', size.toString());
    applyTheme(selectedTheme, selectedAccent, size);
  };

  const handleReset = () => {
    const defaultTheme = 'dark';
    const defaultAccent = '#4f46e5';
    const defaultSize = 16;

    setSelectedTheme(defaultTheme);
    setSelectedAccent(defaultAccent);
    setFontSize(defaultSize);
    setTheme(defaultTheme);

    localStorage.setItem('logic-lens-theme', defaultTheme);
    localStorage.setItem('logic-lens-accent', defaultAccent);
    localStorage.setItem('logic-lens-fontSize', defaultSize.toString());

    applyTheme(defaultTheme, defaultAccent, defaultSize);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/analyze')}
                className="hover:bg-slate-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Appearance Settings</h1>
                <p className="text-sm text-slate-400">Customize your workspace</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Theme Selection */}
          <section>
            <h2 className="text-xl font-bold mb-4">Theme</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'dark', name: 'Midnight', desc: 'Dark professional theme' },
                { id: 'light', name: 'Daylight', desc: 'Light accessible theme' },
              ].map((themeOption) => (
                <Card
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    selectedTheme === themeOption.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{themeOption.name}</h3>
                      <p className="text-sm text-slate-400">{themeOption.desc}</p>
                    </div>
                    {selectedTheme === themeOption.id && (
                      <Check className="h-5 w-5 text-indigo-500" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Accent Color Selection */}
          <section>
            <h2 className="text-xl font-bold mb-4">Accent Color</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleAccentChange(color.value)}
                  className={`group relative rounded-lg p-3 transition-all ${
                    selectedAccent === color.value
                      ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-white'
                      : 'hover:scale-105'
                  }`}
                  title={color.name}
                >
                  <div
                    className="w-full h-12 rounded-md border border-slate-700"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-xs text-slate-300 text-center mt-2 truncate">{color.name}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Font Size */}
          <section>
            <h2 className="text-xl font-bold mb-4">Font Size</h2>
            <Card className="p-6 border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Base font size: {fontSize}px</label>
                </div>
                <input
                  type="range"
                  min="14"
                  max="20"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((fontSize - 14) / 6) * 100}%, #374151 ${((fontSize - 14) / 6) * 100}%, #374151 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>14px</span>
                  <span>20px</span>
                </div>
              </div>
            </Card>
          </section>

          {/* Live Preview */}
          <section>
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            <Card className="p-6 border-slate-700 space-y-4">
              <div className="flex gap-3">
                <Button className="rounded-md" style={{ backgroundColor: selectedAccent }}>
                  Primary Button
                </Button>
                <Button variant="outline">
                  Secondary Button
                </Button>
              </div>
              <div className="text-sm text-slate-300">
                This is how your accent color looks on buttons and interactive elements.
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
