'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { RotateCcw, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themes: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Midnight',
    description: 'Professional dark workspace',
    colors: {
      primary: 'bg-slate-950',
      secondary: 'bg-slate-900',
      accent: 'bg-indigo-600',
    },
  },
  {
    id: 'light',
    name: 'Daylight',
    description: 'Bright and accessible interface',
    colors: {
      primary: 'bg-white',
      secondary: 'bg-slate-50',
      accent: 'bg-indigo-600',
    },
  },
  {
    id: 'system',
    name: 'System',
    description: 'Matches your system preferences',
    colors: {
      primary: 'bg-gradient-to-br from-slate-900 to-slate-800',
      secondary: 'bg-slate-800',
      accent: 'bg-cyan-500',
    },
  },
];

const accentColors = [
  { name: 'Indigo', value: '#4f46e5', hsl: '226 100% 55%' },
  { name: 'Cyan', value: '#06b6d4', hsl: '188 100% 42%' },
  { name: 'Purple', value: '#a855f7', hsl: '280 85% 65%' },
  { name: 'Pink', value: '#ec4899', hsl: '330 81% 60%' },
  { name: 'Green', value: '#10b981', hsl: '160 84% 39%' },
  { name: 'Orange', value: '#f97316', hsl: '25 95% 53%' },
];

export default function AppearanceSettings() {
  const { theme, setTheme, themes: availableThemes } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('dark');
  const [selectedAccent, setSelectedAccent] = useState<string>('#4f46e5');
  const [fontSize, setFontSize] = useState<number>(16);
  const [activeTab, setActiveTab] = useState<'themes' | 'colors' | 'accessibility'>('themes');

  // Initialize from localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('logic-lens-theme') || 'dark';
    const savedAccent = localStorage.getItem('logic-lens-accent') || '#4f46e5';
    const savedFontSize = parseInt(localStorage.getItem('logic-lens-fontSize') || '16');
    
    setSelectedTheme(savedTheme);
    setSelectedAccent(savedAccent);
    setFontSize(savedFontSize);
    
    if (theme) {
      setSelectedTheme(theme);
    }
  }, [theme]);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    setTheme(themeId);
    localStorage.setItem('logic-lens-theme', themeId);
  };

  const handleAccentChange = (colorValue: string) => {
    setSelectedAccent(colorValue);
    localStorage.setItem('logic-lens-accent', colorValue);
    // Apply accent color to CSS variable
    const accentColor = accentColors.find(c => c.value === colorValue);
    if (accentColor) {
      document.documentElement.style.setProperty('--accent-color', accentColor.hsl);
    }
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    localStorage.setItem('logic-lens-fontSize', size.toString());
    // Apply font size
    document.documentElement.style.setProperty('--font-size-base', `${size}px`);
    document.documentElement.style.fontSize = `${size}px`;
  };

  const handleResetToDefault = () => {
    setSelectedTheme('dark');
    setSelectedAccent('#4f46e5');
    setFontSize(16);
    setTheme('dark');
    localStorage.removeItem('logic-lens-theme');
    localStorage.removeItem('logic-lens-accent');
    localStorage.removeItem('logic-lens-fontSize');
    document.documentElement.style.removeProperty('--accent-color');
    document.documentElement.style.removeProperty('--font-size-base');
    document.documentElement.style.fontSize = '16px';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/analyze')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Appearance Settings</h1>
                <p className="text-sm text-slate-400">Customize your workspace look and feel</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 border-b border-slate-800">
          {(['themes', 'colors', 'accessibility'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Choose a Theme</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map(themeOption => (
                  <Card
                    key={themeOption.id}
                    className={`p-4 cursor-pointer border-2 transition-all ${
                      selectedTheme === themeOption.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => handleThemeChange(themeOption.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{themeOption.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">{themeOption.description}</p>
                      </div>
                      {selectedTheme === themeOption.id && (
                        <Check className="h-5 w-5 text-indigo-500" />
                      )}
                    </div>
                    <div className={`h-24 rounded-lg ${themeOption.colors.primary} border border-slate-700 flex items-end overflow-hidden`}>
                      <div className={`flex-1 h-1/2 ${themeOption.colors.secondary}`} />
                      <div className={`w-1/4 h-2/3 ${themeOption.colors.accent}`} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Accent Color</h2>
              <p className="text-sm text-slate-400 mb-4">Pick a vibe for your workspace</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {accentColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => handleAccentChange(color.value)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      selectedAccent === color.value
                        ? 'border-white scale-105'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-md"
                      style={{ backgroundColor: color.value }}
                    />
                    <p className="text-xs text-center mt-2 font-medium">{color.name}</p>
                    {selectedAccent === color.value && (
                      <Check className="absolute top-2 right-2 h-4 w-4 text-white bg-black/50 rounded-full p-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="border-t border-slate-800 pt-8">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="flex gap-3 flex-wrap">
                <Button variant="default">Primary Action</Button>
                <Button variant="outline">Secondary Action</Button>
                <Button variant="ghost">Tertiary Action</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Font Size</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Base Font Size: {fontSize}px</span>
                  <span className="text-xs bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded">WCAG AA</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="20"
                  value={fontSize}
                  onChange={e => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Small (14px)</span>
                  <span>Default (16px)</span>
                  <span>Large (20px)</span>
                </div>
              </div>
            </div>

            {/* Sample Text */}
            <div className="border-t border-slate-800 pt-8">
              <h3 className="text-lg font-semibold mb-4">Sample Text</h3>
              <div className="space-y-4 p-4 bg-slate-900 rounded-lg">
                <p style={{ fontSize: `${fontSize}px` }} className="font-semibold">
                  Heading Sample
                </p>
                <p style={{ fontSize: `${fontSize - 2}px` }} className="text-slate-300">
                  This is body text for readability testing. You can adjust the font size using the slider above to find what works best for you.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
