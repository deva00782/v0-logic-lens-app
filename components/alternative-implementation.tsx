import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface AlternativeImplementationProps {
  title: string;
  description: string;
  code: string;
  tradeoffs: string;
}

export function AlternativeImplementation({
  title,
  description,
  code,
  tradeoffs,
}: AlternativeImplementationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 border-indigo-500/20 bg-slate-900/60">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
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

      <p className="text-sm text-slate-200 mb-4">{description}</p>

      <div className="mb-4">
        <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-700">
          <code className="text-sm text-slate-200 font-mono">{code}</code>
        </pre>
      </div>

      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
        <h4 className="text-xs font-semibold text-purple-300 mb-2">
          Trade-offs
        </h4>
        <p className="text-sm text-slate-100">{tradeoffs}</p>
      </div>
    </Card>
  );
}
