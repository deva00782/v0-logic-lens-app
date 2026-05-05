'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { useThemeInitializer } from '@/hooks/use-theme-initializer';

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useThemeInitializer();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
