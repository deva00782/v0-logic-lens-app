'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useTheme } from 'next-themes';
import { Settings, RotateCcw, Check } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  label: string;
  description: string;
  preview: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

const themes: ThemeOption[] = [
  {
    id: 'dark',
    name: 'dark',
    label: 'Midnight',
    description: 'Clean and focused dark workspace',
    preview: {
      bg: 'from-slate-950 to-slate-900',
      border: 'border-indigo-500/20',
      text: 'text-slate-200',
      accent: 'bg-indigo-600',
    },
  },
  {
    id: 'light',
    name: 'light',
    label: 'Daylight',
    description: 'Bright and clear interface',
    preview: {
      bg: 'from-white to-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-900',
      accent: 'bg-indigo-600',
    },
  },
  {
    id: 'cyberpunk',
    name: 'system',
    label: 'System',
    description: 'Matches your system preferences',
    preview: {
      bg: 'from-slate-900 to-slate-800',
      border: 'border-cyan-500/30',
      text: 'text-cyan-100',
      accent: 'bg-cyan-500',
    },
  },
];

const accentColors = [
  { name: 'Indigo', value: '#4f46e5', css: 'bg-indigo-600' },
  { name: 'Cyan', value: '#06b6d4', css: 'bg-cyan-500' },
  { name: 'Purple', value: '#a855f7', css: 'bg-purple-600' },
  { name: 'Pink', value: '#ec4899', css: 'bg-pink-600' },
  { name: 'Green', value: '#10b981', css: 'bg-green-600' },
  { name: 'Orange', value: '#f97316', css: 'bg-orange-500' },
];

