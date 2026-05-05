import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Top Navigation */}
      <nav className="border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
          <Link href="/analyze">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      {children}
    </>
  );
}
