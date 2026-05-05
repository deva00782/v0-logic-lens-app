"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Trash2 } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = "Paste your Python code here...",
  readOnly = false,
}: CodeEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden border-indigo-500/20">
      <div className="bg-slate-800/50 border-b border-indigo-500/20 p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
            disabled={readOnly}
          >
            <Upload className="h-4 w-4" />
            Upload .py
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".py"
            onChange={handleFileUpload}
            className="hidden"
            disabled={readOnly}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          {!readOnly && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChange("")}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <span className="text-xs text-slate-300">
          {value.length} characters
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full h-96 bg-slate-900 text-slate-100 p-4 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-500"
        spellCheck="false"
      />
    </Card>
  );
}
