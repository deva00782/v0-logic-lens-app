import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface SimplifiedCodeProps {
  simplifiedCode: string;
  explanation: string;
}

export function SimplifiedCode({
  simplifiedCode,
  explanation,
}: SimplifiedCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(simplifiedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 border-indigo-500/20 bg-slate-900/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Simplified Version</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div className="mb-4">
        <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-700">
          <code className="text-sm text-slate-200 font-mono">
            {simplifiedCode}
          </code>
        </pre>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 border border-indigo-500/10">
        <p className="text-sm text-slate-100 leading-relaxed">
          {explanation}
        </p>
      </div>
    </Card>
  );
}