const fontSizes = [
  { label: 'Small', value: 14 },
  { label: 'Default', value: 16 },
  { label: 'Large', value: 18 },
  { label: 'Extra Large', value: 20 },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>('dark');
  const [selectedAccent, setSelectedAccent] = useState<string>('#4f46e5');
  const [fontSize, setFontSize] = useState<number>(16);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'colors' | 'accessibility'>('themes');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
    setTheme(themeName);
  };

  const handleResetToDefault = () => {
    setSelectedTheme('dark');
    setSelectedAccent('#4f46e5');
    setFontSize(16);
    setTheme('dark');
    localStorage.removeItem('theme');
  };

  const handleSavePreferences = () => {
    localStorage.setItem('appearance-settings', JSON.stringify({
      theme: selectedTheme,
      accentColor: selectedAccent,
      fontSize,
    }));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">Appearance Settings</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Default
            </Button>
            <Button
              size="sm"
              onClick={handleSavePreferences}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-32 space-y-2">
              <button
                onClick={() => setActiveTab('themes')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'themes'
                    ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                Theme
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'colors'
                    ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                Colors
              </button>
              <button
                onClick={() => setActiveTab('accessibility')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'accessibility'
                    ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                Accessibility
              </button>
            </nav>
          </div>

          {/* Right Content Panel */}
          <div className="lg:col-span-3 space-y-12">
            {/* Theme Selection */}
            {activeTab === 'themes' && (
              <section className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Pick a vibe for your workspace</h2>
                  <p className="text-slate-400 text-sm">Choose how your interface looks and feels</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeChange(themeOption.name)}
                      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        selectedTheme === themeOption.name
                          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                          : 'border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      {/* Preview Background */}
                      <div
                        className={`p-4 aspect-square bg-gradient-to-br ${themeOption.preview.bg} relative overflow-hidden`}
                      >
                        {/* Mini UI Preview Inside Card */}
                        <div className="space-y-2">
                          <div
                            className={`h-2 rounded w-1/3 ${themeOption.preview.accent}`}
                          ></div>
                          <div
                            className={`h-1 rounded w-full bg-slate-700/50`}
                          ></div>
                          <div
                            className={`h-1 rounded w-2/3 bg-slate-700/30`}
                          ></div>
                        </div>

                        {/* Checkmark Badge */}
                        {selectedTheme === themeOption.name && (
                          <div className="absolute top-2 right-2 h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="p-4 bg-slate-800/50 backdrop-blur-sm">
                        <h3 className="font-semibold text-white">{themeOption.label}</h3>
                        <p className="text-xs text-slate-400 mt-1">{themeOption.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Color Selection */}
            {activeTab === 'colors' && (
              <section className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Accent Color</h2>
                  <p className="text-slate-400 text-sm">Customize your primary accent color</p>
                </div>

                {/* Color Palette */}
                <Card className="p-8 bg-slate-800/30 border-indigo-500/20">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedAccent(color.value)}
                        className={`group relative h-20 rounded-lg border-2 transition-all duration-300 ${
                          selectedAccent === color.value
                            ? 'border-white shadow-lg'
                            : 'border-slate-700/50 hover:border-slate-600'
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        {selectedAccent === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="h-6 w-6 text-white drop-shadow-lg" />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-0 right-0 text-center text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Live Preview */}
                <Card className="p-8 bg-slate-800/30 border-indigo-500/20 space-y-4">
                  <h3 className="font-semibold text-white">Preview</h3>
                  <div className="flex gap-4 flex-wrap">
                    <button
                      style={{ backgroundColor: selectedAccent }}
                      className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      Primary Button
                    </button>
                    <div
                      style={{ borderColor: selectedAccent }}
                      className="px-6 py-2 rounded-lg border-2 text-white font-medium"
                    >
                      Secondary Button
                    </div>
                    <div
                      style={{ backgroundColor: selectedAccent + '20', borderColor: selectedAccent + '50' }}
                      className="px-6 py-2 rounded-lg border text-white font-medium"
                    >
                      Subtle Button
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Accessibility Settings */}
            {activeTab === 'accessibility' && (
              <section className="space-y-6 animate-in fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Accessibility</h2>
                  <p className="text-slate-400 text-sm">Customize your experience for comfort and clarity</p>
                </div>

                {/* Font Size */}
                <Card className="p-8 bg-slate-800/30 border-indigo-500/20 space-y-6">
                  <div>
                    <label className="text-white font-semibold mb-4 block">Font Size</label>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(val) => setFontSize(val[0])}
                      min={14}
                      max={20}
                      step={1}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Current: {fontSize}px</span>
                      <div
                        style={{ fontSize: fontSize }}
                        className="text-slate-300"
                      >
                        Sample text
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Contrast Indicator */}
                <Card className="p-8 bg-slate-800/30 border-indigo-500/20 space-y-4">
                  <h3 className="font-semibold text-white">WCAG Contrast Level</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-green-600 rounded"></div>
                    <span className="text-green-400 font-semibold">AA - Enhanced</span>
                  </div>
                  <p className="text-slate-400 text-sm">High contrast for improved readability</p>
                </Card>

                {/* Color Blindness Modes */}
                <Card className="p-8 bg-slate-800/30 border-indigo-500/20 space-y-4">
                  <h3 className="font-semibold text-white">Color Blindness Modes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['Deuteranopia', 'Protanopia', 'Tritanopia', 'Achromatopsia'].map((mode) => (
                      <button
                        key={mode}
                        className="px-4 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors"
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* Live Preview Panel */}
            <section className="space-y-6 border-t border-indigo-500/20 pt-12">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Live Preview</h2>
                <p className="text-slate-400 text-sm">See how your changes look in real-time</p>
              </div>

              <Card className="p-8 bg-slate-800/30 border-indigo-500/20 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sample Code Editor */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-300">Code Editor</h3>
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 border border-slate-700">
                      <div className="text-purple-400">def analyze_code():</div>
                      <div className="ml-4 text-slate-300">return metrics</div>
                    </div>
                  </div>

                  {/* Sample UI Components */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-300">Components</h3>
                    <div className="space-y-2">
                      <button
                        style={{ backgroundColor: selectedAccent }}
                        className="w-full px-4 py-2 rounded-lg text-white font-medium"
                      >
                        Primary Button
                      </button>
                      <div className="p-4 rounded-lg border border-slate-700 text-slate-300">
                        Sample Card
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
